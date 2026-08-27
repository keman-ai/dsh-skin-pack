/**
 * 夜色秋千的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 这套的性格是**安静**：底色压到接近黑的深夜蓝，所有描边都带一点月光青
 *（`rgba(141,198,255,.16)`），亮度全压在低位——原型稿自己在对话里写的是
 * 「已将主题统一成深夜蓝、月光冷色和柔和米色」。
 *
 * 那点**米色**（#ded0ae）很关键：它是整套皮肤里唯一的暖色，原型只把它用在能量条渐变的末端
 *（`linear-gradient(90deg,#5f88da,#7bd8ff,#ded0ae)`）——就像画里那盏被夜色包住的灯。
 * 所以这里也只给它一个位置：上下文占用条的末端。铺开就不再是"一点暖"了。
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const SWING_PALETTE = {
  /** 雨夜底，近黑的夜蓝。 */
  bg: '#06111f',
  bg2: '#040b16',
  /** 面板两级。 */
  panel: '#0d1f35',
  panel2: '#132b46',
  /** 侧栏与卡片的底。 */
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
  /** 在线绿。 */
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

  // 遮罩：压向夜蓝而不是纯黑，压黑会把这套本来就很暗的蓝洗成灰。
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
  // 主操作是那条夜蓝渐变（原型 `.new` / `.send` 的 `linear-gradient(135deg,#4b7fe8,#2f62ce)`）。
  // 月光青不做按钮：它在这套里是"描边与状态"的语言，实心铺开会把夜的安静打破。
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
  // 琥珀与红原型都没给（它只画了正常流程）。琥珀借冰白的方向推一个偏冷的暖调，
  // 红压到低饱和——这套的性格是通透，不该出现刺眼的东西。
  '--dsw-alias-state-warn-primary': '#e8cf92',
  '--dsw-alias-state-warn-secondary': '#e8cf92',
  '--dsw-alias-state-warn-label': '#f2e2b8',
  '--dsw-alias-state-warn-tertiary': '#2a2519',
  '--dsw-alias-state-error-primary': '#ff6b64',
  '--dsw-alias-state-error-secondary': '#ff8a84',
  // business = 进行中：月光青。它在夜里最亮，又不刺眼。
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
