/**
 * Red Plane Adventure's palette: the prototype's design variables → the harness's `--dsw-alias-*` / `--dsw-specific-*` semantic layer.
 *
 * This layer is the skin's foundation and the **only part not depending on the harness DOM**: the presenter
 * paints these values onto body as inline variables, replacing the UI's ground, layers, borders, text and status colours wholesale.
 *
 * 🔴 The prototype states the palette itself, in its own trajectory panel:
 *   `theme = deep navy / flight red / cream / cyan`
 *
 * Four words, four jobs:
 *   - **deep navy** (#071522 → #132b3e): ground and panels — most of the interface, and the sky the plane flies in;
 *   - **flight red** (#e6502e / #ff7b52): the primary action and emphasis. The prototype paints `.new` and `.send`
 *     with the solid gradient `linear-gradient(135deg,#f16a45,#d9482b)`, so unlike this pack's quieter skins the
 *     large button here really is solid red — that is the aircraft, and it is meant to be the loudest thing on screen;
 *   - **cream** (#ffd0bd / #ffb079): small warm accents only — session icons, the badge text, the middle of the
 *     energy gradient. It is the light on the clouds, not a surface;
 *   - **cyan** (#72cce8): the only cool accent, at the end of the energy gradient. It goes to **running**.
 *
 * 🔴 Green (#69d49b) is not in that four-word list but the prototype uses it consistently and only for one thing —
 * `● SKY READY`, the five `ONLINE` rows, the `✓ ready` on a tool head. So green means **done / online** and cyan
 * means **in progress**. Keeping them apart is what lets you tell at a glance whether a run finished or is still flying.
 *
 * 🔴 The prototype gives no error colour, and red is already spent on the primary action. So error moves one step
 * **redder** (away from the orange-leaning action red) and slightly brighter — separated by hue and luminance
 * rather than by importing a fifth colour the design never asked for. Warning takes the cream's apricot end, which
 * is likewise already on the palette.
 */

/** The raw colours from the prototype's `:root`. Recolour here; everything below derives from these. */
export const REDPLANE_PALETTE = {
  /** The sky ground: a navy close to black (the prototype's `--bg`). */
  bg: '#071522',
  bg2: '#040b12',
  /** Two panel levels (`--panel` and the chip/pill ground). */
  panel: '#0d2030',
  panel2: '#132b3e',
  /** The ground the sidebar and cards sit on. */
  panelDeep: '#0b1e2c',

  text: '#f7fbff',
  muted: '#8fa6b6',
  muted2: '#7f95a4',

  /** Flight red: the primary action and emphasis. */
  red: '#e6502e',
  red2: '#ff7b52',
  redDeep: '#ad331f',
  /** Cream: small warm accents — session icons, badge text, the middle of the energy gradient. */
  cream: '#ffd0bd',
  cream2: '#ffb079',
  /** Cyan: the only cool accent. Running. */
  cyan: '#72cce8',
  /** Green: done and online. */
  green: '#69d49b',
} as const

const p = REDPLANE_PALETTE

/**
 * The token table handed to `ctx.theme.register()`.
 *
 * Only **what changes** is written; anything unlisted inherits the harness's built-in dark base.
 */
