/**
 * 赛博道观的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 🔴 原型稿在对话里把这套的分寸写死了：
 *   「视觉上转译成"赛博道观"：**黑曜石底色、青铜描边、宣纸白文字、朱砂强调、玉石青状态**。」
 *   「道观气质要深，但**产品可用性不能被吞掉**——按钮、卡片、信息层级仍然是现代开发工具，
 *   只在氛围、用词、材质与动效上完成"修仙化"。」
 *
 * 五种材质各有各的位置，别互相串：
 *   - **黑曜石**（#0a0d10）：底与三级面板；
 *   - **青铜 / 宣纸**（rgba(228,207,168,.12)）：所有描边——这套的"材质感"全在这条线上；
 *   - **宣纸白**（#efe7d7）：正文，不是纯白，带暖；
 *   - **朱砂**（#b94235）：强调——选中的那一条会话，仅此而已；
 *   - **玉石青**（#6e9788）：**状态**。原型的原话就是"玉石青状态"，所以它落在"正在运行"上。
 * 主操作是**赤金**（`.send` 的 `linear-gradient(180deg,#d8b977,#b89252)` 配深字 #261f14）。
 */

/** 原型稿 `:root` 的原始色。 */
export const TAO_PALETTE = {
  /** 黑曜石。 */
  bg: '#0a0d10',
  bg2: '#0f1317',
  surface: '#13181d',
  surface2: '#171d22',
  surface3: '#1d242a',

  /** 宣纸白（正文）与它的次级。 */
  text: '#efe7d7',
  text2: '#b9b0a1',
  text3: '#8a857c',

  /** 青铜三档：描边与低饱和金属面。 */
  bronze: '#8f6d42',
  bronzeDeep: '#6d5230',
  bronzeLight: '#b59260',
  /** 赤金：主操作。 */
  gold: '#c8a768',
  goldLight: '#e0c58f',
  /** 朱砂：强调，只给"选中的那一个"。 */
  cinnabar: '#b94235',
  /** 玉石青：状态色。 */
  jade: '#6e9788',

  ok: '#7ca06e',
  warn: '#c8a768',
  danger: '#be665c',
} as const

const p = TAO_PALETTE

/** 交给 `ctx.theme.register()` 的 token 表。只写要改的，其余继承内置暗色基座。 */
export const TAO_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.surface,
  '--dsw-alias-bg-layer-2': p.surface2,
  '--dsw-alias-bg-layer-3': p.surface3,
  '--dsw-alias-bg-module-platform': p.surface2,
  '--dsw-alias-bg-overlay': p.surface3,
  '--dsw-alias-bg-multi-select': '#22282f',

  '--dsw-alias-bg-mask-1': 'rgba(6, 8, 10, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(6, 8, 10, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(6, 8, 10, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(4, 6, 7, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(45, 37, 25, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(228, 207, 168, 0.07)',

  // ── 描边：青铜 / 宣纸的那条线，这套的材质感全在这里 ──
  '--dsw-alias-border-l1': 'rgba(228, 207, 168, 0.08)',
  '--dsw-alias-border-l2': 'rgba(228, 207, 168, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(228, 207, 168, 0.1)',
  '--dsw-alias-border-l3': 'rgba(228, 207, 168, 0.22)',
  '--dsw-alias-border-l4': p.bronzeLight,
  '--dsw-alias-border-inverted': 'rgba(239, 231, 215, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(239, 231, 215, 0.1)',

  // ── 文字：宣纸白，不是纯白 ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': p.text,
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': p.text2,
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#7d786f',
  '--dsw-alias-label-dimmed': '#7d786f',
  // 赤金底上压深字（原型 `.send` 的 `color:#261f14`）。
  '--dsw-alias-label-primary-foreground': '#261f14',
  '--dsw-alias-label-primary-inverted': p.surface3,

  // ── 品牌与主按钮：赤金 ──
  '--dsw-alias-brand-primary': p.gold,
  '--dsw-alias-brand-text': p.goldLight,
  '--dsw-alias-brand-primary-invert': '#261f14',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.gold,
  '--dsw-alias-button-primary-fill': p.gold,
  '--dsw-alias-button-primary-hover': p.goldLight,
  '--dsw-alias-button-primary-dimmed': p.bronzeDeep,
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface3,
  '--dsw-alias-button-floating-fill': p.surface2,
  '--dsw-alias-button-floating-hover': p.surface3,
  '--dsw-alias-button-ghost-active-fill': '#1d242a',
  '--dsw-alias-button-ghost-active-hover': '#242c33',
  '--dsw-alias-button-ghost-active-border': 'rgba(228, 207, 168, 0.24)',
  // info 走青铜：比赤金低一档，不与主操作抢。
  '--dsw-alias-button-info-fill': p.bronzeDeep,
  '--dsw-alias-button-info-hover': p.bronze,
  '--dsw-alias-button-tool-bar-fill': 'rgba(200, 167, 104, 0.12)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(200, 167, 104, 0.22)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(19, 24, 29, 0.4)',

  // ── 交互态 ──
  '--dsw-alias-interactive-bg-hover': 'rgba(228, 207, 168, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(228, 207, 168, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(185, 66, 53, 0.2)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(190, 102, 92, 0.2)',

  // ── 状态色 ──
  '--dsw-alias-state-success-primary': p.ok,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': 'rgba(110, 151, 136, 0.16)',
  '--dsw-alias-state-warn-primary': p.warn,
  '--dsw-alias-state-warn-secondary': p.goldLight,
  '--dsw-alias-state-warn-label': p.goldLight,
  '--dsw-alias-state-warn-tertiary': '#2a2318',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': p.cinnabar,
  // 🔴 business = 进行中：玉石青。原型写的就是"玉石青状态"——朱砂是强调（选中的那一条），
  // 不是运行态；把两者对调会让"在跑"和"选中"变成同一个信号。
  '--dsw-alias-state-business-primary': p.jade,
  '--dsw-alias-state-business-tertiary': 'rgba(110, 151, 136, 0.16)',

  // ── Markdown 与代码 ──
  '--dsw-alias-markdown-code-block': '#0c1013',
  '--dsw-alias-markdown-code-block-banner': p.surface2,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#0c1013',
  '--dsw-alias-markdown-citation': p.surface3,
  '--dsw-alias-markdown-placeholder': p.surface2,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── 滚动条：青铜，不用中性灰 ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(228, 207, 168, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(228, 207, 168, 0.22)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(228, 207, 168, 0.24)',
  '--dsw-alias-scrollbar-hover-l2': p.bronzeLight,

  // ── 浮层 ──
  '--dsw-alias-toast-bg': p.surface3,
  '--dsw-alias-tooltip-bg': p.surface3,

  // ── specific 层 ──
  '--dsw-specific-sidebar-fill': '#0c1013',
  '--dsw-specific-sidebar-nav-item-hover': p.surface,
  '--dsw-specific-sidebar-nav-item-active': p.surface3,
  '--dsw-specific-sidebar-nav-item-active-accent': p.cinnabar,
  '--dsw-specific-bubble': p.surface2,
  '--dsw-specific-bubble-highlight': p.surface3,
  '--dsw-specific-input-major': p.surface2,
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.surface3,
  '--dsw-specific-selector': p.surface2,
  '--dsw-specific-tip': p.surface3,
}
