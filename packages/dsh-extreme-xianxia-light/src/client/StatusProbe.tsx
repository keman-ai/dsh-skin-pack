/**
 * Status probe: a slot entry mounted on `conversation.composer.dock` that renders nothing.
 *
 * Its only reason to exist is receiving the slot-injected `useProjection` / `useSession`, so the numbers the
 * 投影和会话快照递给右侧状态台（见 status-store）。
 *
 * Three reasons for choosing `conversation.composer.dock`:
 *   1. it is `{ kind: 'list' }`, so appending does not displace the official StatsLine (also there, id `stats`, order 0);
 *   2. its scope is session, so the standard kit injects `useSession` / `useProjection` into props;
 *   3. its lifetime matches the conversation page, so switching sessions remounts this entry and clears the previous numbers.
 *
 * Rendering null is deliberate: this slot sits below the composer and we want nothing extra there,
 * 原型稿把这些信息放在右栏。
 */

import { useEffect } from 'react'
import { clearStatus, publishStatus } from './status-store.ts'
import type { ContextEntry, ToolCallEntry } from './status-store.ts'

/**
 * The harness projection accessors, injected by the slot at render time.
 *
 * Minimal hand-written declarations for the keys we use, rather than importing types from
 * `@deepseek-ai/dsh-client-ui-slots`: that package and its dependency chain cannot be installed (see
 * `token-meter` / `session-stats` / `tool-todo` 一致，对不上时以 harness 源码为准。
 */
export interface UseProjection {
  (key: 'contextPressure'): ContextPressure | undefined
  (key: 'contextBreakdown'): ContextBreakdown | undefined
  (key: 'tokenUsage'): TokenUsage | undefined
  (key: 'sessionStats'): SessionStats | undefined
  (key: 'todos'): readonly TodoItem[] | null | undefined
  (key: 'permissions'): PermissionSelect | undefined
}

/** packages/llm/token-meter/src/projection.ts */
interface ContextPressure {
  /** Prompt size of the most recent request, as reported by the provider. */
  pressureTokens?: number
  /** Estimated size of the next request: the above plus repricing for UI additions and removals since; compaction shows up immediately. */
  projectedTokens?: number
  contextWindow?: number
}

/** packages/llm/token-meter/src/projection.ts — the four buckets are disjoint (reasoning tokens count towards output). */
interface TokenUsage {
  uncachedInputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
}

/** packages/client/ui-conversation/.../StatsLine.tsx 的 WindowStats 同名字段。 */
interface SessionStats {
  turns: number
  steps: number
  llmMs: number
  toolMs: number
}

/**
 * packages/llm/token-meter/src/projection.ts — an estimate of the next request's **composition**.
 *
 * ⚠️ The three use fixed-density estimates (systematically low for CJK and JSON schema) and **do not add up**
 * to `contextPressure.projectedTokens` (which is anchored to the provider's reported value). So read them as
 * what is filling the window, never as a total, and the UI must say so.
 */
interface ContextBreakdown {
  systemTokens: number
  toolsTokens: number
  messageTokens: number
}

/** packages/todo/tool-todo/src/types.ts */
interface TodoItem {
  content?: string
  status?: string
}

/** packages/interaction/permission-presets/src/types.ts */
interface PermissionSelect {
  options: readonly { value: string; name: string; description?: string }[]
  /** The active preset key, or `custom` when nothing matches. */
  currentValue: string
}

/** Session snapshot selector, also slot-injected (the official StatsLine uses the same accessor). */
export interface UseSession {
  <T>(selector: (snapshot: ConversationSnapshotLike) => T): T
}

/** The few fields we use from packages/client/runtime/src/client/sessions/conversation.ts. */
interface ConversationSnapshotLike {
  /** Whether this session is running. */
  running: boolean
  /** Tool calls in flight; `time` is the epoch ms when the tool/call event was recorded. */
  runningCalls: readonly { name: string; time: number }[]
  /**
   * The snapshot each registered view assembles for itself.
   *
   * 🔴 The model name can only come from here: the Chat assembly (`chat.legacy.nodes`) does **not** fill
   * `provenance` (see finalNode in ui-conversation/conversation-nodes/assistant.ts — it fills only blocks /
   * usage / timing），填 provenance 的是 Trajectory 那套
   * （ui-trajectory/trajectory-assistant-definition.ts）。第一版照着类型声明去读 chat 节点的
   * provenance，结果永远是 undefined，界面上模型那行一直是"—"：**字段声明为可选 ≠ 有人填**。
   */
  views: { get(target: 'trajectory'): { eventNodes: readonly ConversationNodeLike[] } | undefined }
  chat: { legacy: { nodes: readonly ConversationNodeLike[] } }
  /**
   * Interactions waiting on you. `kind` is only `approval` (a tool needs consent) or `question` (the agent is
   * asking), and an approval's payload carries `toolName`. This is the one state that stalls until you act.
   */
  pending: readonly {
    kind: string
    payload?: { toolName?: string; questions?: readonly unknown[] }
  }[]
  /** Inbox: queued waits for the next turn, steering merges into the current one, context is pure context injection. */
  queue: readonly { placement: 'queued' | 'steering' | 'context' }[]
  /** Start and end of each turn; the one without an endTime is the turn currently running. */
  turnTimings: ReadonlyMap<number, { startTime: number; endTime?: number }>
}

