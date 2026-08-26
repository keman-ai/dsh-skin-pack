/**
 * 右侧状态台：缩小版的鲸鱼娘封面 + 这场会话的真实状态。
 *
 * 原型稿的右栏是「Current Flight / Harness Systems / Flight Modes / Moonlight Energy」四张卡。
 * 这里做**能对上真实数据的那些**：等你拿主意、状态与计时、模型、上下文占用与构成、权限模式、
 * 用量、待办进度。`Harness Systems` 那四行 ONLINE、`Flight Modes` 四张模式卡、
 * `Moonlight Energy` 那个 85% 都是纯装饰（写死的数字），harness 没有对应投影，不伪造。
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
import css from './StatusDock.module.css'

/** 展开状态的存储键。 */
const STORAGE_KEY = 'twinwhale.dock.open'

/** 展开时打在 body 上，供样式表把主区让出来。 */
const OPEN_ATTRIBUTE = 'data-twinwhale-dock-open'

/** 本皮肤激活时打在 body 上的标记，与 client/index.ts 的 BODY_ATTRIBUTE 一致。 */
const SKIN_ATTRIBUTE = 'data-dsh-twinwhale'

function readOpen(): boolean {
  try {
    // 默认展开：状态台存在的意义就是被看见；用户收起过才记住收起。
    return window.localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    // 隐私模式下 localStorage 会抛，此时按默认展开处理，不影响功能。
    return true
  }
}

/**
 * 紧凑 token 计数：517 / 12.2K / 1.2M。
 *
 * 口径与官方 `formatTokens` 对齐（StatsLine.tsx），免得同一个值在状态台和输入框下方
 * 显示成两个数字。
 * @param n - token 数。
 * @returns 展示字符串。
 */
function formatTokens(n: number): string {
  const scaled = (v: number): string =>
    v >= 100 ? String(Math.round(v)) : String(Math.round(v * 10) / 10)
  if (n < 1_000) return String(n)
  if (n < 1_000_000) return `${scaled(n / 1_000)}K`
  return `${scaled(n / 1_000_000)}M`
}

/**
 * 紧凑时长：不足一分钟 45.2s，之后 2m42s。同样对齐官方 `formatDuration`。
 * @param ms - 毫秒。
 * @returns 展示字符串。
 */
function formatDuration(ms: number): string {
  const s = ms / 1_000
  if (s < 60) return `${Math.round(s * 10) / 10}s`
  const whole = Math.round(s)
  return `${Math.floor(whole / 60)}m${whole % 60}s`
}

