/**
 * AI Work Mode's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * 🔴 This skin differs structurally from the earlier ones: **its ground is not a solid colour but a full gradient**
 * (`linear-gradient(180deg,#071936 0%,#0a2a60 62%,#2f79ef 100%)` with a blue glow along the top),
 * and every panel is **translucent glass** floating on it (the prototype's `--panel: rgba(10,24,52,.56)`,
 * with the sidebar at `rgba(5,15,34,.42)` plus `backdrop-filter: blur(14px)`).
 *
 * So many token values here are **rgba** rather than solid — a token is just a CSS colour, and transparency is allowed.
 * The gradient itself is drawn on the layer that carries the layout (see aiwork.module.css), and the glass panels let it through.
 *
 * The one value kept solid is `--dsw-alias-bg-base`: it is used to occlude (the fade above the composer, dropdown backings),
 * where transparency would let the content below show through. It takes the dark colour at the top of the gradient.
 *
 * One more: **the primary action is deep blue on white**. On this blue, white is the only thing stronger than blue — the prototype's
 * `＋ New Session`, its launch button and its start button are all `background:#fff; color:#16386c`.
 * A blue primary button drowns into the background.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const WORK_PALETTE = {
  /** The top of the gradient: deep-ocean blue. Also the one step that must stay solid. */
  bg: '#071936',
  /** The middle of the gradient. */
  bg2: '#0a2a60',
  /** The bottom of the gradient: bright blue — this skin grows lighter downwards, the opposite of a conventional dark theme. */
  bg3: '#2f79ef',

  text: '#f7fbff',
  muted: '#b8c9df',

  /** The primary action's solid colour: white, with deep blue text on top. */
  white: '#ffffff',
  /** The text colour on a white button. */
  onWhite: '#16386c',

  blue: '#4284ff',
  cyan: '#7ad9ff',
  green: '#61d89a',
} as const