/**
 * 事件节点。这里只声明用到的字段，字段名与
 * `packages/client/runtime/src/client/sessions/conversation.ts` 的 `ConversationNode` 一致。
 *
 * 🔴 三种 kind 各有各的用处：
 *   - `assistant` → `provenance.model`，最近一次回复实际用的模型；
 *   - `tool-result` → 工具名 + 真实耗时 + 成败，喂「神通调用」那张卡；
 *   - `context` → 注入来源与形态，喂「经卷注入」那张卡；
 *   - `compaction` → 会话被折叠掉多少，喂「压缩」那一行。
 */
interface ConversationNodeLike {
  kind: string
  /**
   * 两种节点都叫 `provenance`，但形状不同：assistant 的是"哪个模型完成的"，
   * context 的是"哪个生产者注入的"。这里合成一个宽松形状，读之前按 kind 分流。
   */
  provenance?: { model?: string; role?: string; label?: string | null }
  /** epoch ms，来源事件的时刻。 */
  time?: number
  /** tool-result：配对的 tool/call 的时刻；窗口把调用头截掉时是 null。 */
  callTime?: number | null
  /** tool-result：调用头；被窗口截断时是 null。 */
  call?: { name?: string } | null
  /** tool-result：调用 id，调用头缺席时拿它兜底显示。 */
  callId?: string
  /** tool-result：这次调用是否失败。 */
  isError?: boolean
  /** context：生产者自报的信息形态；不认识的形态是 null。 */
  form?: string | null
  /** compaction：被折叠掉的条目数 / token 估算；投影拿不到时是 null。 */
  shadowedItemCount?: number | null
  shadowedTokenCount?: number | null
}

/** 「神通调用」卡最多列几条。再多就只报总数——右栏是状态台，不是日志。 */
const TOOL_LOG_LIMIT = 6

/** 「经卷查阅」卡最多列几条。 */
const CONTEXT_LOG_LIMIT = 5

export interface StatusProbeProps {
  useProjection: UseProjection
  useSession: UseSession
}

