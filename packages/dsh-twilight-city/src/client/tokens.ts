/**
 * 黄昏城市的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 原型稿的 Theme rules 写死了每种颜色的职责：
 * 「以**深蓝夜空**为底，**晚霞橙和紫粉云层**作为情绪重点，**暖黄色只负责点亮窗口与按钮**。」
 *
 * 三句话对应三种用量：
 *   - **深蓝夜空**（#0a1020 → #202d47）：底与三级面板，绝大部分界面；
 *   - **晚霞橙**（#ff8a4c）与**紫**（#8459d9）、**粉**（#c96594）：情绪重点。
 *     ⚠️ 「情绪重点」不等于「状态色」——它们负责氛围（描边、强调、hover 的那一点暖），
 *     不负责告诉你任务成没成；
 *   - **暖黄**（#f1b56f）：只点亮"窗口与按钮"，也就是主操作与选中项。
 *
 * 🔴 那么"正在跑"用什么？**天空蓝**（#5b7be4 / #69a9ff）。它是稿子里唯一一个既在调色盘上、
 * 又没被分配情绪职责的颜色，正好留给状态：冷色跟这一整片暖调拉得开，一眼能认出来。
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const TWILIGHT_PALETTE = {
  /** 夜空底。 */
  bg: '#0a1020',
  bg2: '#121a2e',
  /** 城市面板三级。 */
  surface: '#131c31',
  surface2: '#19243b',
  surface3: '#202d47',

  text: '#eef1f7',
  text2: '#c9d0de',
  text3: '#8992a5',

  /** 天空蓝：留给"正在跑"。 */
  blue: '#69a9ff',
  sky: '#5b7be4',
  /** 云层紫与粉：情绪重点，不做状态。 */
  violet: '#8459d9',
  pink: '#c96594',
  /** 晚霞橙：情绪重点里最强的一档。 */
  sunset: '#ff8a4c',
  /** 暖黄：点亮窗口与按钮。 */
  amber: '#f1b56f',
  danger: '#cc6a67',
} as const

const p = TWILIGHT_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const TWILIGHT_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // 遮罩：压向夜空蓝而不是纯黑，压黑会把这套本来就很暗的蓝洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(5, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(5, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(5, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(4, 6, 12, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(32, 45, 71, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.07)',

  // ── Borders ──
  // 原型全场两条：`--line: rgba(255,255,255,.08)`（中性）与 `--line2: rgba(255,138,76,.14)`（晚霞橙）。
  // 中性那条撑起全部分层，橙那条只出现在需要"暖一点"的框上——这就是"情绪重点"的用法。
  '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.06)',
  '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.08)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.07)',
  '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.18)',
  '--dsw-alias-border-l4': p.sunset,
  '--dsw-alias-border-inverted': 'rgba(238, 241, 247, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(238, 241, 247, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e4eaf5',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#adb6c8',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#737d91',
  '--dsw-alias-label-dimmed': '#737d91',
  // 暖黄实底上放白字对比度不够，配一档接近黑的深棕。
  '--dsw-alias-label-primary-foreground': '#241505',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // 主操作是暖黄（原型 Theme rules：「暖黄色只负责**点亮窗口与按钮**」）。
  // 晚霞橙不做实心大按钮：它是氛围色，铺开会把这张画的黄昏感搬进界面，变得吵。
  '--dsw-alias-brand-primary': p.amber,
  '--dsw-alias-brand-text': p.amber,
  '--dsw-alias-brand-primary-invert': '#241505',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.amber,
  '--dsw-alias-button-primary-fill': p.amber,
  '--dsw-alias-button-primary-hover': '#f7c68a',
  '--dsw-alias-button-primary-dimmed': '#9a7241',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#273654',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 138, 76, 0.28)',
  '--dsw-alias-button-info-fill': '#27406e',
  '--dsw-alias-button-info-hover': '#2f4f86',
  '--dsw-alias-button-tool-bar-fill': 'rgba(241, 181, 111, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(241, 181, 111, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(19, 28, 49, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.05)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 138, 76, 0.22)',
  // 云层里那点粉的唯一去处：危险操作的悬停。稿子把粉排在"情绪重点"里，
  // 落到"需要你多看一眼的那一个"上，比铺成装饰更有用。
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(201, 101, 148, 0.24)',

  // ── Status colours ──
  // 🔴 成功用青绿 #7fc9a8：稿子的调色盘里没有绿，但"成功"必须跟"正在跑"（天空蓝）
  // 和"主操作"（暖黄）都区分得开。取一档低饱和的青绿，是这一整片暖调里最不吵的选择。
  '--dsw-alias-state-success-primary': '#7fc9a8',
  '--dsw-alias-state-success-secondary': '#6fb797',
  '--dsw-alias-state-success-tertiary': '#12302a',
  // 警告：晚霞橙。情绪重点在这里正好落到"提醒"上。
  '--dsw-alias-state-warn-primary': p.sunset,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': '#ffc59a',
  '--dsw-alias-state-warn-tertiary': '#2e2013',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#dc8481',
  // business = 进行中：天空蓝。冷色跟这一整片暖调拉得开，一眼能认出来。
  '--dsw-alias-state-business-primary': p.blue,
  '--dsw-alias-state-business-tertiary': '#16294d',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#080d1a',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#080d1a',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.2)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 255, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.amber,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.amber,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
