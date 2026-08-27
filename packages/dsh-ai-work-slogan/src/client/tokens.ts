/**
 * AI 工作模式的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 🔴 这套皮肤跟前面几套有一个结构性差别：**它的底不是一块实色，而是一整片渐变**
 *（`linear-gradient(180deg,#071936 0%,#0a2a60 62%,#2f79ef 100%)` 配顶部一团蓝光），
 * 所有面板都是**半透明玻璃**浮在上面（原型的 `--panel: rgba(10,24,52,.56)`、
 * 侧栏 `rgba(5,15,34,.42)` + `backdrop-filter: blur(14px)`）。
 *
 * 所以这里的 token 值大量是 **rgba**，不是实色——token 就是 CSS 颜色，允许透明。
 * 渐变本身画在承载布局的那一层（见 aiwork.module.css），玻璃面板让它透上来。
 *
 * 唯一保持实色的是 `--dsw-alias-bg-base`：它被用作"遮挡"（输入区上方的渐变淡出、下拉背板），
 * 透明会漏出下面的内容。取渐变顶端的深色。
 *
 * 另一条：**主操作是白底深蓝字**。在这片蓝上，白是唯一比蓝更强的东西——原型的
 * `＋ New Session`、`启动 Harness`、`开始让 AI 干活` 全是 `background:#fff; color:#16386c`。
 * 拿蓝做主按钮会淹没在背景里。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const WORK_PALETTE = {
  /** 渐变顶端：深海蓝。也是唯一需要实色的那一档。 */
  bg: '#071936',
  /** 渐变中段。 */
  bg2: '#0a2a60',
  /** 渐变底端：亮蓝——这套皮肤越往下越亮，跟常规暗色主题相反。 */
  bg3: '#2f79ef',

  text: '#f7fbff',
  muted: '#b8c9df',

  /** 主操作的实心色：白。深蓝字压在上面。 */
  white: '#ffffff',
  /** 白底按钮上的字色。 */
  onWhite: '#16386c',

  blue: '#4284ff',
  cyan: '#7ad9ff',
  green: '#61d89a',
} as const

const p = WORK_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。
 */
