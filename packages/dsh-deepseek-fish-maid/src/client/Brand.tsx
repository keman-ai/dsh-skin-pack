/**
 * 品牌位的鲸鱼标与站名。
 *
 * 原型稿侧栏左上角是一枚 15px 圆角的方形标，里面是一只鲸鱼，配一圈冷青内描边与很淡的蓝辉光；
 * 旁边两行「DeepSeek Harness / 大肥鱼娘 · Deep Sea Theme」。
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
 * 鲸鱼标。
 *
 * 底与描边在 CSS 里，鲸鱼是一段内联 svg —— 不裁封面：封面的主体是一个整身角色，
 * 裁成 24px 小方块只会得到一团蓝。圆角按 size 等比给（原型 34px 配 11px 圆角，约 0.31 倍），
 * 侧栏的 24px 与 hero 的 34px 因此是同一个形状。
 *
 * svg 而不是 emoji 🐋：emoji 的字形由系统字体决定，同一枚标在 mac / Windows / Linux 上
 * 会长成三个样子，还会被系统的彩色字体强行上色，压不住这套皮肤的冷青。
 *
 * @param props - 宿主给的尺寸与类名。
 * @returns 方形鲸鱼标。
 */
export function FishMark({ size, className }: BrandMarkProps) {
  return (
    <span
      className={[css.mark, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.31)}px`,
      }}
    >
      <svg width={Math.round(size * 0.62)} height={Math.round(size * 0.62)} viewBox="0 0 24 24" fill="none">
        {/* 鲸身 + 尾鳍 + 一道背光，笔画尽量少：24px 时细节全都会糊掉。 */}
        <path
          d="M3.2 13.4c2.6-3.8 6.2-5.6 10.7-5.6 3 0 5.2 1.1 6.6 3.2-1.1 3.9-4.3 6.4-9.2 6.4-3.6 0-6.3-1.3-8.1-4z"
          fill="#9be8ff"
          fillOpacity="0.9"
        />
        <path d="M20.5 11c1-1.2 1.9-2.4 2.6-3.6.5 2.4.4 4.6-.3 6.6-.9-1-1.7-2-2.3-3z" fill="#5ed7ff" />
        <circle cx="8.4" cy="12.2" r="0.9" fill="#07202f" />
      </svg>
    </span>
  )
}

/**
 * 站名：主名 + 副标，对应原型稿的「DeepSeek Harness / 大肥鱼娘 · Deep Sea Theme」。
 *
 * 主名保留 DeepSeek Harness —— 皮肤换的是外观，不冒充另一个产品；副标才是这套皮肤的身份。
 *
 * @returns 两行站名。
 */
export function FishName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>大肥鱼娘 · Deep Sea</small>
    </span>
  )
}
