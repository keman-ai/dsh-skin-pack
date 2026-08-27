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
 * 🔴 All data comes from official projections and snapshots — **no DOM parsing, nothing fabricated**. The five
 * "Assistant Systems online" rows in the prototype's right column are pure decoration; the harness has no such heartbeat projection, so this skin does not build that card.
 */

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
  ]
  if (!keys.every(key => a[key] === b[key])) {
    return false
  }
  // Both string arrays get new references every time, so compare by content.
  return sameNames(a.runningTools, b.runningTools) && sameNames(a.pendingApprovals, b.pendingApprovals)
}

function sameNames(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  const left = a ?? []
  const right = b ?? []
  return left.length === right.length && left.every((name, index) => name === right[index])
}
