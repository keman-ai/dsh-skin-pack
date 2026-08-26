/**
 * 侧栏底部那条能量槽。
 *
 * 原型稿几乎每一套都在侧栏最下面放了一条：赛博道观是「今日修行 · 76 心神值」，天机阁是
 * 「灵力 68,250 / 108,000」，齐天星海是「战意」，大鱼娘是「Bubble 82%」，
 * 火星驾驶舱是「Compute Load 71%」。它是这些稿子里辨识度最高的一个部件。
 *
 * 🔴 稿子里的数字全是写死的。这里换成**真的**：上下文占用（`contextPressure` 投影的
 * `projectedTokens / contextWindow`），也就是"这场会话把窗口撑到几成了"。
 * 名字按各自的世界观取，数字只有一份来源。
 *
 * 挂在 `sidebar.footer.action`（list slot，紧挨着「设置」那一行）。这个 slot 的 scope 是
 * `root`，拿不到会话投影——所以数据不从 props 走，而是订阅 `status-store`：那边由挂在
 * `conversation.composer.dock` 的采集器（session scope）写入。一次采集，两处显示。
 *
 * ⚠️ 侧栏收窄成 56px 的轨道态时只留一条竖着的细条，不写字：那个宽度写什么都会被截断。
 */

import { useSyncExternalStore } from 'react'
import { getStatus, subscribeStatus } from './status-store.ts'
import css from './EnergyRail.module.css'

/** 这套皮肤给这条槽起的名字。 */
const RAIL_LABEL = 'Bubble'

export interface EnergyRailProps {
  /** 宿主给的列宽状态：false 是 56px 的轨道态。 */
  wide: boolean
}

/**
 * 紧凑 token 计数，口径与状态台、官方 StatsLine 一致。
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

export function FishEnergyRail({ wide }: EnergyRailProps) {
  const status = useSyncExternalStore(subscribeStatus, getStatus)
  const used = status.usedTokens
  const window = status.contextWindow

  // 没有读数就整条不画：一条永远停在某个百分比的槽，正是这套皮肤最想避免的东西。
  if (used === undefined || window === undefined || window === 0) {
    return null
  }

  const percent = Math.min(100, Math.round(used / window * 100))
  // 三档：宽裕 / 见底 / 告急。阈值取 70 与 90——和 harness 自己的上下文圆环同一档口径。
  const level = percent >= 90 ? 'critical' : percent >= 70 ? 'warn' : 'calm'

  return (
    <div className={css.rail} data-level={level} data-wide={wide || undefined} title={`${RAIL_LABEL} ${percent}% · ${formatTokens(used)} / ${formatTokens(window)}`}>
      {wide && (
        <div className={css.head}>
          <span className={css.label}>{RAIL_LABEL}</span>
          <span className={css.value}>{`${formatTokens(used)} / ${formatTokens(window)}`}</span>
        </div>
      )}
      <div className={css.track}>
        <span className={css.fill} style={{ width: `${Math.max(2, percent)}%` }} />
      </div>
    </div>
  )
}
