/**
 * 品牌位的「悟」字印与站名。
 *
 * 原型稿侧栏左上角是一枚圆形金边印章（里面一个「悟」字）+ 两行站名
 * 「DeepSeek Harness / 黑神话悟空 · 焚山版」。harness 把这两处都开成了 slot：
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
 * 「悟」字金印。
 *
 * 整枚印做成 svg 而不是 DOM + CSS：宿主给的 `size` 在侧栏（24）与 hero（34）不同，
 * svg 用 viewBox 缩放，字号、环宽、间距按同一比例走，两处都不用另配一套样式。
 *
 * @param props - Size and class name from the host.
 * @returns 金边圆印。
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
      {/* 金环：用 currentColor，跟着宿主给的文字色走，主题切换和悬停都不用额外处理。 */}
      <circle cx="16" cy="16" r="15" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.4" />
      <text
        x="16"
        y="16"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="17"
        fontWeight="700"
        /* 楷体优先：原型的大标题用的就是楷体，印章跟着走才是一套字。找不到就退回系统衬线。 */
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
      <small className={css.subtitle}>黑神话悟空 · 焚山版</small>
    </span>
  )
}
