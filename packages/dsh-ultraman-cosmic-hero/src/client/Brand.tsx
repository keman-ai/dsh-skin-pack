/**
 * The energy badge and wordmark for the brand slots.
 *
 * The prototype's top left carries a rounded square seal: `radial-gradient(circle at 50% 50%, #38e5ff 0 22%, #10243a 23% 56%,
 * #d93640 57% 100%)` with a cyan glow — cyan core, deep-blue ring, red shell from the inside out: the colour timer in cross-section.
 * Beside it, two lines reading "DeepSeek Harness / Cosmic Hero Skin".
 *
 * 🔴 The sidebar mark, the new-session mark and the wordmark are all `{ kind: 'single' }` slots. The old conclusion,
 * "a single slot occupied by the official component makes third-party registration throw" is **out of date**:
 * `SlotCore.register` in dsh 0.1.1-rc.2 detects occupancy only **at the same priority**, and different
 * priorities shadow instead (`entriesOfSlot` takes the live entry with the lowest priority in each cell). The
 * registers at the default 0, so registering at `priority: -1` takes over while its entry is only shadowed, not unloaded —
 * official mark returns automatically the moment the skin is deactivated.
 *
 * Taking over means honouring the other side's owner-props contract, so both components follow it strictly:
 *   SidebarBrandMarkOwnerProps { size }            — the sidebar wants 24px
 *   HeroBrandMarkOwnerProps    { size, className } — the new-session page wants 34px and passes a class name
 *     keeps the default hover animation, so it is passed through verbatim
 *   SidebarBrandNameOwnerProps {}                  — the name slot decides its own content and width
 */

import css from './Brand.module.css'

/** The badge contract shared by the sidebar and the new-session page. */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * The energy badge.
 *
 * Concentric SVG circles reproduce the prototype's radial-gradient: the host's `size` differs between sidebar (24) and
 * hero (34), and a viewBox keeps both proportional without a second set of styles.
 *
 * The red outer ring is one of this skin's rare reds — here it is **part of the badge**, not a status signal,
 * hence a fixed colour rather than `--dsw-alias-state-error-primary`: if the error colour is ever adjusted, the badge should not follow.
 *
 * @param props - Size and class name from the host.
 * @returns The timer cross-section badge.
 */
export function CosmicMark({ size, className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {/* 外壳：红。原型的 57%–100% 那一段。 */}
      <rect x="0" y="0" width="32" height="32" rx="9" fill="#d93640" />
      {/* 深蓝环：23%–56%。 */}
      <circle cx="16" cy="16" r="9" fill="#10243a" />
      {/* 青芯：0–22%，带一层柔光，对应原型的 `box-shadow: 0 0 28px rgba(35,217,255,.22)`。 */}
      <circle cx="16" cy="16" r="3.6" fill="#38e5ff" />
      <circle cx="16" cy="16" r="6" fill="#38e5ff" fillOpacity="0.16" />
    </svg>
  )
}

/**
 * The wordmark: a primary name plus a subtitle, matching the prototype's "DeepSeek Harness / Cosmic Hero Skin".
 *
 * The primary name stays DeepSeek Harness — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function CosmicName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>Cosmic Hero Skin</small>
    </span>
  )
}