export const WORK_TOKENS: Record<string, string> = {
  // ── 容器层次：玻璃 ──
  // base 保持实色（要当遮挡用），其余三级都是半透明白/深蓝，好让底下的渐变透上来。
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': 'rgba(5, 15, 34, 0.42)',
  '--dsw-alias-bg-layer-2': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-bg-layer-3': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-bg-module-platform': 'rgba(10, 24, 52, 0.56)',
  '--dsw-alias-bg-overlay': 'rgba(7, 20, 44, 0.94)',
  '--dsw-alias-bg-multi-select': 'rgba(255, 255, 255, 0.1)',

  // 遮罩：压向深海蓝而不是纯黑。
  '--dsw-alias-bg-mask-1': 'rgba(3, 10, 24, 0.62)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 10, 24, 0.3)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 10, 24, 0.52)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 7, 18, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(37, 84, 168, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(255,255,255,.12)`——**白色半透明**，不是彩色描边。
  // 玻璃面板靠它勾边，这是"玻璃感"的一半。
  '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.22)',
  '--dsw-alias-border-l4': 'rgba(255, 255, 255, 0.32)',
  '--dsw-alias-border-inverted': 'rgba(23, 59, 113, 0.16)',
  '--dsw-alias-border-inverted2': 'rgba(23, 59, 113, 0.26)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#d9e9ff',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#d2dfef',
  '--dsw-alias-label-tertiary': '#9db0c7',
  '--dsw-alias-label-caption': '#8198b3',
  '--dsw-alias-label-dimmed': '#8198b3',
  // 🔴 落在主按钮上的字是**深蓝**，因为主按钮是白底。
  '--dsw-alias-label-primary-foreground': p.onWhite,
  '--dsw-alias-label-primary-inverted': p.onWhite,

  // ── Brand and primary button ──
  // 🔴 主操作 = 白。见文件头的说明：在这片蓝上，白是唯一比蓝更强的东西。
  '--dsw-alias-brand-primary': p.white,
  // 文字上的品牌色不能也用白（正文本来就是近白），用亮青蓝拉开层次。
  '--dsw-alias-brand-text': p.cyan,
  '--dsw-alias-brand-primary-invert': p.onWhite,
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.white,
  '--dsw-alias-button-primary-fill': p.white,
  '--dsw-alias-button-primary-hover': '#e8f2ff',
  '--dsw-alias-button-primary-dimmed': 'rgba(255, 255, 255, 0.42)',
  '--dsw-alias-button-contrast-fill': p.white,
  '--dsw-alias-button-elevated-fill': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-button-floating-fill': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-button-floating-hover': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-button-ghost-active-fill': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-button-ghost-active-hover': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 255, 255, 0.28)',
  '--dsw-alias-button-info-fill': 'rgba(66, 132, 255, 0.34)',
  '--dsw-alias-button-info-hover': 'rgba(66, 132, 255, 0.5)',
  '--dsw-alias-button-tool-bar-fill': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0)',

  // ── Interaction states ──
  // 玻璃界面的 hover 就是"再加一点白"，与面板本身同一种语言。
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-interactive-bg-hover-solid': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(66, 132, 255, 0.28)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(240, 100, 100, 0.24)',

  // ── Status colours ──
  // 绿来自原型的 `● HARNESS READY` 胶囊与 `.online`。
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#9ceabb',
  '--dsw-alias-state-success-tertiary': 'rgba(24, 90, 52, 0.24)',
  // 琥珀与红原型没给（它只画了正常流程），按这套的亮度基调各推一个——在深蓝上要够亮才读得出。
  '--dsw-alias-state-warn-primary': '#ffd166',
  '--dsw-alias-state-warn-secondary': '#ffd166',
  '--dsw-alias-state-warn-label': '#ffe6a8',
  '--dsw-alias-state-warn-tertiary': 'rgba(120, 88, 20, 0.28)',
  '--dsw-alias-state-error-primary': '#ff7b7b',
  '--dsw-alias-state-error-secondary': '#ff9a9a',
  // business = 进行中。给亮青：它在这片蓝里最跳，又不会跟白色主操作抢。
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': 'rgba(122, 217, 255, 0.18)',

  // ── Markdown and code ──
  // 代码块比面板更沉一档（原型 `.toolbody` 是 rgba(5,14,32,.45)），读长代码时不刺眼。
  '--dsw-alias-markdown-code-block': 'rgba(5, 14, 32, 0.45)',
  '--dsw-alias-markdown-code-block-banner': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-markdown-inline-code': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-markdown-code-segment-selected': 'rgba(255, 255, 255, 0.14)',
  '--dsw-alias-markdown-code-segment-unselected': 'rgba(5, 14, 32, 0.45)',
  '--dsw-alias-markdown-citation': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-markdown-placeholder': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-markdown-tag': 'rgba(255, 255, 255, 0.1)',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.22)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 255, 255, 0.24)',
  '--dsw-alias-scrollbar-hover-l2': 'rgba(255, 255, 255, 0.4)',

  // ── Overlays ──
  // 浮层要**不透明**：飘在渐变上的半透明弹层会把底下的内容一起读进来，看不清。
  '--dsw-alias-toast-bg': '#0d2247',
  '--dsw-alias-tooltip-bg': '#0d2247',

  // ── specific 层：harness 给具体部件留的口子 ──
  '--dsw-specific-sidebar-fill': 'rgba(5, 15, 34, 0.42)',
  '--dsw-specific-sidebar-nav-item-hover': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-sidebar-nav-item-active': 'rgba(255, 255, 255, 0.1)',
  '--dsw-specific-sidebar-nav-item-active-accent': p.white,
  '--dsw-specific-bubble': 'rgba(255, 255, 255, 0.08)',
  '--dsw-specific-bubble-highlight': 'rgba(255, 255, 255, 0.14)',
  '--dsw-specific-input-major': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-login-input': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-menu': '#0d2247',
  '--dsw-specific-selector': 'rgba(255, 255, 255, 0.06)',
  '--dsw-specific-tip': 'rgba(255, 255, 255, 0.1)',
}
