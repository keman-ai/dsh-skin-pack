/**
 * Misty Xianxia's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 This is a **light** skin (`colorScheme: 'light'`). The prototype's Theme rules state the proportions as
 * a single line of numbers, and it is this skin's hardest constraint:
 * **80% grey-white / mist-white base; 12% ink grey for hierarchy; 5% pale gold for interaction; 2% jade green for running; 1% cinnabar for danger**.
 *
 * Translated into use:
 *   - **paper white / mist white** (#f4f3f0 → #e3e0da): ground, panels and the composer — most of the interface;
 *   - **ink grey** (#313331): text and hierarchy, not black. This skin contains no pure black;
 *   - **pale gold** (#b18a50): borders, the primary action and the wordmark. 5% means edges and buttons, not broad fills;
 *   - **jade green** (#6d948d): reserved for **running**. 2%;
 *   - **cinnabar** (#b55a52): reserved for **danger and failure**. 1%.
 *
 * One more line is equally binding: the xianxia hero visual concentrates on New Session, the empty state and a few identity
 * surfaces, and **the working state is never covered wall to wall**. So the cover is drawn on the hero only.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const MIST_PALETTE = {
  /** Paper white, the brightest level. */
  paper: '#f4f3f0',
  paper2: '#eceae5',
  /** Mist white: panels and dividers. */
  paper3: '#e3e0da',

  /** The three ink-grey levels. No pure black here — black would press the mist into shadow. */
  ink: '#313331',
  ink2: '#676b68',
  ink3: '#8f918d',

  line: '#d7d2c8',
  line2: '#c9c2b5',

  /** Pale gold: borders, the primary action and the wordmark. */
  gold: '#b18a50',
  gold2: '#d4b681',
  gold3: '#8d6b3d',
  /** Jade green: running only. */
  jade: '#6d948d',
  jade2: '#4f7871',
  /** Cinnabar: danger and failure only. */
  red: '#b55a52',
} as const

const p = MIST_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in **light** base (`colorScheme: 'light'`).
 * The override set is deliberately incomplete: listing everything would shut out built-in tokens added later.
 */
export const MIST_TOKENS: Record<string, string> = {
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
