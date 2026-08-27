/**
 * Forest Adventure's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype's Theme rules fix each colour's job:
 * **forest green** as the ground, **stream teal and moss green** as the state colours, and **daylight yellow only as a warm accent**.
 *
 * Three clauses, three uses:
 *   - **forest green** (#08150f → #1f3b2b): ground and the three panel levels, covering most of the interface;
 *   - **moss green** (#6fa36d) for the primary action and **stream teal** (#5eb7c7) for running: the two state colours divide the work plainly,
 *     green meaning done and teal meaning in progress — one family would blur the two;
 *   - **daylight yellow** (#d7c77e): accent only, given exactly two places here — the warning state and the end of the context-usage bar.
 *     Accent-only is its definition; spread wider it stops being the light through the canopy.
 *
 * The draft also carries a **purple** (`--flower: #9a7fbb`, the wisteria in the picture). It appears only as decoration,
 * with no semantics, so it is never used here: assigning it one would be inventing rules on the designer's behalf.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const GROVE_PALETTE = {
  /** The forest floor: a deep green close to black. */
  bg: '#08150f',
  bg2: '#0d2117',
  /** The third panel level (moss). */
  surface: '#10261b',
  surface2: '#173022',
  surface3: '#1f3b2b',

  text: '#eef1e8',
  text2: '#c6cebf',
  text3: '#899585',

  /** Moss green: the primary action and done. */
  green: '#6fa36d',
  green2: '#a7cb87',
  mint: '#89c7ad',
  /** Stream teal: running only. */
  river: '#5eb7c7',
  /** Daylight yellow: accent only. */
  sun: '#d7c77e',
  /** Wisteria. Decoration only in the prototype and never used here (see the file header). */
  flower: '#9a7fbb',
  danger: '#b96355',
} as const

const p = GROVE_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const GROVE_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // The scrim darkens towards the forest floor's deep green rather than pure black; black would wash this already dark green to grey.
  '--dsw-alias-bg-mask-1': 'rgba(4, 11, 7, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(4, 11, 7, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(4, 11, 7, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(3, 8, 5, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(31, 59, 43, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(187, 212, 180, 0.08)',

  // ── Borders ──
  // The prototype uses exactly two: `--line: rgba(187,212,180,.14)` (grass) and `--line2: rgba(94,183,199,.12)` (stream teal).
  // All layering on the dark ground rests on them, not on lightening the ground.
  '--dsw-alias-border-l1': 'rgba(187, 212, 180, 0.1)',
  '--dsw-alias-border-l2': 'rgba(187, 212, 180, 0.14)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(187, 212, 180, 0.11)',
  '--dsw-alias-border-l3': 'rgba(187, 212, 180, 0.28)',
  '--dsw-alias-border-l4': p.green2,
  '--dsw-alias-border-inverted': 'rgba(238, 241, 232, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(238, 241, 232, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e4ebe1',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#aab5a3',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#728073',
  '--dsw-alias-label-dimmed': '#728073',
  '--dsw-alias-label-primary-foreground': '#102014',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // The primary action is moss green (the prototype's `.hero-send`: `linear-gradient(180deg,#8ebf7f,#5f8d5d)`),
  // with deep forest green `#102014` in front — as the prototype pairs them, since white on bright green lacks contrast.
  '--dsw-alias-brand-primary': p.green,
  '--dsw-alias-brand-text': p.green2,
  '--dsw-alias-brand-primary-invert': '#102014',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.green,
  '--dsw-alias-button-primary-fill': p.green,
  '--dsw-alias-button-primary-hover': '#82b47c',
  '--dsw-alias-button-primary-dimmed': '#4c7350',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#26472f',
  '--dsw-alias-button-ghost-active-border': 'rgba(167, 203, 135, 0.28)',
  '--dsw-alias-button-info-fill': '#1c4a4f',
  '--dsw-alias-button-info-hover': '#245c62',
  '--dsw-alias-button-tool-bar-fill': 'rgba(167, 203, 135, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(167, 203, 135, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(16, 38, 27, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(187, 212, 180, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(187, 212, 180, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(111, 163, 109, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(185, 99, 85, 0.22)',

  // ── Status colours ──
  // 🔴 Success is moss green and in-progress is stream teal: the draft names both together as the state colours,
  // and this is the division — green means done, teal means in progress. One family would blur the two.
  '--dsw-alias-state-success-primary': p.green2,
  '--dsw-alias-state-success-secondary': p.green,
  '--dsw-alias-state-success-tertiary': '#14301d',
  // Warning: daylight yellow. The first of its two places.
  '--dsw-alias-state-warn-primary': p.sun,
  '--dsw-alias-state-warn-secondary': p.sun,
  '--dsw-alias-state-warn-label': '#e6dba6',
  '--dsw-alias-state-warn-tertiary': '#2b2718',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#cd7a6c',
  // business = in progress: stream teal.
  '--dsw-alias-state-business-primary': p.river,
  '--dsw-alias-state-business-tertiary': '#10333a',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#06110b',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#06110b',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(187, 212, 180, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(187, 212, 180, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(187, 212, 180, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.green2,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.green2,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
