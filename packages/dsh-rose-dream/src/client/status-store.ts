/**
 * The relay that feeds the status dock.
 *
 * Why the relay is needed: state and usage all come from the harness's **projections** and **session
 * snapshots**, and `useProjection` / `useSession` are hooks injected into props at slot render time — only a
 * component mounted on a slot receives them. The right-hand dock is our own fixed node with its own React root and belongs to no slot.
 *
 * Hence the split in two: a zero-render probe mounted on `conversation.composer.dock` (a list slot third
 * parties may append to, and where the official StatsLine also lives) writes what it reads into here, and the dock subscribes with `useSyncExternalStore`.
 *
 * 🔴 数据一律来自官方投影/快照，**不解析 DOM、不伪造**。原型稿右栏的 `Workspace context`
 *（哪些文件被索引了）harness 没有对应投影，所以本皮肤不做那张卡，也不拿假文件名凑数。
 */

/**
 * One tool call's reading.
 *
 * The data comes from `tool-result` nodes in `views.get('trajectory').eventNodes` plus the snapshot's
 * `runningCalls`. This is exactly what the prototype's tool-call card in the right column wanted — except that
 * its "finished 2.1s" was hardcoded, and here it is real.
 */
export interface ToolCallEntry {
  /** Tool name. When the call head is truncated by the window (`call` is null), falls back to a short callId prefix. */
  name: string
  /**
   * Wall-clock duration in milliseconds.
   *
   * ⚠️ Computable only while the matching `tool/call` is still inside the window (`callTime !== null`).
   * Older calls whose head the window truncated have no value — **absent stays absent; nothing is guessed**.
   */
  ms?: number | undefined
  /** Finished but failed (`ToolResultNode.isError`). */
  failed?: boolean | undefined
  /** Still running. `ms` is absent, and the dock computes the per-second duration from `startedAt`. */
  running?: boolean | undefined
  /** Start of the running call (epoch ms, `RunningToolCall.time`). */
  startedAt?: number | undefined
}

/**
 * One context injection's reading (`ContextMessageNode`).
 *
 * This is the prototype's context-files card. ⚠️ Its rows also carry a token count (`1.3K` / `820`), but the
 * **harness has no projection pricing individual injections**, so only source and form are given, with no invented numbers.
 */
export interface ContextEntry {
  /** Producer name (`ContextProvenanceView.label`): an AGENTS.md path, a skill name, a plugin id… */
  label: string
  /** The form the producer reports (instructions / catalog / snapshot / notice / relay / recall). */
  form?: string | undefined
  /** `inject` was injected in this session; `recall` was pulled in from another. */
  role?: string | undefined
}

/** One reading. Every field may be absent — the projection is empty until the provider reports usage. */
export interface StatusSnapshot {
  /** Whether this session is running (ConversationSnapshot.running). */
  running?: boolean | undefined
  /** Names of tools executing (ConversationSnapshot.runningCalls); there may be several at once. */
  runningTools?: readonly string[] | undefined

  // ── "Waiting on you": the one state that stalls indefinitely if ignored ──
  /** Names of tools awaiting approval (pending entries with kind === 'approval'). */
  pendingApprovals?: readonly string[] | undefined
  /** Number of questions awaiting your answer (pending entries with kind === 'question'). */
  pendingQuestions?: number | undefined
  /** Number of queued messages (queue entries with placement === 'queued'). */
  queuedCount?: number | undefined
  /** Number of inserted messages waiting to merge into the current turn (placement === 'steering'). */
  steeringCount?: number | undefined

  // ── Permissions · sandbox mode ──
  /** Display name of the active permission preset (permissions projection). */
  permissionLabel?: string | undefined
  /** One-line description of that preset; absent when not configured. */
  permissionHint?: string | undefined

  // ── Live timing (timestamps are stored; the per-second part is computed by the dock) ──
  /** Start of the current turn (epoch ms); absent when no turn is in flight. */
  turnStartedAt?: number | undefined
  /** Start of the earliest tool call still running (epoch ms). */
  toolStartedAt?: number | undefined

