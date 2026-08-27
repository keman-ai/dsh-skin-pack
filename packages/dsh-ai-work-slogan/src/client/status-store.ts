/**
 * 状态台的数据中转站。
 *
 * Why the relay is needed: state and usage all come from the harness's **projections** and **session
 * snapshots**, and `useProjection` / `useSession` are hooks injected into props at slot render time — only a
 * 组件才拿得到。右侧状态台是本插件自建的 fixed 节点、走自己的 React root，不在任何 slot 里。
 *
 * Hence the split in two: a zero-render probe mounted on `conversation.composer.dock` (a list slot third
 * 追加，官方 StatsLine 也在上面），把读到的值写进这里；状态台 `useSyncExternalStore` 订阅这里。
 *
 * 🔴 数据一律来自官方投影/快照，**不解析 DOM、不伪造**。原型稿右栏的
 * `Harness Systems`（五行 ONLINE）与 `Work Modes`（四张模式卡）都是装饰，harness 没有对应投影，
 * 所以本皮肤不做那两张卡，也不拿假状态凑数。
 */

/**
 * 一次工具调用的读数。
 *
 * 数据来自 `views.get('trajectory').eventNodes` 里的 `tool-result` 节点，以及快照的
 * `runningCalls`。这正是原型稿右栏「神通调用」那张卡要的东西——只不过稿子里的
 * `已完成 2.1s` 是写死的，这里是真的。
 */
export interface ToolCallEntry {
  /** 工具名。调用头被窗口截断时（`call` 为 null）退回 callId 的短前缀。 */
  name: string
  /**
   * 墙钟耗时（毫秒）。
   *
   * ⚠️ 只有配对的 `tool/call` 还在窗口内（`callTime !== null`）时才算得出来。
   * 窗口截断掉调用头的老调用没有这个值——**缺席就缺席，不猜**。
   */
  ms?: number | undefined
  /** 跑完了但失败（`ToolResultNode.isError`）。 */
  failed?: boolean | undefined
  /** 还在跑。此时 `ms` 缺席，逐秒的耗时由状态台按 `startedAt` 自己算。 */
  running?: boolean | undefined
  /** 正在跑的那条的开始时刻（epoch ms，`RunningToolCall.time`）。 */
  startedAt?: number | undefined
}

/**
 * 一次上下文注入的读数（`ContextMessageNode`）。
 *
 * 对应原型稿的「经卷 / 天书 / Context files」那张卡。⚠️ 稿子每行还带一个 token 数
 *（`1.3K` / `820`），**harness 没有按注入项计价的投影**，所以这里只给来源与形态，不编数字。
 */
export interface ContextEntry {
  /** 生产者名（`ContextProvenanceView.label`）：AGENTS.md 路径、skill 名、插件 id…… */
  label: string
  /** 生产者自报的信息形态（instructions / catalog / snapshot / notice / relay / recall）。 */
  form?: string | undefined
  /** `inject` 是本会话注入，`recall` 是从别的会话捞回来的。 */
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

  // ── 实时计时（存的是时间戳，逐秒变化的那部分由状态台自己算） ──
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

  // ── 工具调用与上下文注入：从 trajectory 的事件节点里读，最近的排前面 ──
  /** 最近若干次工具调用，正在跑的排最前。 */
  toolCalls?: readonly ToolCallEntry[] | undefined
  /** 本会话累计的工具调用次数（不截断，用来显示"另有 N 次"）。 */
  toolCallTotal?: number | undefined
  /** 最近若干条上下文注入。 */
  contextInjections?: readonly ContextEntry[] | undefined
  /** 本会话累计的注入条数。 */
  contextTotal?: number | undefined

  // ── 压缩（CompactionSummaryNode）：会话被折叠过几次、折掉了多少 ──
  /** 落地过的压缩次数。 */
  compactedCount?: number | undefined
  /** 被折叠掉的条目数合计；投影没给时缺席。 */
  compactedItems?: number | undefined
  /** 被折叠掉的 token 估算合计；投影没给时缺席。 */
  compactedTokens?: number | undefined
}

let current: StatusSnapshot = {}
const listeners = new Set<() => void>()

/** 采集器每次读到新值时调用。值没变就不通知，避免状态台跟着流式输出空转。 */
export function publishStatus(next: StatusSnapshot): void {
  if (sameStatus(current, next)) {
    return
  }
  current = next
  for (const listener of listeners) {
    listener()
  }
}

/** 供 `useSyncExternalStore` 用：值没变时返回同一个引用。 */
export function getStatus(): StatusSnapshot {
  return current
}

export function subscribeStatus(listener: () => void): () => void {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** 采集器卸载（切走会话、皮肤停用）时清空，免得状态台挂着上一次会话的数字。 */
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
  // 数组的引用每次都新，按内容比——否则状态台会跟着流式输出每帧重渲染。
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
