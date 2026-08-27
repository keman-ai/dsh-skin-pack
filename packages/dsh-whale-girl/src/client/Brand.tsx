/**
 * 品牌位的鲸鱼标与站名。
 *
 * 原型稿侧栏左上角是「🐋 deepseek / Whale Girl Lounge」两行，harness 把这两处都开成了
 * slot：`sidebar.brand.mark`、`sidebar.brand.name`，新会话页的大标还有一个
 * `conversation.hero.brand.mark`。
 *
 * 🔴 All three are `{ kind: 'single' }`. The old conclusion — that an occupied single makes third-party registration throw —
 * **is out of date**: `SlotCore.register` in dsh 0.1.1-rc.2 detects occupancy only **at the same priority**,
 * and different priorities shadow (`entriesOfSlot` takes the live entry with the lowest priority in each cell).
 * 官方 `ui-brand-official` 注册在默认 0，所以我们注册 `priority: -1` 就能接管，且它那份
 * 只是被影子化、没被卸载——皮肤一停用就自动回到官方标。
 *
 * Taking over means honouring the other side's owner-props contract, so both components follow it strictly:
 *   SidebarBrandMarkOwnerProps { size }        —— 侧栏要 24px
 *   HeroBrandMarkOwnerProps    { size, className } —— 新会话页要 34px，还会塞一个类名
 *     进来保留默认的悬停动效，原样透传即可
 *   SidebarBrandNameOwnerProps {}              —— 名字位自己决定内容与宽度
 */

import css from './Brand.module.css'

/** 侧栏 / 新会话页共用的鲸鱼标契约。 */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * 鲸鱼标。
 *
 * 画成 svg 而不是用 🐋 emoji：emoji 在不同系统上是三种完全不同的画风（苹果的写实、
 * 安卓的卡通、部分 Linux 直接是缺字框），而品牌标必须到处长一个样。
 * 填色用 `currentColor`，跟着宿主给的文字色走，皮肤切换和悬停态都不用额外处理。
 *
 * @param props - Size and class name from the host.
 * @returns 鲸鱼轮廓。
 */
export function WhaleMark({ size, className }: BrandMarkProps) {
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
      {/* 身体：一条向右上扬的鲸，尾鳍分叉在左。 */}
      <path
        d="M4.6 12.1c.5-.4 1.2-.2 1.5.3l1.6 2.9 1.4-3.3c.3-.6 1.1-.7 1.6-.3 3 2.5 6.5 3.8 10.4 3.8 2.9 0 5.5-.7 7.8-2.1.8-.5 1.7.3 1.4 1.2-1.9 5.6-7 9.2-13.2 9.2-4.7 0-8.7-2.1-11-5.6-.4-.6-.1-1.4.6-1.6l2.2-.6-4-2.4a1 1 0 0 1-.3-1.5Z"
        fill="currentColor"
      />
      {/* 眼睛：留一个空洞而不是画点，缩到 16px 也不会糊成一团。 */}
      <circle cx="22.4" cy="18.2" r="1.15" fill="var(--dsw-alias-bg-layer-2, #fff)" />
      {/* 水柱：鲸鱼娘的辨识点，小尺寸下也还认得出。 */}
      <path
        d="M20.8 11.2c0-1.6.9-2.7 2.4-3.4-.7 1.4-.5 2.4.5 3.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * 站名：主名 + 副标，对应原型稿的「deepseek / Whale Girl Lounge」。
 *
 * 主名保留 deepseek —— 皮肤换的是外观，不冒充另一个产品；副标才是这套皮肤的身份。
 *
 * @returns The two-line wordmark.
 */
export function WhaleName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>deepseek</strong>
      <small className={css.subtitle}>Whale Girl Lounge</small>
    </span>
  )
}
