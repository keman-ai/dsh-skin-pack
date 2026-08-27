/**
 * The mission badge and wordmark for the brand slots.
 *
 * 原型稿侧栏左上角是一枚圆角方标（深蓝渐变 + 冷蓝描边 + 一圈青色辉光，里面是一个「海」字）
 * plus a two-line wordmark, "DeepSeek Harness / Cosmic Exploration". The harness exposes both as slots:
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
 * The mission badge.
 *
 * Built as SVG rather than DOM + CSS: the host's `size` differs between sidebar (24) and hero (34), and an SVG viewBox
 * scaling, so type size, radius and spacing follow one ratio and neither place needs its own styles.
 *
 * A single character rather than a drawn figure: at 24px any silhouette blurs into a blob of colour while a Chinese character stays recognisable —
 * 把店名收成一个字，24px 时仍然认得出。
 *
 * @param props - Size and class name from the host.
 * @returns The square mission badge.
 */
export function SeasideMark({ size, className }: BrandMarkProps) {
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
        <linearGradient id="cosmic-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2f1f6" />
        </linearGradient>
      </defs>
      {/* The prototype's `.brand-avatar`: a 10px-radius deep-blue gradient square with a cool blue border. */}
      <rect x="0.8" y="0.8" width="30.4" height="30.4" rx="9" fill="url(#cosmic-mark)" />
      <rect
        x="0.8"
        y="0.8"
        width="30.4"
        height="30.4"
        rx="9"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="1.4"
      />
      <text
        x="16"
        y="16.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="800"
        letterSpacing="0.6"
        /* Monospace: the prototype's mission codes and telemetry figures are all monospaced, and the badge follows to stay one typeface. */
        fontFamily='"STKaiti", "KaiTi", "Songti SC", serif'
        fill="#2f7fa6"
      >
        Sea
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
export function SeasideName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>海边小铺</small>
    </span>
  )
}
