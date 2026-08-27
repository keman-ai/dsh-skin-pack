/**
 * 森林漫游的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值作为
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。
 *
 * 🔴 原型稿的 Theme rules 写死了每种颜色的职责：
 * 「以**森林深绿**为底，**溪水青与苔藓绿**作为状态色，**日光黄只做温暖点缀**。」
 *
 * 三句话对应三种用量：
 *   - **森林深绿**（#08150f → #1f3b2b）：底与三级面板，吃掉绝大部分界面；
 *   - **苔藓绿**（#6fa36d）主操作 + **溪水青**（#5eb7c7）"正在跑"：两个状态色分工明确，
 *     绿是"做完了"，青是"正在做"——同色系会让人分不清；
 *   - **日光黄**（#d7c77e）：只做点缀。这里给它两个位置：警告态、上下文占用条的末端。
 *     「只做点缀」就是它的定义，铺开就不再是穿过树冠的那束光了。
 *
 * 稿子里还有一个**紫**（`--flower: #9a7fbb`，画里那串紫藤）。全场只在装饰上出现过，
 * 没有任何语义，所以这里一处都不用：给它一个语义等于替设计师瞎定规矩。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const GROVE_PALETTE = {
  /** 林底，接近黑的深绿。 */
  bg: '#08150f',
  bg2: '#0d2117',
  /** 面板三级（苔藓）。 */
  surface: '#10261b',
  surface2: '#173022',
  surface3: '#1f3b2b',

  text: '#eef1e8',
  text2: '#c6cebf',
  text3: '#899585',

  /** 苔藓绿：主操作与"做完了"。 */
  green: '#6fa36d',
  green2: '#a7cb87',
  mint: '#89c7ad',
  /** 溪水青：只给"正在跑"。 */
  river: '#5eb7c7',
  /** 日光黄：只做点缀。 */
  sun: '#d7c77e',
  /** 紫藤。原型只在装饰上用过，这里一处不用（见文件头）。 */
  flower: '#9a7fbb',
  danger: '#b96355',
} as const

const p = GROVE_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。
 */
export const GROVE_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // 遮罩：压向林底的深绿而不是纯黑，压黑会把这套本来就很暗的绿洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(4, 11, 7, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(4, 11, 7, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(4, 11, 7, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(3, 8, 5, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(31, 59, 43, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(187, 212, 180, 0.08)',

  // ── 描边 ──
  // 原型全场两条：`--line: rgba(187,212,180,.14)`（草绿）与 `--line2: rgba(94,183,199,.12)`（溪水青）。
  // 暗底上的分层全靠它们，而不是靠提亮底色。
  '--dsw-alias-border-l1': 'rgba(187, 212, 180, 0.1)',
  '--dsw-alias-border-l2': 'rgba(187, 212, 180, 0.14)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(187, 212, 180, 0.11)',
  '--dsw-alias-border-l3': 'rgba(187, 212, 180, 0.28)',
  '--dsw-alias-border-l4': p.green2,
  '--dsw-alias-border-inverted': 'rgba(238, 241, 232, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(238, 241, 232, 0.1)',

  // ── 文字 ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e4ebe1',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#aab5a3',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#728073',
  '--dsw-alias-label-dimmed': '#728073',
  '--dsw-alias-label-primary-foreground': '#102014',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── 品牌与主按钮 ──
  // 主操作是苔藓绿（原型 `.hero-send` 的 `linear-gradient(180deg,#8ebf7f,#5f8d5d)`），
  // 前景色配深林绿 `#102014`——原型自己就是这么配的：亮绿底上放白字对比度不够。
  '--dsw-alias-brand-primary': p.green,
  '--dsw-alias-brand-text': p.green2,
  '--dsw-alias-brand-primary-invert': '#102014',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.green,
  '--dsw-alias-button-primary-fill': p.green,
  '--dsw-alias-button-primary-hover': '#82b47c',
  '--dsw-alias-button-primary-dimmed': '#4c7350',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#26472f',
  '--dsw-alias-button-ghost-active-border': 'rgba(167, 203, 135, 0.28)',
  '--dsw-alias-button-info-fill': '#1c4a4f',
  '--dsw-alias-button-info-hover': '#245c62',
  '--dsw-alias-button-tool-bar-fill': 'rgba(167, 203, 135, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(167, 203, 135, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(16, 38, 27, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(187, 212, 180, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(187, 212, 180, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(111, 163, 109, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(185, 99, 85, 0.22)',

  // ── Status colours ──
  // 🔴 成功用苔藓绿、进行中用溪水青：稿子把这两个词并列写成"状态色"，
  // 分工就在这里——绿是"做完了"，青是"正在做"。做成同色系会让人分不清。
  '--dsw-alias-state-success-primary': p.green2,
  '--dsw-alias-state-success-secondary': p.green,
  '--dsw-alias-state-success-tertiary': '#14301d',
  // 警告：日光黄。这是它两个位置里的第一个。
  '--dsw-alias-state-warn-primary': p.sun,
  '--dsw-alias-state-warn-secondary': p.sun,
  '--dsw-alias-state-warn-label': '#e6dba6',
  '--dsw-alias-state-warn-tertiary': '#2b2718',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#cd7a6c',
  // business = 进行中：溪水青。
  '--dsw-alias-state-business-primary': p.river,
  '--dsw-alias-state-business-tertiary': '#10333a',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#06110b',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#06110b',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── 滚动条 ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(187, 212, 180, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(187, 212, 180, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(187, 212, 180, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.green2,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── specific 层：harness 给具体部件留的口子 ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.green2,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
