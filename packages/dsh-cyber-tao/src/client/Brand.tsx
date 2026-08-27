/**
 * 品牌位的任务徽标与站名。
 *
 * 原型稿侧栏左上角是一枚圆角方标（深蓝渐变 + 冷蓝描边 + 一圈青色辉光，里面是一个「道」字）
 * + 两行站名「DeepSeek Harness / Cosmic Exploration」。harness 把这两处都开成了 slot：
 * `sidebar.brand.mark`、`sidebar.brand.name`，新会话页的大标还有一个
 * `conversation.hero.brand.mark`。
 *
 * 🔴 All three are `{ kind: 'single' }`. The old conclusion — that an occupied single makes third-party registration throw —
 * **is out of date**: `SlotCore.register` in dsh 0.1.1-rc.2 detects occupancy only **at the same priority**,
 * and different priorities shadow (`entriesOfSlot` takes the live entry with the lowest priority in each cell).
 * 官方 `ui-brand-official` 注册在默认 0，所以我们注册 `priority: -1` 就能接管，且它那份只是
 * 被影子化、没被卸载——皮肤一停用就自动回到官方标。
 *
 * Taking over means honouring the other side's owner-props contract, so both components follow it strictly:
 *   SidebarBrandMarkOwnerProps { size }            — the sidebar wants 24px
 *   HeroBrandMarkOwnerProps    { size, className } — the new-session page wants 34px and passes a class name
 *     keeps the default hover animation, so it is passed through verbatim
 *   SidebarBrandNameOwnerProps {}                  — the name slot decides its own content and width
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
 * 原型稿的侧栏标本身也是一个「道」字。
 *
 * @param props - Size and class name from the host.
 * @returns 方形任务徽标。
 */
export function TaoMark({ size, className }: BrandMarkProps) {
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
          <stop offset="0%" stopColor="#242c33" />
          <stop offset="100%" stopColor="#0c1013" />
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
        fill="#e0c58f"
      >
        道
      </text>
    </svg>
  )
}

/**
 * 站名：主名 + 副标，对应原型稿的「DeepSeek Harness / 黑神话悟空 · 焚山版」。
 *
 * The primary name stays DeepSeek Harness — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function TaoName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>赛博道观</small>
    </span>
  )
}
