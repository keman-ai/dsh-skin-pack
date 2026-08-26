/**
 * 状态采集器：挂在 `conversation.composer.dock` 上、什么都不画的一个 slot 条目。
 *
 * 它存在的唯一理由是拿到 slot 注入的 `useProjection` / `useSession`，把 harness 已经算好的
 * 投影和会话快照递给右侧栏（见 usage-store）。
 *
 * 选 `conversation.composer.dock` 的三个理由：
 *   1. 它是 `{ kind: 'list' }`，追加不会顶掉官方 StatsLine（那条也在上面，id `stats`、order 0）；
 *   2. 它的 scope 是 session，标准套件会把 `useSession` / `useProjection` 一起注进 props；
 *   3. 它的生存期正好和对话页一致，换会话时本条目重新挂载，正好清掉上一场的数字。
 *
 * 渲染 null 是刻意的：这个 slot 在输入框下方，我们不想在那儿多出任何东西，
 * 设计稿把这些信息放在右栏。
 */

import { useEffect } from 'react'
import { clearUsage, publishUsage } from './usage-store.ts'

/**
 * harness 的投影读取口，由 slot 在渲染时注入。
 *
 * 按用到的 key 手写最小声明，不从 `@deepseek-ai/dsh-client-ui-slots` 引类型：那个包和它的
 * 依赖链装不下来（见 types/dsh.d.ts），而运行期它们本来就是 external。字段名与 harness 的
 * `token-meter` / `session-stats` / `tool-todo` / `permission-presets` 一致，
 * 对不上时以 harness 源码为准。
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
  /** 最近一次请求的提示词大小，供应商上报。 */
  pressureTokens?: number
  /** 下一次请求的预估大小：上面那个加上此后界面增删的重新计价，压缩后会立刻反映。 */
  projectedTokens?: number
  contextWindow?: number
}

/**
 * packages/llm/token-meter/src/projection.ts —— 下一次请求的**构成**估算。
 *
 * ⚠️ 三项用的是固定密度估算（对 CJK 与 JSON schema 系统性低估），**加起来不等于**
 * `contextPressure.projectedTokens`（那个锚在供应商上报值）。所以只能当"被什么撑满的"看，
 * 不能当总量，界面上必须说清楚。
 */
interface ContextBreakdown {
  systemTokens: number
  toolsTokens: number
  messageTokens: number
}

/** packages/llm/token-meter/src/projection.ts —— 四个桶互不重叠（推理 token 已计入 output）。 */
interface TokenUsage {
  uncachedInputTokens: number
  outputTokens: number
  cacheReadTokens: number
  cacheWriteTokens: number
}

/** packages/session/session-stats/src/types.ts 的同名字段。 */
interface SessionStats {
  turns: number
  steps: number
  llmMs: number
  toolMs: number
}

/** packages/todo/tool-todo/src/types.ts */
interface TodoItem {
  content?: string
  status?: string
}

/** packages/interaction/permission-presets/src/types.ts */
interface PermissionSelect {
  options: readonly { value: string; name: string; description?: string }[]
  /** 当前生效的预设 key，或匹配不上任何预设时的 `custom`。 */
  currentValue: string
}

/** 会话快照选择器，同样由 slot 注入（官方 StatsLine 用的是同一个口）。 */
export interface UseSession {
  <T>(selector: (snapshot: ConversationSnapshotLike) => T): T
}

/** packages/client/runtime/src/client/sessions/conversation.ts 里用到的那几个字段。 */
interface ConversationSnapshotLike {
  /** 本会话是否正在跑。 */
  running: boolean
  /** 正在执行中的工具调用；`time` 是 tool/call 事件被记录的 epoch ms。 */
  runningCalls: readonly { name: string; time: number }[]
  /**
   * 各个已注册视图各自装配出来的快照。
   *
   * 🔴 模型名只能从这里拿：Chat 那套装配（`chat.legacy.nodes`）**不填** `provenance`
   * （见 ui-conversation/conversation-nodes/assistant.ts 的 finalNode——它只填 blocks /
   * usage / timing），填 provenance 的是 Trajectory 那套。**字段声明为可选 ≠ 有人填**，
   * 照着类型去读 chat 节点只会永远拿到 undefined。
   */
  views: { get(target: 'trajectory'): { eventNodes: readonly ConversationNodeLike[] } | undefined }
  chat: { legacy: { nodes: readonly ConversationNodeLike[] } }
  /**
   * 正在等你的交互。`kind` 只有 `approval`（工具要授权）与 `question`（智能体在提问），
   * approval 的 payload 带 `toolName`。这是唯一一类"你不理它就一直停着"的状态。
   */
  pending: readonly {
    kind: string
    payload?: { toolName?: string; questions?: readonly unknown[] }
  }[]
  /** 收件箱：queued 排队等下一轮，steering 会并进当前轮，context 是纯上下文注入。 */
  queue: readonly { placement: 'queued' | 'steering' | 'context' }[]
  /** 每一轮的起止时刻；没有 endTime 的那一轮就是正在跑的这轮。 */
  turnTimings: ReadonlyMap<number, { startTime: number; endTime?: number }>
}

