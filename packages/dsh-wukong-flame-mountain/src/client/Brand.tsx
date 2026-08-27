/**
 * 品牌位的「悟」字印与站名。
 *
 * 原型稿侧栏左上角是一枚圆形金边印章（里面一个「悟」字）+ 两行站名
 * 「DeepSeek Harness / 黑神话悟空 · 焚山版」。harness 把这两处都开成了 slot：
 * `sidebar.brand.mark`、`sidebar.brand.name`，新会话页的大标还有一个
 * `conversation.hero.brand.mark`。
 *
 * 🔴 这三个都是 `{ kind: 'single' }`。以前的结论是"single 已被官方占用，第三方注册直接抛错"，
 * **那条已经过时**：dsh 0.1.1-rc.2 的 `SlotCore.register` 只在**同一个 priority** 上判占用，
 * 不同 priority 是影子化（`entriesOfSlot` 取每个 cell 里 priority 最小的那个 live entry）。
 * 官方 `ui-brand-official` 注册在默认 0，所以我们注册 `priority: -1` 就能接管，且它那份只是
 * 被影子化、没被卸载——皮肤一停用就自动回到官方标。
 *
 * 接管 = 承接对方的 owner props 契约，所以这两个组件严格按契约取参：
 *   SidebarBrandMarkOwnerProps { size }            —— 侧栏要 24px
 *   HeroBrandMarkOwnerProps    { size, className } —— 新会话页要 34px，还会塞一个类名进来
 *     保留默认的悬停动效，原样透传即可
 *   SidebarBrandNameOwnerProps {}                  —— 名字位自己决定内容与宽度
 *
 * 印章用「字 + 圆环」而不是画一只猴子：小到 24px 时任何角色轮廓都会糊成一团色块，
 * 而汉字在这个尺寸下仍然认得出——原型稿本身也是这么处理的。
 */

import css from './Brand.module.css'

/** 侧栏 / 新会话页共用的印章契约。 */
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
      {/* 印底：从上方偏暖的一点光晕过渡到近黑，对应原型 .brand-avatar 的径向渐变。 */}
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
 * 站名：主名 + 副标，对应原型稿的「DeepSeek Harness / 黑神话悟空 · 焚山版」。
 *
 * 主名保留 DeepSeek Harness —— 皮肤换的是外观，不冒充另一个产品；副标才是这套皮肤的身份。
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
