/**
 * Flame Mountain Wukong's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * inline 变量刷到 body 上，界面的底色、层次、描边、文字、状态色随之整体换掉。harness 改版
 * 会动 class 名和布局，但不会动语义 token 的含义，所以这层能长期活着。
 *
 * 🔴 The prototype fixes the **ratios**: 72% black ink / 14% dark brown surface / 8% old gold / 3% bronze / 2% ember orange /
 * 1% danger red. This is not a swatch but a **usage constraint** — old gold is an accent, and ember orange rarer still. So:
 *   - old gold goes to the primary action and the brand slots only, never across a surface;
 *   - ember goes **only to the running semantic** (`state-business-*`), and the rarer it is on screen,
 *     the more the running signal means;
 *   - danger red goes to error alone.
 *
 * ⚠️ The values come from `:root` (what the Appearance swatch actually renders). The `<code>` blocks in the
 * prototype's closing "Design handoff" list a different set of approximations (#B9813F / #7F5B35 / #B95B2F)
 * that do not match the swatches themselves — the visible swatch wins.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const WUKONG_PALETTE = {
  /** Void: the lowest black ink, seven tenths of the interface. */
  bg: '#080706',
  bg2: '#0d0b09',
  /** Three raised surfaces (the Armor Ink family). */
  surface: '#11100e',
  surface2: '#171411',
  surface3: '#1d1915',

  text: '#f1e7d8',
  text2: '#c7b6a0',
  text3: '#81776d',

  /** Old Gold: the <b>primary action colour</b> (the prototype's Start task, Allow and Send all use this gold gradient). */
  gold: '#c67a32',
  /** Bright gold: the top of the gold gradient, used for hover. */
  gold2: '#f0a34e',
  /** Bronze: the second-tier solid block, such as the info button. */
  bronze: '#87502f',
  /** Ember orange: <b>reserved for the running state</b> and used nowhere else. */
  ember: '#d15e2f',
  /** Danger red, for error alone. */
  red: '#b74632',
  /** Bronze green, the interface's only cool colour, for success. */
  jade: '#7d9a87',
} as const

const p = WUKONG_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; unlisted tokens inherit the harness's built-in dark base. The incomplete override
 * set is deliberate — listing everything would shut out built-in tokens added later.
 */
