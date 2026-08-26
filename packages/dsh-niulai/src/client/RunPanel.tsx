/**
 * 「牛来」运行概览面板 —— 与鲸鱼娘皮肤同一套状态台，只是把缩略图换成牛、配色走原野色。
 *
 * 🔴 <b>数据全部来自 harness 的官方投影与会话快照，不再解析 DOM</b>。
 * 早先这块是数 `[data-variant]` 行、按类名猜预设与模型名的——那是在"用量拿不到、得自己
 * 写一整套事件投影"的错误判断下写的。实际上 harness 自带 token-meter / session-stats /
 * permission-presets / tool-todo，投影早算好了，缺的只是把值递出 slot（见 UsageProbe）。
 * 换掉之后少了一整类"harness 改结构就读不到"的耦合。
 *
 * 为什么不接管 harness 的右侧详情栏（`details` slot）：它确实**可以**接管（`single` 的
 * 占用冲突只发生在同一 priority，注册 -1 就能影子化官方那份），但那根装的是「点某次工具
 * 调用看 Input / Output」——排障时唯一的线索，拿状态台把它换掉是净损失。所以自己开一根。
 */

import { useEffect, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { getUsage, subscribeUsage } from './usage-store.ts'
import css from './RunPanel.module.css'

/**
 * token 数压成 31.8K / 1.2M。
 * 与 harness 的 `formatTokens` 同口径（三位数以内保一位小数），免得侧栏和官方
 * 那颗上下文圆环显示出不同的数字。
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

function Row({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className={css.row}>
      <span className={css.rowLabel}>{label}</span>
      <span className={css.rowValue}>{children}</span>
    </div>
  )
}

/** 面板本体。挂在自建的右侧栏里。 */
export function NiulaiRunPanel() {
  const usage = useSyncExternalStore(subscribeUsage, getUsage, getUsage)

  /*
   * 逐秒重画，只在真有东西在跑的时候。
   *
   * 采集器传过来的是**时间戳**而不是"已跑多久"：后者每秒都变，会让采集器每秒 publish 一次、
   * 把整根侧栏跟着重渲染。计时留在这里算，定时器也只在有进行中的轮次/工具时才起。
   */
  const timing = usage.turnStartedAt ?? usage.toolStartedAt
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (timing === undefined) {
      return
    }
    setNow(Date.now())
    const id = window.setInterval(() => { setNow(Date.now()) }, 1_000)
    return () => { window.clearInterval(id) }
  }, [timing])

  const busy = usage.running === true
  const tools = usage.runningTools ?? []
  const occupancy = usage.usedTokens !== undefined && usage.contextWindow !== undefined
    ? Math.min(100, Math.round(usage.usedTokens / usage.contextWindow * 100))
    : undefined

  const approvals = usage.pendingApprovals ?? []
  const questions = usage.pendingQuestions ?? 0
  const queued = usage.queuedCount ?? 0
  const steering = usage.steeringCount ?? 0
  const waitingOnYou = approvals.length > 0 || questions > 0

  // 上下文构成：三项都是估算值，只用来分比例，不参与任何总量计算。
  const ctx = [
    { key: 'system', label: 'System', tokens: usage.ctxSystemTokens },
    { key: 'tools', label: '工具 schema', tokens: usage.ctxToolsTokens },
    { key: 'message', label: '对话', tokens: usage.ctxMessageTokens },
  ].filter((part): part is { key: string, label: string, tokens: number } => part.tokens !== undefined)
  const ctxTotal = ctx.reduce((sum, part) => sum + part.tokens, 0)

  const dash = '—'
  return (
    <div className={css.root}>
      {/*
        缩小版牛图。用的是同一张内联图（不额外增加体积），contain 保证牛完整，
        3/2 比例与设计稿的封面卡一致。
      */}
      <div className={css.cover} style={{ backgroundImage: 'var(--niulai-cow-cover)' }}>
        <span className={css.coverName}>牛来原野</span>
      </div>

      {/*
        「等你拿主意」排在最上面、且只在真的有东西等你时出现。
        这是右栏里唯一一类"你不理它就一直停着"的状态，比任何用量数字都重要。
      */}
      {waitingOnYou && (
        <section className={`${css.card} ${css.alert}`}>
          <div className={css.cardTitle}>等你拿主意</div>
          {approvals.map((tool, index) => (
            <Row key={`${tool}-${index}`} label="待授权">
              <span className={css.mono}>{tool}</span>
            </Row>
          ))}
          {questions > 0 && <Row label="待回答">{`${questions} 个问题`}</Row>}
          <p className={css.note}>回到对话里确认后才会继续。</p>
        </section>
      )}

      <section className={css.card}>
        <div className={css.cardTitle}>Current run</div>
        <Row label="状态">
          <span className={css.status} data-running={busy || undefined}>
            {busy ? '牛来正在干活' : '牛来在待命'}
          </span>
        </Row>
        {usage.turnStartedAt !== undefined && (
          <Row label="本轮已跑">
            <span className={css.busy}>{formatDuration(Math.max(0, now - usage.turnStartedAt))}</span>
          </Row>
        )}
        {tools.length > 0 && (
          <Row label="正在执行">
            <span className={css.mono}>
              {tools.join(' · ')}
              {usage.toolStartedAt !== undefined
                && ` · ${formatDuration(Math.max(0, now - usage.toolStartedAt))}`}
            </span>
          </Row>
        )}
        {(queued > 0 || steering > 0) && (
          <Row label="收件箱">
            {[queued > 0 ? `${queued} 条排队` : '', steering > 0 ? `${steering} 条插话` : '']
              .filter(Boolean).join(' · ')}
          </Row>
        )}
        <Row label="模型">{usage.model ?? dash}</Row>
      </section>

      <section className={css.card}>
        <div className={css.cardTitle}>Context</div>
        <Row label="占用">{occupancy === undefined ? dash : `${occupancy}%`}</Row>
        {occupancy !== undefined && (
          <div className={css.progress}>
            <span style={{ width: `${occupancy}%` }} />
          </div>
        )}
        <Row label="Token 负载">
          {usage.usedTokens === undefined || usage.contextWindow === undefined
            ? dash
            : `${formatTokens(usage.usedTokens)} / ${formatTokens(usage.contextWindow)}`}
        </Row>
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
              <Row key={part.key} label={part.label}>
                <span data-part={part.key} className={css.legend}>
                  {`${Math.round(part.tokens / ctxTotal * 100)}% · ${formatTokens(part.tokens)}`}
                </span>
              </Row>
            ))}
            {/*
              🔴 必须写这句：这三项是固定密度估算（对中文和 JSON schema 系统性低估），
              加起来跟上面的 Token 负载对不上。是"构成"，不是"总量"。
            */}
            <p className={css.note}>构成为估算，与上方负载不同源，不可相加。</p>
          </>
        )}
      </section>

      {usage.permissionLabel !== undefined && (
        <section className={css.card}>
          <div className={css.cardTitle}>Permission</div>
          <Row label="当前模式">{usage.permissionLabel}</Row>
          {usage.permissionHint !== undefined && (
            <p className={css.note}>{usage.permissionHint}</p>
          )}
        </section>
      )}

      <section className={css.card}>
        <div className={css.cardTitle}>Usage</div>
        <Row label="输入">{usage.inputTokens === undefined ? dash : formatTokens(usage.inputTokens)}</Row>
        <Row label="输出">{usage.outputTokens === undefined ? dash : formatTokens(usage.outputTokens)}</Row>
        <Row label="缓存命中">
          {usage.cacheHitPercent === undefined ? dash : `${usage.cacheHitPercent}%`}
        </Row>
        <Row label="耗时">
          {usage.llmMs === undefined && usage.toolMs === undefined
            ? dash
            : `LLM ${formatDuration(usage.llmMs ?? 0)} · 工具 ${formatDuration(usage.toolMs ?? 0)}`}
        </Row>
        <Row label="轮次">
          {usage.turns === undefined ? dash : `${usage.turns} 轮 · ${usage.steps ?? 0} 步`}
        </Row>
      </section>

      {/* 待办卡只在真的有清单时出现——没有计划的会话不该看到一张空卡。 */}
      {usage.todosTotal !== undefined && (
        <section className={css.card}>
          <div className={css.cardTitle}>Plan</div>
          <Row label="进度">{`${usage.todosDone ?? 0} / ${usage.todosTotal}`}</Row>
          {usage.todoActive !== undefined && <p className={css.todo}>{usage.todoActive}</p>}
        </section>
      )}

    </div>
  )
}
