/**
 * Dark Xianxia's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype's Theme rules state the ratio as a single figure, and it is this skin's hardest constraint:
 * **70% ink-teal black / 18% warm grey-black / 8% antique gold / 3% jade green / 1% cinnabar**.
 *
 * Which translates into:
 *   - **ink-teal black** (#071012) and warm grey-black: ground, panels and the composer — most of the interface;
 *   - **antique gold** (#c09b5c): borders, the primary action and the wordmark. 8% means edges and buttons, not broad fills;
 *   - **jade green** (#4d9b8f): reserved for **running**. 3%;
 *   - **cinnabar** (#bf5a47): reserved for **danger and failure**. 1% — the prototype uses it in one place only, Stop run.
 *
 * One more line is equally binding: the strong world-building visuals concentrate on New Session and the empty state, and once you enter the workflow it
 * returns to a restrained dark developer-tool interface, which is what suits real long-term use. So the cover is drawn on the hero only.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const XIAN_PALETTE = {
  /** Ink-teal black, close to black. */
  bg: '#071012',
  bg2: '#0a1518',
  bg3: '#0d1a1d',
  /** The three panel levels (warm grey-black). */
  surface: '#0b1619',
  surface2: '#0f1d21',
  surface3: '#13252a',

  text: '#e8dfca',
  text2: '#b5a98f',
  text3: '#756f61',

  /** Antique gold: borders, the primary action and the wordmark. */
  gold: '#c09b5c',
  gold2: '#e0bd7b',
  gold3: '#8b6734',
  /** Jade green: running only. */
  jade: '#4d9b8f',
  jade2: '#74b5a9',
  /** Cinnabar: danger and failure only. */
  red: '#bf5a47',
  red2: '#7a3429',
} as const

const p = XIAN_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const XIAN_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // The scrim darkens towards ink-teal rather than pure black; black would wash this already dark teal to grey.
  '--dsw-alias-bg-mask-1': 'rgba(4, 9, 10, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(4, 9, 10, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(4, 9, 10, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(3, 7, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(19, 37, 42, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(189, 151, 88, 0.08)',

  // ── Borders ──
  // The prototype uses exactly two: `--line: rgba(189,151,88,.18)` and `--line2: .28` — **dark borders tinted antique gold**.
  // This is where most of that 8% gold goes: all layering on the dark ground rests on it, not on lightening the ground.
  '--dsw-alias-border-l1': 'rgba(189, 151, 88, 0.12)',
  '--dsw-alias-border-l2': 'rgba(189, 151, 88, 0.18)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(189, 151, 88, 0.14)',
  '--dsw-alias-border-l3': 'rgba(189, 151, 88, 0.28)',
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(232, 223, 202, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(232, 223, 202, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dfd8c6',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#a79c85',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#6a6558',
  '--dsw-alias-label-dimmed': '#6a6558',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // The primary action is antique gold (the `linear-gradient(135deg,#e0bd7b,#c09b5c)` on the prototype's `.new-session` and its summon button).
  // A deep brown `#241a0c` goes in front: white on gold lacks contrast, and black is too hard.
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.gold2,
  '--dsw-alias-brand-primary-invert': '#241a0c',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.gold2,
  '--dsw-alias-button-primary-dimmed': p.gold3,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#183036',
  '--dsw-alias-button-ghost-active-border': 'rgba(189, 151, 88, 0.3)',
  '--dsw-alias-button-info-fill': '#1a4b45',
  '--dsw-alias-button-info-hover': '#215d55',
  '--dsw-alias-button-tool-bar-fill': 'rgba(192, 155, 92, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(192, 155, 92, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(11, 22, 25, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(189, 151, 88, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(189, 151, 88, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(192, 155, 92, 0.22)',
  // One of the places for that 1% of cinnabar: hovering a destructive action (Stop run in the prototype).
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(191, 90, 71, 0.22)',

  // ── Status colours ──
  // 🔴 Success uses jade too. This draft's palette has no green at all, and forcing one would break both
  // both the 3% jade and the 70% ink-black proportions.
  '--dsw-alias-state-success-primary': p.jade2,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': '#0d2a27',
  // Warning leans on antique gold. The draft gives no yellow, and gold is already this skin's attention colour.
  '--dsw-alias-state-warn-primary': p.gold2,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#efd6a2',
  '--dsw-alias-state-warn-tertiary': '#2a2216',
  // Error: cinnabar. The other of the two 1% uses.
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#d4705d',
  // business = in progress: jade. It is the prototype's running dot.
  '--dsw-alias-state-business-primary': p.jade,
  '--dsw-alias-state-business-tertiary': '#0d2a27',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#050d0f',
  '--dsw-alias-markdown-code-block-banner': p.bg3,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#050d0f',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.bg3,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(189, 151, 88, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(189, 151, 88, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(189, 151, 88, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': p.bg3,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
