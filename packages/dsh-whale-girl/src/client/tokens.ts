/**
 * Whale Girl Lounge's palette: the prototype's design variables → the harness's `--dsw-alias-*` /
 * `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter paints
 * these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 * A harness redesign changes class names and layout but not what a semantic token means, so this layer lasts.
 *
 * The mapping is not colour-by-colour transcription but **semantic alignment**: the prototype's `--paper / --paper2 /
 * card white` are three container levels, and the harness's `bg-base / layer-1 / layer-2 / layer-3` rise likewise, so they line up.
 * What the prototype omits (scrims, skeletons, scrollbars, the danger state) is derived from the existing ramp, with the rule stated in each section.
 *
 * 🔴 This is a **light** skin (`colorScheme: 'light'`), the opposite of the earlier dark ones. The prototype's design
 * notes fix it: keep everything within pale blue, white and navy, avoid a cyberpunk feel, and emphasise
 * softness, freshness and charm while staying professional. So unlisted tokens inherit the harness's **built-in light base**,
 * The override set is deliberately incomplete: listing everything would shut out built-in tokens added later.
 */

/** The raw colours from the prototype's `:root` and Appearance swatch. Recolour here; everything below derives from these. */
export const WHALE_PALETTE = {
  /** Deep Navy: the deepest level, for inverted blocks and high-contrast buttons. */
  navy: '#18357f',
  /** The second navy: a raised state of the first. */
  navy2: '#24479e',
  /** DeepSeek Blue: the <b>primary action colour</b> (the prototype's + New chat, Allow and Send all use it). */
  blue: '#5369ef',
  /** The primary action's pressed and hover state (the lower end of the prototype's new-btn gradient). */
  blueDeep: '#465be0',
  /** Sky Blue: borders and desaturated decoration. */
  sky: '#7ca6ff',
  /** Ocean Cyan: the ocean light, used at the end of progress and motion gradients. */
  cyan: '#70d8ff',

  /** Pearl White: the first raised surface (cards, and the paper beneath the composer). */
  paper: '#f8fbff',
  /** The second paper surface, and the source of the app's ground. */
  paper2: '#edf4ff',
  /** The app's lowest ground (the prototype's body background). */
  base: '#eaf2ff',
  /** The pale blue of the selected state (the prototype's .session.active). */
  selected: '#e2e9ff',
  /** The light blue of tool output blocks (the prototype's .toolbody). */
  code: '#f5f8ff',

  /** Primary text (the prototype's --ink). */
  ink: '#1d356d',
  /** Secondary text (the prototype's --ink2). */
  ink2: '#61729b',
  /** Tertiary text (the prototype's .search / .stime and similar). */
  ink3: '#8290ad',
  /** Description text, the weakest level. */
  ink4: '#9aa6bc',

  /** Online Green: <b>reserved for online and success</b> (the prototype's five system statuses all use it), never a primary button. */
  green: '#74bf72',
  /** The permission card's amber (the border and heading colour of the prototype's .permission). */
  amber: '#eaab42',
  amberLabel: '#a66e1c',
} as const

const p = WHALE_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; unlisted tokens inherit the harness's built-in light base.
 */
