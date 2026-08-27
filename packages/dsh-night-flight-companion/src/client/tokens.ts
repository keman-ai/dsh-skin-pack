/**
 * 夜航同行的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * This skin's character is **quiet**: the ground is pressed to a near-black night blue and every border carries a hint of moonlit cyan
 * (`rgba(141,198,255,.16)`), with everything held low in luminance — as the prototype's own notes put it,
 * "the theme is unified into deep night blue, cool moonlight and soft beige".
 *
 * That touch of **beige** (#ded0ae) matters: it is the only warm colour in the skin, and the prototype uses it solely at the end of the energy gradient
 * (`linear-gradient(90deg,#5f88da,#7bd8ff,#ded0ae)`) — like the lamp wrapped in night in the picture.
 * so it gets exactly one place here too: the end of the context bar. Spread wider it would stop being a touch of warmth.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const NIGHT_PALETTE = {
  /** 夜空底，接近黑。 */
  bg: '#06101c',
  /** 更沉的一档（原型渐变的下端）。 */
  bg2: '#040a12',
  /** 面板：夜蓝。 */
  panel: '#0b1d31',
  panel2: '#0c2034',
  /** The ground for the sidebar and cards. */
  panelDeep: '#091827',

  text: '#edf7ff',
  muted: '#819caf',
  muted2: '#70899b',

  /** 主操作蓝（原型的 `＋ New Session` 与 `Send →` 都是这条渐变）。 */
  blue: '#3b78e8',
  blue2: '#4b7fe8',
  blueDeep: '#2d5eb9',
  /** 月光青：描边、图标、强调、以及"正在运行"。 */
  cyan: '#73d5ff',
  /** Online green. */
  green: '#72d99c',
  /** 🔴 全场唯一的暖色，只出现在能量条末端。 */
  moonBeige: '#ded0ae',
} as const

const p = NIGHT_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const NIGHT_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.panelDeep,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#142f50',

  // The scrim pushes towards night blue rather than pure black; black would wash this already dark blue into grey.
  '--dsw-alias-bg-mask-1': 'rgba(3, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 5, 10, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(20, 47, 80, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(141, 198, 255, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(141,198,255,.16)`——**带月光青的暗描边**。夜里的界面全靠它分层。
  '--dsw-alias-border-l1': 'rgba(141, 198, 255, 0.1)',
  '--dsw-alias-border-l2': 'rgba(141, 198, 255, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(141, 198, 255, 0.12)',
  '--dsw-alias-border-l3': 'rgba(141, 198, 255, 0.3)',
  '--dsw-alias-border-l4': p.cyan,
  '--dsw-alias-border-inverted': 'rgba(237, 247, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 247, 255, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dfedf6',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#9bafbf',
  '--dsw-alias-label-tertiary': p.muted2,
  '--dsw-alias-label-caption': '#5c7589',
  '--dsw-alias-label-dimmed': '#5c7589',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // 主操作是那条夜蓝渐变（原型 `.new` / `.send` 的 `linear-gradient(135deg,#4b7fe8,#2d5eb9)`）。
  // Moonlit cyan is not used for buttons: here it is the language of borders and state, and a solid fill would break the night's quiet.
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': p.cyan,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': p.blue2,
  '--dsw-alias-button-primary-dimmed': '#24406f',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#10243b',
  '--dsw-alias-button-floating-fill': '#0a1929',
  '--dsw-alias-button-floating-hover': '#10243b',
  '--dsw-alias-button-ghost-active-fill': '#102a45',
  '--dsw-alias-button-ghost-active-hover': '#142f50',
  '--dsw-alias-button-ghost-active-border': 'rgba(141, 198, 255, 0.28)',
  '--dsw-alias-button-info-fill': '#1d4270',
  '--dsw-alias-button-info-hover': '#2d5eb9',
  '--dsw-alias-button-tool-bar-fill': 'rgba(115, 213, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(115, 213, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 25, 41, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(141, 198, 255, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(141, 198, 255, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#102a45',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(59, 120, 232, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(220, 110, 110, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#74d099',
  '--dsw-alias-state-success-tertiary': '#0e261f',
  // 琥珀与红原型没给（它只画了正常流程）。琥珀借那点月光米色的方向推一个暖调，
  // 红压到低饱和——这套皮肤最不该出现的就是刺眼的东西。
  '--dsw-alias-state-warn-primary': '#e3c47a',
  '--dsw-alias-state-warn-secondary': '#e3c47a',
  '--dsw-alias-state-warn-label': '#f0dcaa',
  '--dsw-alias-state-warn-tertiary': '#2a2318',
  '--dsw-alias-state-error-primary': '#e5798a',
  '--dsw-alias-state-error-secondary': '#f0919f',
  // business = in progress: moonlit cyan. The brightest thing at night without glaring.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#10344a',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#050d16',
  '--dsw-alias-markdown-code-block-banner': '#0c1c2e',
  '--dsw-alias-markdown-inline-code': '#10243b',
  '--dsw-alias-markdown-code-segment-selected': '#142f50',
  '--dsw-alias-markdown-code-segment-unselected': '#050d16',
  '--dsw-alias-markdown-citation': '#10243b',
  '--dsw-alias-markdown-placeholder': '#0c1c2e',
  '--dsw-alias-markdown-tag': '#10243b',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(141, 198, 255, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(141, 198, 255, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(141, 198, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.cyan,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.panelDeep,
  '--dsw-specific-sidebar-nav-item-hover': '#0c2034',
  '--dsw-specific-sidebar-nav-item-active': '#142f50',
  '--dsw-specific-sidebar-nav-item-active-accent': p.cyan,
  '--dsw-specific-bubble': '#0c1c2e',
  '--dsw-specific-bubble-highlight': '#10243b',
  '--dsw-specific-input-major': '#0a1929',
  '--dsw-specific-login-input': '#0a1929',
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#0a1929',
  '--dsw-specific-tip': '#10243b',
}
