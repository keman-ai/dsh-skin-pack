/**
 * Forest Companion's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype states the palette rule plainly in its own notes:
 * the whole theme is drawn together into **deep forest green, soft cream and a touch of pink echoing the character**,
 * and the handoff says `theme = deep green / soft cream / warm pink`.
 *
 * Three words, three uses:
 *   - **deep forest green**: ground, panels, borders and the primary action — most of the interface;
 *   - **soft cream** (#e9e0c5): only at the end of the energy bar and in the brand mark's core, like light through the canopy;
 *   - **a touch of pink** (#d96f95): used in two places only, both very faint — a 5% glow on the cover
 *     and the current-mode card's border. **"A touch" is its definition**; spread wider it no longer echoes the figure in the picture.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const FOREST_PALETTE = {
  /** The forest floor: a deep green close to black. */
  bg: '#071713',
  /** One step deeper (the bottom of the prototype's gradient). */
  bg2: '#050f0c',
  /** Two panel levels. */
  panel: '#0b211a',
  panel2: '#102b22',
  /** The top of the sidebar and card gradients. */
  panelUp: '#0a2019',

  text: '#edf8f1',
  muted: '#8da99b',
  muted2: '#718a7e',

  /** The primary action green (the prototype's `.new` / `.send`: `linear-gradient(135deg,#58c88a,#2d8f72)`). */
  green: '#59c98b',
  greenDeep: '#2d8f72',
  /** Teal: used for running, clearly apart from the success green. */
  teal: '#4db9b0',
  /** 🔴 Soft cream: only the end of the energy bar and the brand mark's core. */
  cream: '#e9e0c5',
  /** 🔴 A touch of pink: two places anywhere, both very faint. */
  pink: '#d96f95',
} as const

const p = FOREST_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const FOREST_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': '#091812',
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#163a2e',

  // The scrim darkens towards the forest floor's deep green rather than pure black; black would wash this already dark green to grey.
  '--dsw-alias-bg-mask-1': 'rgba(3, 10, 7, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 10, 7, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 10, 7, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 6, 4, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(22, 58, 46, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(151, 220, 190, 0.08)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(151,220,190,.15)` — a dark border tinted grass green. All layering in the forest rests on it.
  '--dsw-alias-border-l1': 'rgba(151, 220, 190, 0.09)',
  '--dsw-alias-border-l2': 'rgba(151, 220, 190, 0.15)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(151, 220, 190, 0.12)',
  '--dsw-alias-border-l3': 'rgba(151, 220, 190, 0.3)',
  '--dsw-alias-border-l4': p.green,
  '--dsw-alias-border-inverted': 'rgba(237, 248, 241, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 248, 241, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e4f0e9',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#9bb1a5',
  '--dsw-alias-label-tertiary': p.muted2,
  '--dsw-alias-label-caption': '#5d786b',
  '--dsw-alias-label-dimmed': '#5d786b',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // The primary action is that 135° green gradient (the prototype's `.new` and `.send`). Neither cream nor pink is ever a button:
  // one is light and the other an echo, and a solid fill of either would break this skin's quiet.
  '--dsw-alias-brand-primary': p.green,
  '--dsw-alias-brand-text': '#a6e6c6',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.green,
  '--dsw-alias-button-primary-fill': p.green,
  '--dsw-alias-button-primary-hover': '#6bd79a',
  '--dsw-alias-button-primary-dimmed': p.greenDeep,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#11291f',
  '--dsw-alias-button-floating-fill': '#0a1e17',
  '--dsw-alias-button-floating-hover': '#11291f',
  '--dsw-alias-button-ghost-active-fill': '#123426',
  '--dsw-alias-button-ghost-active-hover': '#163a2e',
  '--dsw-alias-button-ghost-active-border': 'rgba(151, 220, 190, 0.28)',
  '--dsw-alias-button-info-fill': '#1c5344',
  '--dsw-alias-button-info-hover': p.greenDeep,
  '--dsw-alias-button-tool-bar-fill': 'rgba(89, 201, 139, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(89, 201, 139, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 30, 23, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(151, 220, 190, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(151, 220, 190, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#123426',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(89, 201, 139, 0.22)',
  // 🔴 Pink's second place (the first is the cover glow): hovering a destructive action. The prototype uses pink on the
  // current-mode border, meaning "the one that needs your attention"; this lands on the same semantic.
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(217, 111, 149, 0.22)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': '#76dfa0',
  '--dsw-alias-state-success-secondary': '#78d698',
  '--dsw-alias-state-success-tertiary': '#10261d',
  // The prototype gives no amber, so one is derived towards the cream — the last thing this skin should contain is anything that glares.
  '--dsw-alias-state-warn-primary': '#dcc487',
  '--dsw-alias-state-warn-secondary': '#dcc487',
  '--dsw-alias-state-warn-label': '#ecdcae',
  '--dsw-alias-state-warn-tertiary': '#2a2418',
  // Error leans on that touch of pink (#d96f95, one step brighter). The prototype gives no error colour, and pink is its
  // only warm-against-cool contrast, so using it keeps nothing glaring while introducing no fifth colour out of thin air.
  '--dsw-alias-state-error-primary': '#e07f9f',
  '--dsw-alias-state-error-secondary': '#eb95b1',
  // business = in progress: teal. A step apart from the success green, so running and success never read as one.
  '--dsw-alias-state-business-primary': p.teal,
  '--dsw-alias-state-business-tertiary': '#0f3330',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#07130f',
  '--dsw-alias-markdown-code-block-banner': '#0d2119',
  '--dsw-alias-markdown-inline-code': '#11291f',
  '--dsw-alias-markdown-code-segment-selected': '#163a2e',
  '--dsw-alias-markdown-code-segment-unselected': '#07130f',
  '--dsw-alias-markdown-citation': '#11291f',
  '--dsw-alias-markdown-placeholder': '#0d2119',
  '--dsw-alias-markdown-tag': '#11291f',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(151, 220, 190, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(151, 220, 190, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(151, 220, 190, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.green,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': '#091812',
  '--dsw-specific-sidebar-nav-item-hover': '#0c241b',
  '--dsw-specific-sidebar-nav-item-active': '#163a2e',
  '--dsw-specific-sidebar-nav-item-active-accent': p.green,
  '--dsw-specific-bubble': '#0d2119',
  '--dsw-specific-bubble-highlight': '#11291f',
  '--dsw-specific-input-major': '#0a1e17',
  '--dsw-specific-login-input': '#0b1c17',
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#0a1e17',
  '--dsw-specific-tip': '#11291f',
}
