/**
 * 状态台的数据中转站。
 *
 * 为什么需要中转：状态与用量全部来自 harness 的**投影**与**会话快照**，而
 * `useProjection` / `useSession` 是 slot 渲染时注入进 props 的 hook —— 只有挂在 slot 上的
 * 组件才拿得到。右侧状态台是本插件自建的 fixed 节点、走自己的 React root，不在任何 slot 里。
 *
 * 于是拆成两半：一个零渲染的采集器挂进 `conversation.composer.dock`（list slot，第三方可
 * 追加，官方 StatsLine 也在上面），把读到的值写进这里；状态台 `useSyncExternalStore` 订阅这里。
 *
 * 🔴 数据一律来自官方投影/快照，**不解析 DOM、不伪造**。原型稿右栏的 `Workspace context`
 *（哪些文件被索引了）harness 没有对应投影，所以本皮肤不做那张卡，也不拿假文件名凑数。
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

/** 一次读数。字段全部可能缺席——供应商没报用量前投影就是空的。 */
export interface StatusSnapshot {
  /** 本会话是否正在跑（ConversationSnapshot.running）。 */
  running?: boolean | undefined
  /** 正在执行的工具名（ConversationSnapshot.runningCalls），可能同时有多个。 */
  runningTools?: readonly string[] | undefined

  // ── 「等你拿主意」：唯一一类不看就会一直卡着的状态 ──
  /** 正在等审批的工具名（pending 里 kind === 'approval'）。 */
  pendingApprovals?: readonly string[] | undefined
  /** 正在等你回答的问题数（pending 里 kind === 'question'）。 */
  pendingQuestions?: number | undefined
  /** 排队中的消息数（queue 里 placement === 'queued'）。 */
  queuedCount?: number | undefined
  /** 已插入、等着并进当前轮的消息数（placement === 'steering'）。 */
  steeringCount?: number | undefined

  // ── 权限 · 沙箱模式 ──
  /** 当前生效的权限预设显示名（permissions 投影）。 */
  permissionLabel?: string | undefined
  /** 该预设的一句话说明，没配就缺席。 */
  permissionHint?: string | undefined

  // ── 实时计时（存的是时间戳，逐秒变化的那部分由状态台自己算） ──
  /** 当前这一轮的开始时刻（epoch ms）；没有进行中的轮次时缺席。 */
  turnStartedAt?: number | undefined
  /** 最早那个仍在跑的工具调用的开始时刻（epoch ms）。 */
  toolStartedAt?: number | undefined

  // ── 上下文构成（contextBreakdown 投影，全部是估算值） ──
  ctxSystemTokens?: number | undefined
  ctxToolsTokens?: number | undefined
  ctxMessageTokens?: number | undefined
  /** 最近一次助手回复实际用的模型（AssistantMessageNode.provenance.model）。 */
  model?: string | undefined
  /** 当前上下文占用的 token 数（下一次请求的预估提示词大小）。 */
  usedTokens?: number | undefined
  /** 该路由的上下文窗口容量。 */
  contextWindow?: number | undefined
  /** 计费口径的输入 token（未命中缓存 + 缓存读 + 缓存写，三个桶不重叠）。 */
  inputTokens?: number | undefined
  /** 输出 token（已含推理 token，不重复累加）。 */
  outputTokens?: number | undefined
  /** 缓存命中率，0–100 的整数；没有计费输入时缺席。 */
  cacheHitPercent?: number | undefined
  /** 模型请求墙钟总和（毫秒）。 */
  llmMs?: number | undefined
  /** 工具执行墙钟总和（毫秒）。 */
  toolMs?: number | undefined
  /** 轮数与步数。 */
  turns?: number | undefined
  steps?: number | undefined
  /** 待办清单进度（todos 投影）；没有清单时缺席。 */
  todosDone?: number | undefined
  todosTotal?: number | undefined
  /** 当前进行中的那条待办的标题。 */
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
