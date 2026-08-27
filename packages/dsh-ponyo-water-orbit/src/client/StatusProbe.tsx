/**
 * Status probe: a slot entry mounted on `conversation.composer.dock` that renders nothing.
 *
 * Its only reason to exist is receiving the slot-injected `useProjection` / `useSession`, so the numbers the
 * passes the projections and session snapshot to the right-hand dock (see status-store).
 *
 * Three reasons for choosing `conversation.composer.dock`:
 *   1. it is `{ kind: 'list' }`, so appending does not displace the official StatsLine (also there, id `stats`, order 0);
 *   2. its scope is session, so the standard kit injects `useSession` / `useProjection` into props;
 *   3. its lifetime matches the conversation page, so switching sessions remounts this entry and clears the previous numbers.
 *
 * Rendering null is deliberate: this slot sits below the composer and we want nothing extra there,
 * The prototype puts this information in the right column.
 */

import { useEffect } from 'react'
import { clearStatus, publishStatus } from './status-store.ts'
import type { ContextEntry, ToolCallEntry } from './status-store.ts'

/**
 * The harness projection accessors, injected by the slot at render time.
 *
 * Minimal hand-written declarations for the keys we use, rather than importing types from
 * `@deepseek-ai/dsh-client-ui-slots`: that package and its dependency chain cannot be installed (see
 * `token-meter` / `session-stats` / `tool-todo`; when they disagree, the harness source wins.
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

/** The same-named fields of WindowStats in packages/client/ui-conversation/.../StatsLine.tsx. */
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
   * usage / timing); provenance is filled by the Trajectory assembly
   * (ui-trajectory/trajectory-assistant-definition.ts). The first version read provenance off chat nodes as the
   * type declaration suggested and always got undefined, leaving the model row as "—": **a field declared optional is not a field someone fills**.
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
 * Event nodes. Only the fields we use are declared, with names matching `ConversationNode` in
 * `packages/client/runtime/src/client/sessions/conversation.ts`.
 *
 * 🔴 Each of the three kinds has its own use:
 *   - `assistant` → `provenance.model`, the model that actually served the latest reply;
 *   - `tool-result` → 工具名 + 真实耗时 + 成败，喂「神通调用」那张卡；
 *   - `context` → the injection's source and form, feeding the context-injection card;
 *   - `compaction` → how much of the session was folded away, feeding the compaction row.
 */
interface ConversationNodeLike {
  kind: string
  /**
   * Both node kinds call it `provenance`, but the shapes differ: on assistant it is which model completed the
   * reply, on context which producer injected it. A loose combined shape is declared here and read per kind.
   */
  provenance?: { model?: string; role?: string; label?: string | null }
  /** epoch ms, the time of the source event. */
  time?: number
  /** tool-result: the time of the matching tool/call; null once the window has cut off the call head. */
  callTime?: number | null
  /** tool-result: the call head; null once truncated by the window. */
  call?: { name?: string } | null
  /** tool-result: the call id, used for display when the call head is absent. */
  callId?: string
  /** tool-result: whether this call failed. */
  isError?: boolean
  /** context: the form the producer reports; null for an unrecognised one. */
  form?: string | null
  /** compaction: the count of folded items / estimated tokens; null when the projection has none. */
  shadowedItemCount?: number | null
  shadowedTokenCount?: number | null
}

/** 「夜行记录」卡最多列几条。再多就只报总数——右栏是状态台，不是日志。 */
const TOOL_LOG_LIMIT = 6

/** 「上下文注入」卡最多列几条。 */
const CONTEXT_LOG_LIMIT = 5

export interface StatusProbeProps {
  useProjection: UseProjection
  useSession: UseSession
}

export function PonyoStatusProbe({ useProjection, useSession }: StatusProbeProps) {
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
   * The tool-call feed: running calls first, then the most recently finished.
   *
   * 🔴 A duration can only be computed while **the matching `tool/call` is still inside the window**
   * (`callTime !== null`). Once the session window scrolls, older calls lose their head and report only name and
   * outcome, leaving the duration blank — the prototype's card shows a neat `2.1s` on every row, but that is hardcoded, and blank is better.
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
          name: node.call?.name ?? (node.callId === undefined ? 'unknown tool' : `#${node.callId.slice(0, 6)}`),
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
          label: provenance?.label ?? 'unattributed source',
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

  // Running calls go first: they are what is happening now, while finished ones are history.
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

  // Start of the current turn: the one without an endTime. The per-second elapsed time is computed by the dock,
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

  // and switching sessions remounts this entry, clearing on unmount so the dock does not keep the previous session's numbers.
  useEffect(() => clearStatus, [])

  return null
}
