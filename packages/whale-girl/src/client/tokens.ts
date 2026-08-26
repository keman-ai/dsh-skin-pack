/**
 * 鲸鱼娘海岸休息室的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` /
 * `--dsw-specific-*` 语义层。
 *
 * 这一层是皮肤的地基，也是**唯一不依赖 harness DOM 结构**的部分：presenter 把这些值
 * 作为 inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。
 * harness 改版会动 class 名和布局，但不会动语义 token 的含义，所以这层能长期活着。
 *
 * 映射不是逐条抄色号，而是**按语义对位**：原型稿的 `--paper / --paper2 / 卡片白` 是
 * 三级容器，harness 的 `bg-base / layer-1 / layer-2 / layer-3` 也是逐级抬升，对上即可。
 * 原型没给的（遮罩、骨架屏、滚动条、危险态）从已有色阶推导，规则写在各段注释里。
 *
 * 🔴 这是一套**浅色**皮肤（`colorScheme: 'light'`），跟之前那套暗色皮肤相反。原型稿
 * 的设计说明写死了这条：「整体控制在浅蓝、白色、深蓝三个层级，避免赛博朋克感，
 * 突出柔和、清爽、可爱但仍然专业」。所以没列出的 token 继承的是 harness 的**内置浅色基座**，
 * 覆盖集不完整是有意的：列全反而会把将来新增的内置 token 挡在外面。
 */

/** 原型稿 `:root` 与 Appearance 色卡的原始色，改配色从这里改，下面全部由它派生。 */
export const WHALE_PALETTE = {
  /** Deep Navy：最深的一级，用于反白块与强对比按钮。 */
  navy: '#18357f',
  /** 次深蓝：navy 的抬升态。 */
  navy2: '#24479e',
  /** DeepSeek Blue：<b>主操作色</b>（原型的「＋ 新建对话」「允许」「发送」都是它）。 */
  blue: '#5369ef',
  /** 主操作的按下 / 悬停态（原型 new-btn 渐变的下端）。 */
  blueDeep: '#465be0',
  /** Sky Blue：描边与低饱和装饰。 */
  sky: '#7ca6ff',
  /** Ocean Cyan：海洋光，用于进度与"在动"的渐变末端。 */
  cyan: '#70d8ff',

  /** Pearl White：一级抬升面（卡片、输入框之下的纸面）。 */
  paper: '#f8fbff',
  /** 次级纸面，也是应用底色的来源。 */
  paper2: '#edf4ff',
  /** 应用最底（原型 body 背景）。 */
  base: '#eaf2ff',
  /** 选中态的浅蓝（原型 .session.active）。 */
  selected: '#e2e9ff',
  /** 工具输出块的淡蓝（原型 .toolbody）。 */
  code: '#f5f8ff',

  /** 主文字（原型 --ink）。 */
  ink: '#1d356d',
  /** 次级文字（原型 --ink2）。 */
  ink2: '#61729b',
  /** 三级文字（原型 .search / .stime 一类）。 */
  ink3: '#8290ad',
  /** 说明文字，最弱一级。 */
  ink4: '#9aa6bc',

  /** Online Green：<b>保留给在线 / 成功态</b>（原型五个系统状态都是它），不做主按钮。 */
  green: '#74bf72',
  /** 权限卡的琥珀（原型 .permission 的描边与标题色）。 */
  amber: '#eaab42',
  amberLabel: '#a66e1c',
} as const

const p = WHALE_PALETTE

/**
 * 交给 `ctx.theme.register()` 的 token 表。
 *
 * 只写**要改的**：没列出的继承 harness 内置浅色基座。
 */
