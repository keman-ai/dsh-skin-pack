/**
 * 夕阳猫巴士的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
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
export const CATBUS_PALETTE = {
  /** 黄昏底，深棕（不是黑）。 */
  bg: '#160d08',
  bg2: '#100904',
  /** 面板：暖棕两级。 */
  panel: '#24150d',
  panel2: '#302016',
  /** 侧栏与卡片的底。 */
  panelDeep: '#1c1009',

  text: '#fff4e7',
  muted: '#b49a84',
  muted2: '#9a836f',

  /** 夕阳橙：主操作。 */
  orange: '#f49a43',
  orange2: '#f8b168',
  orangeDeep: '#bd5e27',
  /** 麦田金：描边与强调。 */
  gold: '#ffd07a',
  /** 冷色：全场唯一，留给"正在跑"。 */
  blue: '#6ab6ff',
  /** 在线绿。 */
  green: '#7fd59e',
} as const

const p = CATBUS_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const CATBUS_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.panelDeep,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#3a2415',

  // 遮罩：压向夜蓝而不是纯黑，压黑会把这套本来就很暗的蓝洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(3, 8, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 8, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 8, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 5, 10, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(20, 47, 80, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 191, 103, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(255,191,103,.16)`——**带麦田金的暗描边**。暗棕底上的分层全靠它。
  '--dsw-alias-border-l1': 'rgba(255, 191, 103, 0.1)',
  '--dsw-alias-border-l2': 'rgba(255, 191, 103, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 191, 103, 0.12)',
  '--dsw-alias-border-l3': 'rgba(255, 191, 103, 0.3)',
  '--dsw-alias-border-l4': p.gold,
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
  // 主操作是那条夜蓝渐变（原型 `.new` / `.send` 的 `linear-gradient(135deg,#4b7fe8,#24507a)`）。
  // 麦田金不做实心按钮：它在这套里是"描边与强调"的语言，金色大按钮会跟封面抢光。
  '--dsw-alias-brand-primary': p.orange,
  '--dsw-alias-brand-text': p.gold,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.orange,
  '--dsw-alias-button-primary-fill': p.orange,
  '--dsw-alias-button-primary-hover': p.orange2,
  '--dsw-alias-button-primary-dimmed': '#7a4a20',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#302016',
  '--dsw-alias-button-floating-fill': '#24150d',
  '--dsw-alias-button-floating-hover': '#302016',
  '--dsw-alias-button-ghost-active-fill': '#3a2415',
  '--dsw-alias-button-ghost-active-hover': '#3a2415',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 191, 103, 0.28)',
  '--dsw-alias-button-info-fill': '#1a3550',
  '--dsw-alias-button-info-hover': '#24507a',
  '--dsw-alias-button-tool-bar-fill': 'rgba(115, 213, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(115, 213, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(10, 25, 41, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 191, 103, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 191, 103, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#3a2415',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(59, 120, 232, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(220, 110, 110, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#74d099',
  '--dsw-alias-state-success-tertiary': '#16301f',
  // 🔴 警告在这套里是个难题：整盘都是橙金，橙色警告根本浮不出来。
  // 所以警告取**麦田金的高亮档**（靠亮度而不是色相区分），错误取砖红——
  // 比夕阳橙更深更红，在一片暖色里仍然读得出"这是坏消息"。
  '--dsw-alias-state-warn-primary': '#ffd07a',
  '--dsw-alias-state-warn-secondary': '#f0bd63',
  '--dsw-alias-state-warn-label': '#ffe1a8',
  '--dsw-alias-state-warn-tertiary': '#33270f',
  '--dsw-alias-state-error-primary': '#e0674f',
  '--dsw-alias-state-error-secondary': '#ea8069',
  // business = 进行中：冷蓝。全场唯一的冷色，在一片橙金里一眼能认出来。
  '--dsw-alias-state-business-primary': p.blue,
  '--dsw-alias-state-business-tertiary': '#12293d',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#100904',
  '--dsw-alias-markdown-code-block-banner': '#24150d',
  '--dsw-alias-markdown-inline-code': '#302016',
  '--dsw-alias-markdown-code-segment-selected': '#3a2415',
  '--dsw-alias-markdown-code-segment-unselected': '#100904',
  '--dsw-alias-markdown-citation': '#302016',
  '--dsw-alias-markdown-placeholder': '#24150d',
  '--dsw-alias-markdown-tag': '#302016',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 191, 103, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 191, 103, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 191, 103, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.panelDeep,
  '--dsw-specific-sidebar-nav-item-hover': '#0c2034',
  '--dsw-specific-sidebar-nav-item-active': '#3a2415',
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': '#24150d',
  '--dsw-specific-bubble-highlight': '#302016',
  '--dsw-specific-input-major': '#24150d',
  '--dsw-specific-login-input': '#24150d',
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': '#24150d',
  '--dsw-specific-tip': '#302016',
}
