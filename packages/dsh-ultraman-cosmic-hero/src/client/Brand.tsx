/**
 * 品牌位的能量徽标与站名。
 *
 * 原型稿左上角是一枚圆角方章：`radial-gradient(circle at 50% 50%, #38e5ff 0 22%, #10243a 23% 56%,
 * #d93640 57% 100%)` 配一圈青色辉光——由内到外「青芯 / 深蓝环 / 红外壳」，就是彩色计时器的剖面。
 * 旁边两行「DeepSeek Harness / Cosmic Hero Skin」。
 *
 * 🔴 侧栏与新会话页的标、以及站名，这三个 slot 都是 `{ kind: 'single' }`。以前的结论是
 * "single 已被官方占用，第三方注册直接抛错"，**那条已经过时**：dsh 0.1.1-rc.2 的
 * `SlotCore.register` 只在**同一个 priority** 上判占用，不同 priority 是影子化
 *（`entriesOfSlot` 取每个 cell 里 priority 最小的那个 live entry）。官方 `ui-brand-official`
 * 注册在默认 0，所以我们注册 `priority: -1` 就能接管，且它那份只是被影子化、没被卸载——
 * 皮肤一停用就自动回到官方标。
 *
 * 接管 = 承接对方的 owner props 契约，所以这两个组件严格按契约取参：
 *   SidebarBrandMarkOwnerProps { size }            —— 侧栏要 24px
 *   HeroBrandMarkOwnerProps    { size, className } —— 新会话页要 34px，还会塞一个类名进来
 *     保留默认的悬停动效，原样透传即可
 *   SidebarBrandNameOwnerProps {}                  —— 名字位自己决定内容与宽度
 */

import css from './Brand.module.css'

/** 侧栏 / 新会话页共用的徽标契约。 */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * 能量徽标。
 *
 * 用 svg 的同心圆复刻原型那道 radial-gradient：宿主给的 `size` 在侧栏（24）与 hero（34）不同，
 * viewBox 缩放能保证两处比例一致，不用另配一套样式。
 *
 * 外圈的红是这套皮肤里为数不多的红——它在这里是**徽标的一部分**，不是状态信号，
 * 所以写成固定色而不是 `--dsw-alias-state-error-primary`：错误色将来若调整，徽标不该跟着变。
 *
 * @param props - Size and class name from the host.
 * @returns 计时器剖面徽标。
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
 * 站名：主名 + 副标，对应原型稿的「DeepSeek Harness / Cosmic Hero Skin」。
 *
 * 主名保留 DeepSeek Harness —— 皮肤换的是外观，不冒充另一个产品；副标才是这套皮肤的身份。
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
