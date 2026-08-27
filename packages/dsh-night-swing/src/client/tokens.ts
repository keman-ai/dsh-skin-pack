/**
 * 夜色秋千的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
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
export const SWING_PALETTE = {
  /** 雨夜底，近黑的夜蓝。 */
  bg: '#06111f',
  bg2: '#040b16',
  /** Two panel levels. */
  panel: '#0d1f35',
  panel2: '#132b46',
  /** The ground for the sidebar and cards. */
  panelDeep: '#081a2e',

  text: '#f7fbff',
  muted: '#8ea7ba',
  muted2: '#7b93a6',

  /** 战斗红：主操作与强调。 */
  blue: '#e44649',
  blue2: '#ff6b64',
  blueDeep: '#b4302f',
  /** 霓虹青：正在跑。 */
  cyan: '#69d4ff',
  /** 冷蓝：次级信息按钮。 */
  ice: '#2477b8',
  /** Online green. */
  green: '#6bd59f',
} as const

const p = SWING_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const SWING_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.panelDeep,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#123452',

  // The scrim pushes towards night blue rather than pure black; black would wash this already dark blue into grey.
  '--dsw-alias-bg-mask-1': 'rgba(3, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 5, 10, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(20, 47, 80, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(255,255,255,.115)`——**中性白描边，不带色**。雨夜里所有颜色都在发光，描边再带色会跟着一起亮。
  '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.3)',
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
  // The primary action is that night-blue gradient (the prototype's `.new` / `.send`: `linear-gradient(135deg,#4b7fe8,#2f62ce)`).
  // Moonlit cyan is not used for buttons: here it is the language of borders and state, and a solid fill would break the night's quiet.
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': p.cyan,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': p.blue2,
  '--dsw-alias-button-primary-dimmed': '#1e4a7a',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#0e2438',
  '--dsw-alias-button-floating-fill': '#0b1c2e',
  '--dsw-alias-button-floating-hover': '#0e2438',
  '--dsw-alias-button-ghost-active-fill': '#123452',
  '--dsw-alias-button-ghost-active-hover': '#123452',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 255, 255, 0.28)',
  '--dsw-alias-button-info-fill': '#1a4a70',
  '--dsw-alias-button-info-hover': '#2f62ce',
  '--dsw-alias-button-tool-bar-fill': 'rgba(115, 213, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(115, 213, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 25, 41, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#123452',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(59, 120, 232, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(220, 110, 110, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#74d099',
  '--dsw-alias-state-success-tertiary': '#0f2a20',
  // The prototype gives neither amber nor red (it drew only the happy path). The amber is derived towards the ice white, a cool warm tone,
  // The red is desaturated — this skin's character is clarity, and nothing should glare.
  '--dsw-alias-state-warn-primary': '#e8cf92',
  '--dsw-alias-state-warn-secondary': '#e8cf92',
  '--dsw-alias-state-warn-label': '#f2e2b8',
  '--dsw-alias-state-warn-tertiary': '#2a2519',
  '--dsw-alias-state-error-primary': '#ff6b64',
  '--dsw-alias-state-error-secondary': '#ff8a84',
  // business = in progress: moonlit cyan. The brightest thing at night without glaring.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#10344a',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#050f1a',
  '--dsw-alias-markdown-code-block-banner': '#0b1c2e',
  '--dsw-alias-markdown-inline-code': '#0e2438',
  '--dsw-alias-markdown-code-segment-selected': '#123452',
  '--dsw-alias-markdown-code-segment-unselected': '#050f1a',
  '--dsw-alias-markdown-citation': '#0e2438',
  '--dsw-alias-markdown-placeholder': '#0b1c2e',
  '--dsw-alias-markdown-tag': '#0e2438',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 255, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.cyan,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.panelDeep,
  '--dsw-specific-sidebar-nav-item-hover': '#0c2034',
  '--dsw-specific-sidebar-nav-item-active': '#123452',
  '--dsw-specific-sidebar-nav-item-active-accent': p.cyan,
  '--dsw-specific-bubble': '#0b1c2e',
  '--dsw-specific-bubble-highlight': '#0e2438',
  '--dsw-specific-input-major': '#0b1c2e',
  '--dsw-specific-login-input': '#0b1c2e',
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#0b1c2e',
  '--dsw-specific-tip': '#0e2438',
}