export const WHALE_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  // 原型是「浅蓝底 + 白卡片」：底最沉、卡片最亮，与 harness 的 base → layer-1/2/3
  // 逐级抬升同构。这里刻意让 layer-3 到纯白，弹层比卡片再亮一档才分得开。
  '--dsw-alias-bg-base': p.base,
  '--dsw-alias-bg-layer-1': p.paper2,
  '--dsw-alias-bg-layer-2': p.paper,
  '--dsw-alias-bg-layer-3': '#ffffff',
  '--dsw-alias-bg-module-platform': p.paper,
  '--dsw-alias-bg-overlay': '#ffffff',
  '--dsw-alias-bg-multi-select': p.selected,

  // 遮罩原型只给了 Settings 弹窗那一处：rgba(26,45,93,.25) + blur。照它的色相铺开，
  // 不用纯黑透明——浅色界面压黑会脏，压深蓝才像"水面变深"。
  '--dsw-alias-bg-mask-1': 'rgba(26, 45, 93, 0.25)',
  '--dsw-alias-bg-mask-2': 'rgba(26, 45, 93, 0.12)',
  '--dsw-alias-bg-mask-3': 'rgba(26, 45, 93, 0.22)',
  '--dsw-alias-bg-mask-photo': 'rgba(18, 32, 66, 0.86)',
  '--dsw-alias-bg-mask-drop': 'rgba(210, 226, 255, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(37, 70, 145, 0.08)',

  // ── 描边 ──
  // 原型只有一个 --line: rgba(37,70,145,.12)。harness 要四级：l1 弱一点、l2 用原值，
  // l3/l4 往天蓝方向加强，保持同一色相（原型 Component language 要的是
  // 「1px 低对比描边」，所以四级全部克制）。
  '--dsw-alias-border-l1': 'rgba(37, 70, 145, 0.10)',
  '--dsw-alias-border-l2': 'rgba(37, 70, 145, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(37, 70, 145, 0.12)',
  '--dsw-alias-border-l3': '#b9cdf2',
  '--dsw-alias-border-l4': p.sky,
  // inverted 是落在深色块上的描边（如 navy 底的 Settings 侧栏）。
  '--dsw-alias-border-inverted': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0.26)',

  // ── 文字 ──
  '--dsw-alias-label-primary': p.ink,
  '--dsw-alias-label-primary-bluish': p.navy2,
  '--dsw-alias-label-primary-dimmed': p.ink2,
  '--dsw-alias-label-secondary': p.ink2,
  '--dsw-alias-label-tertiary': p.ink3,
  '--dsw-alias-label-caption': p.ink4,
  '--dsw-alias-label-dimmed': p.ink4,
  // 落在主色块（DeepSeek Blue）上的文字：白。
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.paper,

  // ── 品牌与主按钮 ──
  // 🔴 <b>主操作是 DeepSeek Blue，不是 Ocean Cyan，也不是绿</b>。原型稿里蓝色实心只出现在
  // 「＋ 新建对话」「允许」「发送」这三处主操作上；绿色被明确<b>保留给在线 / 成功态</b>
  // （五个 Assistant Systems 的"在线"、工具调用的 ✓）。拿绿做按钮会让"成功"和"可以点"
  // 变成同一个视觉语言，状态就没法读了。
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': '#3953c9',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': p.blueDeep,
  '--dsw-alias-button-primary-dimmed': '#b9c6f7',
  // 高对比按钮走 navy：浅底上唯一敢用的深色实心。
  '--dsw-alias-button-contrast-fill': p.navy,
  '--dsw-alias-button-elevated-fill': '#ffffff',
  '--dsw-alias-button-floating-fill': '#ffffff',
  '--dsw-alias-button-floating-hover': '#f2f6ff',
  '--dsw-alias-button-ghost-active-fill': p.selected,
  '--dsw-alias-button-ghost-active-hover': '#d7e2ff',
  '--dsw-alias-button-ghost-active-border': '#b9cdf2',
  // info 是「去看正在发生的事」，跟着深蓝走，不占主操作的位置。
  '--dsw-alias-button-info-fill': p.navy2,
  '--dsw-alias-button-info-hover': p.navy,
  '--dsw-alias-button-tool-bar-fill': 'rgba(83, 105, 239, 0.10)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(83, 105, 239, 0.18)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0)',

  // ── 交互态 ──
  // 浅底不能用"加白"做 hover（看不见），用极低透明度的深蓝压一层。
  '--dsw-alias-interactive-bg-hover': 'rgba(37, 70, 145, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(37, 70, 145, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.selected,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(83, 105, 239, 0.14)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(224, 104, 95, 0.14)',

  // ── 状态色 ──
  // 绿与琥珀直接来自原型；错误色原型没给（稿子里没有失败态），按同一套海洋色相推导一个
  // 偏珊瑚的红——纯红在这套浅蓝里会跳出画面。
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#6bb56a',
  '--dsw-alias-state-success-tertiary': '#e4f4e3',
  '--dsw-alias-state-warn-primary': p.amber,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': p.amberLabel,
  '--dsw-alias-state-warn-tertiary': '#fff9ec',
  '--dsw-alias-state-error-primary': '#e0685f',
  '--dsw-alias-state-error-secondary': '#c9544c',
  // 🔴 business 是 harness 标注「进行中 / 活动」的那档语义（spinner、运行指示读它）。
  // 原型把"在动"交给了海洋光（进度条 #546af0 → #6fcdfb 的渐变），但 Ocean Cyan 原色
  // 在浅底上对比不够，压深到能读的程度再用。
  '--dsw-alias-state-business-primary': '#2f9fd8',
  '--dsw-alias-state-business-tertiary': '#dff2fd',

  // ── Markdown 与代码 ──
  // 原型的工具输出块是淡蓝底 + 等宽字（.toolbody），代码块照它。
  '--dsw-alias-markdown-code-block': p.code,
  '--dsw-alias-markdown-code-block-banner': p.paper2,
  '--dsw-alias-markdown-inline-code': p.paper2,
  '--dsw-alias-markdown-code-segment-selected': p.selected,
  '--dsw-alias-markdown-code-segment-unselected': p.code,
  '--dsw-alias-markdown-citation': p.selected,
  '--dsw-alias-markdown-placeholder': p.paper2,
  '--dsw-alias-markdown-tag': p.paper2,

  // ── 滚动条 ──
  // 用深蓝半透明而不是中性灰：滚动条是长期可见的元素，灰色会把整片蓝调拉回中性。
  '--dsw-alias-scrollbar-bg-l1': 'rgba(37, 70, 145, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(83, 105, 239, 0.28)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(37, 70, 145, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.sky,

  // ── 浮层 ──
  // tooltip 在浅色界面里要反过来用深底白字，否则贴在白卡片上看不出是浮层。
  '--dsw-alias-toast-bg': '#ffffff',
  '--dsw-alias-tooltip-bg': '#26418f',

  // ── specific 层：harness 给具体部件留的口子 ──
  // 原型的侧栏是 #f7f9ff → #eef3ff 的竖向渐变，token 只能给单色，取中间值；
  // 渐变本身在 whale.module.css 里补。
  '--dsw-specific-sidebar-fill': '#f3f7ff',
  '--dsw-specific-sidebar-nav-item-hover': '#eaf1ff',
  '--dsw-specific-sidebar-nav-item-active': p.selected,
  '--dsw-specific-sidebar-nav-item-active-accent': p.blue,
  '--dsw-specific-bubble': '#ffffff',
  '--dsw-specific-bubble-highlight': p.paper2,
  '--dsw-specific-input-major': '#ffffff',
  '--dsw-specific-login-input': p.code,
  '--dsw-specific-menu': '#ffffff',
  '--dsw-specific-selector': '#ffffff',
  '--dsw-specific-tip': p.paper2,
}
