/**
 * 右侧状态台：缩小版的鲸鱼娘封面 + 这场会话的真实状态。
 *
 * 原型稿的右栏是「会话状态 / Assistant Systems / 鲸鱼少女模式」三张卡。这里做**能对上真实
 * 数据的那些**：状态、模型、上下文占用、用量、待办进度；那五个 “Assistant Systems 在线”
 * 是纯装饰，harness 没有对应的心跳投影，不伪造。
 *
 * 为什么自己造一根而不是接管 harness 的右侧详情栏（`details` slot）：
 * 它确实**可以**接管（`{ kind: 'single' }` 的占用冲突只发生在同一 priority，注册 -1 就能影子化
 * 官方那份），但官方那根装的是「点某次工具调用看 Input / Output」——那是排障时唯一的线索，
 * 拿状态台把它换掉是净损失。所以开一根自己的：`position: fixed` 贴右边，展开时通过 body 上的
 * 标记让主区让出等宽的空间，收起时只留一个把手，两者可以同时存在。
 *
 * 收起状态记在 localStorage：状态台是长期可见的东西，每次刷新都弹回来会很烦。
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { getStatus, subscribeStatus } from './status-store.ts'
import css from './LoungeDock.module.css'

/** Storage key for the expanded state. */
const STORAGE_KEY = 'whale-girl.dock.open'

/** Set on body while expanded, so the stylesheet can free up the main area. */
const OPEN_ATTRIBUTE = 'data-whale-girl-dock-open'

/** Marker set on body while this skin is active; matches BODY_ATTRIBUTE in client/index.ts. */
const SKIN_ATTRIBUTE = 'data-dsh-whale-girl'

function readOpen(): boolean {
  try {
    // 默认展开：状态台存在的意义就是被看见；用户收起过才记住收起。
    return window.localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    // localStorage throws in private mode; fall back to the default expanded state, which changes nothing functionally.
    return true
  }
}

/**
 * 紧凑 token 计数：517 / 12.2K / 1.2M。
 *
 * 口径与官方 `formatTokens` 对齐（StatsLine.tsx），免得同一个值在状态台和输入框下方
 * 显示成两个数字。
 * @param n - Token count.
 * @returns The display string.
 */
function formatTokens(n: number): string {
  const scaled = (v: number): string =>
    v >= 100 ? String(Math.round(v)) : String(Math.round(v * 10) / 10)
  if (n < 1_000) return String(n)
  if (n < 1_000_000) return `${scaled(n / 1_000)}K`
  return `${scaled(n / 1_000_000)}M`
}

/**
 * Compact durations: 45.2s under a minute, then 2m42s. Also aligned with the official `formatDuration`.
 * @param ms - Milliseconds.
 * @returns The display string.
 */
function formatDuration(ms: number): string {
  const s = ms / 1_000
  if (s < 60) return `${Math.round(s * 10) / 10}s`
  const whole = Math.round(s)
  return `${Math.floor(whole / 60)}m${whole % 60}s`
}