export const WUKONG_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // The prototype is a black-ink ground with dark brown cards: bg → surface → surface2/3 rise step by step,
  // isomorphic to the harness's base → layer-1/2/3.
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.surface,
  '--dsw-alias-bg-layer-2': p.surface2,
  '--dsw-alias-bg-layer-3': p.surface3,
  '--dsw-alias-bg-module-platform': p.surface2,
  '--dsw-alias-bg-overlay': p.surface3,
  '--dsw-alias-bg-multi-select': p.surface3,

  // The scrim: the prototype's Settings modal is rgba(2,2,2,.78) with a blur. Its hue is applied throughout — this skin
  // darkens to near black, since grey would wash the ink into dirty grey.
  '--dsw-alias-bg-mask-1': 'rgba(3, 2, 2, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 2, 2, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 2, 2, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 2, 2, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(37, 27, 18, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(241, 231, 216, 0.06)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(211,164,91,.16)` — a **dark border tinted gold**, not neutral grey.
  // The harness wants four: l1 weaker, l2 the original, and l3/l4 rising to solid bronze and old gold.
  '--dsw-alias-border-l1': 'rgba(211, 164, 91, 0.10)',
  '--dsw-alias-border-l2': 'rgba(211, 164, 91, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(211, 164, 91, 0.12)',
  '--dsw-alias-border-l3': p.bronze,
  '--dsw-alias-border-l4': p.gold,
  '--dsw-alias-border-inverted': 'rgba(241, 231, 216, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(241, 231, 216, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': p.text,
  '--dsw-alias-label-primary-dimmed': p.text2,
  '--dsw-alias-label-secondary': p.text2,
  '--dsw-alias-label-tertiary': p.text3,
  '--dsw-alias-label-caption': '#75695d',
  '--dsw-alias-label-dimmed': '#75695d',
  // Text on a gold block: the prototype's Start task button uses deep brown #21150b, not white — white on gold smears.
  '--dsw-alias-label-primary-foreground': '#21150b',
  '--dsw-alias-label-primary-inverted': p.surface3,

  // ── Brand and primary button ──
  // 🔴 <b>The primary action is old gold, not ember orange.</b> In the prototype ember appears only on the running
  // indicator, while Start task, Allow and Send all use the gold gradient. An orange button would make running and
  // clickable one visual language, leaving state unreadable — the same point as the 8% gold / 2% ember ratio.
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
  // info means "go and see what is happening", so bronze — a step below gold, never competing with the primary action.
  '--dsw-alias-button-info-fill': p.bronze,
  '--dsw-alias-button-info-hover': p.gold,
  '--dsw-alias-button-tool-bar-fill': 'rgba(198, 122, 50, 0.14)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(198, 122, 50, 0.24)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(23, 20, 17, 0.4)',

  // ── Interaction states ──
  // On a dark ground hover adds warm white: adding gold would make every hover look like something lit up, against gold's scarcity.
  '--dsw-alias-interactive-bg-hover': 'rgba(241, 231, 216, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(241, 231, 216, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.surface3,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(209, 94, 47, 0.2)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(183, 70, 50, 0.2)',

  // ── Status colours ──
  '--dsw-alias-state-success-primary': p.jade,
  '--dsw-alias-state-success-secondary': p.jade,
  '--dsw-alias-state-success-tertiary': '#1c2620',
  // Actions needing your confirmation use amber: the prototype's permission card is exactly this colour (a rgba(185,91,47,.22) border, a #dfad65 heading).
  '--dsw-alias-state-warn-primary': '#d18d46',
  '--dsw-alias-state-warn-secondary': '#d18d46',
  '--dsw-alias-state-warn-label': '#dfad65',
  '--dsw-alias-state-warn-tertiary': '#26180f',
  '--dsw-alias-state-error-primary': p.red,
  '--dsw-alias-state-error-secondary': '#c75849',
  // 🔴 business is the harness's semantic for in-progress and active (read by the spinner and the running indicator),
  // exactly where the prototype reserves ember: a 2% budget means it should appear only when something is really running.
  '--dsw-alias-state-business-primary': p.ember,
  '--dsw-alias-state-business-tertiary': '#2a1710',

  // ── Markdown and code ──
  // Code blocks sit deeper than the body container (the prototype's .tool-body is #0b0907), so long listings do not glare.
  '--dsw-alias-markdown-code-block': '#0b0907',
  '--dsw-alias-markdown-code-block-banner': p.surface2,
  '--dsw-alias-markdown-inline-code': p.surface2,
  '--dsw-alias-markdown-code-segment-selected': p.surface3,
  '--dsw-alias-markdown-code-segment-unselected': '#0b0907',
  '--dsw-alias-markdown-citation': p.surface3,
  '--dsw-alias-markdown-placeholder': p.surface2,
  '--dsw-alias-markdown-tag': p.surface2,

  // ── Scrollbar ──
  // Translucent gold rather than neutral grey: a scrollbar is permanently visible, and grey would pull the whole warmth back to neutral.
  '--dsw-alias-scrollbar-bg-l1': 'rgba(211, 164, 91, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(211, 164, 91, 0.26)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(211, 164, 91, 0.28)',
  '--dsw-alias-scrollbar-hover-l2': p.gold,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.surface3,
  '--dsw-alias-tooltip-bg': p.surface3,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  // The sidebar sits one step deeper than the main area (the prototype's sidebar is rgba(8,7,6,.98) against a slightly brighter main), floating the conversation forward.
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
