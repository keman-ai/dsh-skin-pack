/**
 * The white square mark and wordmark for the brand slots.
 *
 * The prototype has two marks: the bare 34px one in the top bar, and the 84px **white rounded square** at the
 * centre of the hero (`background: rgba(255,255,255,.96)`, a 24px radius, a soft shadow, with a 58px whale inside).
 * Against this deep blue gradient the white square is the brightest point on screen, and where the brand lands.
 *
 * Both places use one component: it draws at whatever size the host gives, a white square with a centred whale and a radius scaled to size
 * (the prototype's 84px with a 24px radius ≈ 0.29×).
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

/** The mark contract shared by the sidebar and the new-session page. */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * The white square mark.
 *
 * `background-image` rather than an `<img>`: on the hero the host passes in a class of its own (preserving the hover
 * animation), and applying it to one element is simpler than wrapping, with no extra child for flex to stretch.
 *
 * @param props - Size and class name from the host.
 * @returns The white square mark.
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
 * The wordmark: a primary name plus a subtitle, matching the prototype's "DeepSeek Harness / AI Work Mode".
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
