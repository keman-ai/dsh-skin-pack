/**
 * 鲸跃横幅的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale. A harness redesign changes
 * class names and layout but not what a semantic token means, so this layer lasts.
 *
 * 🔴 原型稿 Appearance 面板里的第 4 条实现建议是硬约束：
 * 「色彩尽量控制在 **DeepSeek 蓝 + 白 + 极浅灰蓝**，保持轻、干净、品牌化」。
 * 所以这套皮肤里几乎没有第五种颜色——绿只在"在线 / 成功"上出现一次，暖色只在需要确认的操作上
 * 出现一次，其余全部是蓝白两色的深浅。**克制本身就是这套设计的内容**，别加装饰色。
 */

/** The raw colours from the prototype's `:root` and Appearance swatch. Recolour here; everything below derives from these. */
export const WAVE_PALETTE = {
  /** Primary：DeepSeek 蓝，主操作色。 */
  brand: '#4969ef',
  /** Accent：渐变按钮的上端，也是 hover。 */
  brand2: '#6c8cff',
  /** Soft Blue：浅蓝，用于弱强调与描边升级。 */
  brand3: '#9dbbff',

  /** Background：应用底色（极浅灰蓝）。 */
  bg: '#eef4ff',
  /** 一级纸面。 */
  panel: '#f9fbff',
  /** 卡片白。 */
  panel2: '#ffffff',
  /** 选中态的浅蓝（原型 `.session.active`）。 */
  selected: '#e6edff',
  /** 工具输出块的淡蓝（原型 `.toolbody`）。 */
  code: '#f7faff',

  /** 主文字。 */
  text: '#20345f',
  /** 次级文字。 */
  muted: '#7f8eaa',
  /** 三级文字 / 说明。 */
  muted2: '#8b99b3',
  /** 最弱一级。 */
  muted3: '#9ba7bc',

  /** Online：唯一的绿，只给在线与成功。 */
  green: '#69bd78',
} as const

const p = WAVE_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; unlisted tokens inherit the harness's built-in light base.
 */
