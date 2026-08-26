/**
 * 品牌位的金环标与站名。
 *
 * 原型稿侧栏左上角是一枚圆角方标，里面是一个「齐」字配金环，配一层很淡的金色辉光；旁边两行「deepseek / 齐天星海」。
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
 * 金环标。
 *
 * 用纯 CSS 的径向渐变复刻原型那枚标，不裁横幅——横幅的主体在画面左三分之一，裁成小方块只会
 * 得到一团星海。圆角按 size 等比给（原型 35px 配 11px 圆角，约 0.31 倍），侧栏的 24px 与
 * hero 的 34px 因此是同一个形状。
 *
 * @param props - 宿主给的尺寸与类名。
 * @returns 方形鲸鱼标。
 */
export function QitianMark({ size, className }: BrandMarkProps) {
  return (
    <span
      className={[css.mark, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.31)}px`,
      }}
    />
  )
}

/**
 * 站名：主名 + 副标，对应原型稿的「deepseek / 齐天星海」。
 *
 * 主名保留 DeepSeek Harness —— 皮肤换的是外观，不冒充另一个产品；副标才是这套皮肤的身份。
 *
 * @returns 两行站名。
 */
export function QitianName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>齐天星海</small>
    </span>
  )
}
