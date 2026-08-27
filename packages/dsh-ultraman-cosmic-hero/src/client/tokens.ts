/**
 * Cosmic Hero's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale. A harness redesign changes
 * class names and layout but not what a semantic token means, so this layer lasts.
 *
 * 🔴 The most important rule of this palette: **red is scarce**. The prototype uses it in three places only — the logo's
 * outer ring, the avatar gradient and the current-mode card's border — everything else is deep-space blue-black and cyan.
 * So red maps only to `state-error-*` and never to the primary action or the running state; the primary action is **blue**
 * (`.new`'s `linear-gradient(135deg,#1a7dff,#2154d7)`) and running is **cyan**.
 *
 * And another: the prototype's energy bar is `linear-gradient(90deg,#22d8ff,#ffdb53,#ef3943)` — cyan → amber → red,
 * exactly the colour timer's order from full to critical. That sequence is reused in the dock for the occupancy bar and
 * the energy core, letting rising occupancy convey its own urgency (see StatusDock.module.css).
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const COSMIC_PALETTE = {
  /** The deep-space ground: near black with a blue cast. */
  bg: '#030810',
  bg2: '#07131f',
  /** Two panel levels (the top and bottom of the card gradient). */
  panel: '#091726',
  panel2: '#0d2032',

  text: '#e9f8ff',
  muted: '#7897aa',

  /** Cyan: borders, icons, emphasis and running. */
  cyan: '#23d9ff',
  /** Blue: the <b>primary action colour</b> (the prototype's + New Session is this blue gradient). */
  blue: '#2787ff',
  /** Bright blue: the top of the blue gradient, used for hover. */
  blue2: '#1a7dff',
  /** Red: <b>the scarce colour</b>, reserved for errors. */
  red: '#e6313a',
  /** Amber: actions needing confirmation, and the timer's middle band. */
  amber: '#ffd84e',
  /** Green: ONLINE / READY. */
  green: '#5ce2a6',
} as const

const p = COSMIC_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; unlisted tokens inherit the harness's built-in dark base. The incomplete override set
 * is deliberate — listing everything would shut out built-in tokens added later.
 */
export const COSMIC_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // The prototype is a deep-space ground with blue-black panels: bg → panel → panel2 rise step by step, isomorphic to
  // the harness's base → layer-1/2/3; layer-3 rises once more for overlays so they stay distinct from cards.
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': '#071623',
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#112f4a',

  // The scrim darkens towards deep blue rather than pure black — black would wash this blue to grey.
  '--dsw-alias-bg-mask-1': 'rgba(2, 7, 13, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 7, 13, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 7, 13, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 4, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(17, 47, 74, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(233, 248, 255, 0.06)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(102,213,255,.16)` — a **cyan-tinted dark border**, not neutral grey.
  // That line is where the skin's technical feel comes from, and all four levels follow its hue.
  '--dsw-alias-border-l1': 'rgba(102, 213, 255, 0.10)',
  '--dsw-alias-border-l2': 'rgba(102, 213, 255, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(102, 213, 255, 0.12)',
  '--dsw-alias-border-l3': 'rgba(102, 213, 255, 0.32)',
  '--dsw-alias-border-l4': p.cyan,
  '--dsw-alias-border-inverted': 'rgba(233, 248, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(233, 248, 255, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dceef7',
  '--dsw-alias-label-primary-dimmed': '#89a4b6',
  '--dsw-alias-label-secondary': '#89a4b6',
  '--dsw-alias-label-tertiary': p.muted,
  '--dsw-alias-label-caption': '#557183',
  '--dsw-alias-label-dimmed': '#557183',
  // Text on the blue primary button: the prototype's + New Session is white.
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // 🔴 <b>The primary action is blue, neither red nor cyan.</b> In the prototype red appears only on the logo's outer
  // ring, the avatar and the current-mode border, while cyan is borders and emphasis; the one large solid button uses the
  // blue gradient. A red button would make "something went wrong" and "you may click" one visual language.
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': '#6ee0ff',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': p.blue2,
  '--dsw-alias-button-primary-dimmed': '#1b3f6b',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.panel2,
  '--dsw-alias-button-floating-fill': p.panel,
  '--dsw-alias-button-floating-hover': p.panel2,
  '--dsw-alias-button-ghost-active-fill': '#0d2940',
  '--dsw-alias-button-ghost-active-hover': '#112f4a',
  '--dsw-alias-button-ghost-active-border': 'rgba(102, 213, 255, 0.28)',
  // info means "go and see what is happening", so cyan — one step below blue, never competing with the primary action.
  '--dsw-alias-button-info-fill': '#0d4160',
  '--dsw-alias-button-info-hover': '#155a80',
  '--dsw-alias-button-tool-bar-fill': 'rgba(35, 217, 255, 0.12)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(35, 217, 255, 0.22)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(9, 23, 38, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(102, 213, 255, 0.08)',
  '--dsw-alias-interactive-bg-active': 'rgba(102, 213, 255, 0.16)',
  '--dsw-alias-interactive-bg-hover-solid': '#0d2940',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(39, 135, 255, 0.22)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(230, 49, 58, 0.2)',

  // ── Status colours ──
  // Green = ONLINE / READY (the prototype's `.online` and its `● COSMIC HERO ONLINE` pill).
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': p.green,
  '--dsw-alias-state-success-tertiary': '#0a2525',
  // Actions needing your confirmation use amber, the timer's middle band.
  '--dsw-alias-state-warn-primary': p.amber,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': '#ffe38a',
  '--dsw-alias-state-warn-tertiary': '#2a2410',
  // 🔴 Red appears here and nowhere else.
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#ef3943',
  // business is the harness's semantic for in-progress and active (read by the spinner and the running indicator).
  // Cyan it is: the colour of a hero at full energy, and the start of the timer's three.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#0a2a3a',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#04101a',
  '--dsw-alias-markdown-code-block-banner': p.panel,
  '--dsw-alias-markdown-inline-code': p.panel,
  '--dsw-alias-markdown-code-segment-selected': p.panel2,
  '--dsw-alias-markdown-code-segment-unselected': '#04101a',
  '--dsw-alias-markdown-citation': p.panel2,
  '--dsw-alias-markdown-placeholder': p.panel,
  '--dsw-alias-markdown-tag': p.panel,

  // ── Scrollbar ──
  // Translucent cyan rather than neutral grey: a scrollbar is permanently visible, and grey would pull the whole blue back to neutral.
  '--dsw-alias-scrollbar-bg-l1': 'rgba(102, 213, 255, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(102, 213, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(102, 213, 255, 0.28)',
  '--dsw-alias-scrollbar-hover-l2': p.cyan,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  // The sidebar sits one step deeper than the main area (the prototype's sidebar is a #06121e → #040c14 vertical gradient).
  '--dsw-specific-sidebar-fill': '#051019',
  '--dsw-specific-sidebar-nav-item-hover': '#0a1d2d',
  '--dsw-specific-sidebar-nav-item-active': '#112f4a',
  '--dsw-specific-sidebar-nav-item-active-accent': p.cyan,
  '--dsw-specific-bubble': p.panel,
  '--dsw-specific-bubble-highlight': p.panel2,
  '--dsw-specific-input-major': '#081522',
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#081522',
  '--dsw-specific-tip': p.panel2,
}
