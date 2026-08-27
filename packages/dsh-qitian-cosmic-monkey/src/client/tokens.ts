/**
 * Qitian Starscape's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype's Theme rules state the ratio as a single figure, and it is this skin's hardest constraint:
 * **64% midnight cosmic blue / 16% blue-black surface / 9% sunset ember gold / 6% starlight blue / 4% misty grey text / 1% danger red**.
 *
 * Translated into use:
 *   - **midnight cosmic blue and blue-black surface** (#070b13 → #16213a): ground and the three panel levels, eight tenths of the interface;
 *   - **ember gold** (#d39a52 / #f1bc70): borders, the primary action, the wordmark — the sunrise light in the picture;
 *   - **starlight blue** (#315fae / #6e94e9): for **running** alone. It is the starscape half;
 *   - **misty grey** (#c6bcaa / #847e73): secondary text. Note that it is warm, not neutral —
 *     a pure grey looks dirty against this warm gold;
 *   - **red** (#ca5a49): danger and failure alone. One per cent.
 *
 * The draft also has a purple (`--purple: #765799`, the nebula). It appears in the prototype only on decorative gradients
 * and carries no meaning, so it is used nowhere here.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const QITIAN_PALETTE = {
  /** The starscape ground: a cosmic blue close to black. */
  bg: '#070b13',
  bg2: '#0a1020',
  /** Three blue-black surface levels. */
  surface: '#0c1424',
  surface2: '#111b30',
  surface3: '#16213a',

  /** The text is warm-toned, not neutral grey. */
  text: '#efe9dc',
  text2: '#c6bcaa',
  text3: '#847e73',

  /** Ember gold: borders, the primary action, the wordmark. */
  gold: '#d39a52',
  gold2: '#f1bc70',
  /** Starlight blue: for running alone. */
  blue: '#315fae',
  blue2: '#6e94e9',
  /** Nebula purple. The prototype uses it only on decorative gradients, and it is used nowhere here (see the file header). */
  purple: '#765799',
  ember: '#d97a3c',
  red: '#ca5a49',
} as const

const p = QITIAN_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const QITIAN_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // The scrim darkens towards cosmic blue rather than pure black; black would wash this already dark blue to grey.
  '--dsw-alias-bg-mask-1': 'rgba(3, 5, 10, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 5, 10, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 5, 10, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 4, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(22, 33, 58, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(240, 188, 112, 0.08)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(240,188,112,.14)` — a **dark border tinted ember gold**.
  // All layering on a dark ground rests on it, not on brightening the ground.
  '--dsw-alias-border-l1': 'rgba(240, 188, 112, 0.1)',
  '--dsw-alias-border-l2': 'rgba(240, 188, 112, 0.14)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(240, 188, 112, 0.11)',
  '--dsw-alias-border-l3': 'rgba(240, 188, 112, 0.28)',
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(239, 233, 220, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(239, 233, 220, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e6e5e0',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#b0a794',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#6f6a61',
  '--dsw-alias-label-dimmed': '#6f6a61',
  // White lacks contrast on solid gold, so a near-black deep brown is used instead.
  '--dsw-alias-label-primary-foreground': '#211405',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // The primary action is ember gold (the prototype's send button). Starlight blue is never a solid button:
  // here it is the language of state, and a large fill would flatten the starscape into a blue screen.
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.gold2,
  '--dsw-alias-brand-primary-invert': '#211405',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.gold2,
  '--dsw-alias-button-primary-dimmed': '#8a6634',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#1c2a48',
  '--dsw-alias-button-ghost-active-border': 'rgba(240, 188, 112, 0.28)',
  '--dsw-alias-button-info-fill': '#1e3564',
  '--dsw-alias-button-info-hover': '#274279',
  '--dsw-alias-button-tool-bar-fill': 'rgba(240, 188, 112, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(240, 188, 112, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(12, 20, 36, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(240, 188, 112, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(240, 188, 112, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(211, 154, 82, 0.22)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(202, 90, 73, 0.22)',

  // ── Status colours ──
  // 🔴 Success uses ember orange (#d97a3c, one step brighter) rather than green: this draft's palette has no green,
  // and forcing one would break both the 9% gold and the 64% cosmic blue ratios. Luminance and hue separate it from the primary gold.
  '--dsw-alias-state-success-primary': '#e0a06a',
  '--dsw-alias-state-success-secondary': p.ember,
  '--dsw-alias-state-success-tertiary': '#2a1c10',
  '--dsw-alias-state-warn-primary': p.gold2,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#f6d29a',
  '--dsw-alias-state-warn-tertiary': '#2c2314',
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#dd7565',
  // business = in progress: starlight blue. It is the starscape half, balancing gold's sunrise half.
  '--dsw-alias-state-business-primary': p.blue2,
  '--dsw-alias-state-business-tertiary': '#152a4d',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#050810',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#050810',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(240, 188, 112, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(240, 188, 112, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(240, 188, 112, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
