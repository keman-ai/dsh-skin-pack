/**
 * 灰白仙境的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 这是一套**浅色**皮肤（`colorScheme: 'light'`）。原型稿的 Theme rules 把配比写成了
 * 一句数字，这是这套皮肤最硬的约束：
 * 「**80% 灰白 / 雾白基底；12% 墨灰层级；5% 淡金交互；2% 玉青运行态；1% 朱砂危险态**」。
 *
 * 换算成用量：
 *   - **纸白 / 雾白**（#f4f3f0 → #e3e0da）：底、面板、输入框——绝大部分界面；
 *   - **墨灰**（#313331）：文字与层级，不是黑。这套里没有纯黑；
 *   - **淡金**（#b18a50）：描边、主操作、品牌字。5% 的意思是"边和按钮"，不是大面积铺；
 *   - **玉青**（#6d948d）：只给**正在跑**。2%；
 *   - **朱砂**（#b55a52）：只给**危险与失败**。1%。
 *
 * 还有一句同样写死在稿子里：「仙侠主视觉集中在 New Session、Empty State 与少量 Identity
 * surface，**工作态不满屏铺图**」。所以封面只画在 hero。
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const MIST_PALETTE = {
  /** 纸白，最亮的一级。 */
  paper: '#f4f3f0',
  paper2: '#eceae5',
  /** 雾白：面板与分隔带。 */
  paper3: '#e3e0da',

  /** 墨灰三级。这套里没有纯黑——纯黑会把"雾"压成"影"。 */
  ink: '#313331',
  ink2: '#676b68',
  ink3: '#8f918d',

  line: '#d7d2c8',
  line2: '#c9c2b5',

  /** 淡金：描边、主操作、品牌字。 */
  gold: '#b18a50',
  gold2: '#d4b681',
  gold3: '#8d6b3d',
  /** 玉青：只给"正在跑"。 */
  jade: '#6d948d',
  jade2: '#4f7871',
  /** 朱砂：只给危险与失败。 */
  red: '#b55a52',
} as const

const p = MIST_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * 只写**要改的**：没列出的继承 harness 内置**浅色**基座（`colorScheme: 'light'`）。
 * 覆盖集不完整是有意的：列全反而会把将来新增的内置 token 挡在外面。
 */
