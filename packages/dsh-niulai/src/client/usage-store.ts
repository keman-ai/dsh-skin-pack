/**
 * 状态数据的中转站。
 *
 * Why the relay is needed: state and usage all come from the harness's **projections** and **session
 * snapshots**, and `useProjection` / `useSession` are hooks injected into props at slot render time — only a
 * 组件才拿得到。侧边栏是本插件自建的 fixed 节点、走自己的 React root，不在任何 slot 里。
 *
 * Hence the split in two: a zero-render probe mounted on `conversation.composer.dock` (a list slot third
 * 追加，官方 StatsLine 也在上面），把读到的值写进这里；侧栏 `useSyncExternalStore` 订阅这里。
 *
 * 🔴 数据一律来自官方投影/快照，**不解析 DOM、不伪造**。早先这块是数 DOM 里的
 * `[data-variant]` 行、按类名猜预设与模型名的，harness 一改结构就全空 —— 那套已经删掉。
 */

/** One reading. Every field may be absent — the projection is empty until the provider reports usage. */
export interface UsageSnapshot {
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

  // ── 实时计时（存的是时间戳，逐秒变化的那部分由面板自己算） ──
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

let current: UsageSnapshot = {}
const listeners = new Set<() => void>()

/** 采集器每次读到新值时调用。值没变就不通知，避免侧栏跟着流式输出空转。 */
export function publishUsage(next: UsageSnapshot): void {
  if (sameUsage(current, next)) {
    return
  }
  current = next
  for (const listener of listeners) {
    listener()
  }
}

/** 供 `useSyncExternalStore` 用：返回稳定引用，值没变时引用也不变。 */
export function getUsage(): UsageSnapshot {
  return current
}

export function subscribeUsage(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** 采集器卸载（切走会话、皮肤停用）时清空，免得侧栏挂着上一次会话的数字。 */
export function clearUsage(): void {
  publishUsage({})
}

function sameUsage(a: UsageSnapshot, b: UsageSnapshot): boolean {
  const keys: (keyof UsageSnapshot)[] = [
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