export function MistStatusProbe({ useProjection, useSession }: StatusProbeProps) {
  const pressure = useProjection('contextPressure')
  const breakdown = useProjection('contextBreakdown')
  const usage = useProjection('tokenUsage')
  const stats = useProjection('sessionStats')
  const todos = useProjection('todos')
  const permissions = useProjection('permissions')

  const running = useSession(s => s.running)
  const runningCalls = useSession(s => s.runningCalls)
  const pending = useSession(s => s.pending)
  const queue = useSession(s => s.queue)
  const turnTimings = useSession(s => s.turnTimings)
  // Trajectory view nodes carry provenance; without ui-trajectory it is undefined and we fall back to chat
  // nodes (which currently do not fill provenance, so the model shows "—" rather than a guess).
  const nodes = useSession(s => s.views.get('trajectory')?.eventNodes ?? s.chat.legacy.nodes)

  // Use projectedTokens, not pressureTokens: compaction reports no usage and only the former drops immediately,
  // or the UI would keep showing the old high occupancy after compaction (the harness's own context ring reads it too).
  const usedTokens = pressure?.projectedTokens ?? pressure?.pressureTokens
  const billedInput = usage === undefined
    ? undefined
    : usage.uncachedInputTokens + usage.cacheReadTokens + usage.cacheWriteTokens

  // Model: scan backwards for the most recent assistant node carrying provenance. provenance is the model that
  // actually served the request, which is more trustworthy than the composer's picker — after a mid-session switch, earlier turns still ran on the old model.
  let model: string | undefined
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const node = nodes[index]
    if (node?.kind === 'assistant' && node.provenance?.model !== undefined) {
      model = node.provenance.model
      break
    }
  }

  const toolNames = runningCalls.map(call => call.name)

  /*
   * 工具调用流水：正在跑的排最前，然后是最近跑完的。
   *
   * 🔴 耗时只在**配对的 `tool/call` 还在窗口内**时算得出来（`callTime !== null`）。
   * 会话窗口滚动后老调用的调用头会被截掉，那些只报名字与成败，耗时留空——
   * 原型稿那张卡每行都有一个漂亮的 `2.1s`，但那是写死的；这里宁可空着。
   */
  const settledTools: ToolCallEntry[] = []
  let toolCallTotal = 0
  const contextEntries: ContextEntry[] = []
  let contextTotal = 0
  let compactedCount = 0
  let compactedItems: number | undefined
  let compactedTokens: number | undefined

  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const node = nodes[index]
    if (node === undefined) continue
    if (node.kind === 'tool-result') {
      toolCallTotal += 1
      if (settledTools.length < TOOL_LOG_LIMIT) {
        const started = node.callTime
        const ended = node.time
        settledTools.push({
          name: node.call?.name ?? (node.callId === undefined ? '未知工具' : `#${node.callId.slice(0, 6)}`),
          ms: typeof started === 'number' && typeof ended === 'number'
            ? Math.max(0, ended - started)
            : undefined,
          failed: node.isError === true ? true : undefined,
        })
      }
      continue
    }
    if (node.kind === 'context') {
      contextTotal += 1
      if (contextEntries.length < CONTEXT_LOG_LIMIT) {
        const provenance = node.provenance
        contextEntries.push({
          label: provenance?.label ?? '未署名来源',
          form: node.form ?? undefined,
          role: provenance?.role,
        })
      }
      continue
    }
    if (node.kind === 'compaction') {
      compactedCount += 1
      if (typeof node.shadowedItemCount === 'number') {
        compactedItems = (compactedItems ?? 0) + node.shadowedItemCount
      }
      if (typeof node.shadowedTokenCount === 'number') {
        compactedTokens = (compactedTokens ?? 0) + node.shadowedTokenCount
      }
    }
  }

  // 正在跑的接在最前面：它们才是"现在发生了什么"，跑完的是流水。
  const toolCalls: ToolCallEntry[] = [
    ...runningCalls.map((call): ToolCallEntry => ({
      name: call.name,
      running: true,
      startedAt: call.time,
    })),
    ...settledTools,
  ].slice(0, TOOL_LOG_LIMIT)

  // Waiting on you: approvals carry the tool name, questions report only a count (the question text is in the conversation, not repeated here).
  const pendingApprovals = pending
    .filter(item => item.kind === 'approval')
    .map(item => item.payload?.toolName ?? 'unknown tool')
  const pendingQuestions = pending.filter(item => item.kind === 'question').length
  const queuedCount = queue.filter(item => item.placement === 'queued').length
  const steeringCount = queue.filter(item => item.placement === 'steering').length

  // 当前轮的开始时刻：没有 endTime 的那一轮。逐秒变化的"已跑多久"交给状态台算，
  // Only the timestamp is passed — otherwise this would publish every second and re-render the whole rail for nothing.
  let turnStartedAt: number | undefined
  for (const [, timing] of turnTimings) {
    if (timing.endTime === undefined && (turnStartedAt === undefined || timing.startTime > turnStartedAt)) {
      turnStartedAt = timing.startTime
    }
  }
  // Likewise, take the earliest tool call still running — that is what tells you whether things are stuck.
  const toolStartedAt = runningCalls.length === 0
    ? undefined
    : Math.min(...runningCalls.map(call => call.time))

  // Permissions: the display name is looked up in options by currentValue, falling back to the raw value (which is also how `custom` is handled).
  const permissionOption = permissions?.options.find(option => option.value === permissions.currentValue)

  const todoList = todos ?? []
  const todosTotal = todoList.length
  const todosDone = todoList.filter(item => item.status === 'completed').length
  const todoActive = todoList.find(item => item.status === 'in_progress')?.content

  useEffect(() => {
    publishStatus({
      running,
      runningTools: toolNames,
      pendingApprovals,
      pendingQuestions,
      queuedCount,
      steeringCount,
      permissionLabel: permissionOption?.name ?? permissions?.currentValue,
      permissionHint: permissionOption?.description,
      turnStartedAt,
      toolStartedAt,
      ctxSystemTokens: breakdown?.systemTokens,
      ctxToolsTokens: breakdown?.toolsTokens,
      ctxMessageTokens: breakdown?.messageTokens,
      model,
      usedTokens,
      contextWindow: pressure?.contextWindow,
      inputTokens: billedInput,
      outputTokens: usage?.outputTokens,
      cacheHitPercent: usage === undefined || billedInput === undefined || billedInput === 0
        ? undefined
        : Math.round(usage.cacheReadTokens / billedInput * 100),
      llmMs: stats?.llmMs,
      toolMs: stats?.toolMs,
      turns: stats?.turns,
      steps: stats?.steps,
      todosTotal: todosTotal === 0 ? undefined : todosTotal,
      todosDone: todosTotal === 0 ? undefined : todosDone,
      todoActive,
      toolCalls,
      toolCallTotal: toolCallTotal + runningCalls.length,
      contextInjections: contextEntries,
      contextTotal,
      compactedCount: compactedCount === 0 ? undefined : compactedCount,
      compactedItems,
      compactedTokens,
    })
  })

  // 换会话时这个条目会重新挂载，卸载时清掉，免得状态台留着上一次会话的数字。
  useEffect(() => clearStatus, [])

  return null
}