const p = WORK_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const WORK_TOKENS: Record<string, string> = {
  // ── Container hierarchy: glass ──
  // base stays solid (it has to occlude); the other three levels are translucent white or deep blue so the gradient shows through.
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': 'rgba(5, 15, 34, 0.42)',
  '--dsw-alias-bg-layer-2': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-bg-layer-3': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-bg-module-platform': 'rgba(10, 24, 52, 0.56)',
  '--dsw-alias-bg-overlay': 'rgba(7, 20, 44, 0.94)',
  '--dsw-alias-bg-multi-select': 'rgba(255, 255, 255, 0.1)',

  // The scrim darkens towards deep-ocean blue rather than pure black.
  '--dsw-alias-bg-mask-1': 'rgba(3, 10, 24, 0.62)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 10, 24, 0.3)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 10, 24, 0.52)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 7, 18, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(37, 84, 168, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.08)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(255,255,255,.12)` — **translucent white**, not a coloured border.
  // It outlines the glass panels, and is half of what makes them read as glass.
  '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.22)',
  '--dsw-alias-border-l4': 'rgba(255, 255, 255, 0.32)',
  '--dsw-alias-border-inverted': 'rgba(23, 59, 113, 0.16)',
  '--dsw-alias-border-inverted2': 'rgba(23, 59, 113, 0.26)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#d9e9ff',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#d2dfef',
  '--dsw-alias-label-tertiary': '#9db0c7',
  '--dsw-alias-label-caption': '#8198b3',
  '--dsw-alias-label-dimmed': '#8198b3',
  // 🔴 Text on the primary button is **deep blue**, because the button is white.
  '--dsw-alias-label-primary-foreground': p.onWhite,
  '--dsw-alias-label-primary-inverted': p.onWhite,

  // ── Brand and primary button ──
  // 🔴 The primary action is white. See the file header: on this blue, white is the only thing stronger than blue.
  '--dsw-alias-brand-primary': p.white,
  // The brand colour on text cannot also be white (body text is already near-white), so a bright cyan-blue separates them.
  '--dsw-alias-brand-text': p.cyan,
  '--dsw-alias-brand-primary-invert': p.onWhite,
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.white,
  '--dsw-alias-button-primary-fill': p.white,
  '--dsw-alias-button-primary-hover': '#e8f2ff',
  '--dsw-alias-button-primary-dimmed': 'rgba(255, 255, 255, 0.42)',
  '--dsw-alias-button-contrast-fill': p.white,
  '--dsw-alias-button-elevated-fill': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-button-floating-fill': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-button-floating-hover': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-button-ghost-active-fill': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-button-ghost-active-hover': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 255, 255, 0.28)',
  '--dsw-alias-button-info-fill': 'rgba(66, 132, 255, 0.34)',
  '--dsw-alias-button-info-hover': 'rgba(66, 132, 255, 0.5)',
  '--dsw-alias-button-tool-bar-fill': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0)',

  // ── Interaction states ──
  // Hover on a glass interface means adding a little more white, in the same language as the panels themselves.
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-interactive-bg-hover-solid': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(66, 132, 255, 0.28)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(240, 100, 100, 0.24)',

  // ── Status colours ──
  // The green comes from the prototype's `● HARNESS READY` pill and its `.online`.
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#9ceabb',
  '--dsw-alias-state-success-tertiary': 'rgba(24, 90, 52, 0.24)',
  // The prototype gives no amber or red (it drew only the happy path), so one of each is derived in this skin's brightness register — on deep blue they must be bright enough to read.
  '--dsw-alias-state-warn-primary': '#ffd166',
  '--dsw-alias-state-warn-secondary': '#ffd166',
  '--dsw-alias-state-warn-label': '#ffe6a8',
  '--dsw-alias-state-warn-tertiary': 'rgba(120, 88, 20, 0.28)',
  '--dsw-alias-state-error-primary': '#ff7b7b',
  '--dsw-alias-state-error-secondary': '#ff9a9a',
  // business = in progress. Bright cyan: the most visible thing in all this blue, without competing with the white primary action.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': 'rgba(122, 217, 255, 0.18)',

  // ── Markdown and code ──
  // Code blocks sit one step deeper than the panels (the prototype's `.toolbody` is rgba(5,14,32,.45)), so long code does not glare.
  '--dsw-alias-markdown-code-block': 'rgba(5, 14, 32, 0.45)',
  '--dsw-alias-markdown-code-block-banner': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-markdown-inline-code': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-markdown-code-segment-selected': 'rgba(255, 255, 255, 0.14)',
  '--dsw-alias-markdown-code-segment-unselected': 'rgba(5, 14, 32, 0.45)',
  '--dsw-alias-markdown-citation': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-markdown-placeholder': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-markdown-tag': 'rgba(255, 255, 255, 0.1)',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.22)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 255, 255, 0.24)',
  '--dsw-alias-scrollbar-hover-l2': 'rgba(255, 255, 255, 0.4)',

  // ── Overlays ──
  // Overlays must be **opaque**: a translucent popover floating on the gradient reads the content beneath it too, and becomes illegible.
  '--dsw-alias-toast-bg': '#0d2247',
  '--dsw-alias-tooltip-bg': '#0d2247',

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': 'rgba(5, 15, 34, 0.42)',
  '--dsw-specific-sidebar-nav-item-hover': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-sidebar-nav-item-active': 'rgba(255, 255, 255, 0.1)',
  '--dsw-specific-sidebar-nav-item-active-accent': p.white,
  '--dsw-specific-bubble': 'rgba(255, 255, 255, 0.08)',
  '--dsw-specific-bubble-highlight': 'rgba(255, 255, 255, 0.14)',
  '--dsw-specific-input-major': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-login-input': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-menu': '#0d2247',
  '--dsw-specific-selector': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-tip': 'rgba(255, 255, 255, 0.1)',
}
