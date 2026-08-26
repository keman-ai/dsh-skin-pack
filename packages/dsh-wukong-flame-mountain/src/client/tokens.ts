/**
 * 焚山悟空的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值作为
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。harness 改版
 * 会动 class 名和布局，但不会动语义 token 的含义，所以这层能长期活着。
 *
 * 🔴 原型稿写死了**配比**：「72% 黑墨 / 14% 暗褐 Surface / 8% 古金 / 3% 青铜 / 2% 余烬橙 /
 * 1% 危险红」。这不是色卡，是**用量约束**——古金是点缀，余烬橙更少。所以：
 *   - 古金（Old Gold）只给主操作与品牌位，不铺面；
 *   - 余烬橙（Ember）**只给"正在运行"那一档语义**（`state-business-*`），它在界面上出现得越少，
 *     "在跑"这个信号越有效；
 *   - 危险红只给 error。
 *
 * ⚠️ 色号取 `:root` 里的那一套（也就是 Appearance 色卡实际渲染出来的颜色）。原型末尾
 * 「Design handoff」那几个 `<code>` 写的是另一组近似值（#B9813F / #7F5B35 / #B95B2F），
 * 与色块本身对不上——以能看见的色块为准。
 */

/** 原型稿 `:root` 的原始色，改配色从这里改，下面全部由它派生。 */
export const WUKONG_PALETTE = {
  /** Void：最底的黑墨，占七成。 */
  bg: '#080706',
  bg2: '#0d0b09',
  /** 三级抬升面（Armor Ink 一族）。 */
  surface: '#11100e',
  surface2: '#171411',
  surface3: '#1d1915',

  text: '#f1e7d8',
  text2: '#c7b6a0',
  text3: '#81776d',

  /** Old Gold：<b>主操作色</b>（原型的 Start task / 允许 / 发送都是这条金渐变）。 */
  gold: '#c67a32',
  /** 亮金：金渐变的上端，用作 hover。 */
  gold2: '#f0a34e',
  /** Bronze：次一级的实心块（info 按钮一类）。 */
  bronze: '#87502f',
  /** Ember 余烬橙：<b>保留给运行态</b>，别处不用。 */
  ember: '#d15e2f',
  /** 危险红，只给 error。 */
  red: '#b74632',
  /** 青铜绿，界面里唯一的冷色，给成功态。 */
  jade: '#7d9a87',
} as const

const p = WUKONG_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置暗色基座。覆盖集不完整是有意的——列全反而会把
 * 将来新增的内置 token 挡在外面。
 */
