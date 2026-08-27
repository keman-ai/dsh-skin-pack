/**
 * Niulai Field's palette: the draft's 25 variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter paints
 * these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 * A harness redesign changes class names and layout but not what a semantic token means, so this layer lasts.
 *
 * The mapping is not colour-by-colour transcription but **semantic alignment**: the draft's `--surface/-2/-3` are
 * three container levels and so are the harness's `bg-layer-1/2/3`, so they line up. What the draft omits (scrims,
 * skeletons, scrollbars, toolbar buttons) is derived from the existing ramp, with the rule stated in each section.
 *
 * The ground deliberately keeps the field's warm green cast (`#171911`, not neutral grey), which is the first thing
 * that distinguishes Niulai from the built-in dark theme, whose `neutral-bluish` family leans blue.
 */

/** The raw colours from the draft's `:root`. Recolour here; everything below derives from these. */
export const NIULAI_PALETTE = {
  /** Primary orange: the cow's body colour. The draft <b>reserves it for active and running states</b>, never for the primary button. */
  orange: '#ff7a14',
  /** Deep orange: the pressed and hover state of the orange. */
  orangeDeep: '#e95e0a',
  /** Muzzle cream: the <b>primary action colour</b> (the handoff swatch's Primary action = #F0D28A). */
  muzzle: '#f0d28a',
  /** Grass / moss / straw: the field's three colours, used for dividers and desaturated decoration. */
  grass: '#737746',
  moss: '#4f5f32',
  straw: '#b49a54',
  /** Sky: the brightest neutral in the draft. */
  sky: '#e8e1da',

  bg: '#171911',
  bg2: '#1c1f16',
  surface: '#20231a',
  surface2: '#25291e',
  surface3: '#2b3022',
  line: '#373c2a',

  text: '#f3efe4',
  text2: '#b7b6a5',
  text3: '#858777',

  good: '#91b65b',
  warn: '#d9b45e',
  danger: '#db735b',
  blue: '#7f9fbf',
} as const

const p = NIULAI_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; unlisted tokens inherit the harness's built-in dark base. This is deliberate —
 * an incomplete override set is allowed (the README says explicitly there is no completeness check), and listing
 * everything would shut out built-in tokens added later.
 */
