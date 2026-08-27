/**
 * Twilight City's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype's Theme rules fix each colour's job:
 * **deep night-sky blue** as the ground, **sunset orange and purple-pink cloud** as the emotional emphasis, and **warm yellow only to light windows and buttons**.
 *
 * Three clauses, three uses:
 *   - **night-sky blue** (#0a1020 → #202d47): ground and the three panel levels, most of the interface;
 *   - **sunset orange** (#ff8a4c) with **purple** (#8459d9) and **pink** (#c96594): the emotional emphasis.
 *     ⚠️ Emotional emphasis is not a state colour — they carry atmosphere (borders, emphasis, the warmth of a hover),
 *     not whether a task succeeded;
 *   - **warm yellow** (#f1b56f): lights windows and buttons only, meaning the primary action and selected items.
 *
 * 🔴 So what carries running? **Sky blue** (#5b7be4 / #69a9ff). It is the only colour in the draft that is both on the palette and
 * unassigned any emotional duty, which leaves it free for state: a cool colour stands well clear of all this warmth and is recognised at a glance.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const TWILIGHT_PALETTE = {
  /** The night-sky ground. */
  bg: '#0a1020',
  bg2: '#121a2e',
  /** The three city panel levels. */
  surface: '#131c31',
  surface2: '#19243b',
  surface3: '#202d47',

  text: '#eef1f7',
  text2: '#c9d0de',
  text3: '#8992a5',

  /** Sky blue: reserved for running. */
  blue: '#69a9ff',
  sky: '#5b7be4',
  /** Cloud purple and pink: emotional emphasis, never state. */
  violet: '#8459d9',
  pink: '#c96594',
  /** Sunset orange: the strongest step of the emotional emphasis. */
  sunset: '#ff8a4c',
  /** Warm yellow: lights windows and buttons. */
  amber: '#f1b56f',
  danger: '#cc6a67',
} as const

const p = TWILIGHT_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const TWILIGHT_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // The scrim darkens towards the night-sky blue rather than pure black; black would wash this already dark blue to grey.
  '--dsw-alias-bg-mask-1': 'rgba(5, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(5, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(5, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(4, 6, 12, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(32, 45, 71, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.07)',

  // ── Borders ──
  // The prototype uses exactly two: `--line: rgba(255,255,255,.08)` (neutral) and `--line2: rgba(255,138,76,.14)` (sunset orange).
  // The neutral one carries all the layering; the orange appears only on frames that want a little warmth — which is what emotional emphasis means.
  '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.07)',
  '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.18)',
  '--dsw-alias-border-l4': p.sunset,
  '--dsw-alias-border-inverted': 'rgba(238, 241, 247, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(238, 241, 247, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e4eaf5',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#adb6c8',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#737d91',
  '--dsw-alias-label-dimmed': '#737d91',
  // White on solid warm yellow lacks contrast, so a near-black deep brown is paired with it.
  '--dsw-alias-label-primary-foreground': '#241505',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // The primary action is warm yellow (the prototype's Theme rules: warm yellow **lights windows and buttons** only).
  // Sunset orange is never a large solid button: it is an atmosphere colour, and spreading it would drag the picture's dusk into the interface and turn it noisy.
  '--dsw-alias-brand-primary': p.amber,
  '--dsw-alias-brand-text': p.amber,
  '--dsw-alias-brand-primary-invert': '#241505',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.amber,
  '--dsw-alias-button-primary-fill': p.amber,
  '--dsw-alias-button-primary-hover': '#f7c68a',
  '--dsw-alias-button-primary-dimmed': '#9a7241',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#273654',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 138, 76, 0.28)',
  '--dsw-alias-button-info-fill': '#27406e',
  '--dsw-alias-button-info-hover': '#2f4f86',
  '--dsw-alias-button-tool-bar-fill': 'rgba(241, 181, 111, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(241, 181, 111, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(19, 28, 49, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.05)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 138, 76, 0.22)',
  // The one place for the pink in those clouds: hovering a destructive action. The draft files pink under emotional emphasis,
  // and landing it on the one that deserves a second look is more useful than spreading it as decoration.
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(201, 101, 148, 0.24)',

  // ── Status colours ──
  // 🔴 Success uses teal-green #7fc9a8: the draft's palette has no green, but success must stay clear of both running (sky blue)
  // and the primary action (warm yellow). A low-saturation teal-green is the quietest choice available amid all that warmth.
  '--dsw-alias-state-success-primary': '#7fc9a8',
  '--dsw-alias-state-success-secondary': '#6fb797',
  '--dsw-alias-state-success-tertiary': '#12302a',
  // Warning: sunset orange. Here the emotional emphasis lands squarely on drawing attention.
  '--dsw-alias-state-warn-primary': p.sunset,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': '#ffc59a',
  '--dsw-alias-state-warn-tertiary': '#2e2013',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#dc8481',
  // business = in progress: sky blue. A cool colour stands well clear of all this warmth and is recognised at a glance.
  '--dsw-alias-state-business-primary': p.blue,
  '--dsw-alias-state-business-tertiary': '#16294d',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#080d1a',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#080d1a',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.2)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 255, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.amber,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.amber,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
