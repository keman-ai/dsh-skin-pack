/**
 * Whale Girl Deep Sea's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype's Theme rules fix two things:
 * keep the primary colour in the **DeepSeek blue family**, with the whale girl as brand personification only, **never covering tool or code information**;
 * and character visuals belong to New Dive and the empty state, while Chat, Dive Path and Details **return to the real Harness working state**.
 *
 * So this palette is **one blue at several depths**, not an assortment of colours:
 *   - **deep-sea blue** (#03101f → #0f2d4a): ground and the three panel levels, taking up most of the interface;
 *   - **cool cyan** (#5ed7ff): borders, emphasis and running — the glowing line of the deep;
 *   - **DeepSeek Blue** (#4e7ff2): the primary action button, the brand colour itself;
 *   - **gold** (#e8ba72): the only warm colour anywhere, used in the prototype on the character's bow and a few accents.
 *     Here it gets exactly one place too: the end of the context bar. Spread wider it stops being a touch of warmth.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const FISH_PALETTE = {
  /** The deep-sea ground: a blue close to black. */
  bg: '#03101f',
  bg2: '#061a2d',
  /** Three panel levels. */
  surface: '#071a2d',
  surface2: '#0b2239',
  surface3: '#0f2d4a',

  text: '#eef8ff',
  text2: '#c7d8e8',
  text3: '#6f8da4',

  /** Cool cyan: borders, icons, emphasis and running. */
  cyan: '#5ed7ff',
  cyan2: '#9be8ff',
  /** DeepSeek Blue: the primary action. */
  blue: '#4e7ff2',
  navy: '#17426a',
  /** Foam white. */
  foam: '#e8fbff',
  aqua: '#55c9d6',
  /** 🔴 The only warm colour anywhere. */
  gold: '#e8ba72',
  ok: '#6fd6a6',
  danger: '#ff7c86',
} as const

const p = FISH_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const FISH_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // The scrim darkens towards deep-sea blue rather than pure black; black would wash this already dark blue to grey.
  '--dsw-alias-bg-mask-1': 'rgba(2, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 6, 12, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(15, 45, 74, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(118, 204, 255, 0.08)',

  // ── Borders ──
  // The prototype uses exactly two, `--line: rgba(118,204,255,.13)` and `--line2: rgba(94,215,255,.14)` —
  // **dark borders tinted cool cyan**, the glowing line of the deep. All layering on a dark ground rests on them, not on brightening the ground.
  '--dsw-alias-border-l1': 'rgba(118, 204, 255, 0.1)',
  '--dsw-alias-border-l2': 'rgba(118, 204, 255, 0.14)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(118, 204, 255, 0.11)',
  '--dsw-alias-border-l3': 'rgba(94, 215, 255, 0.28)',
  '--dsw-alias-border-l4': p.cyan,
  '--dsw-alias-border-inverted': 'rgba(238, 248, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(238, 248, 255, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dceefb',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#a8c0d4',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#5c7a91',
  '--dsw-alias-label-dimmed': '#5c7a91',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // The primary action is DeepSeek Blue (the prototype's dive button and `+ New Dive` gradients are both built on it).
  // Cool cyan is never a solid button: here it is the language of borders and state, and a large fill would break the deep's quiet.
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': p.cyan,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': '#6791f5',
  '--dsw-alias-button-primary-dimmed': '#2d4d9e',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#143a5e',
  '--dsw-alias-button-ghost-active-border': 'rgba(94, 215, 255, 0.28)',
  '--dsw-alias-button-info-fill': p.navy,
  '--dsw-alias-button-info-hover': '#1d5384',
  '--dsw-alias-button-tool-bar-fill': 'rgba(94, 215, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(94, 215, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(7, 26, 45, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(118, 204, 255, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(118, 204, 255, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(78, 127, 242, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(255, 124, 134, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.ok,
  '--dsw-alias-state-success-secondary': '#7fdcb2',
  '--dsw-alias-state-success-tertiary': '#0c2f2a',
  // The prototype gives no amber (it drew only the happy path), so one is derived towards that touch of gold —
  // the last thing this skin should contain is anything that glares.
  '--dsw-alias-state-warn-primary': p.gold,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#f2d3a2',
  '--dsw-alias-state-warn-tertiary': '#2c2418',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#ff9aa2',
  // business = in progress: cool cyan. The brightest thing in the deep without glaring.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#0d3550',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#020c18',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#020c18',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(118, 204, 255, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(118, 204, 255, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(118, 204, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.cyan,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.cyan,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