  // ── Context composition (contextBreakdown projection; all estimates) ──
  ctxSystemTokens?: number | undefined
  ctxToolsTokens?: number | undefined
  ctxMessageTokens?: number | undefined
  /** The model that actually served the most recent assistant reply (AssistantMessageNode.provenance.model). */
  model?: string | undefined
  /** Tokens the context currently occupies (the estimated prompt size of the next request). */
  usedTokens?: number | undefined
  /** Context window capacity of that route. */
  contextWindow?: number | undefined
  /** Billed input tokens (cache miss + cache read + cache write; the three buckets are disjoint). */
  inputTokens?: number | undefined
  /** Output tokens (reasoning tokens included, never double-counted). */
  outputTokens?: number | undefined
  /** Cache hit rate, an integer 0–100; absent when there is no billed input. */
  cacheHitPercent?: number | undefined
  /** Total wall-clock time of model requests, in milliseconds. */
  llmMs?: number | undefined
  /** Total wall-clock time of tool execution, in milliseconds. */
  toolMs?: number | undefined
  /** Turn and step counts. */
  turns?: number | undefined
  steps?: number | undefined
  /** Todo list progress (todos projection); absent when there is no list. */
  todosDone?: number | undefined
  todosTotal?: number | undefined
  /** Title of the todo currently in progress. */
  todoActive?: string | undefined

  // ── Tool calls and context injections: read from trajectory event nodes, most recent first ──
  /** The most recent tool calls, running ones first. */
  toolCalls?: readonly ToolCallEntry[] | undefined
  /** Total tool calls this session (untruncated, used for the "N more" line). */
  toolCallTotal?: number | undefined
  /** The most recent context injections. */
  contextInjections?: readonly ContextEntry[] | undefined
  /** Total injections this session. */
  contextTotal?: number | undefined

  // ── Compaction (CompactionSummaryNode): how often the session was folded, and by how much ──
  /** Number of compactions that landed. */
  compactedCount?: number | undefined
  /** Total items folded away; absent when the projection does not provide it. */
  compactedItems?: number | undefined
  /** Total estimated tokens folded away; absent when the projection does not provide it. */
  compactedTokens?: number | undefined
}

let current: StatusSnapshot = {}
const listeners = new Set<() => void>()

/** Called by the probe on every new reading. Unchanged values notify nobody, so the dock does not spin along with streaming output. */
export function publishStatus(next: StatusSnapshot): void {
  if (sameStatus(current, next)) {
    return
  }
  current = next
  for (const listener of listeners) {
    listener()
  }
}

/** For `useSyncExternalStore`: returns the same reference while the value is unchanged. */
export function getStatus(): StatusSnapshot {
  return current
}

export function subscribeStatus(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** Cleared when the probe unmounts (session switch, skin deactivation) so the dock does not keep the previous session's numbers. */
export function clearStatus(): void {
  publishStatus({})
}

function sameStatus(a: StatusSnapshot, b: StatusSnapshot): boolean {
  const keys: (keyof StatusSnapshot)[] = [
    'running', 'model', 'usedTokens', 'contextWindow', 'inputTokens', 'outputTokens',
    'cacheHitPercent', 'llmMs', 'toolMs', 'turns', 'steps',
    'todosDone', 'todosTotal', 'todoActive',
    'pendingQuestions', 'queuedCount', 'steeringCount',
    'permissionLabel', 'permissionHint',
    'turnStartedAt', 'toolStartedAt',
    'ctxSystemTokens', 'ctxToolsTokens', 'ctxMessageTokens',
    'toolCallTotal', 'contextTotal', 'compactedCount', 'compactedItems', 'compactedTokens',
  ]
  if (!keys.every(key => a[key] === b[key])) {
    return false
  }
  // Array references are new every time, so compare by content — otherwise the dock re-renders every frame of streaming output.
  return sameNames(a.runningTools, b.runningTools)
    && sameNames(a.pendingApprovals, b.pendingApprovals)
    && sameTools(a.toolCalls, b.toolCalls)
    && sameContexts(a.contextInjections, b.contextInjections)
}

function sameTools(a: readonly ToolCallEntry[] | undefined, b: readonly ToolCallEntry[] | undefined): boolean {
  const left = a ?? []
  const right = b ?? []
  return left.length === right.length && left.every((entry, index) => {
    const other = right[index]
    return other !== undefined
      && entry.name === other.name
      && entry.ms === other.ms
      && entry.failed === other.failed
      && entry.running === other.running
      && entry.startedAt === other.startedAt
  })
}

function sameContexts(a: readonly ContextEntry[] | undefined, b: readonly ContextEntry[] | undefined): boolean {
  const left = a ?? []
  const right = b ?? []
  return left.length === right.length && left.every((entry, index) => {
    const other = right[index]
    return other !== undefined && entry.label === other.label && entry.form === other.form && entry.role === other.role
  })
}



function sameNames(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  const left = a ?? []
  const right = b ?? []
  return left.length === right.length && left.every((name, index) => name === right[index])
}
