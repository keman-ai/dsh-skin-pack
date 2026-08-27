/**
 * 海边小铺的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 这是一套**浅色**皮肤（`colorScheme: 'light'`）。原型的 `:root` 只有五个色，全是海边的东西：
 *
 *   - **海雾白**（#eef8fb）与**纯白**：底与面板。底不是纯白——它带一点点青，
 *     是被海反射上来的天光；纯白留给卡片，这一点点差别就是整套的层次来源；
 *   - **灰蓝**（#24465d）：正文。不用黑：这张照片里最深的地方也只是灰蓝，
 *     用黑字会比画面本身还重；
 *   - **天空蓝**（#5fb4df / #82cde8）：主操作与"正在跑"，那面墙和那片海的蓝；
 *   - **蜜桃粉**（#efb39d）：点缀。画里只有门框、窗框与几个花盆是这个色，
 *     所以这里也只给警告一处；
 *   - **海草绿**（#77bfa5）：成功。
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const SEASIDE_PALETTE = {
  /** 海雾白，带一点青的天光。 */
  paper: '#eef8fb',
  paper2: '#e4f2f7',
  /** 更深一档的分隔带。 */
  paper3: '#d8e8ef',

  /** 灰蓝正文。这套里没有黑。 */
  ink: '#24465d',
  ink2: '#4a6a80',
  ink3: '#7892a3',

  line: '#d8e8ef',
  line2: '#c3dbe5',

  /** 天空蓝：主操作与"正在跑"。 */
  gold: '#5fb4df',
  gold2: '#82cde8',
  gold3: '#3f93bd',
  /** 海草绿：成功。 */
  jade: '#77bfa5',
  jade2: '#5aa78c',
  /** 蜜桃粉：点缀，只给警告一处。 */
  red: '#efb39d',
} as const

const p = SEASIDE_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in **light** base (`colorScheme: 'light'`).
 * The override set is deliberately incomplete: listing everything would shut out built-in tokens added later.
 */
