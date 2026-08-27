/**
 * Cosmic Opera's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * 🔴 The Theme rules in the prototype's Appearance panel say:
 *   this leans **cosmic opera and the epic** — the visual weight sits on the spiral galaxy, the planetary arc, the deep-space glow and the narrative of exploration,
 *   **while outside New Mission the interface keeps the real Harness product structure and density**.
 *
 * So the approach here is: **all the epic weight goes on the cover** while the interface stays restrained — a deep blue ground with only three accent steps
 * in violet, blue and teal, and a warm tone (#ffb775) reserved for states that need attention. The primary action is solid violet
 * (`.hero-send`'s `linear-gradient(180deg,#977cff,#695de3)`).
 *
 * Compared with its sibling draft Cosmic Exploration, this one adds a **teal #75d4cb**: the prototype puts it on telemetry values,
 * and here it lands on running so that state stays clear of both the blue data and the violet primary action.
 */

/** The raw colours from the prototype's `:root` and its Appearance swatches. */
export const OPERA_PALETTE = {
  /** Space: deep blue space, the lowest ground. */
  bg: '#050814',
  bg2: '#081022',
  /** The three raised surfaces. */
  surface: '#0a1020',
  surface2: '#0e1730',
  /** Panel Blue。 */
  surface3: '#121d3b',

  text: '#edf2fb',
  text2: '#bfc9df',
  text3: '#73809d',

  /** Telemetry: cool blue, used for borders and data. */
  blue: '#79c2ff',
  blue2: '#9dd8ff',
  /** Nebula Violet: <b>the primary action colour</b>. */
  violet: '#8e73ff',
  violet2: '#b594ff',
  /** The step of violet used solid on the primary button. */
  violetSolid: '#7a63eb',
  /** Teal: used on telemetry values in the prototype, given to running here. */
  teal: '#75d4cb',
  /** 🔴 Warm: important states only, never an ordinary button. */
  amber: '#ffb775',

  ok: '#71cb9e',
  warn: '#ffb775',
  danger: '#ff7e7e',
} as const

const p = OPERA_PALETTE

/** The token table handed to `ctx.theme.register()`. Only what changes is written; the rest inherits the built-in dark base. */
export const OPERA_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.surface,
  '--dsw-alias-bg-layer-2': p.surface2,
  '--dsw-alias-bg-layer-3': p.surface3,
  '--dsw-alias-bg-module-platform': p.surface2,
  '--dsw-alias-bg-overlay': p.surface3,
  '--dsw-alias-bg-multi-select': '#152248',

  // The scrim darkens towards space blue rather than pure black — black would wash the nebula's blue-violet to grey.
  '--dsw-alias-bg-mask-1': 'rgba(2, 5, 12, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 5, 12, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 5, 12, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 3, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(21, 34, 72, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(155, 214, 255, 0.08)',

  // ── Borders ──
  // The prototype has two lines: a cool blue `rgba(130,170,255,.12)` and a nebula violet `rgba(176,140,255,.14)`.
  // The lower two levels take cool blue (most of the layering) and the upper two take violet (emphasis borders).
  '--dsw-alias-border-l1': 'rgba(146, 175, 255, 0.09)',
  '--dsw-alias-border-l2': 'rgba(146, 175, 255, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(146, 175, 255, 0.1)',
  '--dsw-alias-border-l3': 'rgba(171, 124, 255, 0.28)',
  '--dsw-alias-border-l4': p.violet2,
  '--dsw-alias-border-inverted': 'rgba(237, 242, 251, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 242, 251, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dfe7f3',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': p.text2,
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#71809d',
  '--dsw-alias-label-dimmed': '#71809d',
  // Dark text sits on the violet ground (the prototype's `.hero-send` uses `color:#0d0a21`).
  '--dsw-alias-label-primary-foreground': '#120c25',
  '--dsw-alias-label-primary-inverted': p.surface3,

  // ── Brand and primary button ──
  // 🔴 The primary action is **nebula violet**, not the warm tone. The rule reads: a small amount of warm colour, for important states and the mission button only —
  // and that mission button is the hero's START EXPLORATION, which the prototype draws with the violet gradient;
  // the warm tone appears only on telemetry and warnings. Spreading it across the primary button would destroy its meaning of "look here".
  '--dsw-alias-brand-primary': p.violetSolid,
  '--dsw-alias-brand-text': p.violet2,
  '--dsw-alias-brand-primary-invert': '#120c25',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.violetSolid,
  '--dsw-alias-button-primary-fill': p.violetSolid,
  '--dsw-alias-button-primary-hover': '#977cff',
  '--dsw-alias-button-primary-dimmed': '#3a3376',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface3,
  '--dsw-alias-button-floating-fill': p.surface2,
  '--dsw-alias-button-floating-hover': p.surface3,
  '--dsw-alias-button-ghost-active-fill': '#152248',
  '--dsw-alias-button-ghost-active-hover': '#1b2b58',
  '--dsw-alias-button-ghost-active-border': 'rgba(155, 214, 255, 0.24)',
  '--dsw-alias-button-info-fill': '#1c3a6b',
  '--dsw-alias-button-info-hover': '#2a5290',
  '--dsw-alias-button-tool-bar-fill': 'rgba(114, 184, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(114, 184, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(11, 19, 41, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(155, 214, 255, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(155, 214, 255, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#152248',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(140, 116, 255, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(255, 123, 123, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.ok,
  '--dsw-alias-state-success-secondary': p.ok,
  '--dsw-alias-state-success-tertiary': '#10281f',
  // 🔴 The warm tone's legitimate use: states that need your attention.
  '--dsw-alias-state-warn-primary': p.warn,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': '#ffd3a4',
  '--dsw-alias-state-warn-tertiary': '#2c2114',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#ff9a9a',
  // business = in progress: teal. Clear of both the blue data and the violet primary action.
  '--dsw-alias-state-business-primary': p.teal,
  '--dsw-alias-state-business-tertiary': '#0d3330',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#070c1a',
  '--dsw-alias-markdown-code-block-banner': p.surface2,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#070c1a',
  '--dsw-alias-markdown-citation': p.surface3,
  '--dsw-alias-markdown-placeholder': p.surface2,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(130, 170, 255, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(176, 140, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(130, 170, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.violet2,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface3,
  '--dsw-alias-tooltip-bg': p.surface3,

  // ── The specific layer ──
  '--dsw-specific-sidebar-fill': '#070d1c',
  '--dsw-specific-sidebar-nav-item-hover': '#121e3a',
  '--dsw-specific-sidebar-nav-item-active': '#152248',
  '--dsw-specific-sidebar-nav-item-active-accent': p.violet2,
  '--dsw-specific-bubble': p.surface2,
  '--dsw-specific-bubble-highlight': p.surface3,
  '--dsw-specific-input-major': '#0f1a33',
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.surface3,
  '--dsw-specific-selector': '#0f1a33',
  '--dsw-specific-tip': p.surface3,
}
