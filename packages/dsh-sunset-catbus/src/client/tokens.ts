/**
 * Sunset Catbus's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * This skin's character is **quiet**: the ground is pressed to a near-black night blue and every border carries a hint of moonlit cyan
 * (`rgba(141,198,255,.16)`), with everything held low in luminance — as the prototype's own notes put it,
 * "the theme is unified into deep night blue, cool moonlight and soft beige".
 *
 * That touch of **beige** (#ded0ae) matters: it is the only warm colour in the skin, and the prototype uses it solely at the end of the energy gradient
 * (`linear-gradient(90deg,#5f88da,#7bd8ff,#ded0ae)`) — like the lamp wrapped in night in the picture.
 * so it gets exactly one place here too: the end of the context bar. Spread wider it would stop being a touch of warmth.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const CATBUS_PALETTE = {
  /** The dusk ground: deep brown, not black. */
  bg: '#160d08',
  bg2: '#100904',
  /** Panels: two levels of warm brown. */
  panel: '#24150d',
  panel2: '#302016',
  /** The ground for the sidebar and cards. */
  panelDeep: '#1c1009',

  text: '#fff4e7',
  muted: '#b49a84',
  muted2: '#9a836f',

  /** Sunset orange: the primary action. */
  orange: '#f49a43',
  orange2: '#f8b168',
  orangeDeep: '#bd5e27',
  /** Wheat gold: borders and emphasis. */
  gold: '#ffd07a',
  /** The only cool colour anywhere, reserved for running. */
  blue: '#6ab6ff',
  /** Online green. */
  green: '#7fd59e',
} as const

const p = CATBUS_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const CATBUS_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.panelDeep,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#3a2415',

  // The scrim pushes towards night blue rather than pure black; black would wash this already dark blue into grey.
  '--dsw-alias-bg-mask-1': 'rgba(3, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 5, 10, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(20, 47, 80, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 191, 103, 0.08)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(255,191,103,.16)` — **a dark border tinted wheat gold**. All layering on the dark brown ground rests on it.
  '--dsw-alias-border-l1': 'rgba(255, 191, 103, 0.1)',
  '--dsw-alias-border-l2': 'rgba(255, 191, 103, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 191, 103, 0.12)',
  '--dsw-alias-border-l3': 'rgba(255, 191, 103, 0.3)',
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(237, 247, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 247, 255, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dfedf6',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#9bafbf',
  '--dsw-alias-label-tertiary': p.muted2,
  '--dsw-alias-label-caption': '#5c7589',
  '--dsw-alias-label-dimmed': '#5c7589',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // The primary action is that night-blue gradient (the prototype's `.new` / `.send`: `linear-gradient(135deg,#4b7fe8,#24507a)`).
  // Wheat gold is never a solid button: here it is the language of borders and emphasis, and a large gold button would compete with the cover for light.
  '--dsw-alias-brand-primary': p.orange,
  '--dsw-alias-brand-text': p.gold,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.orange,
  '--dsw-alias-button-primary-fill': p.orange,
  '--dsw-alias-button-primary-hover': p.orange2,
  '--dsw-alias-button-primary-dimmed': '#7a4a20',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#302016',
  '--dsw-alias-button-floating-fill': '#24150d',
  '--dsw-alias-button-floating-hover': '#302016',
  '--dsw-alias-button-ghost-active-fill': '#3a2415',
  '--dsw-alias-button-ghost-active-hover': '#3a2415',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 191, 103, 0.28)',
  '--dsw-alias-button-info-fill': '#1a3550',
  '--dsw-alias-button-info-hover': '#24507a',
  '--dsw-alias-button-tool-bar-fill': 'rgba(115, 213, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(115, 213, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 25, 41, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 191, 103, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 191, 103, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#3a2415',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(59, 120, 232, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(220, 110, 110, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#74d099',
  '--dsw-alias-state-success-tertiary': '#16301f',
  // 🔴 Warnings are the hard problem here: with the whole palette orange and gold, an orange warning simply does not surface.
  // So warnings take **a bright step of wheat gold** (separated by brightness rather than hue) and errors take a brick red —
  // deeper and redder than the sunset orange, so it still reads as bad news amid all the warmth.
  '--dsw-alias-state-warn-primary': '#ffd07a',
  '--dsw-alias-state-warn-secondary': '#f0bd63',
  '--dsw-alias-state-warn-label': '#ffe1a8',
  '--dsw-alias-state-warn-tertiary': '#33270f',
  '--dsw-alias-state-error-primary': '#e0674f',
  '--dsw-alias-state-error-secondary': '#ea8069',
  // business = in progress: cool blue. The only cool colour anywhere, recognised at a glance amid the orange and gold.
  '--dsw-alias-state-business-primary': p.blue,
  '--dsw-alias-state-business-tertiary': '#12293d',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#100904',
  '--dsw-alias-markdown-code-block-banner': '#24150d',
  '--dsw-alias-markdown-inline-code': '#302016',
  '--dsw-alias-markdown-code-segment-selected': '#3a2415',
  '--dsw-alias-markdown-code-segment-unselected': '#100904',
  '--dsw-alias-markdown-citation': '#302016',
  '--dsw-alias-markdown-placeholder': '#24150d',
  '--dsw-alias-markdown-tag': '#302016',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 191, 103, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 191, 103, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 191, 103, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.panelDeep,
  '--dsw-specific-sidebar-nav-item-hover': '#0c2034',
  '--dsw-specific-sidebar-nav-item-active': '#3a2415',
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': '#24150d',
  '--dsw-specific-bubble-highlight': '#302016',
  '--dsw-specific-input-major': '#24150d',
  '--dsw-specific-login-input': '#24150d',
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#24150d',
  '--dsw-specific-tip': '#302016',
}
