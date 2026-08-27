/**
 * Whale Wave Banner's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale. A harness redesign changes
 * class names and layout but not what a semantic token means, so this layer lasts.
 *
 * 🔴 Point 4 of the implementation notes in the prototype's Appearance panel is binding:
 * keep the colours as far as possible to **DeepSeek blue, white and a very pale grey-blue**, staying light, clean and on-brand.
 * So this skin has almost no fifth colour — green appears once, for online and success; a warm tone appears once, on actions needing
 * confirmation; everything else is a shade of blue or white. **The restraint is the design**, so add no decorative colours.
 */

/** The raw colours from the prototype's `:root` and Appearance swatch. Recolour here; everything below derives from these. */
export const WAVE_PALETTE = {
  /** Primary: DeepSeek blue, the primary action colour. */
  brand: '#4969ef',
  /** Accent: the top of the gradient button, and the hover state. */
  brand2: '#6c8cff',
  /** Soft Blue: a pale blue for weak emphasis and stronger borders. */
  brand3: '#9dbbff',

  /** Background: the app ground (a very pale grey-blue). */
  bg: '#eef4ff',
  /** The first paper level. */
  panel: '#f9fbff',
  /** Card white. */
  panel2: '#ffffff',
  /** The pale blue of the selected state (the prototype's `.session.active`). */
  selected: '#e6edff',
  /** The pale blue of tool output blocks (the prototype's `.toolbody`). */
  code: '#f7faff',

  /** Primary text. */
  text: '#20345f',
  /** Secondary text. */
  muted: '#7f8eaa',
  /** Tertiary text and captions. */
  muted2: '#8b99b3',
  /** The weakest level. */
  muted3: '#9ba7bc',

  /** Online: the only green, reserved for online and success. */
  green: '#69bd78',
} as const

const p = WAVE_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; unlisted tokens inherit the harness's built-in light base.
 */