export const NIULAI_TOKENS: Record<string, string> = {
  // ── Three container levels ──
  // The draft's bg → surface → surface-2/3 rise step by step, isomorphic to the harness's base → layer-1/2/3.
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.surface,
  '--dsw-alias-bg-layer-2': p.surface2,
  '--dsw-alias-bg-layer-3': p.surface3,
  '--dsw-alias-bg-module-platform': p.surface2,
  '--dsw-alias-bg-overlay': p.surface3,
  '--dsw-alias-bg-multi-select': p.surface2,

  // The draft gives no scrim. The built-in uses transparent black; here it becomes a green-tinged dark,
  // so dimming behind a modal does not wash the field colours to grey.
  '--dsw-alias-bg-mask-1': 'rgba(10, 12, 7, 0.56)',
  '--dsw-alias-bg-mask-2': 'rgba(10, 12, 7, 0.24)',
  '--dsw-alias-bg-mask-3': 'rgba(10, 12, 7, 0.52)',
  '--dsw-alias-bg-mask-photo': 'rgba(8, 10, 6, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(43, 48, 34, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(243, 239, 228, 0.07)',

  // ── Borders ──
  // The draft has only two levels, --line (#373c2a) and --line-soft (white 6.5%), while the harness wants four:
  // l1 the weakest uses line-soft, l2 the solid line, and l3/l4 brighten towards grass, keeping one hue.
  '--dsw-alias-border-l1': 'rgba(243, 239, 228, 0.065)',
  '--dsw-alias-border-l2': p.line,
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(243, 239, 228, 0.08)',
  '--dsw-alias-border-l3': p.grass,
  '--dsw-alias-border-l4': p.straw,
  '--dsw-alias-border-inverted': 'rgba(243, 239, 228, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(243, 239, 228, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': p.text,
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': p.text2,
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': p.text3,
  '--dsw-alias-label-dimmed': p.grass,
  // Text on the primary block (dark on cream). It uses bg rather than pure black to keep the warmth consistent.
  '--dsw-alias-label-primary-foreground': p.bg,
  '--dsw-alias-label-primary-inverted': p.surface3,

  // ── Brand and primary button ──
  // 🔴 <b>The primary action is muzzle cream, not orange.</b> The draft's component language fixes the division:
  // 「orange reserved for active state / run state」「straw yellow for primary action」，
  // the handoff swatch marks Primary action as #F0D28A. Orange signals the cow in motion, not a button's default —
  // an orange primary button would make "running" and "clickable" one visual language, leaving state unreadable.
  '--dsw-alias-brand-primary': p.muzzle,
  '--dsw-alias-brand-text': p.muzzle,
  '--dsw-alias-brand-primary-invert': p.bg,
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.muzzle,
  '--dsw-alias-button-primary-fill': p.muzzle,
  '--dsw-alias-button-primary-hover': p.straw,
  '--dsw-alias-button-primary-dimmed': p.moss,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface3,
  '--dsw-alias-button-floating-fill': p.surface2,
  '--dsw-alias-button-floating-hover': p.surface3,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': p.grass,
  '--dsw-alias-button-ghost-active-border': p.grass,
  // The info button carries "go and see what is happening", which belongs to run state, so orange.
  '--dsw-alias-button-info-fill': p.orangeDeep,
  '--dsw-alias-button-info-hover': p.orange,
  '--dsw-alias-button-tool-bar-fill': 'rgba(115, 119, 70, 0.5)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(115, 119, 70, 0.66)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(32, 35, 26, 0.4)',

  // ── Interaction states ──
  // Hover uses warm white at low opacity, visible on any container level without drawing attention.
  '--dsw-alias-interactive-bg-hover': 'rgba(243, 239, 228, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(243, 239, 228, 0.13)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 122, 20, 0.22)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(219, 115, 91, 0.18)',

  // ── Status colours ──
  // The draft's four status colours map directly; tertiary (the light ground) is darkened within the same hue to container level.
  '--dsw-alias-state-success-primary': p.good,
  '--dsw-alias-state-success-secondary': p.good,
  '--dsw-alias-state-success-tertiary': '#2b3a1f',
  '--dsw-alias-state-warn-primary': p.warn,
  '--dsw-alias-state-warn-secondary': p.warn,
  '--dsw-alias-state-warn-label': p.straw,
  '--dsw-alias-state-warn-tertiary': '#3a3220',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': p.danger,
  // 🔴 business is the harness's semantic for in-progress and active (read by the spinner and the running indicator),
  // exactly where the draft reserves the orange: orange reserved for active state / run state.
  '--dsw-alias-state-business-primary': p.orange,
  '--dsw-alias-state-business-tertiary': '#3a2a18',

  // ── Markdown and code ──
  // Code blocks sit deeper than the body container, pressed to bg-2 so long listings do not glare.
  '--dsw-alias-markdown-code-block': p.bg2,
  '--dsw-alias-markdown-code-block-banner': p.surface2,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': p.bg2,
  '--dsw-alias-markdown-citation': p.surface3,
  '--dsw-alias-markdown-placeholder': p.surface2,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  // The grass family rather than neutral grey: a scrollbar is permanently visible, and grey would pull the whole warmth back to neutral.
  '--dsw-alias-scrollbar-bg-l1': p.line,
  '--dsw-alias-scrollbar-bg-l2': p.grass,
  '--dsw-alias-scrollbar-hover-l1': p.grass,
  '--dsw-alias-scrollbar-hover-l2': p.straw,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface3,
  '--dsw-alias-tooltip-bg': p.surface3,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  // The sidebar sits one step deeper than the main area (the draft's --bg-2), floating the conversation forward.
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.moss,
  '--dsw-specific-bubble': p.surface2,
  '--dsw-specific-bubble-highlight': p.surface3,
  '--dsw-specific-input-major': p.surface2,
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.surface3,
  '--dsw-specific-selector': p.surface3,
  '--dsw-specific-tip': p.surface3,
}
