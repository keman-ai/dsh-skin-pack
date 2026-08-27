/**
 * 品牌位的月环标与站名。
 *
 * 原型稿侧栏左上角是一枚 12px 圆角的方形标，里面就是**横幅本身**（`object-fit: cover` 裁方），
 * 配一层很淡的蓝色投影；旁边两行「deepseek / Night Swing」。
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
 * 月环标。
 *
 * 用纯 CSS 的径向渐变复刻原型那枚标，不裁横幅——横幅的主体在画面左三分之一，裁成小方块只会
 * 得到一团夜色。圆角按 size 等比给（原型 35px 配 11px 圆角，约 0.31 倍），侧栏的 24px 与
 * hero 的 34px 因此是同一个形状。
 *
 * @param props - Size and class name from the host.
 * @returns The square whale mark.
 */
export function SwingMark({ size, className }: BrandMarkProps) {
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
 * 站名：主名 + 副标，对应原型稿的「deepseek / Night Swing」。
 *
 * The primary name stays DeepSeek Harness — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function SwingName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>Night Swing</small>
    </span>
  )
}
