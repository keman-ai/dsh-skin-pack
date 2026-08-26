/**
 * 珍珠神谕的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值作为
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。
 *
 * 这套的性格是**安静**：底色压到接近黑的深夜蓝，所有描边都带一点月光青
 *（`rgba(141,198,255,.16)`），亮度全压在低位——原型稿自己在对话里写的是
 * 「已将主题统一成深夜蓝、月光冷色和柔和米色」。
 *
 * 那点**米色**（#ded0ae）很关键：它是整套皮肤里唯一的暖色，原型只把它用在能量条渐变的末端
 *（`linear-gradient(90deg,#5f88da,#7bd8ff,#ded0ae)`）——就像画里那盏被夜色包住的灯。
 * 所以这里也只给它一个位置：上下文占用条的末端。铺开就不再是"一点暖"了。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const PEARL_PALETTE = {
  /** 岩布底，带绿灰的暖石色。 */
  bg: '#11181a',
  bg2: '#0d1315',
  /** 面板两级。 */
  panel: '#1a2326',
  panel2: '#202c30',
  /** 侧栏与卡片的底。 */
  panelDeep: '#151d20',

  text: '#f5f1e8',
  muted: '#9da9aa',
  muted2: '#8a9698',

  /** 雾蓝：主操作与"正在跑"。全场唯一的彩色。 */
  blue: '#6f8fb9',
  blue2: '#7f9fc8',
  blueDeep: '#54708f',
  /** 银：描边与次要文字，珠子的反光。 */
  cyan: '#bfc8ca',
  /** 珍珠白：强调与高光，只给最该被看见的几处。 */
  ice: '#e8e0cf',
  /** 在线绿。 */
  green: '#77c69a',
} as const

const p = PEARL_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。
 */
export const PEARL_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.panelDeep,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#233033',

  // 遮罩：压向夜蓝而不是纯黑，压黑会把这套本来就很暗的蓝洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(3, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 5, 10, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(20, 47, 80, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(238, 234, 219, 0.08)',

  // ── 描边 ──
  // 原型全场一条 `--line: rgba(238,234,219,.14)`——**带珍珠白的暗描边**，正是那些珠子的反光。分层全靠它。
  '--dsw-alias-border-l1': 'rgba(238, 234, 219, 0.1)',
  '--dsw-alias-border-l2': 'rgba(238, 234, 219, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(238, 234, 219, 0.12)',
  '--dsw-alias-border-l3': 'rgba(238, 234, 219, 0.3)',
  '--dsw-alias-border-l4': p.cyan,
  '--dsw-alias-border-inverted': 'rgba(237, 247, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 247, 255, 0.1)',

  // ── 文字 ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#efeade',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#aab4b5',
  '--dsw-alias-label-tertiary': p.muted2,
  '--dsw-alias-label-caption': '#7d8a8b',
  '--dsw-alias-label-dimmed': '#7d8a8b',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── 品牌与主按钮 ──
  // 主操作是那条夜蓝渐变（原型 `.new` / `.send` 的 `linear-gradient(135deg,#4b7fe8,#2f62ce)`）。
  // 月光青不做按钮：它在这套里是"描边与状态"的语言，实心铺开会把夜的安静打破。
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': p.cyan,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': p.blue2,
  '--dsw-alias-button-primary-dimmed': '#3f5570',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#202c30',
  '--dsw-alias-button-floating-fill': '#1a2326',
  '--dsw-alias-button-floating-hover': '#202c30',
  '--dsw-alias-button-ghost-active-fill': '#233033',
  '--dsw-alias-button-ghost-active-hover': '#233033',
  '--dsw-alias-button-ghost-active-border': 'rgba(238, 234, 219, 0.28)',
  '--dsw-alias-button-info-fill': '#35485f',
  '--dsw-alias-button-info-hover': '#5b7899',
  '--dsw-alias-button-tool-bar-fill': 'rgba(115, 213, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(115, 213, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 25, 41, 0.4)',

  // ── 交互态 ──
  '--dsw-alias-interactive-bg-hover': 'rgba(238, 234, 219, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(238, 234, 219, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#233033',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(59, 120, 232, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(220, 110, 110, 0.2)',

  // ── 状态色 ──
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#86cfa4',
  '--dsw-alias-state-success-tertiary': '#16241d',
  // 琥珀与红原型都没给（它只画了正常流程）。琥珀借冰白的方向推一个偏冷的暖调，
  // 红压到低饱和——这套的性格是通透，不该出现刺眼的东西。
  '--dsw-alias-state-warn-primary': '#e8cf92',
  '--dsw-alias-state-warn-secondary': '#e8cf92',
  '--dsw-alias-state-warn-label': '#f2e2b8',
  '--dsw-alias-state-warn-tertiary': '#2a2519',
  '--dsw-alias-state-error-primary': '#e0808f',
  '--dsw-alias-state-error-secondary': '#ec96a3',
  // business = 进行中：月光青。它在夜里最亮，又不刺眼。
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#1b2b33',

  // ── Markdown 与代码 ──
  '--dsw-alias-markdown-code-block': '#0d1315',
  '--dsw-alias-markdown-code-block-banner': '#1a2326',
  '--dsw-alias-markdown-inline-code': '#202c30',
  '--dsw-alias-markdown-code-segment-selected': '#233033',
  '--dsw-alias-markdown-code-segment-unselected': '#0d1315',
  '--dsw-alias-markdown-citation': '#202c30',
  '--dsw-alias-markdown-placeholder': '#1a2326',
  '--dsw-alias-markdown-tag': '#202c30',

  // ── 滚动条 ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(238, 234, 219, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(238, 234, 219, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(238, 234, 219, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.cyan,

  // ── 浮层 ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── specific 层：harness 给具体部件留的口子 ──
  '--dsw-specific-sidebar-fill': p.panelDeep,
  '--dsw-specific-sidebar-nav-item-hover': '#1a2326',
  '--dsw-specific-sidebar-nav-item-active': '#233033',
  '--dsw-specific-sidebar-nav-item-active-accent': p.cyan,
  '--dsw-specific-bubble': '#1a2326',
  '--dsw-specific-bubble-highlight': '#202c30',
  '--dsw-specific-input-major': '#1a2326',
  '--dsw-specific-login-input': '#1a2326',
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#1a2326',
  '--dsw-specific-tip': '#202c30',
}
