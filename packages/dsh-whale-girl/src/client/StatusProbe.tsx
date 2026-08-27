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

interface ConversationNodeLike {
  kind: string
  /** 只有 assistant 节点带；`provenance` 是"这次回复实际由哪个 provider/model 完成"。 */
  provenance?: { model?: string }
}

export interface StatusProbeProps {
  useProjection: UseProjection
  useSession: UseSession
}

export function WhaleStatusProbe({ useProjection, useSession }: StatusProbeProps) {
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
    })
  })

  // 换会话时这个条目会重新挂载，卸载时清掉，免得状态台留着上一次会话的数字。
  useEffect(() => clearStatus, [])

  return null
}