export const SEASIDE_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // 🔴 A light skin layers the other way round from a dark one: the ground is brightest and each layer above darkens slightly.
  '--dsw-alias-bg-base': p.paper,
  '--dsw-alias-bg-layer-1': '#faf9f6',
  '--dsw-alias-bg-layer-2': '#ffffff',
  '--dsw-alias-bg-layer-3': p.paper2,
  '--dsw-alias-bg-module-platform': '#ffffff',
  '--dsw-alias-bg-overlay': '#ffffff',
  '--dsw-alias-bg-multi-select': '#e7ece9',

  // The scrim pushes towards warm grey rather than pure black; a black scrim looks dirty over paper white.
  '--dsw-alias-bg-mask-1': 'rgba(72, 69, 60, 0.42)',
  '--dsw-alias-bg-mask-2': 'rgba(72, 69, 60, 0.18)',
  '--dsw-alias-bg-mask-3': 'rgba(72, 69, 60, 0.32)',
  '--dsw-alias-bg-mask-photo': 'rgba(72, 69, 60, 0.72)',
  '--dsw-alias-bg-mask-drop': 'rgba(177, 138, 80, 0.14)',
  '--dsw-alias-bg-skeleton': 'rgba(72, 69, 60, 0.08)',

  // ── Borders ──
  // The prototype uses exactly two: `--line: #d7d2c8` and `--line2: #c9c2b5` — **solid warm grey**.
  // A light UI separates with lines, not shadows: shadows everywhere turn paper into a stack of cards.
  '--dsw-alias-border-l1': '#e6e2d9',
  '--dsw-alias-border-l2': p.line,
  '--dsw-alias-border-l2-darkmode-thin': p.line,
  '--dsw-alias-border-l3': p.line2,
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(49, 51, 49, 0.1)',
  '--dsw-alias-border-inverted2': 'rgba(49, 51, 49, 0.16)',

  // ── Text ──
  '--dsw-alias-label-primary': p.ink,
  '--dsw-alias-label-primary-bluish': '#33403c',
  '--dsw-alias-label-primary-dimmed': p.ink2,
  '--dsw-alias-label-secondary': p.ink2,
  '--dsw-alias-label-tertiary': p.ink3,
  '--dsw-alias-label-caption': '#9b9d98',
  '--dsw-alias-label-dimmed': '#9b9d98',
  // 🔴 Text on inverted blocks: the easiest thing to miss in a light skin. The primary button is solid pale gold,
  // White lacks contrast and black is too hard, so a warmer step of the paper white is used.
  '--dsw-alias-label-primary-foreground': '#fdfcf9',
  '--dsw-alias-label-primary-inverted': '#fdfcf9',

  // ── Brand and primary button ──
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.gold3,
  '--dsw-alias-brand-primary-invert': '#fdfcf9',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.gold3,
  '--dsw-alias-button-primary-dimmed': p.gold2,
  '--dsw-alias-button-contrast-fill': p.ink,
  '--dsw-alias-button-elevated-fill': '#ffffff',
  '--dsw-alias-button-floating-fill': '#ffffff',
  '--dsw-alias-button-floating-hover': p.paper2,
  '--dsw-alias-button-ghost-active-fill': '#efece4',
  '--dsw-alias-button-ghost-active-hover': p.paper3,
  '--dsw-alias-button-ghost-active-border': p.line2,
  '--dsw-alias-button-info-fill': '#e7eeec',
  '--dsw-alias-button-info-hover': '#dae5e2',
  '--dsw-alias-button-tool-bar-fill': 'rgba(177, 138, 80, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(177, 138, 80, 0.18)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0.6)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(72, 69, 60, 0.05)',
  '--dsw-alias-interactive-bg-active': 'rgba(72, 69, 60, 0.09)',
  '--dsw-alias-interactive-bg-hover-solid': p.paper2,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(177, 138, 80, 0.16)',
  // One of the two 1% cinnabar uses: hovering a destructive action.
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(181, 90, 82, 0.14)',

  // ── Status colours ──
  // 🔴 Success uses jade too. This draft's palette has no green at all, and forcing one would break both
  // the 2% jade and 80% grey-white ratios. Depth separates them: success uses the deeper jade2.
  '--dsw-alias-state-success-primary': p.jade2,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': '#e7eeec',
  // Warning leans on the pale gold. The draft gives no yellow, and pale gold is already this skin's attention colour.
  // A light ground needs the deeper gold3; gold2 is nearly invisible on paper white.
  '--dsw-alias-state-warn-primary': p.gold3,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#7a5c33',
  '--dsw-alias-state-warn-tertiary': '#f5efe3',
  // Error: cinnabar. The other of the two 1% uses.
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#9c4a43',
  // business = in progress: jade. It is the prototype's running dot.
  '--dsw-alias-state-business-primary': p.jade2,
  '--dsw-alias-state-business-tertiary': '#e7eeec',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#f7f6f2',
  '--dsw-alias-markdown-code-block-banner': p.paper2,
  '--dsw-alias-markdown-inline-code': '#efece4',
  '--dsw-alias-markdown-code-segment-selected': p.paper3,
  '--dsw-alias-markdown-code-segment-unselected': '#f7f6f2',
  '--dsw-alias-markdown-citation': '#efece4',
  '--dsw-alias-markdown-placeholder': p.paper2,
  '--dsw-alias-markdown-tag': '#efece4',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(72, 69, 60, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(72, 69, 60, 0.22)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(72, 69, 60, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold3,

  // ── Overlays ──
  // In a light skin, toasts and tooltips are inverted to a dark ground, or they lose all separation over paper white.
  '--dsw-alias-toast-bg': '#3a3c39',
  '--dsw-alias-tooltip-bg': '#3a3c39',

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': '#faf9f6',
  '--dsw-specific-sidebar-nav-item-hover': '#efece4',
  '--dsw-specific-sidebar-nav-item-active': p.paper3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': '#ffffff',
  '--dsw-specific-bubble-highlight': p.paper2,
  '--dsw-specific-input-major': '#ffffff',
  '--dsw-specific-login-input': '#ffffff',
  '--dsw-specific-menu': '#ffffff',
  '--dsw-specific-selector': '#ffffff',
  '--dsw-specific-tip': '#efece4',
}