export const MIST_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // 🔴 浅色皮肤的层级方向与暗色相反：底最亮，往上逐级压暗一点点。
  '--dsw-alias-bg-base': p.paper,
  '--dsw-alias-bg-layer-1': '#faf9f6',
  '--dsw-alias-bg-layer-2': '#ffffff',
  '--dsw-alias-bg-layer-3': p.paper2,
  '--dsw-alias-bg-module-platform': '#ffffff',
  '--dsw-alias-bg-overlay': '#ffffff',
  '--dsw-alias-bg-multi-select': '#e7ece9',

  // 遮罩：压向暖灰而不是纯黑。纯黑遮罩会在纸白上显出一层脏。
  '--dsw-alias-bg-mask-1': 'rgba(72, 69, 60, 0.42)',
  '--dsw-alias-bg-mask-2': 'rgba(72, 69, 60, 0.18)',
  '--dsw-alias-bg-mask-3': 'rgba(72, 69, 60, 0.32)',
  '--dsw-alias-bg-mask-photo': 'rgba(72, 69, 60, 0.72)',
  '--dsw-alias-bg-mask-drop': 'rgba(177, 138, 80, 0.14)',
  '--dsw-alias-bg-skeleton': 'rgba(72, 69, 60, 0.08)',

  // ── Borders ──
  // 原型全场两条：`--line: #d7d2c8` 与 `--line2: #c9c2b5`——**暖灰实线**。
  // 浅色界面的分层靠线，不靠阴影：满屏投影会把"纸"变成"卡片堆"。
  '--dsw-alias-border-l1': '#e6e2d9',
  '--dsw-alias-border-l2': p.line,
  '--dsw-alias-border-l2-darkmode-thin': p.line,
  '--dsw-alias-border-l3': p.line2,
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(49, 51, 49, 0.1)',
  '--dsw-alias-border-inverted2': 'rgba(49, 51, 49, 0.16)',

  // ── Text ──
  '--dsw-alias-label-primary': p.ink,
  '--dsw-alias-label-primary-bluish': '#33403c',
  '--dsw-alias-label-primary-dimmed': p.ink2,
  '--dsw-alias-label-secondary': p.ink2,
  '--dsw-alias-label-tertiary': p.ink3,
  '--dsw-alias-label-caption': '#9b9d98',
  '--dsw-alias-label-dimmed': '#9b9d98',
  // 🔴 反白块上的文字：浅色皮肤里这一条最容易漏。主按钮是淡金实底，
  // 白字对比度不够、黑字太硬，取纸白偏暖的一档。
  '--dsw-alias-label-primary-foreground': '#fdfcf9',
  '--dsw-alias-label-primary-inverted': '#fdfcf9',

  // ── Brand and primary button ──
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.gold3,
  '--dsw-alias-brand-primary-invert': '#fdfcf9',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.gold3,
  '--dsw-alias-button-primary-dimmed': p.gold2,
  '--dsw-alias-button-contrast-fill': p.ink,
  '--dsw-alias-button-elevated-fill': '#ffffff',
  '--dsw-alias-button-floating-fill': '#ffffff',
  '--dsw-alias-button-floating-hover': p.paper2,
  '--dsw-alias-button-ghost-active-fill': '#efece4',
  '--dsw-alias-button-ghost-active-hover': p.paper3,
  '--dsw-alias-button-ghost-active-border': p.line2,
  '--dsw-alias-button-info-fill': '#e7eeec',
  '--dsw-alias-button-info-hover': '#dae5e2',
  '--dsw-alias-button-tool-bar-fill': 'rgba(177, 138, 80, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(177, 138, 80, 0.18)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0.6)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(72, 69, 60, 0.05)',
  '--dsw-alias-interactive-bg-active': 'rgba(72, 69, 60, 0.09)',
  '--dsw-alias-interactive-bg-hover-solid': p.paper2,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(177, 138, 80, 0.16)',
  // 那 1% 朱砂的其中一处：危险操作的悬停。
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(181, 90, 82, 0.14)',

  // ── Status colours ──
  // 🔴 成功也走玉青。这套稿子的调色盘里根本没有绿——硬塞一个会同时破坏
  // "2% 玉青"和"80% 灰白"两条配比。用深浅区分：成功用深一档的 jade2。
  '--dsw-alias-state-success-primary': p.jade2,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': '#e7eeec',
  // 警告：往淡金上靠。稿子没给黄，而淡金本来就是这套的"注意"色。
  // 浅底上要用深一档的 gold3，gold2 在纸白上几乎看不见。
  '--dsw-alias-state-warn-primary': p.gold3,
  '--dsw-alias-state-warn-secondary': p.gold,
  '--dsw-alias-state-warn-label': '#7a5c33',
  '--dsw-alias-state-warn-tertiary': '#f5efe3',
  // 错误：朱砂。1% 的另一处。
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#9c4a43',
  // business = 进行中：玉青。原型「运行中」那颗点就是它。
  '--dsw-alias-state-business-primary': p.jade2,
  '--dsw-alias-state-business-tertiary': '#e7eeec',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#f7f6f2',
  '--dsw-alias-markdown-code-block-banner': p.paper2,
  '--dsw-alias-markdown-inline-code': '#efece4',
  '--dsw-alias-markdown-code-segment-selected': p.paper3,
  '--dsw-alias-markdown-code-segment-unselected': '#f7f6f2',
  '--dsw-alias-markdown-citation': '#efece4',
  '--dsw-alias-markdown-placeholder': p.paper2,
  '--dsw-alias-markdown-tag': '#efece4',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(72, 69, 60, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(72, 69, 60, 0.22)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(72, 69, 60, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.gold3,

  // ── Overlays ──
  // 浅色皮肤里 toast / tooltip 通常反过来做成暗底，否则浮在纸白上分不出层。
  '--dsw-alias-toast-bg': '#3a3c39',
  '--dsw-alias-tooltip-bg': '#3a3c39',

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': '#faf9f6',
  '--dsw-specific-sidebar-nav-item-hover': '#efece4',
  '--dsw-specific-sidebar-nav-item-active': p.paper3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': '#ffffff',
  '--dsw-specific-bubble-highlight': p.paper2,
  '--dsw-specific-input-major': '#ffffff',
  '--dsw-specific-login-input': '#ffffff',
  '--dsw-specific-menu': '#ffffff',
  '--dsw-specific-selector': '#ffffff',
  '--dsw-specific-tip': '#efece4',
}
