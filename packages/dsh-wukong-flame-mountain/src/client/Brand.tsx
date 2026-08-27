/**
 * The 悟 seal and wordmark for the brand slots.
 *
 * The prototype's sidebar top-left carries a round gold-rimmed seal holding the character 悟, beside two lines reading
 * "DeepSeek Harness / Black Myth Wukong · Flame Mountain". The harness exposes both as slots:
 * `sidebar.brand.mark`, `sidebar.brand.name`, and the new-session page's larger mark has another
 * `conversation.hero.brand.mark`。
 *
 * 🔴 All three are `{ kind: 'single' }`. The old conclusion — that an occupied single makes third-party registration throw —
 * **is out of date**: `SlotCore.register` in dsh 0.1.1-rc.2 detects occupancy only **at the same priority**,
 * and different priorities shadow (`entriesOfSlot` takes the live entry with the lowest priority in each cell).
 * The official `ui-brand-official` registers at the default 0, so registering at `priority: -1` takes over while its entry is
 * only shadowed, not unloaded — the official mark returns the moment the skin is deactivated.
 *
 * Taking over means honouring the other side's owner-props contract, so both components follow it strictly:
 *   SidebarBrandMarkOwnerProps { size }            — the sidebar wants 24px
 *   HeroBrandMarkOwnerProps    { size, className } — the new-session page wants 34px and passes a class name
 *     keeps the default hover animation, so it is passed through verbatim
 *   SidebarBrandNameOwnerProps {}                  — the name slot decides its own content and width
 *
 * The seal is a character inside a ring rather than a drawn monkey: at 24px any figure blurs into a blob of colour,
 * while a Chinese character stays recognisable at that size — which is how the prototype handles it too.
 */

import css from './Brand.module.css'

/** The seal contract shared by the sidebar and the new-session page. */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * The gold 悟 seal.
 *
 * The whole seal is SVG rather than DOM + CSS: the host's `size` differs between sidebar (24) and hero (34), and
 * a viewBox scales type size, ring width and spacing by one ratio, so neither place needs its own styles.
 *
 * @param props - Size and class name from the host.
 * @returns The round gold-rimmed seal.
 */
export function WukongMark({ size, className }: BrandMarkProps) {
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
      {/* Seal ground: a slightly warm glow at the top fading to near black, matching the prototype's .brand-avatar radial gradient. */}
      <defs>
        <radialGradient id="wukong-seal" cx="50%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#3a2718" />
          <stop offset="100%" stopColor="#0b0907" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="15" fill="url(#wukong-seal)" />
      {/* The gold ring uses currentColor, following the host's text colour, so theme switches and hover need no extra handling. */}
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="17"
        fontWeight="700"
        /* A brush serif first: the prototype's headline uses one, and the seal follows to stay one typeface. Falls back to the system serif. */
        fontFamily='"STKaiti", "KaiTi", "Songti SC", serif'
        fill="currentColor"
      >
        悟
      </text>
    </svg>
  )
}

/**
 * The wordmark: a primary name plus a subtitle, matching the prototype's "DeepSeek Harness / Black Myth Wukong · Flame Mountain".
 *
 * The primary name stays DeepSeek Harness — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function WukongName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>Black Myth Wukong · Flame Mountain</small>
    </span>
  )
}
