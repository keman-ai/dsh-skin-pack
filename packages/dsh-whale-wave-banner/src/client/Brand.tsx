/**
 * The whale mark and wordmark for the brand slots.
 *
 * The prototype's sidebar has a 12px-radius square mark in the top left containing **the banner itself** (cropped square with `object-fit: cover`),
 * with a faint blue shadow, beside two lines reading "deepseek / Whale Wave Theme".
 *
 * 🔴 The sidebar mark, the wordmark and the new-session mark are all `{ kind: 'single' }` slots. The old conclusion,
 * "a single slot occupied by the official component makes third-party registration throw" is **out of date**:
 * `SlotCore.register` in dsh 0.1.1-rc.2 detects occupancy only **at the same priority**, and different
 * priorities shadow instead (`entriesOfSlot` takes the live entry with the lowest priority in each cell). The
 * registers at the default 0, so registering at `priority: -1` takes over while its entry is only shadowed, not unloaded —
 * official mark returns automatically the moment the skin is deactivated.
 *
 * Taking over means honouring the other side's owner-props contract, so the parameters follow it strictly:
 *   SidebarBrandMarkOwnerProps { size }            — the sidebar wants 24px
 *   HeroBrandMarkOwnerProps    { size, className } — the new-session page wants 34px and passes a class name
 *   SidebarBrandNameOwnerProps {}                  — the name slot decides its own content and width
 */

import css from './Brand.module.css'

/** The mark contract shared by the sidebar and the new-session page. */
interface BrandMarkProps {
  /** The square size the host requires, in px. */
  size: number
  /** The class the host provides, present only on the new-session page; passed through verbatim to keep the default animation. */
  className?: string | undefined
}

/**
 * The whale mark: the banner cropped square.
 *
 * It reuses the inlined banner rather than adding weight — `background-size: cover` crops a square from the centre,
 * and since the whale sits dead centre the crop lands exactly on its head and body. The radius scales with size (the prototype's 34px carries
 * a 12px radius, 0.35×), so the sidebar's 24px and the hero's 34px are the same shape.
 *
 * @param props - Size and class name from the host.
 * @returns The square whale mark.
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
 * The wordmark: a primary name plus a subtitle, matching the prototype's "deepseek / Whale Wave Theme".
 *
 * The primary name stays deepseek — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function WaveName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>deepseek</strong>
      <small className={css.subtitle}>Whale Wave Theme</small>
    </span>
  )
}
