/**
 * Ultra Team · Apocalypse's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 This draft has **no** Theme rules section (unlike others in the batch, which fix the ratios) and gives only a set of
 * `:root` variables. So the division had to be read from **how it actually uses** them:
 *
 *   - `--bg: #120909` / `--panel: #1a1010` — ground and panels are a **charred dark red-black**, not neutral black,
 *     and they are eight tenths of the interface;
 *   - `--line: rgba(255,151,85,.16)` — **the only border anywhere**, tinted with firelight; all layering rests on it;
 *   - `--orange: #ff7b2c` — the primary action (the prototype's `.new` is `linear-gradient(135deg,#f0522d,#bb251f)`,
 *     an orange-to-red gradient);
 *   - `--red: #ef3b2f` — the red of the hero's suit, reserved for **danger and failure**;
 *   - `--yellow: #ffdc60` / `--cyan: #57d9ff` / `--green: #65dfa3` — the prototype uses them only sparingly on small
 *     badges and status dots, and here they land on warning, in-progress and success respectively.
 *
 * 🔴 **Orange and red must stay apart**: orange is what you are meant to do (the primary action), red is that something
 * went wrong. The artwork is already all fire, and mixing them would make everything look ablaze, hiding a real error.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const ULTRATEAM_PALETTE = {
  /** The charred dark red-black. */
  bg: '#120909',
  bg2: '#1a0c0b',
  /** Two panel levels. */
  panel: '#1a1010',
  panel2: '#251311',

  text: '#fff2e6',
  muted: '#b08f7b',

  /** Firelight orange: the primary action. */
  orange: '#ff7b2c',
  /** Battle red: danger and failure. */
  red: '#ef3b2f',
  /** Timer yellow: warning. */
  yellow: '#ffdc60',
  /** Energy cyan: in progress. */
  cyan: '#57d9ff',
  /** Recovery green: success. */
  green: '#65dfa3',
} as const

const p = ULTRATEAM_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const ULTRATEAM_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // 🔴 The prototype gives two panel levels (`--panel` / `--panel2`) and the harness wants three.
  // The third rises one step further rather than reusing panel2: collapsed to two, overlays and the selected state become indistinguishable.
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#331915',

  // The scrim darkens towards the dark red-black rather than pure black; black would wash the char into grey.
  '--dsw-alias-bg-mask-1': 'rgba(9, 4, 4, 0.74)',
  '--dsw-alias-bg-mask-2': 'rgba(9, 4, 4, 0.36)',
  '--dsw-alias-bg-mask-3': 'rgba(9, 4, 4, 0.64)',
  '--dsw-alias-bg-mask-photo': 'rgba(7, 4, 3, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(51, 25, 21, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 151, 85, 0.08)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(255,151,85,.16)` — a dark border lit by fire. All layering rests on it.
  '--dsw-alias-border-l1': 'rgba(255, 151, 85, 0.11)',
  '--dsw-alias-border-l2': 'rgba(255, 151, 85, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 151, 85, 0.13)',
  '--dsw-alias-border-l3': 'rgba(255, 151, 85, 0.3)',
  '--dsw-alias-border-l4': p.orange,
  '--dsw-alias-border-inverted': 'rgba(255, 242, 230, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(255, 242, 230, 0.1)',

  // ── Text ──
  // Body text is a warm off-white `#fff2e6` and secondary text `#b08f7b` — both carrying a smoky warmth,
  // the same light as the fire. Neutral grey would look pasted on.
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#f6ece3',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#c2a18d',
  '--dsw-alias-label-tertiary': '#8f7767',
  '--dsw-alias-label-caption': '#7a6455',
  '--dsw-alias-label-dimmed': '#7a6455',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // The primary action is that orange-to-red gradient (the prototype's `.new`), rendered here as a solid at its midpoint
  // `#ff7b2c`, which white text holds up against.
  '--dsw-alias-brand-primary': p.orange,
  '--dsw-alias-brand-text': '#ffa763',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.orange,
  '--dsw-alias-button-primary-fill': p.orange,
  '--dsw-alias-button-primary-hover': '#ff9450',
  '--dsw-alias-button-primary-dimmed': '#8f4319',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.panel2,
  '--dsw-alias-button-floating-fill': p.panel,
  '--dsw-alias-button-floating-hover': p.panel2,
  '--dsw-alias-button-ghost-active-fill': '#331915',
  '--dsw-alias-button-ghost-active-hover': '#3d1e19',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 151, 85, 0.3)',
  '--dsw-alias-button-info-fill': '#123c4c',
  '--dsw-alias-button-info-hover': '#164c60',
  '--dsw-alias-button-tool-bar-fill': 'rgba(255, 123, 44, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(255, 123, 44, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(26, 16, 16, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 151, 85, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 151, 85, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#331915',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 123, 44, 0.22)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(239, 59, 47, 0.24)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#79e5b1',
  '--dsw-alias-state-success-tertiary': '#0f3025',
  '--dsw-alias-state-warn-primary': p.yellow,
  '--dsw-alias-state-warn-secondary': '#f5cf5c',
  '--dsw-alias-state-warn-label': '#ffe995',
  '--dsw-alias-state-warn-tertiary': '#32290f',
  // 🔴 Errors use `--red` and the primary action `--orange`, never shared. The artwork is already all fire,
  // and mixing orange with red would hide a real error.
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#f5665b',
  // business = in progress: energy cyan. The only cool colour anywhere, and the easiest to pick out amid the fire.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#0f3444',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#0d0605',
  '--dsw-alias-markdown-code-block-banner': p.panel,
  '--dsw-alias-markdown-inline-code': p.panel2,
  '--dsw-alias-markdown-code-segment-selected': '#331915',
  '--dsw-alias-markdown-code-segment-unselected': '#0d0605',
  '--dsw-alias-markdown-citation': p.panel2,
  '--dsw-alias-markdown-placeholder': p.panel,
  '--dsw-alias-markdown-tag': p.panel2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 151, 85, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 151, 85, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 151, 85, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.orange,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.panel,
  '--dsw-specific-sidebar-nav-item-active': '#331915',
  '--dsw-specific-sidebar-nav-item-active-accent': p.orange,
  '--dsw-specific-bubble': p.panel,
  '--dsw-specific-bubble-highlight': p.panel2,
  '--dsw-specific-input-major': p.panel,
  '--dsw-specific-login-input': p.panel,
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': p.panel,
  '--dsw-specific-tip': p.panel2,
}
