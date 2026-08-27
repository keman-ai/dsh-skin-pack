/**
 * 森林同行的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 原型稿自己在对话里把配色规则写清楚了：
 * 「已把整套主题收束到**深森林绿、柔和米色与一点粉色人物呼应**」，
 * handoff 里也写着 `theme = deep green / soft cream / warm pink`。
 *
 * 三个词对应三种用量：
 *   - **深森林绿**：底、面板、描边、主操作——绝大部分界面；
 *   - **柔和米色**（#e9e0c5）：只出现在能量条末端与品牌标的芯上，像穿过树冠的那束光；
 *   - **一点粉**（#d96f95）：原型全场只用了两处，而且都极淡——封面上一团 5% 的光晕，
 *     和「当前模式」卡的描边。**"一点"是它的定义**，铺开就不再是呼应画里那个人物了。
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const FOREST_PALETTE = {
  /** 林底，接近黑的深绿。 */
  bg: '#071713',
  /** 更沉的一档（原型渐变的下端）。 */
  bg2: '#050f0c',
  /** 面板两级。 */
  panel: '#0b211a',
  panel2: '#102b22',
  /** 侧栏与卡片渐变的上端。 */
  panelUp: '#0a2019',

  text: '#edf8f1',
  muted: '#8da99b',
  muted2: '#718a7e',

  /** 主操作绿（原型 `.new` / `.send` 的 `linear-gradient(135deg,#58c88a,#2d8f72)`）。 */
  green: '#59c98b',
  greenDeep: '#2d8f72',
  /** 青绿：用于"正在运行"，与成功绿区分得开。 */
  teal: '#4db9b0',
  /** 🔴 柔和米色：只给能量条末端与品牌标的芯。 */
  cream: '#e9e0c5',
  /** 🔴 一点粉：全场两处，都极淡。 */
  pink: '#d96f95',
} as const

const p = FOREST_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const FOREST_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': '#091812',
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#163a2e',

  // 遮罩：压向林底的深绿而不是纯黑，压黑会把这套本来就很暗的绿洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(3, 10, 7, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 10, 7, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 10, 7, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 6, 4, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(22, 58, 46, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(151, 220, 190, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(151,220,190,.15)`——带草绿的暗描边。林子里的分层全靠它。
  '--dsw-alias-border-l1': 'rgba(151, 220, 190, 0.09)',
  '--dsw-alias-border-l2': 'rgba(151, 220, 190, 0.15)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(151, 220, 190, 0.12)',
  '--dsw-alias-border-l3': 'rgba(151, 220, 190, 0.3)',
  '--dsw-alias-border-l4': p.green,
  '--dsw-alias-border-inverted': 'rgba(237, 248, 241, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 248, 241, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e4f0e9',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#9bb1a5',
  '--dsw-alias-label-tertiary': p.muted2,
  '--dsw-alias-label-caption': '#5d786b',
  '--dsw-alias-label-dimmed': '#5d786b',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // 主操作是那条 135° 绿渐变（原型 `.new` 与 `.send`）。米色与粉都不做按钮：
  // 前者是光、后者是呼应，实心铺开会把这套的安静打破。
  '--dsw-alias-brand-primary': p.green,
  '--dsw-alias-brand-text': '#a6e6c6',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.green,
  '--dsw-alias-button-primary-fill': p.green,
  '--dsw-alias-button-primary-hover': '#6bd79a',
  '--dsw-alias-button-primary-dimmed': p.greenDeep,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#11291f',
  '--dsw-alias-button-floating-fill': '#0a1e17',
  '--dsw-alias-button-floating-hover': '#11291f',
  '--dsw-alias-button-ghost-active-fill': '#123426',
  '--dsw-alias-button-ghost-active-hover': '#163a2e',
  '--dsw-alias-button-ghost-active-border': 'rgba(151, 220, 190, 0.28)',
  '--dsw-alias-button-info-fill': '#1c5344',
  '--dsw-alias-button-info-hover': p.greenDeep,
  '--dsw-alias-button-tool-bar-fill': 'rgba(89, 201, 139, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(89, 201, 139, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 30, 23, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(151, 220, 190, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(151, 220, 190, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#123426',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(89, 201, 139, 0.22)',
  // 🔴 粉的第二处（第一处是封面上那团光晕）：危险操作的悬停。原型把粉用在
  // 「当前模式」的描边上，也就是"需要你注意的那一个"；这里落到同一类语义上。
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(217, 111, 149, 0.22)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': '#76dfa0',
  '--dsw-alias-state-success-secondary': '#78d698',
  '--dsw-alias-state-success-tertiary': '#10261d',
  // 琥珀原型没给，借米色的方向推一个暖调——这套皮肤最不该出现的就是刺眼的东西。
  '--dsw-alias-state-warn-primary': '#dcc487',
  '--dsw-alias-state-warn-secondary': '#dcc487',
  '--dsw-alias-state-warn-label': '#ecdcae',
  '--dsw-alias-state-warn-tertiary': '#2a2418',
  // 错误：往那点粉上靠（#d96f95 提亮一档）。原型没给错误色，而粉是它唯一的暖冷对比色，
  // 拿它当错误既守住"不刺眼"，又不用凭空引入第五种颜色。
  '--dsw-alias-state-error-primary': '#e07f9f',
  '--dsw-alias-state-error-secondary': '#eb95b1',
  // business = 进行中：青绿。与成功绿拉开一档，运行和成功不会看成同一件事。
  '--dsw-alias-state-business-primary': p.teal,
  '--dsw-alias-state-business-tertiary': '#0f3330',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#07130f',
  '--dsw-alias-markdown-code-block-banner': '#0d2119',
  '--dsw-alias-markdown-inline-code': '#11291f',
  '--dsw-alias-markdown-code-segment-selected': '#163a2e',
  '--dsw-alias-markdown-code-segment-unselected': '#07130f',
  '--dsw-alias-markdown-citation': '#11291f',
  '--dsw-alias-markdown-placeholder': '#0d2119',
  '--dsw-alias-markdown-tag': '#11291f',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(151, 220, 190, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(151, 220, 190, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(151, 220, 190, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.green,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': '#091812',
  '--dsw-specific-sidebar-nav-item-hover': '#0c241b',
  '--dsw-specific-sidebar-nav-item-active': '#163a2e',
  '--dsw-specific-sidebar-nav-item-active-accent': p.green,
  '--dsw-specific-bubble': '#0d2119',
  '--dsw-specific-bubble-highlight': '#11291f',
  '--dsw-specific-input-major': '#0a1e17',
  '--dsw-specific-login-input': '#0b1c17',
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#0a1e17',
  '--dsw-specific-tip': '#11291f',
}