export const WHALE_TOKENS: Record<string, string> = {
  // ── Container layers ──
  // The prototype is a pale blue ground with white cards: the ground deepest and the cards brightest, isomorphic to
  // the harness's base → layer-1/2/3. layer-3 deliberately reaches pure white so overlays stay distinct from cards.
  '--dsw-alias-bg-base': p.base,
  '--dsw-alias-bg-layer-1': p.paper2,
  '--dsw-alias-bg-layer-2': p.paper,
  '--dsw-alias-bg-layer-3': '#ffffff',
  '--dsw-alias-bg-module-platform': p.paper,
  '--dsw-alias-bg-overlay': '#ffffff',
  '--dsw-alias-bg-multi-select': p.selected,

  // The prototype gives a scrim only for the Settings modal: rgba(26,45,93,.25) with a blur. Its hue is applied throughout,
  // never transparent black — black looks dirty over a light UI, while navy reads as water deepening.
  '--dsw-alias-bg-mask-1': 'rgba(26, 45, 93, 0.25)',
  '--dsw-alias-bg-mask-2': 'rgba(26, 45, 93, 0.12)',
  '--dsw-alias-bg-mask-3': 'rgba(26, 45, 93, 0.22)',
  '--dsw-alias-bg-mask-photo': 'rgba(18, 32, 66, 0.86)',
  '--dsw-alias-bg-mask-drop': 'rgba(210, 226, 255, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(37, 70, 145, 0.08)',

  // ── Borders ──
  // The prototype has one, --line: rgba(37,70,145,.12), while the harness wants four: l1 weaker, l2 the original,
  // and l3/l4 strengthened towards sky blue in the same hue (the prototype's component language calls for
  // 1px low-contrast borders, so all four stay restrained).
  '--dsw-alias-border-l1': 'rgba(37, 70, 145, 0.10)',
  '--dsw-alias-border-l2': 'rgba(37, 70, 145, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(37, 70, 145, 0.12)',
  '--dsw-alias-border-l3': '#b9cdf2',
  '--dsw-alias-border-l4': p.sky,
  // inverted is the border on dark blocks, such as the navy Settings sidebar.
  '--dsw-alias-border-inverted': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-border-inverted2': 'rgba(255, 255, 255, 0.26)',

  // ── Text ──
  '--dsw-alias-label-primary': p.ink,
  '--dsw-alias-label-primary-bluish': p.navy2,
  '--dsw-alias-label-primary-dimmed': p.ink2,
  '--dsw-alias-label-secondary': p.ink2,
  '--dsw-alias-label-tertiary': p.ink3,
  '--dsw-alias-label-caption': p.ink4,
  '--dsw-alias-label-dimmed': p.ink4,
  // Text on the primary block (DeepSeek Blue): white.
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.paper,

  // ── Brand and primary button ──
  // 🔴 <b>The primary action is DeepSeek Blue, not Ocean Cyan and not green.</b> Solid blue appears in the prototype
  // only on three primary actions — + New chat, Allow and Send — while green is explicitly <b>reserved for online and
  // （五个 Assistant Systems 的"在线"、工具调用的 ✓）。拿绿做按钮会让"成功"和"可以点"
  // "you may click" one visual language, leaving state unreadable.
  '--dsw-alias-brand-primary': p.blue,
  '--dsw-alias-brand-text': '#3953c9',
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.blue,
  '--dsw-alias-button-primary-fill': p.blue,
  '--dsw-alias-button-primary-hover': p.blueDeep,
  '--dsw-alias-button-primary-dimmed': '#b9c6f7',
  // High-contrast buttons use navy: the only dark solid safe on a light ground.
  '--dsw-alias-button-contrast-fill': p.navy,
  '--dsw-alias-button-elevated-fill': '#ffffff',
  '--dsw-alias-button-floating-fill': '#ffffff',
  '--dsw-alias-button-floating-hover': '#f2f6ff',
  '--dsw-alias-button-ghost-active-fill': p.selected,
  '--dsw-alias-button-ghost-active-hover': '#d7e2ff',
  '--dsw-alias-button-ghost-active-border': '#b9cdf2',
  // info means "go and see what is happening", so it follows the navy and never takes the primary action's place.
  '--dsw-alias-button-info-fill': p.navy2,
  '--dsw-alias-button-info-hover': p.navy,
  '--dsw-alias-button-tool-bar-fill': 'rgba(83, 105, 239, 0.10)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(83, 105, 239, 0.18)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(255, 255, 255, 0)',

  // ── Interaction states ──
  // On a light ground hover cannot add white (invisible), so a very low-opacity navy is laid over instead.
  '--dsw-alias-interactive-bg-hover': 'rgba(37, 70, 145, 0.06)',
  '--dsw-alias-interactive-bg-active': 'rgba(37, 70, 145, 0.12)',
  '--dsw-alias-interactive-bg-hover-solid': p.selected,
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(83, 105, 239, 0.14)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(224, 104, 95, 0.14)',

  // ── Status colours ──
  // Green and amber come straight from the prototype; the error colour is absent from it (the draft has no failure
  // state), so a coral-leaning red is derived in the same ocean hue — pure red would leap out of this pale blue.
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#6bb56a',
  '--dsw-alias-state-success-tertiary': '#e4f4e3',
  '--dsw-alias-state-warn-primary': p.amber,
  '--dsw-alias-state-warn-secondary': p.amber,
  '--dsw-alias-state-warn-label': p.amberLabel,
  '--dsw-alias-state-warn-tertiary': '#fff9ec',
  '--dsw-alias-state-error-primary': '#e0685f',
  '--dsw-alias-state-error-secondary': '#c9544c',
  // 🔴 business is the harness's semantic for in-progress and active (read by the spinner and running indicator).
  // The prototype gives motion to the ocean light (a #546af0 → #6fcdfb progress gradient), but raw Ocean Cyan lacks
  // contrast on a light ground, so it is darkened until legible.
  '--dsw-alias-state-business-primary': '#2f9fd8',
  '--dsw-alias-state-business-tertiary': '#dff2fd',

  // ── Markdown and code ──
  // The prototype's tool output block is light blue with monospace type (.toolbody), and code blocks follow it.
  '--dsw-alias-markdown-code-block': p.code,
  '--dsw-alias-markdown-code-block-banner': p.paper2,
  '--dsw-alias-markdown-inline-code': p.paper2,
  '--dsw-alias-markdown-code-segment-selected': p.selected,
  '--dsw-alias-markdown-code-segment-unselected': p.code,
  '--dsw-alias-markdown-citation': p.selected,
  '--dsw-alias-markdown-placeholder': p.paper2,
  '--dsw-alias-markdown-tag': p.paper2,

  // ── Scrollbar ──
  // Translucent navy rather than neutral grey: a scrollbar is permanently visible, and grey would pull the whole blue back to neutral.
  '--dsw-alias-scrollbar-bg-l1': 'rgba(37, 70, 145, 0.14)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(83, 105, 239, 0.28)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(37, 70, 145, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.sky,

  // ── Overlays ──
  // In a light UI a tooltip must invert to white on dark, or it is indistinguishable from the white card it floats over.
  '--dsw-alias-toast-bg': '#ffffff',
  '--dsw-alias-tooltip-bg': '#26418f',

  // ── The specific layer: hooks the harness leaves for individual parts ──
  // The prototype's sidebar is a #f7f9ff → #eef3ff vertical gradient; a token can only carry one colour, so the midpoint is used
  // and the gradient itself is added in whale.module.css.
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
