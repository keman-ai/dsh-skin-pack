/**
 * Mars Flight Deck's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype's Theme rules state the ratio as a single figure, and it is this skin's hardest constraint:
 * **80% spaceflight black and deep blue consoles, 10% cool blue telemetry, 6% thruster orange for interaction emphasis,
 * 3% Nominal green for state and 1% red for anomalies**.
 *
 * Translated into use:
 *   - **spaceflight black / deep blue panels** (#05080d → #142331): ground and the three panel levels — most of the interface;
 *   - **cool blue** (#7fb4d3): telemetry, meaning **borders and secondary data**. The hairlines on the instrument panel are this;
 *   - **thruster orange** (#ff7a2e): **interaction emphasis** — the primary action and selected items. 6% means the moment you press;
 *   - **Nominal green** (#73b89a): reserved for **all nominal** (the success state). 3%;
 *   - **red** (#d9503f): reserved for **anomalies**. 1%.
 *
 * 🔴 Orange and green must never blur: orange is what you are about to do, green is what is already done. Confusing the two on a flight deck
 * costs you the ability to tell at a glance whether to act.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const MARS_PALETTE = {
  /** Spaceflight black, close to pure black. */
  bg: '#05080d',
  bg2: '#08111a',
  /** The three deep blue console levels. */
  surface: '#0a121b',
  surface2: '#0f1a25',
  surface3: '#142331',

  text: '#e8edf2',
  text2: '#aeb9c3',
  text3: '#6f7d89',

  /** Cool blue telemetry: borders and secondary data. */
  cyan: '#7fb4d3',
  cyan2: '#9fd3ee',
  /** Thruster orange: interaction emphasis. */
  orange: '#ff7a2e',
  orange2: '#ffad66',
  /** Anomaly red. */
  red: '#d9503f',
  /** Nominal green. */
  green: '#73b89a',
} as const

const p = MARS_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const MARS_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // The scrim darkens towards spaceflight black. This skin is dark enough already, and pushing the scrim towards blue would dirty it.
  '--dsw-alias-bg-mask-1': 'rgba(2, 4, 7, 0.74)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 4, 7, 0.36)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 4, 7, 0.64)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 3, 5, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(20, 35, 49, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(142, 181, 203, 0.08)',

  // ── Borders ──
  // The prototype uses exactly two: `--line: rgba(142,181,203,.12)` (cool blue) and `--line2: rgba(255,122,46,.14)` (orange).
  // The cool blue is the instrument hairline and carries all the layering; the orange appears only on frames that need emphasis.
  '--dsw-alias-border-l1': 'rgba(142, 181, 203, 0.09)',
  '--dsw-alias-border-l2': 'rgba(142, 181, 203, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(142, 181, 203, 0.1)',
  '--dsw-alias-border-l3': 'rgba(142, 181, 203, 0.26)',
  '--dsw-alias-border-l4': p.orange,
  '--dsw-alias-border-inverted': 'rgba(232, 237, 242, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(232, 237, 242, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dde7ef',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#9aa7b3',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#5d6a75',
  '--dsw-alias-label-dimmed': '#5d6a75',
  // White on solid orange lacks contrast, so a near-black deep brown is paired with it.
  '--dsw-alias-label-primary-foreground': '#1a0d05',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // The primary action is thruster orange (the prototype's `LAUNCH MISSION →`). Cool blue is never a solid button:
  // here it is the language of telemetry and borders, and spreading it across large areas flattens the instrument panel's layering.
  '--dsw-alias-brand-primary': p.orange,
  '--dsw-alias-brand-text': p.orange2,
  '--dsw-alias-brand-primary-invert': '#1a0d05',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.orange,
  '--dsw-alias-button-primary-fill': p.orange,
  '--dsw-alias-button-primary-hover': p.orange2,
  '--dsw-alias-button-primary-dimmed': '#8a4520',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#1a2c3d',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 122, 46, 0.28)',
  '--dsw-alias-button-info-fill': '#1a3547',
  '--dsw-alias-button-info-hover': '#224358',
  '--dsw-alias-button-tool-bar-fill': 'rgba(255, 122, 46, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(255, 122, 46, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 18, 27, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(142, 181, 203, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(142, 181, 203, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 122, 46, 0.22)',
  // One of the two places for that 1% of red: hovering a destructive action.
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(217, 80, 63, 0.22)',

  // ── Status colours ──
  // 🔴 Success = Nominal green, in progress = cool blue, primary action = orange. Each keeps to its own job and none ever trades places.
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#8ac9ad',
  '--dsw-alias-state-success-tertiary': '#102b26',
  // Warning leans on orange (the draft gives no yellow, and orange is already this skin's attention colour, with the brighter orange2 keeping it apart from the primary button).
  '--dsw-alias-state-warn-primary': p.orange2,
  '--dsw-alias-state-warn-secondary': p.orange,
  '--dsw-alias-state-warn-label': '#ffc48c',
  '--dsw-alias-state-warn-tertiary': '#2c1c10',
  // Anomaly: red. The other of the two 1% places.
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#e56d5c',
  // business = in progress: cool blue telemetry.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#123141',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#040710',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#040710',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(142, 181, 203, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(142, 181, 203, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(142, 181, 203, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.orange,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.orange,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
