/**
 * The whale mark and wordmark for the brand slots.
 *
 * The prototype's sidebar top-left carries two lines, "🐋 deepseek / Whale Girl Lounge", and the harness exposes both as
 * slots: `sidebar.brand.mark` and `sidebar.brand.name`, with the new-session page's larger mark on another
 * `conversation.hero.brand.mark`。
 *
 * 🔴 All three are `{ kind: 'single' }`. The old conclusion — that an occupied single makes third-party registration throw —
 * **is out of date**: `SlotCore.register` in dsh 0.1.1-rc.2 detects occupancy only **at the same priority**,
 * and different priorities shadow (`entriesOfSlot` takes the live entry with the lowest priority in each cell).
 * The official `ui-brand-official` registers at the default 0, so registering at `priority: -1` takes over while its entry
 * is only shadowed, not unloaded — the official mark returns the moment the skin is deactivated.
 *
 * Taking over means honouring the other side's owner-props contract, so both components follow it strictly:
 *   SidebarBrandMarkOwnerProps { size }        — the sidebar wants 24px
 *   HeroBrandMarkOwnerProps    { size, className } — the new-session page wants 34px and passes a class name
 *     to preserve the default hover animation, so it is passed through verbatim
 *   SidebarBrandNameOwnerProps {}              — the name slot decides its own content and width
 */

import css from './Brand.module.css'

/** The whale-mark contract shared by the sidebar and the new-session page. */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * The whale mark.
 *
 * Drawn as SVG rather than the 🐋 emoji: that emoji is three entirely different illustrations across systems (Apple's
 * realistic one, Android's cartoon, and on some Linux systems a tofu box), while a brand mark must look the same everywhere.
 * The fill is `currentColor`, following the host's text colour, so theme switches and hover states need no extra handling.
 *
 * @param props - Size and class name from the host.
 * @returns The whale silhouette.
 */
export function WhaleMark({ size, className }: BrandMarkProps) {
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
      {/* 身体：一条向右上扬的鲸，尾鳍分叉在左。 */}
      <path
        d="M4.6 12.1c.5-.4 1.2-.2 1.5.3l1.6 2.9 1.4-3.3c.3-.6 1.1-.7 1.6-.3 3 2.5 6.5 3.8 10.4 3.8 2.9 0 5.5-.7 7.8-2.1.8-.5 1.7.3 1.4 1.2-1.9 5.6-7 9.2-13.2 9.2-4.7 0-8.7-2.1-11-5.6-.4-.6-.1-1.4.6-1.6l2.2-.6-4-2.4a1 1 0 0 1-.3-1.5Z"
        fill="currentColor"
      />
      {/* 眼睛：留一个空洞而不是画点，缩到 16px 也不会糊成一团。 */}
      <circle cx="22.4" cy="18.2" r="1.15" fill="var(--dsw-alias-bg-layer-2, #fff)" />
      {/* 水柱：鲸鱼娘的辨识点，小尺寸下也还认得出。 */}
      <path
        d="M20.8 11.2c0-1.6.9-2.7 2.4-3.4-.7 1.4-.5 2.4.5 3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * The wordmark: a primary name plus a subtitle, matching the prototype's "deepseek / Whale Girl Lounge".
 *
 * The primary name stays deepseek — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function WhaleName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>deepseek</strong>
      <small className={css.subtitle}>Whale Girl Lounge</small>
    </span>
  )
}
