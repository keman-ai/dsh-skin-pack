/**
 * 奥特小队·末日的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值作为
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。
 *
 * 🔴 这套稿子**没有** Theme rules 那一节（不像同批的其它几套写死了配比），只给了一组
 * `:root` 变量。所以配比得从它**实际怎么用**这些变量里读出来：
 *
 *   - `--bg: #120909` / `--panel: #1a1010`——底与面板是**烧焦的暗红黑**，不是中性黑。
 *     整套界面的八成是它；
 *   - `--line: rgba(255,151,85,.16)`——**全场只有一条描边**，带火光橙。分层全靠它；
 *   - `--orange: #ff7b2c`——主操作（原型 `.new` 是 `linear-gradient(135deg,#f0522d,#bb251f)`，
 *     橙红渐变）；
 *   - `--red: #ef3b2f`——奥特曼身上那片红，留给**危险与失败**；
 *   - `--yellow: #ffdc60` / `--cyan: #57d9ff` / `--green: #65dfa3`——原型只在小徽标和
 *     状态点上零星用过，这里分别落到警告、进行中、成功。
 *
 * 🔴 **橙和红必须分开**：橙是"你要做的事"（主操作），红是"出事了"。这套画面本身就是
 * 一片火，两个色再混在一起，界面会变成"哪里都在烧"，真出错时反而看不见。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const ULTRATEAM_PALETTE = {
  /** 烧焦的暗红黑。 */
  bg: '#120909',
  bg2: '#1a0c0b',
  /** 面板两级。 */
  panel: '#1a1010',
  panel2: '#251311',

  text: '#fff2e6',
  muted: '#b08f7b',

  /** 火光橙：主操作。 */
  orange: '#ff7b2c',
  /** 战斗红：危险与失败。 */
  red: '#ef3b2f',
  /** 计时黄：警告。 */
  yellow: '#ffdc60',
  /** 能量青：进行中。 */
  cyan: '#57d9ff',
  /** 恢复绿：成功。 */
  green: '#65dfa3',
} as const

const p = ULTRATEAM_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。
 */
export const ULTRATEAM_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // 🔴 原型只给了两级面板（`--panel` / `--panel2`），harness 要三级。
  // 第三级往上再抬一档而不是复用 panel2：层级塌成两级后，弹层和选中态会分不出来。
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.bg2,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#331915',

  // 遮罩：压向暗红黑而不是纯黑。纯黑会把这套的"焦"洗成"灰"。
  '--dsw-alias-bg-mask-1': 'rgba(9, 4, 4, 0.74)',
  '--dsw-alias-bg-mask-2': 'rgba(9, 4, 4, 0.36)',
  '--dsw-alias-bg-mask-3': 'rgba(9, 4, 4, 0.64)',
  '--dsw-alias-bg-mask-photo': 'rgba(7, 4, 3, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(51, 25, 21, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 151, 85, 0.08)',

  // ── Borders ──
  // 原型全场一条 `--line: rgba(255,151,85,.16)`——带火光的暗描边。分层全靠它。
  '--dsw-alias-border-l1': 'rgba(255, 151, 85, 0.11)',
  '--dsw-alias-border-l2': 'rgba(255, 151, 85, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 151, 85, 0.13)',
  '--dsw-alias-border-l3': 'rgba(255, 151, 85, 0.3)',
  '--dsw-alias-border-l4': p.orange,
  '--dsw-alias-border-inverted': 'rgba(255, 242, 230, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(255, 242, 230, 0.1)',

  // ── Text ──
  // 正文是米白偏暖的 `#fff2e6`，次要文字是 `#b08f7b`——都带一点烟熏的暖，
  // 跟这片火光是同一套光。放中性灰会像贴上去的。
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#f6ece3',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#c2a18d',
  '--dsw-alias-label-tertiary': '#8f7767',
  '--dsw-alias-label-caption': '#7a6455',
  '--dsw-alias-label-dimmed': '#7a6455',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // 主操作是那条橙红渐变（原型 `.new`）。这里用它的中点 `#ff7b2c` 做实心，
  // 白字压得住。
  '--dsw-alias-brand-primary': p.orange,
  '--dsw-alias-brand-text': '#ffa763',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.orange,
  '--dsw-alias-button-primary-fill': p.orange,
  '--dsw-alias-button-primary-hover': '#ff9450',
  '--dsw-alias-button-primary-dimmed': '#8f4319',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.panel2,
  '--dsw-alias-button-floating-fill': p.panel,
  '--dsw-alias-button-floating-hover': p.panel2,
  '--dsw-alias-button-ghost-active-fill': '#331915',
  '--dsw-alias-button-ghost-active-hover': '#3d1e19',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 151, 85, 0.3)',
  '--dsw-alias-button-info-fill': '#123c4c',
  '--dsw-alias-button-info-hover': '#164c60',
  '--dsw-alias-button-tool-bar-fill': 'rgba(255, 123, 44, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(255, 123, 44, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(26, 16, 16, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 151, 85, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 151, 85, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#331915',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(255, 123, 44, 0.22)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(239, 59, 47, 0.24)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#79e5b1',
  '--dsw-alias-state-success-tertiary': '#0f3025',
  '--dsw-alias-state-warn-primary': p.yellow,
  '--dsw-alias-state-warn-secondary': '#f5cf5c',
  '--dsw-alias-state-warn-label': '#ffe995',
  '--dsw-alias-state-warn-tertiary': '#32290f',
  // 🔴 错误用 `--red`，主操作用 `--orange`，两者不共用。这套画面本身就是一片火，
  // 橙红再混在一起，真出错时反而看不见。
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#f5665b',
  // business = 进行中：能量青。全场唯一的冷色，在这片火里最容易被认出来。
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#0f3444',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#0d0605',
  '--dsw-alias-markdown-code-block-banner': p.panel,
  '--dsw-alias-markdown-inline-code': p.panel2,
  '--dsw-alias-markdown-code-segment-selected': '#331915',
  '--dsw-alias-markdown-code-segment-unselected': '#0d0605',
  '--dsw-alias-markdown-citation': p.panel2,
  '--dsw-alias-markdown-placeholder': p.panel,
  '--dsw-alias-markdown-tag': p.panel2,

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 151, 85, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 151, 85, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 151, 85, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.orange,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── specific 层：harness 给具体部件留的口子 ──
  '--dsw-specific-sidebar-fill': p.bg2,
  '--dsw-specific-sidebar-nav-item-hover': p.panel,
  '--dsw-specific-sidebar-nav-item-active': '#331915',
  '--dsw-specific-sidebar-nav-item-active-accent': p.orange,
  '--dsw-specific-bubble': p.panel,
  '--dsw-specific-bubble-highlight': p.panel2,
  '--dsw-specific-input-major': p.panel,
  '--dsw-specific-login-input': p.panel,
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': p.panel,
  '--dsw-specific-tip': p.panel2,
}