export const WAVE_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // The prototype is a very pale grey-blue ground with white cards: bg → panel → white, matching the harness's base → layer-1/2/3.
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': '#f4f8ff',
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': p.selected,

  // Scrim: the prototype's Settings dialog uses rgba(31,51,98,.20) with a 4px blur — very light, since a heavy scrim dirties a light interface.
  '--dsw-alias-bg-mask-1': 'rgba(31, 51, 98, 0.2)',
  '--dsw-alias-bg-mask-2': 'rgba(31, 51, 98, 0.1)',
  '--dsw-alias-bg-mask-3': 'rgba(31, 51, 98, 0.18)',
  '--dsw-alias-bg-mask-photo': 'rgba(20, 34, 68, 0.86)',
  '--dsw-alias-bg-mask-drop': 'rgba(214, 228, 255, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(67, 102, 205, 0.08)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(67,102,205,.13)` — a very pale border tinted blue, and the main source of the lightness.
  // All four levels follow its hue, with only l3/l4 rising to a solid pale blue.
  '--dsw-alias-border-l1': 'rgba(67, 102, 205, 0.09)',
  '--dsw-alias-border-l2': 'rgba(67, 102, 205, 0.13)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(67, 102, 205, 0.11)',
  '--dsw-alias-border-l3': '#d9e3ff',
  '--dsw-alias-border-l4': p.brand3,
  '--dsw-alias-border-inverted': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0.26)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#3556c7',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#43557a',
  '--dsw-alias-label-tertiary': p.muted,
  '--dsw-alias-label-caption': p.muted2,
  '--dsw-alias-label-dimmed': p.muted3,
  // Text on the blue primary button: white.
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel,

  // ── Brand and primary button ──
  // The primary action is DeepSeek blue (the prototype's New chat, Start task and Send all use this blue gradient).
  // Green is explicitly reserved for the online state (the swatch is literally named Online) and never used for actions.
  '--dsw-alias-brand-primary': p.brand,
  '--dsw-alias-brand-text': '#3556c7',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.brand,
  '--dsw-alias-button-primary-fill': p.brand,
  '--dsw-alias-button-primary-hover': p.brand2,
  '--dsw-alias-button-primary-dimmed': '#b9c6f7',
  '--dsw-alias-button-contrast-fill': '#20345f',
  '--dsw-alias-button-elevated-fill': p.panel2,
  '--dsw-alias-button-floating-fill': p.panel2,
  '--dsw-alias-button-floating-hover': '#f4f7ff',
  '--dsw-alias-button-ghost-active-fill': p.selected,
  '--dsw-alias-button-ghost-active-hover': '#d9e3ff',
  '--dsw-alias-button-ghost-active-border': '#d9e3ff',
  '--dsw-alias-button-info-fill': '#3556c7',
  '--dsw-alias-button-info-hover': p.brand,
  '--dsw-alias-button-tool-bar-fill': 'rgba(73, 105, 239, 0.08)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(73, 105, 239, 0.16)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0)',

  // ── Interaction states ──
  // A light ground cannot hover by adding white (it would be invisible), so a very low-opacity blue is laid over instead.
  '--dsw-alias-interactive-bg-hover': 'rgba(67, 102, 205, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(67, 102, 205, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.selected,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(73, 105, 239, 0.14)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(214, 96, 88, 0.14)',

  // ── Status colours ──
  // The green comes straight from the Online swatch; the prototype gives no amber or red (it has no failure or confirmation state),
  // so a low-saturation value is derived for each in the light, clean register — the less they appear in this skin, the better.
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#65b270',
  '--dsw-alias-state-success-tertiary': '#e6f4e8',
  '--dsw-alias-state-warn-primary': '#e0a63e',
  '--dsw-alias-state-warn-secondary': '#e0a63e',
  '--dsw-alias-state-warn-label': '#96681c',
  '--dsw-alias-state-warn-tertiary': '#fdf6e8',
  '--dsw-alias-state-error-primary': '#d66058',
  '--dsw-alias-state-error-secondary': '#c14c45',
  // business is the harness's semantic for in-progress and active (read by the spinner and the running indicator).
  // A brighter step of the brand blue: this skin is blue and white only, and the running state needs no fifth colour.
  '--dsw-alias-state-business-primary': p.brand2,
  '--dsw-alias-state-business-tertiary': '#e6edff',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': p.code,
  '--dsw-alias-markdown-code-block-banner': '#f3f7ff',
  '--dsw-alias-markdown-inline-code': '#f3f7ff',
  '--dsw-alias-markdown-code-segment-selected': p.selected,
  '--dsw-alias-markdown-code-segment-unselected': p.code,
  '--dsw-alias-markdown-citation': p.selected,
  '--dsw-alias-markdown-placeholder': '#f3f7ff',
  '--dsw-alias-markdown-tag': '#f3f7ff',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(67, 102, 205, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(73, 105, 239, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(67, 102, 205, 0.24)',
  '--dsw-alias-scrollbar-hover-l2': p.brand3,

  // ── Overlays ──
  // In a light UI a tooltip must invert to white on dark, or it is indistinguishable from the white card it floats over.
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': '#27418a',

  // ── The specific layer: hooks the harness leaves for individual parts ──
  // The prototype's sidebar is a #f8fbff → #f0f5fd vertical gradient; a token can only hold one colour, so the midpoint is used and the gradient is added in the stylesheet.
  '--dsw-specific-sidebar-fill': '#f4f8ff',
  '--dsw-specific-sidebar-nav-item-hover': '#edf2ff',
  '--dsw-specific-sidebar-nav-item-active': p.selected,
  '--dsw-specific-sidebar-nav-item-active-accent': p.brand,
  '--dsw-specific-bubble': p.panel2,
  '--dsw-specific-bubble-highlight': '#f3f7ff',
  '--dsw-specific-input-major': '#fbfdff',
  '--dsw-specific-login-input': p.code,
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': p.panel2,
  '--dsw-specific-tip': '#f3f7ff',
}
