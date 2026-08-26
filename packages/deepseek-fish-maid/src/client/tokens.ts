/**
 * 大鱼娘 Deep Sea 的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值作为
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。
 *
 * 🔴 原型稿的 Theme rules 写死了两条：
 * 「**主色保持 DeepSeek 蓝系**，鱼娘元素只作为品牌人格化，**不覆盖工具和代码信息**」，
 * 「角色视觉集中在 New Dive / Empty State；Chat、Dive Path、Details **回归真实 Harness 工作态**」。
 *
 * 所以这套的用色是**一条蓝的深浅**，不是彩色拼盘：
 *   - **深海蓝**（#03101f → #0f2d4a）：底与三级面板，吃掉绝大部分界面；
 *   - **冷青**（#5ed7ff）：描边、强调、"正在跑"——海底的发光线；
 *   - **DeepSeek 蓝**（#4e7ff2）：主操作按钮，品牌色本身；
 *   - **金**（#e8ba72）：全场唯一的暖色，原型只用在角色的蝴蝶结与少量点缀上。
 *     这里也只给它一个位置：上下文占用条的末端。铺开就不再是"一点暖"了。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const FISH_PALETTE = {
  /** 深海底，接近黑的蓝。 */
  bg: '#03101f',
  bg2: '#061a2d',
  /** 面板三级。 */
  surface: '#071a2d',
  surface2: '#0b2239',
  surface3: '#0f2d4a',

  text: '#eef8ff',
  text2: '#c7d8e8',
  text3: '#6f8da4',

  /** 冷青：描边、图标、强调、以及"正在跑"。 */
  cyan: '#5ed7ff',
  cyan2: '#9be8ff',
  /** DeepSeek 蓝：主操作。 */
  blue: '#4e7ff2',
  navy: '#17426a',
  /** 泡沫白。 */
  foam: '#e8fbff',
  aqua: '#55c9d6',
  /** 🔴 全场唯一的暖色。 */
  gold: '#e8ba72',
  ok: '#6fd6a6',
  danger: '#ff7c86',
} as const

const p = FISH_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。
 */
export const FISH_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // 遮罩：压向深海蓝而不是纯黑，压黑会把这套本来就很暗的蓝洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(2, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 6, 12, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(15, 45, 74, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(118, 204, 255, 0.08)',

  // ── 描边 ──
  // 原型全场两条：`--line: rgba(118,204,255,.13)` 与 `--line2: rgba(94,215,255,.14)`
  // ——**带冷青的暗描边**，就是海底那种发光线。暗底上的分层全靠它，而不是靠提亮底色。
  '--dsw-alias-border-l1': 'rgba(118, 204, 255, 0.1)',
  '--dsw-alias-border-l2': 'rgba(118, 204, 255, 0.14)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(118, 204, 255, 0.11)',
  '--dsw-alias-border-l3': 'rgba(94, 215, 255, 0.28)',
  '--dsw-alias-border-l4': p.cyan,
  '--dsw-alias-border-inverted': 'rgba(238, 248, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(238, 248, 255, 0.1)',

  // ── 文字 ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dceefb',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#a8c0d4',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#5c7a91',
  '--dsw-alias-label-dimmed': '#5c7a91',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── 品牌与主按钮 ──
  // 主操作是 DeepSeek 蓝（原型 `开始下潜 →` 与 `＋ New Dive` 的渐变都以它为主）。
  // 冷青不做实心按钮：它在这套里是"描边与状态"的语言，铺成大块会把海底的安静打破。
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': p.cyan,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': '#6791f5',
  '--dsw-alias-button-primary-dimmed': '#2d4d9e',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#143a5e',
  '--dsw-alias-button-ghost-active-border': 'rgba(94, 215, 255, 0.28)',
  '--dsw-alias-button-info-fill': p.navy,
  '--dsw-alias-button-info-hover': '#1d5384',
  '--dsw-alias-button-tool-bar-fill': 'rgba(94, 215, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(94, 215, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(7, 26, 45, 0.4)',

  // ── 交互态 ──
  '--dsw-alias-interactive-bg-hover': 'rgba(118, 204, 255, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(118, 204, 255, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(78, 127, 242, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(255, 124, 134, 0.2)',

  // ── 状态色 ──
  '--dsw-alias-state-success-primary': p.ok,
  '--dsw-alias-state-success-secondary': '#7fdcb2',
  '--dsw-alias-state-success-tertiary': '#0c2f2a',
  // 琥珀原型没给（它只画了正常流程）。借那点金的方向推一个暖调——
  // 这套皮肤最不该出现的就是刺眼的东西。
  '--dsw-alias-state-warn-primary': p.gold,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#f2d3a2',
  '--dsw-alias-state-warn-tertiary': '#2c2418',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#ff9aa2',
  // business = 进行中：冷青。它在海底最亮，又不刺眼。
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#0d3550',

  // ── Markdown 与代码 ──
  '--dsw-alias-markdown-code-block': '#020c18',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#020c18',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── 滚动条 ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(118, 204, 255, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(118, 204, 255, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(118, 204, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.cyan,

  // ── 浮层 ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── specific 层：harness 给具体部件留的口子 ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.cyan,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
