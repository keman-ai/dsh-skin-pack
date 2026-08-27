/**
 * 品牌位的白色方标与站名。
 *
 * 原型稿有两处标：顶栏那枚 34px 的裸标，和 hero 中央那块 84px 的**白色圆角方块**
 *（`background: rgba(255,255,255,.96)`、24px 圆角、一层柔和投影，里面嵌 58px 的鲸鱼图）。
 * 在这片深蓝渐变上，白方块是整屏最亮的一点，也是"品牌"的落点。
 *
 * 这里两处都用同一个组件：宿主给多大就画多大，白底方块 + 居中的鲸鱼，圆角按尺寸等比
 *（原型 84px 配 24px 圆角 ≈ 0.29 倍）。
 *
 * 🔴 三个 slot 都是 `{ kind: 'single' }`。以前的结论是"single 已被官方占用，第三方注册直接
 * 抛错"，**那条已经过时**：dsh 0.1.1-rc.2 的 `SlotCore.register` 只在**同一个 priority** 上
 * 判占用，不同 priority 是影子化（`entriesOfSlot` 取每个 cell 里 priority 最小的那个 live
 * entry）。官方 `ui-brand-official` 注册在默认 0，所以注册 `priority: -1` 就能接管，
 * 且它那份只是被影子化、没被卸载——皮肤一停用就自动回到官方标。
 */

import type { CSSProperties } from 'react'
import { DEEPSEEK_ICON } from './icon.generated.ts'
import css from './Brand.module.css'

/** 侧栏 / 新会话页共用的标契约。 */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * 白色方标。
 *
 * 用 `background-image` 而不是 `<img>`：宿主在 hero 那处会传一个自己的类名进来（保留悬停
 * 动效），套在同一个元素上比包一层更省事，也不会多出一个会被 flex 拉伸的子节点。
 *
 * @param props - Size and class name from the host.
 * @returns 白底方标。
 */
export function WorkMark({ size, className }: BrandMarkProps) {
  return (
    <span
      className={[css.mark, className].filter(Boolean).join(' ')}
      aria-hidden="true"
      /*
       * 🔴 尺寸走 CSS 变量，不写死成 width/height 内联值。
       *
       * 宿主在新会话页只给 34px，而原型那块白方块是 84px——内联样式的优先级高于任何类选择器，
       * 写死之后样式表就只能靠 `!important` 去抢。
       *
       * ⚠️ 变量名是 `--mark-host-size`（宿主要求的尺寸），不是 `--mark-size`：自定义属性写在
       * **元素自己**的 style 上时，祖先上的同名变量盖不过它——第一版就是这么写的，hero 里那条
       * 放大规则完全不起作用。样式表实际读的是 `var(--mark-size, var(--mark-host-size, 34px))`：
       * 谁都不设就用宿主尺寸，样式表想放大就在祖先上设 `--mark-size`。
       */
      style={{
        '--mark-host-size': `${size}px`,
        backgroundImage: `url("${DEEPSEEK_ICON}")`,
      } as CSSProperties}
    />
  )
}

/**
 * 站名：主名 + 副标，对应原型稿的「DeepSeek Harness / AI Work Mode」。
 *
 * @returns The two-line wordmark.
 */
export function WorkName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>AI Work Mode</small>
    </span>
  )
}
