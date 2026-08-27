/**
 * 品牌位的鲸鱼标与站名。
 *
 * 原型稿侧栏左上角是一枚 15px 圆角的方形标，里面是一只鲸鱼，配一圈冷青内描边与很淡的蓝辉光；
 * 旁边两行「DeepSeek Harness / 双胞胎鲸鱼娘 Theme」。
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
 * 鲸鱼标。
 *
 * 底与描边在 CSS 里，鲸鱼是一段内联 svg —— 不裁封面：封面的主体是一个整身角色，
 * 裁成 24px 小方块只会得到一团蓝。圆角按 size 等比给（原型 34px 配 11px 圆角，约 0.31 倍），
 * 侧栏的 24px 与 hero 的 34px 因此是同一个形状。
 *
 * svg 而不是 emoji 🐋：emoji 的字形由系统字体决定，同一枚标在 mac / Windows / Linux 上
 * 会长成三个样子，还会被系统的彩色字体强行上色，压不住这套皮肤的冷青。
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
 * 站名：主名 + 副标，对应原型稿的「DeepSeek Harness / 双胞胎鲸鱼娘 Theme」。
 *
 * The primary name stays DeepSeek Harness — a skin changes the look, it does not impersonate another product; the subtitle carries the skin's identity.
 *
 * @returns The two-line wordmark.
 */
export function TwinwhaleName() {
  return (
    <span className={css.name}>
      <strong className={css.title}>DeepSeek Harness</strong>
      <small className={css.subtitle}>双胞胎鲸鱼娘</small>
    </span>
  )
}