export const REDPLANE_TOKENS: Record<string, string> = {
  // ── Container layers ──
  '--dsw-alias-bg-base': p.bg,
  '--dsw-alias-bg-layer-1': p.panelDeep,
  '--dsw-alias-bg-layer-2': p.panel,
  '--dsw-alias-bg-layer-3': p.panel2,
  '--dsw-alias-bg-module-platform': p.panel,
  '--dsw-alias-bg-overlay': p.panel2,
  '--dsw-alias-bg-multi-select': '#183549',

  // The scrim pushes towards the navy rather than pure black; black would wash this already dark blue into grey.
  '--dsw-alias-bg-mask-1': 'rgba(3, 9, 16, 0.72)',
  '--dsw-alias-bg-mask-2': 'rgba(3, 9, 16, 0.34)',
  '--dsw-alias-bg-mask-3': 'rgba(3, 9, 16, 0.62)',
  '--dsw-alias-bg-mask-photo': 'rgba(2, 6, 11, 0.9)',
  '--dsw-alias-bg-mask-drop': 'rgba(24, 53, 73, 0.72)',
  '--dsw-alias-bg-skeleton': 'rgba(255, 255, 255, 0.08)',

  // ── Borders ──
  // The prototype uses exactly one, `--line: rgba(255,255,255,.12)` — **neutral white, no tint**. The cover is
  // already the loudest thing here; a tinted border would compete with it instead of framing it.
  '--dsw-alias-border-l1': 'rgba(255, 255, 255, 0.1)',
  '--dsw-alias-border-l2': 'rgba(255, 255, 255, 0.16)',
  '--dsw-alias-border-l2-darkmode-thin': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-border-l3': 'rgba(255, 255, 255, 0.3)',
  '--dsw-alias-border-l4': p.red2,
  '--dsw-alias-border-inverted': 'rgba(237, 247, 255, 0.06)',
  '--dsw-alias-border-inverted2': 'rgba(237, 247, 255, 0.1)',

  // ── Text ──
  '--dsw-alias-label-primary': p.text,
  '--dsw-alias-label-primary-bluish': '#e2eff7',
  '--dsw-alias-label-primary-dimmed': p.muted,
  '--dsw-alias-label-secondary': '#a4b6c2',
  '--dsw-alias-label-tertiary': p.muted2,
  '--dsw-alias-label-caption': '#61798a',
  '--dsw-alias-label-dimmed': '#61798a',
  '--dsw-alias-label-primary-foreground': '#ffffff',
  '--dsw-alias-label-primary-inverted': p.panel2,

  // ── Brand and primary button ──
  // The primary action is flight red (the prototype's `.new` / `.send`: `linear-gradient(135deg,#f16a45,#d9482b)`),
  // with white on top as the prototype has it. Cream is never a button surface: it is light on the clouds, and a
  // solid fill of it would put the warmth everywhere and leave the aircraft nothing to be.
  '--dsw-alias-brand-primary': p.red,
  '--dsw-alias-brand-text': p.red2,
  '--dsw-alias-brand-primary-invert': '#ffffff',
  '--dsw-alias-brand-primary-new-colorprimary-new-color': p.red,
  '--dsw-alias-button-primary-fill': p.red,
  '--dsw-alias-button-primary-hover': p.red2,
  '--dsw-alias-button-primary-dimmed': '#7a2818',
  '--dsw-alias-button-contrast-fill': p.text,
  '--dsw-alias-button-elevated-fill': '#0e2233',
  '--dsw-alias-button-floating-fill': p.panel,
  '--dsw-alias-button-floating-hover': '#0e2233',
  '--dsw-alias-button-ghost-active-fill': '#183549',
  '--dsw-alias-button-ghost-active-hover': '#183549',
  '--dsw-alias-button-ghost-active-border': 'rgba(255, 255, 255, 0.28)',
  '--dsw-alias-button-info-fill': '#1a4560',
  '--dsw-alias-button-info-hover': '#2e7aa5',
  '--dsw-alias-button-tool-bar-fill': 'rgba(114, 204, 232, 0.1)',
  '--dsw-alias-button-tool-bar-hover': 'rgba(114, 204, 232, 0.2)',
  '--dsw-alias-button-tool-bar-fill-invisible': 'rgba(11, 30, 44, 0.4)',

  // ── Interaction states ──
  '--dsw-alias-interactive-bg-hover': 'rgba(255, 255, 255, 0.07)',
  '--dsw-alias-interactive-bg-active': 'rgba(255, 255, 255, 0.14)',
  '--dsw-alias-interactive-bg-hover-solid': '#183549',
  '--dsw-alias-interactive-bg-hover-accent': 'rgba(230, 80, 46, 0.24)',
  '--dsw-alias-interactive-bg-hover-danger': 'rgba(240, 98, 95, 0.22)',

  // ── Status colours ──
  // 🔴 green = done / online, cyan = in progress. See the file header: the prototype keeps these two apart and so does this.
  '--dsw-alias-state-success-primary': p.green,
  '--dsw-alias-state-success-secondary': '#73d19c',
  '--dsw-alias-state-success-tertiary': '#0f2a21',
  // Warning takes the cream's apricot end — already on the palette as the middle stop of the energy gradient.
  '--dsw-alias-state-warn-primary': p.cream2,
  '--dsw-alias-state-warn-secondary': p.cream2,
  '--dsw-alias-state-warn-label': '#ffd9b8',
  '--dsw-alias-state-warn-tertiary': '#2b1f16',
  // Error sits one step redder than the action red, so "something broke" never reads as "press me".
  '--dsw-alias-state-error-primary': '#f0625f',
  '--dsw-alias-state-error-secondary': '#ff8480',
  // business = in progress: cyan.
  '--dsw-alias-state-business-primary': p.cyan,
  '--dsw-alias-state-business-tertiary': '#10344a',

  // ── Markdown and code ──
  '--dsw-alias-markdown-code-block': '#07121b',
  '--dsw-alias-markdown-code-block-banner': '#0c1e2c',
  '--dsw-alias-markdown-inline-code': '#0e2233',
  '--dsw-alias-markdown-code-segment-selected': '#183549',
  '--dsw-alias-markdown-code-segment-unselected': '#07121b',
  '--dsw-alias-markdown-citation': '#0e2233',
  '--dsw-alias-markdown-placeholder': p.panel,
  '--dsw-alias-markdown-tag': '#0e2233',

  // ── Scrollbar ──
  '--dsw-alias-scrollbar-bg-l1': 'rgba(255, 255, 255, 0.12)',
  '--dsw-alias-scrollbar-bg-l2': 'rgba(255, 255, 255, 0.24)',
  '--dsw-alias-scrollbar-hover-l1': 'rgba(255, 255, 255, 0.26)',
  '--dsw-alias-scrollbar-hover-l2': p.red2,

  // ── Overlays ──
  '--dsw-alias-toast-bg': p.panel2,
  '--dsw-alias-tooltip-bg': p.panel2,

  // ── The specific layer: hooks the harness leaves for individual parts ──
  '--dsw-specific-sidebar-fill': p.panelDeep,
  '--dsw-specific-sidebar-nav-item-hover': '#0e2233',
  '--dsw-specific-sidebar-nav-item-active': '#183549',
  '--dsw-specific-sidebar-nav-item-active-accent': p.red2,
  '--dsw-specific-bubble': '#0f2333',
  '--dsw-specific-bubble-highlight': '#132b3e',
  '--dsw-specific-input-major': p.panel,
  '--dsw-specific-login-input': p.panel,
  '--dsw-specific-menu': p.panel2,
  '--dsw-specific-selector': p.panel,
  '--dsw-specific-tip': '#0e2233',
}
