/**
 * 状态数据的中转站。
 *
 * 为什么需要中转：状态与用量全部来自 harness 的**投影**与**会话快照**，而
 * `useProjection` / `useSession` 是 slot 渲染时注入进 props 的 hook —— 只有挂在 slot 上的
 * 组件才拿得到。侧边栏是本插件自建的 fixed 节点、走自己的 React root，不在任何 slot 里。
 *
 * 于是拆成两半：一个零渲染的采集器挂进 `conversation.composer.dock`（list slot，第三方可
 * 追加，官方 StatsLine 也在上面），把读到的值写进这里；侧栏 `useSyncExternalStore` 订阅这里。
 *
 * 🔴 数据一律来自官方投影/快照，**不解析 DOM、不伪造**。早先这块是数 DOM 里的
 * `[data-variant]` 行、按类名猜预设与模型名的，harness 一改结构就全空 —— 那套已经删掉。
 */

/** 一次读数。字段全部可能缺席——供应商没报用量前投影就是空的。 */
export interface UsageSnapshot {
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

  // ── 实时计时（存的是时间戳，逐秒变化的那部分由面板自己算） ──
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
  // 两个字符串数组的引用每次都新，按内容比。
  return sameNames(a.runningTools, b.runningTools) && sameNames(a.pendingApprovals, b.pendingApprovals)
}

function sameNames(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  const left = a ?? []
  const right = b ?? []
  return left.length === right.length && left.every((name, index) => name === right[index])
}
