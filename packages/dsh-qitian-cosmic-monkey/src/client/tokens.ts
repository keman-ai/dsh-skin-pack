/**
 * 齐天星海的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值作为
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。
 *
 * 🔴 原型稿的 Theme rules 把配比写成了一句数字，这是这套皮肤最硬的约束：
 * 「**64% 深夜宇宙蓝 / 16% 蓝黑 Surface / 9% 日落余烬金 / 6% 星辉蓝 / 4% 雾灰文字 / 1% 危险态红**」。
 *
 * 换算成用量：
 *   - **深夜宇宙蓝 + 蓝黑 Surface**（#070b13 → #16213a）：底与三级面板，八成的界面；
 *   - **余烬金**（#d39a52 / #f1bc70）：描边、主操作、品牌字——画里那道日出的光；
 *   - **星辉蓝**（#315fae / #6e94e9）：只给**正在跑**。它是"星海"那一半；
 *   - **雾灰**（#c6bcaa / #847e73）：次要文字。注意它带暖调，不是中性灰——
 *     纯灰放在这套暖金里会显脏；
 *   - **红**（#ca5a49）：只给危险与失败。1%。
 *
 * 稿子里还有一个紫（`--purple: #765799`，星云那一片）。它在原型全场只出现在装饰渐变上，
 * 没有任何语义，所以这里一处都不用。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const QITIAN_PALETTE = {
  /** 星海底，接近黑的宇宙蓝。 */
  bg: '#070b13',
  bg2: '#0a1020',
  /** 蓝黑 Surface 三级。 */
  surface: '#0c1424',
  surface2: '#111b30',
  surface3: '#16213a',

  /** 文字带暖调，不是中性灰。 */
  text: '#efe9dc',
  text2: '#c6bcaa',
  text3: '#847e73',

  /** 余烬金：描边、主操作、品牌字。 */
  gold: '#d39a52',
  gold2: '#f1bc70',
  /** 星辉蓝：只给"正在跑"。 */
  blue: '#315fae',
  blue2: '#6e94e9',
  /** 星云紫。原型只在装饰渐变上用过，这里一处不用（见文件头）。 */
  purple: '#765799',
  ember: '#d97a3c',
  red: '#ca5a49',
} as const

const p = QITIAN_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。
 */
export const QITIAN_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.surface,
  '--dsw-alias-bg-layer-3': p.surface2,
  '--dsw-alias-bg-module-platform': p.surface,
  '--dsw-alias-bg-overlay': p.surface2,
  '--dsw-alias-bg-multi-select': p.surface3,

  // 遮罩：压向宇宙蓝而不是纯黑，压黑会把这套本来就很暗的蓝洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(3, 5, 10, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 5, 10, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 5, 10, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 4, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(22, 33, 58, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(240, 188, 112, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(240,188,112,.14)`——**带余烬金的暗描边**。
  // 暗底上的分层全靠它，而不是靠提亮底色。
  '--dsw-alias-border-l1': 'rgba(240, 188, 112, 0.1)',
  '--dsw-alias-border-l2': 'rgba(240, 188, 112, 0.14)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(240, 188, 112, 0.11)',
  '--dsw-alias-border-l3': 'rgba(240, 188, 112, 0.28)',
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(239, 233, 220, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(239, 233, 220, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e6e5e0',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': '#b0a794',
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#6f6a61',
  '--dsw-alias-label-dimmed': '#6f6a61',
  // 金实底上放白字对比度不够，配一档接近黑的深褐。
  '--dsw-alias-label-primary-foreground': '#211405',
  '--dsw-alias-label-primary-inverted': p.surface2,

  // ── Brand and primary button ──
  // 主操作是余烬金（原型 `踏云出发 →`）。星辉蓝不做实心按钮：
  // 它在这套里是"状态"的语言，铺成大块会把星海压成蓝屏。
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.gold2,
  '--dsw-alias-brand-primary-invert': '#211405',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.gold2,
  '--dsw-alias-button-primary-dimmed': '#8a6634',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface2,
  '--dsw-alias-button-floating-fill': p.surface,
  '--dsw-alias-button-floating-hover': p.surface2,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#1c2a48',
  '--dsw-alias-button-ghost-active-border': 'rgba(240, 188, 112, 0.28)',
  '--dsw-alias-button-info-fill': '#1e3564',
  '--dsw-alias-button-info-hover': '#274279',
  '--dsw-alias-button-tool-bar-fill': 'rgba(240, 188, 112, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(240, 188, 112, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(12, 20, 36, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(240, 188, 112, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(240, 188, 112, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(211, 154, 82, 0.22)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(202, 90, 73, 0.22)',

  // ── Status colours ──
  // 🔴 成功用余烬橙（#d97a3c 提亮一档），不用绿：这套稿子的调色盘里没有绿，
  // 硬塞一个会同时破坏"9% 金"和"64% 宇宙蓝"两条配比。用亮度与色相跟主操作金拉开。
  '--dsw-alias-state-success-primary': '#e0a06a',
  '--dsw-alias-state-success-secondary': p.ember,
  '--dsw-alias-state-success-tertiary': '#2a1c10',
  '--dsw-alias-state-warn-primary': p.gold2,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#f6d29a',
  '--dsw-alias-state-warn-tertiary': '#2c2314',
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#dd7565',
  // business = 进行中：星辉蓝。它是"星海"那一半，和金的"日出"那一半各占一边。
  '--dsw-alias-state-business-primary': p.blue2,
  '--dsw-alias-state-business-tertiary': '#152a4d',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#050810',
  '--dsw-alias-markdown-code-block-banner': p.surface,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#050810',
  '--dsw-alias-markdown-citation': p.surface2,
  '--dsw-alias-markdown-placeholder': p.surface,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(240, 188, 112, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(240, 188, 112, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(240, 188, 112, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface2,
  '--dsw-alias-tooltip-bg': p.surface2,

  // ── specific 层：harness 给具体部件留的口子 ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': p.surface,
  '--dsw-specific-bubble-highlight': p.surface2,
  '--dsw-specific-input-major': p.surface,
  '--dsw-specific-login-input': p.surface,
  '--dsw-specific-menu': p.surface2,
  '--dsw-specific-selector': p.surface,
  '--dsw-specific-tip': p.surface2,
}