export const WUKONG_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  // 原型是「黑墨底 + 暗褐卡片」：bg → surface → surface2/3 逐级抬升，与 harness 的
  // base → layer-1/2/3 同构。
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.surface,
  '--dsw-alias-bg-layer-2': p.surface2,
  '--dsw-alias-bg-layer-3': p.surface3,
  '--dsw-alias-bg-module-platform': p.surface2,
  '--dsw-alias-bg-overlay': p.surface3,
  '--dsw-alias-bg-multi-select': p.surface3,

  // 遮罩：原型的 Settings 弹窗是 rgba(2,2,2,.78) + blur。照它的色相铺开——这套皮肤压暗要压
  // 到近乎纯黑，压灰会把黑墨洗成脏灰。
  '--dsw-alias-bg-mask-1': 'rgba(3, 2, 2, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 2, 2, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 2, 2, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 2, 2, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(37, 27, 18, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(241, 231, 216, 0.06)',

  // ── 描边 ──
  // 原型全场只有一条 `--line: rgba(211,164,91,.16)`——**带金色倾向的暗描边**，不是中性灰。
  // harness 要四级：l1 更弱、l2 用原值，l3/l4 升到实心青铜与古金。
  '--dsw-alias-border-l1': 'rgba(211, 164, 91, 0.10)',
  '--dsw-alias-border-l2': 'rgba(211, 164, 91, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(211, 164, 91, 0.12)',
  '--dsw-alias-border-l3': p.bronze,
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(241, 231, 216, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(241, 231, 216, 0.1)',

  // ── 文字 ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': p.text,
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': p.text2,
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#75695d',
  '--dsw-alias-label-dimmed': '#75695d',
  // 落在金色块上的字：原型的 Start task 按钮是深褐字 #21150b，不是白字——金底白字会糊。
  '--dsw-alias-label-primary-foreground': '#21150b',
  '--dsw-alias-label-primary-inverted': p.surface3,

  // ── 品牌与主按钮 ──
  // 🔴 <b>主操作是古金，不是余烬橙</b>。原型里橙（Ember）只出现在"正在跑"的指示上，
  // 而 Start task / 允许 / 发送 全是那条金渐变。拿橙做按钮会让"运行中"和"可以点"变成
  // 同一个视觉语言，状态就没法读了——这条与配比表里「8% 古金 / 2% 余烬橙」是一回事。
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': '#dfad65',
  '--dsw-alias-brand-primary-invert': '#21150b',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.gold2,
  '--dsw-alias-button-primary-dimmed': p.bronze,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface3,
  '--dsw-alias-button-floating-fill': p.surface2,
  '--dsw-alias-button-floating-hover': p.surface3,
  '--dsw-alias-button-ghost-active-fill': p.surface3,
  '--dsw-alias-button-ghost-active-hover': '#251b12',
  '--dsw-alias-button-ghost-active-border': 'rgba(211, 164, 91, 0.28)',
  // info 是「去看正在发生的事」，用青铜——比金低一档，不与主操作抢位。
  '--dsw-alias-button-info-fill': p.bronze,
  '--dsw-alias-button-info-hover': p.gold,
  '--dsw-alias-button-tool-bar-fill': 'rgba(198, 122, 50, 0.14)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(198, 122, 50, 0.24)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(23, 20, 17, 0.4)',

  // ── 交互态 ──
  // 暗底用"加暖白"做 hover：加金会让每一次悬停都像点亮了什么，与金的稀缺性冲突。
  '--dsw-alias-interactive-bg-hover': 'rgba(241, 231, 216, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(241, 231, 216, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(209, 94, 47, 0.2)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(183, 70, 50, 0.2)',

  // ── 状态色 ──
  '--dsw-alias-state-success-primary': p.jade,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': '#1c2620',
  // 需要你确认的操作走琥珀：原型的权限卡就是这个色（描边 rgba(185,91,47,.22)、标题 #dfad65）。
  '--dsw-alias-state-warn-primary': '#d18d46',
  '--dsw-alias-state-warn-secondary': '#d18d46',
  '--dsw-alias-state-warn-label': '#dfad65',
  '--dsw-alias-state-warn-tertiary': '#26180f',
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#c75849',
  // 🔴 business 是 harness 标注「进行中 / 活动」的那档语义（spinner、运行指示都读它），
  // 正是原型把余烬橙留给的位置：2% 的用量配比意味着它只该在"真的在跑"时出现。
  '--dsw-alias-state-business-primary': p.ember,
  '--dsw-alias-state-business-tertiary': '#2a1710',

  // ── Markdown 与代码 ──
  // 代码块比正文容器更沉（原型 .tool-body 是 #0b0907），读长代码时不刺眼。
  '--dsw-alias-markdown-code-block': '#0b0907',
  '--dsw-alias-markdown-code-block-banner': p.surface2,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#0b0907',
  '--dsw-alias-markdown-citation': p.surface3,
  '--dsw-alias-markdown-placeholder': p.surface2,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── 滚动条 ──
  // 用金色半透明而不是中性灰：滚动条是长期可见的元素，灰色会把整片暖调拉回中性。
  '--dsw-alias-scrollbar-bg-l1': 'rgba(211, 164, 91, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(211, 164, 91, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(211, 164, 91, 0.28)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── 浮层 ──
  '--dsw-alias-toast-bg': p.surface3,
  '--dsw-alias-tooltip-bg': p.surface3,

  // ── specific 层：harness 给具体部件留的口子 ──
  // 侧栏比主区更沉一档（原型 sidebar 是 rgba(8,7,6,.98)，main 略亮），让对话区往前浮。
  '--dsw-specific-sidebar-fill': '#0a0908',
  '--dsw-specific-sidebar-nav-item-hover': p.surface2,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.gold,
  '--dsw-specific-bubble': p.surface2,
  '--dsw-specific-bubble-highlight': p.surface3,
  '--dsw-specific-input-major': '#15110d',
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.surface3,
  '--dsw-specific-selector': '#15110d',
  '--dsw-specific-tip': p.surface3,
}