export function WhaleLoungeDock() {
  const [open, setOpen] = useState<boolean>(readOpen)
  const status = useSyncExternalStore(subscribeStatus, getStatus)

  /*
   * Repaints every second, and only while something is actually running.
   *
   * The probe passes a **timestamp** rather than an elapsed duration: the latter changes every second,
   * which would make the probe publish every second and re-render the whole rail. The clock is computed here, and the timer runs only while a turn or tool is in flight.
   */
  const timing = status.turnStartedAt ?? status.toolStartedAt
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (timing === undefined) {
      return
    }
    setNow(Date.now())
    const id = setInterval(() => { setNow(Date.now()) }, 1_000)
    return () => { clearInterval(id) }
  }, [timing])

  useEffect(() => {
    const body = document.body
    /*
     * 🔴 Touch this marker only while **this skin is active**.
     *
     * The status dock component is always mounted (visibility is left to CSS) and does not know whether its
     * skin is selected. With several installed, every dock would stamp its own `data-*-dock-open` onto body at
     * startup — the CSS is all prefixed with `body[data-dsh-*]` so styles never cross, but a dozen other skins'
     * markers piled on body look exactly like a leak when debugging.
     *
     * On activation, `restoreDockOpen` in client/index.ts restores it from storage; this only handles the user
     * opening and closing it by hand, at which point the skin is necessarily active.
     */
    if (body.hasAttribute(SKIN_ATTRIBUTE)) {
      if (open) {
        body.setAttribute(OPEN_ATTRIBUTE, '')
      } else {
        body.removeAttribute(OPEN_ATTRIBUTE)
      }
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, String(open))
    } catch {
      // Failing to store only affects whether it is remembered after a refresh; this toggle still works.
    }
    return () => { body.removeAttribute(OPEN_ATTRIBUTE) }
  }, [open])

  const toggle = useCallback(() => { setOpen(value => !value) }, [])

  const busy = status.running === true
  const tools = status.runningTools ?? []
  const occupancy = status.usedTokens !== undefined && status.contextWindow !== undefined
    ? Math.min(100, Math.round(status.usedTokens / status.contextWindow * 100))
    : undefined

  const approvals = status.pendingApprovals ?? []
  const questions = status.pendingQuestions ?? 0
  const queued = status.queuedCount ?? 0
  const steering = status.steeringCount ?? 0
  const waitingOnYou = approvals.length > 0 || questions > 0

  // Context composition: all three are estimates, used only for proportions and never for a total.
  const ctx = [
    { key: 'system', label: 'System', tokens: status.ctxSystemTokens },
    { key: 'tools', label: '工具 schema', tokens: status.ctxToolsTokens },
    { key: 'message', label: '对话', tokens: status.ctxMessageTokens },
  ].filter((part): part is { key: string; label: string; tokens: number } => part.tokens !== undefined)
  const ctxTotal = ctx.reduce((sum, part) => sum + part.tokens, 0)

  return (
    <aside className={css.dock} data-open={open || undefined} aria-label="鲸鱼娘状态台">
      <button
        type="button"
        className={css.handle}
        onClick={toggle}
        aria-expanded={open}
        title={open ? '收起状态台' : '展开状态台'}
      >
        {open ? '›' : '‹'}
      </button>
      {open && (
        <div className={css.body}>
          <div className={css.header}>会话状态</div>
          <div className={css.scroll}>
            {/*
              缩小版封面。用的是同一张内联图（不额外增加体积），contain 保证两个角色都完整
              —— 这张图的构图是"左右各一人"，裁切必然切到人。
            */}
            <div className={css.cover} style={{ backgroundImage: 'var(--whale-girl-cover)' }}>
              <span className={css.coverName}>Whale Girl Lounge</span>
            </div>

            {/*
              "Waiting on you" sits at the top and appears only when something is genuinely waiting.
              It is the one state in this column that stalls until you act, which outranks any usage number.
            */}
            {waitingOnYou && (
              <section className={`${css.card} ${css.alert}`}>
                <div className={css.cardTitle}>Waiting on you</div>
                {approvals.map((tool, index) => (
                  <Line key={`${tool}-${index}`} label="待授权">
                    <span className={css.mono}>{tool}</span>
                  </Line>
                ))}
                {questions > 0 && <Line label="待回答">{`${questions} 个问题`}</Line>}
                <p className={css.hint}>回到对话里确认后才会继续。</p>
              </section>
            )}

            <section className={css.card}>
              <div className={css.cardTitle}>Current Session</div>
              <Line label="状态">
                <span className={busy ? css.busy : css.ok}>
                  {busy ? '● 鲸鱼娘正在忙' : '● 就绪 READY'}
                </span>
              </Line>
              {status.turnStartedAt !== undefined && (
                <Line label="本轮已跑">
                  <span className={css.busy}>{formatDuration(Math.max(0, now - status.turnStartedAt))}</span>
                </Line>
              )}
              {tools.length > 0 && (
                <Line label="正在执行">
                  <span className={css.mono}>
                    {tools.join(' · ')}
                    {status.toolStartedAt !== undefined
                      && ` · ${formatDuration(Math.max(0, now - status.toolStartedAt))}`}
                  </span>
                </Line>
              )}
              {(queued > 0 || steering > 0) && (
                <Line label="收件箱">
                  {[queued > 0 ? `${queued} queued` : '', steering > 0 ? `${steering} steering` : '']
                    .filter(Boolean).join(' · ')}
                </Line>
              )}
              <Line label="模型">{status.model ?? '—'}</Line>
            </section>

            <section className={css.card}>
              <div className={css.cardTitle}>Context</div>
              <Line label="占用">{occupancy === undefined ? '—' : `${occupancy}%`}</Line>
              {occupancy !== undefined && (
                <div className={css.progress}>
                  <span style={{ width: `${occupancy}%` }} />
                </div>
              )}
              <Line label="Token 负载">
                {status.usedTokens === undefined || status.contextWindow === undefined
                  ? '—'
                  : `${formatTokens(status.usedTokens)} / ${formatTokens(status.contextWindow)}`}
              </Line>
              {ctxTotal > 0 && (
                <>
                  <div className={css.stack}>
                    {ctx.map(part => (
                      <span
                        key={part.key}
                        data-part={part.key}
                        style={{ width: `${part.tokens / ctxTotal * 100}%` }}
                      />
                    ))}
                  </div>
                  {ctx.map(part => (
                    <Line key={part.key} label={part.label}>
                      <span data-part={part.key} className={css.legend}>
                        {`${Math.round(part.tokens / ctxTotal * 100)}% · ${formatTokens(part.tokens)}`}
                      </span>
                    </Line>
                  ))}
                  {/*
                    🔴 This sentence is mandatory: the three are fixed-density estimates (systematically low for CJK and JSON
                    schema), so they do not add up to the token load above. This is composition, not a total.
                  */}
                  <p className={css.hint}>构成为估算，与上方负载不同源，不可相加。</p>
                </>
              )}
            </section>

            {status.permissionLabel !== undefined && (
              <section className={css.card}>
                <div className={css.cardTitle}>Permission</div>
                <Line label="当前模式">{status.permissionLabel}</Line>
                {status.permissionHint !== undefined && (
                  <p className={css.hint}>{status.permissionHint}</p>
                )}
              </section>
            )}

            <section className={css.card}>
              <div className={css.cardTitle}>Usage</div>
              <Line label="输入">
                {status.inputTokens === undefined ? '—' : formatTokens(status.inputTokens)}
              </Line>
              <Line label="输出">
                {status.outputTokens === undefined ? '—' : formatTokens(status.outputTokens)}
              </Line>
              <Line label="缓存命中">
                {status.cacheHitPercent === undefined ? '—' : `${status.cacheHitPercent}%`}
              </Line>
              <Line label="耗时">
                {status.llmMs === undefined && status.toolMs === undefined
                  ? '—'
                  : `LLM ${formatDuration(status.llmMs ?? 0)} · 工具 ${formatDuration(status.toolMs ?? 0)}`}
              </Line>
              <Line label="轮次">
                {status.turns === undefined ? '—' : `${status.turns} 轮 · ${status.steps ?? 0} 步`}
              </Line>
            </section>

            {/* The todo card appears only when there really is a list — a session with no plan should not see an empty card. */}
            {status.todosTotal !== undefined && (
              <section className={css.card}>
                <div className={css.cardTitle}>Plan</div>
                <Line label="进度">{`${status.todosDone ?? 0} / ${status.todosTotal}`}</Line>
                {status.todoActive !== undefined && (
                  <p className={css.todo}>{status.todoActive}</p>
                )}
              </section>
            )}

          </div>
        </div>
      )}
    </aside>
  )
}

/**
 * 一行「标签 — 值」，对应原型稿 `.line` 的两列排版。
 * @param props - 标签与值。
 * @returns 一行。
 */
function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={css.line}>
      <span className={css.key}>{label}</span>
      <span className={css.value}>{children}</span>
    </div>
  )
}
