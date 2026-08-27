/**
 * The energy gauge at the bottom of the sidebar.
 *
 * Nearly every prototype places one there: the cyber temple has "today's practice · 76 spirit", the oracle
 * 「灵力 68,250 / 108,000」，齐天星海是「战意」，鲸鱼娘是「Ocean compute 82%」，
 * pavilion another, and the Mars flight deck "Compute Load 71%". It is the most recognisable part of those drafts.
 *
 * 🔴 Every number in the drafts is hardcoded. Here it is **real**: context occupancy (`projectedTokens /
 * contextWindow` from the `contextPressure` projection), i.e. how full this session has made the window.
 * Each skin names it in its own idiom; the number has exactly one source.
 *
 * Mounted on `sidebar.footer.action` (a list slot, right beside the Settings row). That slot's scope is `root`
 * and receives no session projection, so the data does not come through props but from subscribing to
 * `status-store`, written by the probe on `conversation.composer.dock` (session scope). Collected once, displayed twice.
 *
 * ⚠️ In the 56px track state only a vertical sliver remains, with no text: anything written at that width is truncated.
 */

import { useSyncExternalStore } from 'react'
import { getStatus, subscribeStatus } from './status-store.ts'
import css from './EnergyRail.module.css'

/** What this skin calls the gauge. */
const RAIL_LABEL = '暑气'

export interface EnergyRailProps {
  /** The column-width state from the host: false is the 56px track state. */
  wide: boolean
}

/**
 * Compact token counts, aligned with the dock and the official StatsLine.
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

export function MistEnergyRail({ wide }: EnergyRailProps) {
  const status = useSyncExternalStore(subscribeStatus, getStatus)
  const used = status.usedTokens
  const window = status.contextWindow

  // With no reading, draw nothing: a gauge frozen at some percentage is exactly what this skin exists to avoid.
  if (used === undefined || window === undefined || window === 0) {
    return null
  }

  const percent = Math.min(100, Math.round(used / window * 100))
  // Three bands: roomy / low / critical, at 70 and 90 — the same thresholds as the harness's own context ring.
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