interface ConversationNodeLike {
  kind: string
  /** 只有 assistant 节点带；`provenance` 是"这次回复实际由哪个 provider/model 完成"。 */
  provenance?: { model?: string }
}

export interface UsageProbeProps {
  useProjection: UseProjection
  useSession: UseSession
}

export function NiulaiUsageProbe({ useProjection, useSession }: UsageProbeProps) {
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
  // Trajectory 视图的节点带 provenance；没装 ui-trajectory 时它是 undefined，退回 chat 节点
  // （那套目前不填 provenance，于是模型显示"—"，不猜也不编）。
  const nodes = useSession(s => s.views.get('trajectory')?.eventNodes ?? s.chat.legacy.nodes)

  // 用 projectedTokens 而不是 pressureTokens：压缩不上报用量，只有前者会立刻回落，
  // 否则界面会在压缩后继续显示旧的高占用（harness 自己的上下文圆环同样取它）。
  const usedTokens = pressure?.projectedTokens ?? pressure?.pressureTokens
  const billedInput = usage === undefined
    ? undefined
    : usage.uncachedInputTokens + usage.cacheReadTokens + usage.cacheWriteTokens

  // 模型：从后往前找最近一条带 provenance 的助手节点。provenance 是"实际完成这次请求的
  // 模型"，比输入框那个选择器更可信——用户中途换模型时，历史那几轮仍然是旧模型跑的。
  let model: string | undefined
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const node = nodes[index]
    if (node?.kind === 'assistant' && node.provenance?.model !== undefined) {
      model = node.provenance.model
      break
    }
  }

  const toolNames = runningCalls.map(call => call.name)

  // 等你拿主意：审批带工具名，提问只报条数（问题正文在对话里，右栏不重复）。
  const pendingApprovals = pending
    .filter(item => item.kind === 'approval')
    .map(item => item.payload?.toolName ?? '未知工具')
  const pendingQuestions = pending.filter(item => item.kind === 'question').length
  const queuedCount = queue.filter(item => item.placement === 'queued').length
  const steeringCount = queue.filter(item => item.placement === 'steering').length

  // 当前轮的开始时刻：没有 endTime 的那一轮。逐秒变化的"已跑多久"交给面板算，
  // 这里只传时间戳——否则每秒都要 publish 一次，白白把整根侧栏重渲染。
  let turnStartedAt: number | undefined
  for (const [, timing] of turnTimings) {
    if (timing.endTime === undefined && (turnStartedAt === undefined || timing.startTime > turnStartedAt)) {
      turnStartedAt = timing.startTime
    }
  }
  // 同理，取最早那个仍在跑的工具调用——那个才是"是不是卡住了"的判断依据。
  const toolStartedAt = runningCalls.length === 0
    ? undefined
    : Math.min(...runningCalls.map(call => call.time))

  // 权限：显示名从 options 里按 currentValue 找；找不到就退回原始值（`custom` 也走这条）。
  const permissionOption = permissions?.options.find(option => option.value === permissions.currentValue)

  const todoList = todos ?? []
  const todosTotal = todoList.length
  const todosDone = todoList.filter(item => item.status === 'completed').length
  const todoActive = todoList.find(item => item.status === 'in_progress')?.content

  useEffect(() => {
    publishUsage({
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

  // 换会话时这个条目会重新挂载，卸载时清掉，免得侧栏留着上一次会话的数字。
  useEffect(() => clearUsage, [])

  return null
}
