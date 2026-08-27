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
 * 🔴 All three slots are `{ kind: 'single' }`. The old conclusion — that single slots are taken by the official entry and a third-party registration
 * simply throws — is **out of date**: in dsh 0.1.1-rc.2 `SlotCore.register` treats a slot as occupied only at the **same priority**,
 * while different priorities shadow instead (`entriesOfSlot` takes the live entry with the lowest priority in each cell).
 * The official `ui-brand-official` registers at the default 0, so registering at `priority: -1` takes over,
 * and its entry is only shadowed rather than unloaded — disabling the skin returns to the official mark automatically.
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
       * 🔴 The size goes through a CSS variable rather than inline width/height.
       *
       * The host gives only 34px on the new-session page while the prototype's square is 84px — and inline styles
       * outrank any class selector, so hardcoding would leave the stylesheet fighting with `!important`.
       *
       * ⚠️ The variable is `--mark-host-size` (the size the host asks for), not `--mark-size`: a custom property set
       * on **the element's own** style cannot be overridden by an ancestor — the first version did exactly that, and
       * the hero's enlarging rule had no effect. The stylesheet actually reads `var(--mark-size, var(--mark-host-size, 34px))`:
       * with neither set it uses the host size, and to enlarge, the stylesheet sets `--mark-size` on an ancestor.
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