export function TwinwhaleStatusDock() {
  const [open, setOpen] = useState<boolean>(readOpen)
  const status = useSyncExternalStore(subscribeStatus, getStatus)

  /*
   * 逐秒重画，只在真有东西在跑的时候。
   *
   * 采集器传过来的是**时间戳**而不是"已跑多久"：后者每秒都变，会让采集器每秒 publish 一次、
   * 把整根侧栏跟着重渲染。计时留在这里算，定时器也只在有进行中的轮次/工具时才起。
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
     * 🔴 只有**本皮肤正激活**时才动这个标记。
     *
     * 状态台组件是一直挂着的（可见性交给 CSS），它不知道皮肤有没有被选中。装了多套时，
     * 每套的状态台都会在启动时把自己的 `data-*-dock-open` 打到 body 上——CSS 都带
     * `body[data-dsh-*]` 前缀所以不会串样式，但 body 上堆着十几个别的皮肤的标记，
     * 排查时看着就像串台。
     *
     * 皮肤激活时由 client/index.ts 的 `restoreDockOpen` 按存储值补上，这里只管
     * 用户手动开合（那时皮肤必然是激活的）。
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
      // 存不下就只影响"刷新后是否记住"，当前这次开合照常。
    }
    return () => { body.removeAttribute(OPEN_ATTRIBUTE) }
  }, [open])

  const toggle = useCallback(() => { setOpen(value => !value) }, [])

  const busy = status.running === true
  const tools = status.runningTools ?? []
  const occupancy = status.usedTokens !== undefined && status.contextWindow !== undefined
    ? Math.min(100, Math.round(status.usedTokens / status.contextWindow * 100))
    : undefined

  const toolCalls = status.toolCalls ?? []
  const moreTools = Math.max(0, (status.toolCallTotal ?? 0) - toolCalls.length)
  const contextEntries = status.contextInjections ?? []
  const moreContext = Math.max(0, (status.contextTotal ?? 0) - contextEntries.length)

  const approvals = status.pendingApprovals ?? []
  const questions = status.pendingQuestions ?? 0
  const queued = status.queuedCount ?? 0
  const steering = status.steeringCount ?? 0
  const waitingOnYou = approvals.length > 0 || questions > 0

  // 上下文构成：三项都是估算值，只用来分比例，不参与任何总量计算。
  const ctx = [
    { key: 'system', label: 'System', tokens: status.ctxSystemTokens },
    { key: 'tools', label: '工具 schema', tokens: status.ctxToolsTokens },
    { key: 'message', label: '对话', tokens: status.ctxMessageTokens },
  ].filter((part): part is { key: string; label: string; tokens: number } => part.tokens !== undefined)
  const ctxTotal = ctx.reduce((sum, part) => sum + part.tokens, 0)

  return (
    <aside className={css.dock} data-open={open || undefined} aria-label="会话状态台">
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
              缩小版横幅。用的是同一张内联图（不额外增加体积），`contain` 整幅呈现——
              封面是整身角色居中的构图，缩到侧栏宽度按 1.55:1 裁一条，角色完整保留。
            */}
            <div className={css.cover} style={{ backgroundImage: 'var(--twinwhale-cover)' }}>
              <span className={css.coverName}>双胞胎鲸鱼娘</span>
            </div>

            {/*
              「等你拿主意」排在最上面、且只在真的有东西等你时出现。
              这是右栏里唯一一类"你不理它就一直停着"的状态，比任何用量数字都重要。
            */}
            {waitingOnYou && (
              <section className={`${css.card} ${css.alert}`}>
                <div className={css.cardTitle}>等你拿主意</div>
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
                  {busy ? '● 正在打理' : '● 就绪 READY'}
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
                  {[queued > 0 ? `${queued} 条排队` : '', steering > 0 ? `${steering} 条插话` : '']
                    .filter(Boolean).join(' · ')}
                </Line>
              )}
              <Line label="模型">{status.model ?? '—'}</Line>
            </section>

            {/*
              打理记录 —— 原型稿右栏那张卡的真数据版。
              稿子里的 `Ocean Systems` 是五行写死的 ONLINE；这里是本会话真实跑过的工具：
              正在跑的排最前并逐秒计时，跑完的按倒序列出耗时与成败。
            */}
            {toolCalls.length > 0 && (
              <section className={css.card}>
                <div className={css.cardTitle}>打理记录</div>
                <ul className={css.log}>
                  {toolCalls.map((call, index) => (
                    <li key={`${call.name}-${index}`} className={css.logRow} data-state={callState(call)}>
                      <span className={css.logName}>{call.name}</span>
                      <span className={css.logMeta}>
                        {call.running === true
                          ? `进行中 · ${formatDuration(Math.max(0, now - (call.startedAt ?? now)))}`
                          : call.failed === true
                            ? call.ms === undefined ? '失手' : `失手 · ${formatDuration(call.ms)}`
                            : call.ms === undefined ? '完成' : `完成 · ${formatDuration(call.ms)}`}
                      </span>
                    </li>
                  ))}
                </ul>
                {moreTools > 0 && <p className={css.hint}>{`另有 ${moreTools} 次更早的下潜`}</p>}
                {/*
                  🔴 必须留这句：耗时只在配对的 tool/call 还在会话窗口内时才算得出来，
                  窗口滚过去的老调用只报名字与成败。宁可空着，也不编一个好看的秒数。
                */}
                {toolCalls.some(call => call.running !== true && call.ms === undefined) && (
                  <p className={css.hint}>没有耗时的那几条，调用头已滚出会话窗口。</p>
                )}
              </section>
            )}

            {/*
              上下文注入 —— 每轮真正被塞进上下文的那些东西（AGENTS.md、skill 目录、系统提示…）。
              ⚠️ 原型稿每行还挂一个 token 数，harness **没有按注入项计价的投影**，所以这里
              只给来源与形态，不编数字。
            */}
            {contextEntries.length > 0 && (
              <section className={css.card}>
                <div className={css.cardTitle}>上下文注入</div>
                <ul className={css.log}>
                  {contextEntries.map((entry, index) => (
                    <li key={`${entry.label}-${index}`} className={css.logRow} data-role={entry.role}>
                      <span className={css.logName}>{entry.label}</span>
                      {entry.form !== undefined && <span className={css.logTag}>{entry.form}</span>}
                    </li>
                  ))}
                </ul>
                {moreContext > 0 && <p className={css.hint}>{`另有 ${moreContext} 条更早的档案`}</p>}
              </section>
            )}


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
                    🔴 必须写这句：这三项是固定密度估算（对中文和 JSON schema 系统性低估），
                    加起来跟上面的 Token 负载对不上。是"构成"，不是"总量"。
                  */}
                  <p className={css.hint}>构成为估算，与上方负载不同源，不可相加。</p>
                </>
              )}
            </section>

            {status.compactedCount !== undefined && (
              <section className={css.card}>
                <div className={css.cardTitle}>已折叠</div>
                <Line label="压缩次数">{`${status.compactedCount} 次`}</Line>
                {status.compactedItems !== undefined && (
                  <Line label="折叠条目">{`${status.compactedItems} 条`}</Line>
                )}
                {status.compactedTokens !== undefined && (
                  <Line label="折叠 token">{formatTokens(status.compactedTokens)}</Line>
                )}
                <p className={css.hint}>被折叠的历史仍在对话里，只是模型不再看见。</p>
              </section>
            )}

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

            {/* 待办卡只在真的有清单时出现——没有计划的会话不该看到一张空卡。 */}
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
 * 一次工具调用的展示态：运行中 / 失败 / 成功。用 `data-state` 交给样式表上色，
 * 而不是在这里拼类名——皮肤要换配色时只改 CSS。
 * @param call - 一次调用的读数。
 * @returns 展示态。
 */
function callState(call: { running?: boolean | undefined; failed?: boolean | undefined }): string {
  if (call.running === true) return 'running'
  return call.failed === true ? 'error' : 'ok'
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
