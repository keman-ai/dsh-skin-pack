/**
 * 火星驾驶舱的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值作为
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。
 *
 * 🔴 原型稿的 Theme rules 把配比写成了一句数字，这是这套皮肤最硬的约束：
 * 「**80% 航天黑与深蓝控制面板，10% 冷蓝遥测信息，6% 推进器橙色交互强调，
 * 3% Nominal 绿色状态，1% 红色异常态**」。
 *
 * 换算成用量：
 *   - **航天黑 / 深蓝面板**（#05080d → #142331）：底与三级面板——绝大部分界面；
 *   - **冷蓝**（#7fb4d3）：遥测信息，也就是**描边与次要数据**。仪表盘上那些细线就是它；
 *   - **推进器橙**（#ff7a2e）：**交互强调**——主操作、选中项。6% 的意思是"按下去的那一下"；
 *   - **Nominal 绿**（#73b89a）：只给**一切正常**（成功态）。3%；
 *   - **红**（#d9503f）：只给**异常**。1%。
 *
 * 🔴 橙和绿分工不能混：橙是"你要做的事"，绿是"已经好了"。驾驶舱里把这两个搞混，
 * 代价是看一眼仪表分不清该不该动手。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const MARS_PALETTE = {
  /** 航天黑，接近纯黑。 */
  bg: '#05080d',
  bg2: '#08111a',
  /** 深蓝控制面板三级。 */
  surface: '#0a121b',
  surface2: '#0f1a25',
  surface3: '#142331',

  text: '#e8edf2',
  text2: '#aeb9c3',
  text3: '#6f7d89',

  /** 冷蓝遥测：描边、次要数据。 */
  cyan: '#7fb4d3',
  cyan2: '#9fd3ee',
  /** 推进器橙：交互强调。 */
  orange: '#ff7a2e',
  orange2: '#ffad66',
  /** 异常红。 */
  red: '#d9503f',
  /** Nominal 绿。 */
  green: '#73b89a',
} as const

const p = MARS_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。
 */
export const MARS_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // 遮罩：压向航天黑。这套本来就够黑，遮罩再往蓝里压会显脏。
  '--dsw-alias-bg-mask-1': 'rgba(2, 4, 7, 0.74)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 4, 7, 0.36)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 4, 7, 0.64)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 3, 5, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(20, 35, 49, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(142, 181, 203, 0.08)',

  // ── 描边 ──
  // 原型全场两条：`--line: rgba(142,181,203,.12)`（冷蓝）与 `--line2: rgba(255,122,46,.14)`（橙）。
  // 冷蓝那条是"仪表盘的细线"，撑起全部分层；橙那条只出现在需要强调的框上。
  '--dsw-alias-border-l1': 'rgba(142, 181, 203, 0.09)',
  '--dsw-alias-border-l2': 'rgba(142, 181, 203, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(142, 181, 203, 0.1)',
  '--dsw-alias-border-l3': 'rgba(142, 181, 203, 0.26)',
  '--dsw-alias-border-l4': p.orange,
  '--dsw-alias-border-inverted': 'rgba(232, 237, 242, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(232, 237, 242, 0.1)',

  // ── 文字 ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dde7ef',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#9aa7b3',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#5d6a75',
  '--dsw-alias-label-dimmed': '#5d6a75',
  // 橙实底上放白字对比度不够，配一档接近黑的深棕。
  '--dsw-alias-label-primary-foreground': '#1a0d05',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── 品牌与主按钮 ──
  // 主操作是推进器橙（原型 `LAUNCH MISSION →`）。冷蓝不做实心按钮：
  // 它在这套里是"遥测与描边"的语言，铺成大块会把仪表盘的层次压平。
  '--dsw-alias-brand-primary': p.orange,
  '--dsw-alias-brand-text': p.orange2,
  '--dsw-alias-brand-primary-invert': '#1a0d05',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.orange,
  '--dsw-alias-button-primary-fill': p.orange,
  '--dsw-alias-button-primary-hover': p.orange2,
  '--dsw-alias-button-primary-dimmed': '#8a4520',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#1a2c3d',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 122, 46, 0.28)',
  '--dsw-alias-button-info-fill': '#1a3547',
  '--dsw-alias-button-info-hover': '#224358',
  '--dsw-alias-button-tool-bar-fill': 'rgba(255, 122, 46, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(255, 122, 46, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 18, 27, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(142, 181, 203, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(142, 181, 203, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 122, 46, 0.22)',
  // 那 1% 红的其中一处：危险操作的悬停。
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(217, 80, 63, 0.22)',

  // ── Status colours ──
  // 🔴 成功 = Nominal 绿，进行中 = 冷蓝，主操作 = 橙。三者各司其职，一处都不串。
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#8ac9ad',
  '--dsw-alias-state-success-tertiary': '#102b26',
  // 警告：往橙上靠（稿子没给黄，而橙本来就是这套的"注意"色，用亮一档的 orange2 区分主按钮）。
  '--dsw-alias-state-warn-primary': p.orange2,
  '--dsw-alias-state-warn-secondary': p.orange,
  '--dsw-alias-state-warn-label': '#ffc48c',
  '--dsw-alias-state-warn-tertiary': '#2c1c10',
  // 异常：红。1% 的另一处。
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#e56d5c',
  // business = 进行中：冷蓝遥测。
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#123141',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#040710',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#040710',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── 滚动条 ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(142, 181, 203, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(142, 181, 203, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(142, 181, 203, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.orange,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── specific 层：harness 给具体部件留的口子 ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.orange,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
