/**
 * Cyber Tao Temple's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * 🔴 The prototype fixes this skin's restraint in its own notes:
 *   translate it visually into a cyber Tao temple: **an obsidian ground, bronze borders, rice-paper white text, cinnabar for emphasis, jade for state**;
 *   the temple's character must run deep **without swallowing the product's usability** — buttons, cards and information
 *   hierarchy stay those of a modern development tool, and only atmosphere, wording, texture and motion take on the temple.
 *
 * Each of the five materials has its own place; never let them cross:
 *   - **obsidian** (#0a0d10): ground and the three panel levels;
 *   - **bronze / rice paper** (rgba(228,207,168,.12)): every border — this skin's whole sense of material rests on that line;
 *   - **rice-paper white** (#efe7d7): body text — not pure white, and warm;
 *   - **cinnabar** (#b94235): emphasis — the selected session, and nothing else;
 *   - **jade** (#6e9788): **state**. The prototype's own words are "jade for state", so it lands on running.
 * The primary action is **red gold** (`.send`'s `linear-gradient(180deg,#d8b977,#b89252)` with #261f14 text).
 */

/** The raw colours from the prototype's `:root`. */
export const TAO_PALETTE = {
  /** Obsidian. */
  bg: '#0a0d10',
  bg2: '#0f1317',
  surface: '#13181d',
  surface2: '#171d22',
  surface3: '#1d242a',

  /** Rice-paper white for body text, and its secondary. */
  text: '#efe7d7',
  text2: '#b9b0a1',
  text3: '#8a857c',

  /** Three bronze steps: borders and desaturated metal surfaces. */
  bronze: '#8f6d42',
  bronzeDeep: '#6d5230',
  bronzeLight: '#b59260',
  /** Red gold: the primary action. */
  gold: '#c8a768',
  goldLight: '#e0c58f',
  /** Cinnabar: emphasis, only ever for the selected one. */
  cinnabar: '#b94235',
  /** Jade: the state colour. */
  jade: '#6e9788',

  ok: '#7ca06e',
  warn: '#c8a768',
  danger: '#be665c',
} as const

const p = TAO_PALETTE

/** The token table handed to `ctx.theme.register()`. Only what changes is written; the rest inherits the built-in dark base. */
export const TAO_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.surface,
  '--dsw-alias-bg-layer-2': p.surface2,
  '--dsw-alias-bg-layer-3': p.surface3,
  '--dsw-alias-bg-module-platform': p.surface2,
  '--dsw-alias-bg-overlay': p.surface3,
  '--dsw-alias-bg-multi-select': '#22282f',

  '--dsw-alias-bg-mask-1': 'rgba(6, 8, 10, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(6, 8, 10, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(6, 8, 10, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(4, 6, 7, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(45, 37, 25, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(228, 207, 168, 0.07)',

  // ── Borders: the bronze / rice-paper line, where this skin's whole sense of material lives ──
  '--dsw-alias-border-l1': 'rgba(228, 207, 168, 0.08)',
  '--dsw-alias-border-l2': 'rgba(228, 207, 168, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(228, 207, 168, 0.1)',
  '--dsw-alias-border-l3': 'rgba(228, 207, 168, 0.22)',
  '--dsw-alias-border-l4': p.bronzeLight,
  '--dsw-alias-border-inverted': 'rgba(239, 231, 215, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(239, 231, 215, 0.1)',

  // ── Text: rice-paper white, not pure white ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': p.text,
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': p.text2,
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#7d786f',
  '--dsw-alias-label-dimmed': '#7d786f',
  // Deep text on red gold (the prototype's `.send` uses `color:#261f14`).
  '--dsw-alias-label-primary-foreground': '#261f14',
  '--dsw-alias-label-primary-inverted': p.surface3,

  // ── Brand and primary button: red gold ──
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.goldLight,
  '--dsw-alias-brand-primary-invert': '#261f14',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.goldLight,
  '--dsw-alias-button-primary-dimmed': p.bronzeDeep,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface3,
  '--dsw-alias-button-floating-fill': p.surface2,
  '--dsw-alias-button-floating-hover': p.surface3,
  '--dsw-alias-button-ghost-active-fill': '#1d242a',
  '--dsw-alias-button-ghost-active-hover': '#242c33',
  '--dsw-alias-button-ghost-active-border': 'rgba(228, 207, 168, 0.24)',
  // info uses bronze: a step below red gold, never competing with the primary action.
  '--dsw-alias-button-info-fill': p.bronzeDeep,
  '--dsw-alias-button-info-hover': p.bronze,
  '--dsw-alias-button-tool-bar-fill': 'rgba(200, 167, 104, 0.12)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(200, 167, 104, 0.22)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(19, 24, 29, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(228, 207, 168, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(228, 207, 168, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(185, 66, 53, 0.2)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(190, 102, 92, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.ok,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': 'rgba(110, 151, 136, 0.16)',
  '--dsw-alias-state-warn-primary': p.warn,
  '--dsw-alias-state-warn-secondary': p.goldLight,
  '--dsw-alias-state-warn-label': p.goldLight,
  '--dsw-alias-state-warn-tertiary': '#2a2318',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': p.cinnabar,
  // 🔴 business = in progress: jade. The prototype's own words are "jade for state" — cinnabar is emphasis (the
  // selected row), not the running state; swapping them would make running and selected the same signal.
  '--dsw-alias-state-business-primary': p.jade,
  '--dsw-alias-state-business-tertiary': 'rgba(110, 151, 136, 0.16)',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#0c1013',
  '--dsw-alias-markdown-code-block-banner': p.surface2,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#0c1013',
  '--dsw-alias-markdown-citation': p.surface3,
  '--dsw-alias-markdown-placeholder': p.surface2,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar: bronze, never neutral grey ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(228, 207, 168, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(228, 207, 168, 0.22)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(228, 207, 168, 0.24)',
  '--dsw-alias-scrollbar-hover-l2': p.bronzeLight,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface3,
  '--dsw-alias-tooltip-bg': p.surface3,

  // ── The specific layer ──
  '--dsw-specific-sidebar-fill': '#0c1013',
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.cinnabar,
  '--dsw-specific-bubble': p.surface2,
  '--dsw-specific-bubble-highlight': p.surface3,
  '--dsw-specific-input-major': p.surface2,
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.surface3,
  '--dsw-specific-selector': p.surface2,
  '--dsw-specific-tip': p.surface3,
}
