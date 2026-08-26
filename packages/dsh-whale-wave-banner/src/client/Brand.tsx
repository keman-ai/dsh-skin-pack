/**
 * 品牌位的鲸鱼标与站名。
 *
 * 原型稿侧栏左上角是一枚 12px 圆角的方形标，里面就是**横幅本身**（`object-fit: cover` 裁方），
 * 配一层很淡的蓝色投影；旁边两行「deepseek / Whale Wave Theme」。
 *
 * 🔴 侧栏标、站名、新会话页的大标这三个 slot 都是 `{ kind: 'single' }`。以前的结论是
 * "single 已被官方占用，第三方注册直接抛错"，**那条已经过时**：dsh 0.1.1-rc.2 的
 * `SlotCore.register` 只在**同一个 priority** 上判占用，不同 priority 是影子化
 *（`entriesOfSlot` 取每个 cell 里 priority 最小的那个 live entry）。官方 `ui-brand-official`
 * 注册在默认 0，所以注册 `priority: -1` 就能接管，且它那份只是被影子化、没被卸载——
 * 皮肤一停用就自动回到官方标。
 *
 * 接管 = 承接对方的 owner props 契约，所以严格按契约取参：
 *   SidebarBrandMarkOwnerProps { size }            —— 侧栏要 24px
 *   HeroBrandMarkOwnerProps    { size, className } —— 新会话页要 34px，还会塞一个类名进来
 *   SidebarBrandNameOwnerProps {}                  —— 名字位自己决定内容与宽度
 */

import css from './Brand.module.css'

/** 侧栏 / 新会话页共用的标契约。 */
interface BrandMarkProps {
  /** 宿主要求的正方形边长（px）。 */
  size: number
  /** 宿主给的类名，只在新会话页出现；原样透传以保留默认动效。 */
  className?: string | undefined
}

/**
 * 鲸鱼标：横幅裁方。
 *
 * 直接复用那张内联横幅，不额外增加体积——`background-size: cover` 从中间裁一个正方形，
 * 而横幅正中就是鲸鱼，裁出来正好是它的头身。圆角按 size 等比给（原型是 34px 配 12px 圆角，
 * 也就是 0.35 倍），这样侧栏的 24px 与 hero 的 34px 是同一个形状。
 *
 * @param props - 宿主给的尺寸与类名。
 * @returns 方形鲸鱼标。
 */
export function WaveMark({ size, className }: BrandMarkProps) {
  return (
    <span
      className={[css.mark, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.35)}px`,
        backgroundImage: 'var(--wave-banner)',
      }}
    />
  )
}

/**
 * 站名：主名 + 副标，对应原型稿的「deepseek / Whale Wave Theme」。
 *
 * 主名保留 deepseek —— 皮肤换的是外观，不冒充另一个产品；副标才是这套皮肤的身份。
 *
 * @returns 两行站名。
 */
export function WaveName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>deepseek</strong>
      <small className={css.subtitle}>Whale Wave Theme</small>
    </span>
  )
}
