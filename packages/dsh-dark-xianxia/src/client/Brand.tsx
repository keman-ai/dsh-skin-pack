/**
 * 品牌位的任务徽标与站名。
 *
 * 原型稿侧栏左上角是一枚圆角方标（深蓝渐变 + 冷蓝描边 + 一圈青色辉光，里面是一个「天」字）
 * + 两行站名「DeepSeek Harness / Cosmic Exploration」。harness 把这两处都开成了 slot：
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
 * 任务徽标。
 *
 * 做成 svg 而不是 DOM + CSS：宿主给的 `size` 在侧栏（24）与 hero（34）不同，svg 用 viewBox
 * 缩放，字号、圆角、间距按同一比例走，两处都不用另配一套样式。
 *
 * 用一个字而不是画道童：小到 24px 时人物轮廓会糊成一团色块，汉字仍然认得出——
 * 原型稿的侧栏标本身也是一个「天」字。
 *
 * @param props - Size and class name from the host.
 * @returns 方形任务徽标。
 */
export function XianMark({ size, className }: BrandMarkProps) {
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
        <linearGradient id="cosmic-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#13252a" />
          <stop offset="100%" stopColor="#0b1619" />
        </linearGradient>
      </defs>
      {/* 原型 `.brand-avatar`：10px 圆角的深蓝渐变方块 + 冷蓝描边。 */}
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
        /* 等宽：原型的任务代号、遥测数字全是等宽字，徽标跟着走才是一套字。 */
        fontFamily='"STKaiti", "KaiTi", "Songti SC", serif'
        fill="#e0bd7b"
      >
        天
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
export function XianName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>天机阁 · 修仙版</small>
    </span>
  )
}
