/**
 * 宇宙英雄的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。harness 改版会动
 * class 名和布局，但不会动语义 token 的含义，所以这层能长期活着。
 *
 * 🔴 这套配色最要紧的一条：**红是稀缺色**。原型里红只出现在三处——logo 的外圈、头像渐变、
 * 「当前模式」卡的描边，其余全是深空蓝黑 + 青。所以映射时红只给 `state-error-*`，绝不拿它
 * 做主操作或运行态；主操作是**蓝**（`.new` 那颗 `linear-gradient(135deg,#1a7dff,#2154d7)`），
 * 运行态是**青**。
 *
 * 另一条：原型的能量条是 `linear-gradient(90deg,#22d8ff,#ffdb53,#ef3943)`——青 → 琥珀 → 红，
 * 正是彩色计时器由充盈到告急的顺序。这个三色序在状态台里被复用成"上下文占用条"和"能量核心"，
 * 让占用变高这件事自己讲出紧迫感（见 StatusDock.module.css）。
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const COSMIC_PALETTE = {
  /** 深空底，接近纯黑但带蓝。 */
  bg: '#030810',
  bg2: '#07131f',
  /** 面板两级（卡片渐变的上下端）。 */
  panel: '#091726',
  panel2: '#0d2032',

  text: '#e9f8ff',
  muted: '#7897aa',

  /** 青：描边、图标、强调，以及"正在运行"。 */
  cyan: '#23d9ff',
  /** 蓝：<b>主操作色</b>（原型的 ＋ New Session 就是这条蓝渐变）。 */
  blue: '#2787ff',
  /** 亮蓝：蓝渐变的上端，用作 hover。 */
  blue2: '#1a7dff',
  /** 红：<b>稀缺色</b>，只给错误态。 */
  red: '#e6313a',
  /** 琥珀：需要确认的操作，以及计时器三色的中段。 */
  amber: '#ffd84e',
  /** 绿：ONLINE / READY。 */
  green: '#5ce2a6',
} as const

const p = COSMIC_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。覆盖集不完整是有意的——列全反而会把将来
 * 新增的内置 token 挡在外面。
 */
export const COSMIC_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // 原型是「深空底 + 蓝黑面板」：bg → panel → panel2 逐级抬升，与 harness 的
  // base → layer-1/2/3 同构；layer-3 再抬一档给弹层，免得弹层与卡片分不开。
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': '#071623',
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#112f4a',

  // 遮罩：压暗要压向深蓝而不是纯黑——纯黑会把这套蓝调洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(2, 7, 13, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 7, 13, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 7, 13, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 4, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(17, 47, 74, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(233, 248, 255, 0.06)',

  // ── Borders ──
  // 原型全场只有一条 `--line: rgba(102,213,255,.16)`——**带青色倾向的暗描边**，不是中性灰。
  // 这条线是整套皮肤"科技感"的来源，四级都按它的色相走。
  '--dsw-alias-border-l1': 'rgba(102, 213, 255, 0.10)',
  '--dsw-alias-border-l2': 'rgba(102, 213, 255, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(102, 213, 255, 0.12)',
  '--dsw-alias-border-l3': 'rgba(102, 213, 255, 0.32)',
  '--dsw-alias-border-l4': p.cyan,
  '--dsw-alias-border-inverted': 'rgba(233, 248, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(233, 248, 255, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dceef7',
  '--dsw-alias-label-primary-dimmed': '#89a4b6',
  '--dsw-alias-label-secondary': '#89a4b6',
  '--dsw-alias-label-tertiary': p.muted,
  '--dsw-alias-label-caption': '#557183',
  '--dsw-alias-label-dimmed': '#557183',
  // 落在蓝色主按钮上的字：原型的 ＋ New Session 是白字。
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // 🔴 <b>主操作是蓝，不是红也不是青</b>。原型里红只在 logo 外圈、头像与"当前模式"描边上出现，
  // 青是描边与强调；唯一的实心大按钮 `＋ New Session` 走蓝渐变。拿红做按钮会让"出错了"和
  // "可以点"变成同一个视觉语言。
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': '#6ee0ff',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': p.blue2,
  '--dsw-alias-button-primary-dimmed': '#1b3f6b',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.panel2,
  '--dsw-alias-button-floating-fill': p.panel,
  '--dsw-alias-button-floating-hover': p.panel2,
  '--dsw-alias-button-ghost-active-fill': '#0d2940',
  '--dsw-alias-button-ghost-active-hover': '#112f4a',
  '--dsw-alias-button-ghost-active-border': 'rgba(102, 213, 255, 0.28)',
  // info 是「去看正在发生的事」，用青——比蓝低一档，不与主操作抢位。
  '--dsw-alias-button-info-fill': '#0d4160',
  '--dsw-alias-button-info-hover': '#155a80',
  '--dsw-alias-button-tool-bar-fill': 'rgba(35, 217, 255, 0.12)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(35, 217, 255, 0.22)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(9, 23, 38, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(102, 213, 255, 0.08)',
  '--dsw-alias-interactive-bg-active': 'rgba(102, 213, 255, 0.16)',
  '--dsw-alias-interactive-bg-hover-solid': '#0d2940',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(39, 135, 255, 0.22)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(230, 49, 58, 0.2)',

  // ── Status colours ──
  // 绿 = ONLINE / READY（原型的 `.online` 与那颗 `● COSMIC HERO ONLINE` 胶囊）。
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': p.green,
  '--dsw-alias-state-success-tertiary': '#0a2525',
  // 需要你确认的操作走琥珀，也是计时器三色的中段。
  '--dsw-alias-state-warn-primary': p.amber,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': '#ffe38a',
  '--dsw-alias-state-warn-tertiary': '#2a2410',
  // 🔴 红只在这里出现。
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#ef3943',
  // business 是 harness 标注「进行中 / 活动」的那档语义（spinner、运行指示都读它）。
  // 给青：英雄"能量充盈"的颜色，与计时器三色的起点一致。
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#0a2a3a',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#04101a',
  '--dsw-alias-markdown-code-block-banner': p.panel,
  '--dsw-alias-markdown-inline-code': p.panel,
  '--dsw-alias-markdown-code-segment-selected': p.panel2,
  '--dsw-alias-markdown-code-segment-unselected': '#04101a',
  '--dsw-alias-markdown-citation': p.panel2,
  '--dsw-alias-markdown-placeholder': p.panel,
  '--dsw-alias-markdown-tag': p.panel,

  // ── Scrollbar ──
  // 用青色半透明而不是中性灰：滚动条长期可见，灰色会把整片蓝调拉回中性。
  '--dsw-alias-scrollbar-bg-l1': 'rgba(102, 213, 255, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(102, 213, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(102, 213, 255, 0.28)',
  '--dsw-alias-scrollbar-hover-l2': p.cyan,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  // 侧栏比主区更沉一档（原型 sidebar 是 #06121e → #040c14 的竖向渐变）。
  '--dsw-specific-sidebar-fill': '#051019',
  '--dsw-specific-sidebar-nav-item-hover': '#0a1d2d',
  '--dsw-specific-sidebar-nav-item-active': '#112f4a',
  '--dsw-specific-sidebar-nav-item-active-accent': p.cyan,
  '--dsw-specific-bubble': p.panel,
  '--dsw-specific-bubble-highlight': p.panel2,
  '--dsw-specific-input-major': '#081522',
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#081522',
  '--dsw-specific-tip': p.panel2,
}
