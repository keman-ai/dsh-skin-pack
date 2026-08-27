/**
 * The whale mark and wordmark for the brand slots.
 *
 * The prototype's sidebar top-left carries a 15px-radius square holding a whale, with a cool cyan inner border and a faint blue glow;
 * beside two lines reading "DeepSeek Harness / Twin Whale Girl Theme".
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
 * The whale mark.
 *
 * The ground and border live in CSS and the whale is inline SVG — the cover is not cropped: its subject is a full figure,
 * and a 24px square crop would yield nothing but blue. The radius scales with size (the prototype's 34px carries an 11px radius, about 0.31×),
 * so the sidebar's 24px and the hero's 34px are the same shape.
 *
 * SVG rather than the 🐋 emoji: an emoji's glyph comes from the system font, so one mark becomes three different
 * things across macOS, Windows and Linux, and colour fonts would force their own palette over this skin's cool cyan.
 *
 * @param props - Size and class name from the host.
 * @returns The square whale mark.
 */
export function TwinwhaleMark({ size, className }: BrandMarkProps) {
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
        {/* Body, fluke and a backlight, with as few strokes as possible: at 24px any detail blurs away. */}
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
 * The wordmark: a primary name plus a subtitle, matching the prototype's "DeepSeek Harness / Twin Whale Girl Theme".
 *
 * The primary name stays DeepSeek Harness — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function TwinwhaleName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>Twin Whale Girl</small>
    </span>
  )
}
