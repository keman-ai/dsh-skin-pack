/**
 * The whale mark and wordmark for the brand slots.
 *
 * The prototype's sidebar has a 12px-radius square mark in the top left containing **the banner itself** (cropped square with `object-fit: cover`),
 * 配一层很淡的蓝色投影；旁边两行「deepseek / Whale Wave Theme」。
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
 * 鲸鱼标：横幅裁方。
 *
 * 直接复用那张内联横幅，不额外增加体积——`background-size: cover` 从中间裁一个正方形，
 * 而横幅正中就是鲸鱼，裁出来正好是它的头身。圆角按 size 等比给（原型是 34px 配 12px 圆角，
 * 也就是 0.35 倍），这样侧栏的 24px 与 hero 的 34px 是同一个形状。
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
 * 站名：主名 + 副标，对应原型稿的「deepseek / Whale Wave Theme」。
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