export const WAVE_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // 原型是「极浅灰蓝底 + 白卡片」：bg → panel → 白，与 harness 的 base → layer-1/2/3 同构。
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': '#f4f8ff',
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': p.selected,

  // 遮罩：原型的 Settings 弹窗是 rgba(31,51,98,.20) + 4px 模糊——压得很轻，浅色界面压重了会脏。
  '--dsw-alias-bg-mask-1': 'rgba(31, 51, 98, 0.2)',
  '--dsw-alias-bg-mask-2': 'rgba(31, 51, 98, 0.1)',
  '--dsw-alias-bg-mask-3': 'rgba(31, 51, 98, 0.18)',
  '--dsw-alias-bg-mask-photo': 'rgba(20, 34, 68, 0.86)',
  '--dsw-alias-bg-mask-drop': 'rgba(214, 228, 255, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(67, 102, 205, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(67,102,205,.13)`——带蓝的极淡描边，是"轻"的主要来源。
  // 四级都按它的色相走，l3/l4 才升到实色浅蓝。
  '--dsw-alias-border-l1': 'rgba(67, 102, 205, 0.09)',
  '--dsw-alias-border-l2': 'rgba(67, 102, 205, 0.13)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(67, 102, 205, 0.11)',
  '--dsw-alias-border-l3': '#d9e3ff',
  '--dsw-alias-border-l4': p.brand3,
  '--dsw-alias-border-inverted': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0.26)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#3556c7',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#43557a',
  '--dsw-alias-label-tertiary': p.muted,
  '--dsw-alias-label-caption': p.muted2,
  '--dsw-alias-label-dimmed': p.muted3,
  // 落在蓝色主按钮上的字：白。
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel,

  // ── Brand and primary button ──
  // 主操作是 DeepSeek 蓝（原型的「＋ 新建对话」「开始任务 →」「发送」都是这条蓝渐变）。
  // 绿被明确保留给在线态（色卡上就叫 Online），不参与操作。
  '--dsw-alias-brand-primary': p.brand,
  '--dsw-alias-brand-text': '#3556c7',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.brand,
  '--dsw-alias-button-primary-fill': p.brand,
  '--dsw-alias-button-primary-hover': p.brand2,
  '--dsw-alias-button-primary-dimmed': '#b9c6f7',
  '--dsw-alias-button-contrast-fill': '#20345f',
  '--dsw-alias-button-elevated-fill': p.panel2,
  '--dsw-alias-button-floating-fill': p.panel2,
  '--dsw-alias-button-floating-hover': '#f4f7ff',
  '--dsw-alias-button-ghost-active-fill': p.selected,
  '--dsw-alias-button-ghost-active-hover': '#d9e3ff',
  '--dsw-alias-button-ghost-active-border': '#d9e3ff',
  '--dsw-alias-button-info-fill': '#3556c7',
  '--dsw-alias-button-info-hover': p.brand,
  '--dsw-alias-button-tool-bar-fill': 'rgba(73, 105, 239, 0.08)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(73, 105, 239, 0.16)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0)',

  // ── Interaction states ──
  // 浅底不能用"加白"做 hover（看不见），用极低透明度的蓝压一层。
  '--dsw-alias-interactive-bg-hover': 'rgba(67, 102, 205, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(67, 102, 205, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.selected,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(73, 105, 239, 0.14)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(214, 96, 88, 0.14)',

  // ── Status colours ──
  // 绿直接来自色卡的 Online；琥珀与红原型没给（稿子里没有失败态与确认态），
  // 按"轻、干净"的基调各推一个低饱和值——它们在这套皮肤里出现得越少越好。
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#65b270',
  '--dsw-alias-state-success-tertiary': '#e6f4e8',
  '--dsw-alias-state-warn-primary': '#e0a63e',
  '--dsw-alias-state-warn-secondary': '#e0a63e',
  '--dsw-alias-state-warn-label': '#96681c',
  '--dsw-alias-state-warn-tertiary': '#fdf6e8',
  '--dsw-alias-state-error-primary': '#d66058',
  '--dsw-alias-state-error-secondary': '#c14c45',
  // business is the harness's semantic for in-progress and active (read by the spinner and the running indicator).
  // 给品牌蓝的亮一档：这套皮肤只有蓝白，运行态没必要引入第五种颜色。
  '--dsw-alias-state-business-primary': p.brand2,
  '--dsw-alias-state-business-tertiary': '#e6edff',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': p.code,
  '--dsw-alias-markdown-code-block-banner': '#f3f7ff',
  '--dsw-alias-markdown-inline-code': '#f3f7ff',
  '--dsw-alias-markdown-code-segment-selected': p.selected,
  '--dsw-alias-markdown-code-segment-unselected': p.code,
  '--dsw-alias-markdown-citation': p.selected,
  '--dsw-alias-markdown-placeholder': '#f3f7ff',
  '--dsw-alias-markdown-tag': '#f3f7ff',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(67, 102, 205, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(73, 105, 239, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(67, 102, 205, 0.24)',
  '--dsw-alias-scrollbar-hover-l2': p.brand3,

  // ── Overlays ──
  // In a light UI a tooltip must invert to white on dark, or it is indistinguishable from the white card it floats over.
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': '#27418a',

  // ── The specific layer: hooks the harness leaves for individual parts ──
  // 原型的侧栏是 #f8fbff → #f0f5fd 的竖向渐变，token 只能给单色，取中间值；渐变在样式表里补。
  '--dsw-specific-sidebar-fill': '#f4f8ff',
  '--dsw-specific-sidebar-nav-item-hover': '#edf2ff',
  '--dsw-specific-sidebar-nav-item-active': p.selected,
  '--dsw-specific-sidebar-nav-item-active-accent': p.brand,
  '--dsw-specific-bubble': p.panel2,
  '--dsw-specific-bubble-highlight': '#f3f7ff',
  '--dsw-specific-input-major': '#fbfdff',
  '--dsw-specific-login-input': p.code,
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': p.panel2,
  '--dsw-specific-tip': '#f3f7ff',
}
