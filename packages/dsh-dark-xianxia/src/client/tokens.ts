/**
 * 天机阁·修仙版的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 原型稿的 Theme rules 把配比写成了一句数字，这是这套皮肤最硬的约束：
 * 「**70% 墨青黑 / 18% 暖灰黑 / 8% 古金 / 3% 玉青 / 1% 朱砂**」。
 *
 * 换算成用量就是：
 *   - **墨青黑**（#071012）与暖灰黑：底、面板、输入框——绝大部分界面；
 *   - **古金**（#c09b5c）：描边、主操作、品牌字。8% 的意思是"边和按钮"，不是"大面积铺"；
 *   - **玉青**（#4d9b8f）：只给**正在跑**。3%；
 *   - **朱砂**（#bf5a47）：只给**危险与失败**。1%——原型全场只有「终止运行」那一处。
 *
 * 另一句同样写死在稿子里：「强世界观视觉集中在 New Session / Empty State，进入工作流后
 * 回到克制的深色开发工具界面，这样才适合真实长期使用」。所以封面只画在 hero。
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const XIAN_PALETTE = {
  /** 墨青黑，接近黑。 */
  bg: '#071012',
  bg2: '#0a1518',
  bg3: '#0d1a1d',
  /** 面板三级（暖灰黑）。 */
  surface: '#0b1619',
  surface2: '#0f1d21',
  surface3: '#13252a',

  text: '#e8dfca',
  text2: '#b5a98f',
  text3: '#756f61',

  /** 古金：描边、主操作、品牌字。 */
  gold: '#c09b5c',
  gold2: '#e0bd7b',
  gold3: '#8b6734',
  /** 玉青：只给"正在跑"。 */
  jade: '#4d9b8f',
  jade2: '#74b5a9',
  /** 朱砂：只给危险与失败。 */
  red: '#bf5a47',
  red2: '#7a3429',
} as const

const p = XIAN_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const XIAN_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // 遮罩：压向墨青而不是纯黑，压黑会把这套本来就很暗的青洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(4, 9, 10, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(4, 9, 10, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(4, 9, 10, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(3, 7, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(19, 37, 42, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(189, 151, 88, 0.08)',

  // ── Borders ──
  // 原型全场两条：`--line: rgba(189,151,88,.18)` 与 `--line2: .28`——**带古金的暗描边**。
  // 这是那 8% 古金的主要去处：暗底上的分层全靠它，而不是靠提亮底色。
  '--dsw-alias-border-l1': 'rgba(189, 151, 88, 0.12)',
  '--dsw-alias-border-l2': 'rgba(189, 151, 88, 0.18)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(189, 151, 88, 0.14)',
  '--dsw-alias-border-l3': 'rgba(189, 151, 88, 0.28)',
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(232, 223, 202, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(232, 223, 202, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dfd8c6',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#a79c85',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#6a6558',
  '--dsw-alias-label-dimmed': '#6a6558',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // 主操作是古金（原型 `.new-session` 与 `召请道童` 那条 `linear-gradient(135deg,#e0bd7b,#c09b5c)`）。
  // 前景色配深褐 `#241a0c`：金底上放白字对比度不够，放黑字又太硬。
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.gold2,
  '--dsw-alias-brand-primary-invert': '#241a0c',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.gold2,
  '--dsw-alias-button-primary-dimmed': p.gold3,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#183036',
  '--dsw-alias-button-ghost-active-border': 'rgba(189, 151, 88, 0.3)',
  '--dsw-alias-button-info-fill': '#1a4b45',
  '--dsw-alias-button-info-hover': '#215d55',
  '--dsw-alias-button-tool-bar-fill': 'rgba(192, 155, 92, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(192, 155, 92, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(11, 22, 25, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(189, 151, 88, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(189, 151, 88, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(192, 155, 92, 0.22)',
  // 那 1% 朱砂的其中一处：危险操作的悬停（原型是「终止运行」）。
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(191, 90, 71, 0.22)',

  // ── Status colours ──
  // 🔴 成功也走玉青。这套稿子的调色盘里根本没有绿——硬塞一个会同时破坏
  // "3% 玉青"和"70% 墨青黑"两条配比。
  '--dsw-alias-state-success-primary': p.jade2,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': '#0d2a27',
  // 警告：往古金上靠。稿子没给黄，而古金本来就是这套的"注意"色。
  '--dsw-alias-state-warn-primary': p.gold2,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#efd6a2',
  '--dsw-alias-state-warn-tertiary': '#2a2216',
  // 错误：朱砂。1% 的另一处。
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#d4705d',
  // business = 进行中：玉青。原型「运行中」那颗点就是它。
  '--dsw-alias-state-business-primary': p.jade,
  '--dsw-alias-state-business-tertiary': '#0d2a27',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#050d0f',
  '--dsw-alias-markdown-code-block-banner': p.bg3,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#050d0f',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.bg3,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(189, 151, 88, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(189, 151, 88, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(189, 151, 88, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': p.bg3,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
