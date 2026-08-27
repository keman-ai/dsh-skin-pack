/**
 * 宇宙探索的配色：原型稿的设计变量 → harness 的 `--dsw-alias-*` / `--dsw-specific-*` 语义层。
 *
 * 🔴 原型稿 Appearance 面板的「Theme rules」写死了三条：
 *   「以**深蓝太空**为主底，**冷蓝与紫色星云**做视觉高潮，**少量暖色只用于重要状态与任务按钮**。
 *   New Mission 使用全屏宇宙探索封面，Console / Trajectory 回归低干扰、真实可用的 Harness 界面。」
 *
 * 落到用量上：深蓝铺满、冷蓝与紫做强调（主操作是紫罗兰实心，`.hero-send` 是
 * `linear-gradient(180deg,#9f82ff,#6e69e4)`），暖色（#ffb772 / #f0b46d）**只给需要你注意的状态**，
 * 不参与任何常规按钮。
 */

/** 原型稿 `:root` 与 Appearance 色卡的原始色。 */
export const COSMIC_PALETTE = {
  /** Space：深蓝太空，最底。 */
  bg: '#050814',
  bg2: '#091126',
  /** 三级抬升面。 */
  surface: '#0b1329',
  surface2: '#101b36',
  /** Panel Blue。 */
  surface3: '#152248',

  text: '#edf2fb',
  text2: '#b8c4d8',
  text3: '#7482a1',

  /** Telemetry：冷蓝，用于描边与数据。 */
  blue: '#72b8ff',
  blue2: '#9bd6ff',
  /** Nebula Violet：<b>主操作色</b>。 */
  violet: '#8c74ff',
  violet2: '#b08cff',
  /** 主按钮实心用的那一档紫。 */
  violetSolid: '#796eeb',
  /** Glow：星云辉光，用于"正在运行"。 */
  glow: '#61d0ff',
  /** 🔴 暖色：只给重要状态，不做常规按钮。 */
  amber: '#ffb772',

  ok: '#70c6a0',
  warn: '#f0b46d',
  danger: '#ff7b7b',
} as const

const p = COSMIC_PALETTE

/** 交给 `ctx.theme.register()` 的 token 表。只写要改的，其余继承内置暗色基座。 */
export const COSMIC_TOKENS: Record<string, string> = {
  // ── 容器层次 ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.surface,
  '--dsw-alias-bg-layer-2': p.surface2,
  '--dsw-alias-bg-layer-3': p.surface3,
  '--dsw-alias-bg-module-platform': p.surface2,
  '--dsw-alias-bg-overlay': p.surface3,
  '--dsw-alias-bg-multi-select': '#152248',

  // 遮罩压向太空蓝，不压纯黑——纯黑会把星云的蓝紫洗成灰。
  '--dsw-alias-bg-mask-1': 'rgba(2, 5, 12, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(2, 5, 12, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(2, 5, 12, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(1, 3, 8, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(21, 34, 72, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(155, 214, 255, 0.08)',

  // ── 描边 ──
  // 原型有两条线：冷蓝 `rgba(130,170,255,.12)` 与星云紫 `rgba(176,140,255,.14)`。
  // 低两级走冷蓝（大部分分层），高两级走紫（强调边）。
  '--dsw-alias-border-l1': 'rgba(130, 170, 255, 0.09)',
  '--dsw-alias-border-l2': 'rgba(130, 170, 255, 0.12)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(130, 170, 255, 0.1)',
  '--dsw-alias-border-l3': 'rgba(176, 140, 255, 0.28)',
  '--dsw-alias-border-l4': p.violet2,
  '--dsw-alias-border-inverted': 'rgba(237, 242, 251, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 242, 251, 0.1)',

  // ── 文字 ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#dfe7f3',
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': p.text2,
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#71809d',
  '--dsw-alias-label-dimmed': '#71809d',
  // 紫底上压深色字（原型 `.hero-send` 的 `color:#0d0a21`）。
  '--dsw-alias-label-primary-foreground': '#0d0a21',
  '--dsw-alias-label-primary-inverted': p.surface3,

  // ── 品牌与主按钮 ──
  // 🔴 主操作是**星云紫**，不是暖色。规则原文：「少量暖色只用于重要状态与任务按钮」——
  // 这里的"任务按钮"在原型里指的是 hero 上那颗 START EXPLORATION，而它用的是紫渐变；
  // 真正的暖色只出现在 telemetry 与警告态上。拿暖色铺主按钮会让"该注意了"失效。
  '--dsw-alias-brand-primary': p.violetSolid,
  '--dsw-alias-brand-text': p.violet2,
  '--dsw-alias-brand-primary-invert': '#0d0a21',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.violetSolid,
  '--dsw-alias-button-primary-fill': p.violetSolid,
  '--dsw-alias-button-primary-hover': '#9f82ff',
  '--dsw-alias-button-primary-dimmed': '#3a3376',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': p.surface3,
  '--dsw-alias-button-floating-fill': p.surface2,
  '--dsw-alias-button-floating-hover': p.surface3,
  '--dsw-alias-button-ghost-active-fill': '#152248',
  '--dsw-alias-button-ghost-active-hover': '#1b2b58',
  '--dsw-alias-button-ghost-active-border': 'rgba(155, 214, 255, 0.24)',
  '--dsw-alias-button-info-fill': '#1c3a6b',
  '--dsw-alias-button-info-hover': '#2a5290',
  '--dsw-alias-button-tool-bar-fill': 'rgba(114, 184, 255, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(114, 184, 255, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(11, 19, 41, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(155, 214, 255, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(155, 214, 255, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#152248',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(140, 116, 255, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(255, 123, 123, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.ok,
  '--dsw-alias-state-success-secondary': p.ok,
  '--dsw-alias-state-success-tertiary': '#10281f',
  // 🔴 暖色的正当用途：需要你注意的状态。
  '--dsw-alias-state-warn-primary': p.warn,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': '#ffd3a4',
  '--dsw-alias-state-warn-tertiary': '#2c2114',
  '--dsw-alias-state-error-primary': p.danger,
  '--dsw-alias-state-error-secondary': '#ff9a9a',
  // business = 进行中：Glow 冷蓝。它在这片深蓝里最亮，又不跟紫的主操作抢。
  '--dsw-alias-state-business-primary': p.glow,
  '--dsw-alias-state-business-tertiary': '#0c2e42',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#070c1a',
  '--dsw-alias-markdown-code-block-banner': p.surface2,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#070c1a',
  '--dsw-alias-markdown-citation': p.surface3,
  '--dsw-alias-markdown-placeholder': p.surface2,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── 滚动条 ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(130, 170, 255, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(176, 140, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(130, 170, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.violet2,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface3,
  '--dsw-alias-tooltip-bg': p.surface3,

  // ── specific 层 ──
  '--dsw-specific-sidebar-fill': '#060b18',
  '--dsw-specific-sidebar-nav-item-hover': '#121e3a',
  '--dsw-specific-sidebar-nav-item-active': '#152248',
  '--dsw-specific-sidebar-nav-item-active-accent': p.violet2,
  '--dsw-specific-bubble': p.surface2,
  '--dsw-specific-bubble-highlight': p.surface3,
  '--dsw-specific-input-major': '#0f1a33',
  '--dsw-specific-login-input': p.bg2,
  '--dsw-specific-menu': p.surface3,
  '--dsw-specific-selector': '#0f1a33',
  '--dsw-specific-tip': p.surface3,
}
