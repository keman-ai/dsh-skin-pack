/**
 * The Niulai Field skin · browser half.
 *
 * It does two things whose robustness differs by an order of magnitude, hence kept separate:
 *
 * 1. **Register the theme** — hand the palette to `ctx.theme`, and the presenter paints it as inline variables on body.
 *    This layer depends on semantic tokens alone, and harness redesigns do not change what a token means, so it lasts.
 * 2. **Mount the background layer** — stamp our own attribute on body and insert a background div. Only our own
 *    attributes and elements; no hooks into harness class names or structure, so a redesign is equally harmless.
 *
 * Both go through `ctx.effect`, so disposing removes the attribute, removes the element and unregisters the theme, restoring the UI.
 */

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { Context } from '@deepseek-ai/cordis'
import { NIULAI_COW_AVATAR } from './cow-art.generated.ts'
import { NiulaiRunDock } from './RunDock.tsx'
import { NiulaiUsageProbe } from './UsageProbe.tsx'
import { NIULAI_TOKENS } from './tokens.ts'
import './niulai.module.css'

export { NIULAI_PALETTE, NIULAI_TOKENS } from './tokens.ts'
export { NIULAI_COW_AVATAR } from './cow-art.generated.ts'

/** Theme id, and the argument to `setTheme`. */
export const THEME_ID = 'niulai'

/** Body marker: the single hook for the decorative CSS, and a convenient handle for user overrides. */
export const BODY_ATTRIBUTE = 'data-dsh-niulai'

/** The background variable: read by the CSS, injected here, keeping the image out of the stylesheet. */
const COVER_VARIABLE = '--niulai-cow-cover'

/**
 * The dock's expanded marker and storage key, matching the same-named constants in StatusDock.
 *
 * 🔴 These belong to theme switching too: the dock component is **always mounted** (visibility is left to CSS)
 * and its effect stamps the expanded marker onto body regardless of whether the skin is active. With 21 installed,
 * body carries 21 `data-*-dock-open` attributes — the CSS is all prefixed with `body[data-dsh-*]` so styles never
 * cross, but the pile-up is residue that looks like a leak when debugging. So it is removed on deactivation and restored from storage on reactivation.
 */
const DOCK_OPEN_ATTRIBUTE = 'data-niulai-dock-open'
const DOCK_STORAGE_KEY = 'niulai.dock.open'

/**
 * The cover URL, served by the host half at `/skin-cover/niulai.webp` (see COVER_ROUTE in src/index.ts).
 * No longer an inline data URI: with several skins installed, all that base64 crushes the browser's main thread.
 */
const COVER_URL = '/skin-cover/niulai.webp'


/**
 * The startup window for auto-apply.
 *
 * What must be outlasted is ui-theme's `adopt()`, which overrides the theme back to a built-in value when the Host
 * preference snapshot arrives. Measured at roughly 300ms, slower on a cold start, so 8 seconds leaves ample room; after the window the plugin lets go entirely.
 */
const AUTO_APPLY_WINDOW_MS = 8_000

/** The cow-head variable, used by the "at work" status mark. */
const AVATAR_VARIABLE = '--niulai-cow-avatar'

/** The theme service; `inject` guarantees it is ready first. */
export const inject = ['theme', 'slots']

/** Browser-half config, with the same field names as the host half. */
export interface Config {
  /**
   * Switch to Niulai on install; on by default.
   *
   * Why the switch exists: the harness's third-party theme ids **never enter the built-in settings schema**
   * (see the ui-theme README), so the choice lives only in the process and is never written to `$DSH_HOME/settings.yaml`.
   * Without auto-apply the user would return to Settings → Appearance and reselect on every start —
   * installing a skin and not seeing it is the default outcome of this mechanism.
   *
   * Turning it off returns to "installing only makes it available; select it yourself".
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  // Registration and mounting share one effect, in order: mountStage calls setTheme,
  // And setTheme throws outright on an unregistered id.
  /*
   * The Niulai run overview: our own right-hand rail, always present and collapsible.
   *
   * It does not mount into the harness's details rail — that `details` slot is `{ kind: 'single' }` and already held
   * by the official DetailsPanel, so third-party registration throws; and forcing DOM into its container would fight
   * the "click a tool row for details" flow. Our own fixed rail leaves both usable side by side.
   *
   * It also no longer takes the `conversation.view` tab: the same content in two places only confuses.
   */
  ctx.effect(() => mountDock(), 'niulai: run overview dock')

  /*
   * The usage probe.
   *
   * The rail is our own node and receives no slot-injected `useProjection`, so a zero-render entry on `composer.dock`
   * reads the projections on its behalf (see UsageProbe / usage-store). That slot is `{ kind: 'list' }` and the
   * official StatsLine is on it too, so appending displaces nothing.
   *
   * Use `inject` rather than a bare register: the target slot is declared by ui-conversation, this plugin's load order
   * after it is not guaranteed, and inject waits for it to be ready.
   */
  ctx.effect(() => ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'niulai-usage',
    // Ordered after the official stats (order 0); it draws nothing anyway and simply avoids disturbing the existing order.
    order: 100,
  }, NiulaiUsageProbe)), 'niulai: usage probe')

  ctx.effect(() => {
    const unregister = ctx.theme.register({ id: THEME_ID, colorScheme: 'dark', tokens: NIULAI_TOKENS })
    const unmount = mountStage(ctx, shouldAutoApply(ctx, config.autoApply !== false), userPicked())
    return () => {
      unmount()
      unregister()
    }
  }, 'niulai: theme + backdrop')
}

/**
 * Open and close the decoration layer, following the active theme.
 *
 * The decorations **exist only while the Niulai theme is active**: with the user back on the built-in dark theme
 * while the cow is still spread, the palette is no longer the field's — pure visual pollution. So it subscribes to `theme/change` and mounts by the active id.
 *
 * Only two things happen here: stamping the marker attribute on body and handing the image to the stylesheet as a
 * CSS variable. The actual painting lives in `niulai.module.css`, anchored on the harness's `[data-phase='hero']`
 * (the empty new-session screen), where the draft says the cow belongs. The background must be painted on the
 * content container itself to show through; an element beneath body is buried by the container's opaque ground (which is how the first version failed).
 *
 * @param ctx - Plugin context.
 * @returns A disposer: removes the attribute, clears the variable, unsubscribes.
 */
/** The key the skin market remembers the user's choice under (see appearance.ts in dsh-skin-market). */
const MARKET_THEME_KEY = 'skin-market.theme'

/** Page-lifetime global marker for who claimed the auto-apply slot. */
const CLAIM_KEY = '__dshSkinAutoApplyClaim__'

/**
 * With several skins installed, decide whether this one auto-applies.
 *
 * 🔴 This layer is mandatory. A skin's `autoApply` is configured on the Loader row, which **the host half can
 * read and the browser half cannot** (a client boot row carries only id / url / rev / inject / external, no
 * config). So even with `autoApply: false` written for every skin in `cordis.patch.yml`, in the browser every
 * skin still tries to force the theme to itself: three installed is enough for the second to collide when registering the brand slot, blanking the whole UI.
 *
 * Two rules:
 *   1. **once the user has chosen, the user decides everything** — the skin market records the choice in
 *      localStorage, that is authoritative, and no skin auto-applies any more (or one refresh would override the choice);
 *   2. with no choice made, **only the first skin to load claims the slot**, and the rest register quietly and wait to be picked.
 *
 * @param ctx - Plugin context, used only for logging.
 * @param configured - The intent configured on the host half (unreachable from the browser half; its default only matters in the single-skin case).
 * @returns Whether this skin auto-applies.
 */
function shouldAutoApply(ctx: Context, configured: boolean): boolean {
  if (!configured) {
    return false
  }
  const scope = globalThis as Record<string, unknown>
  let stored: string | null = null
  try {
    stored = localStorage.getItem(MARKET_THEME_KEY)
  } catch {
    // Unreadable in private mode counts as no choice, falling through to first-come-first-served below.
  }
  if (stored === THEME_ID) {
    /*
     * 🔴 The user picked this skin in the market — apply it ourselves rather than relying on the market to replay it.
     *
     * The market's `restoreSaved` waits for the target theme inside a `theme/change` event, but **registering a
     * theme does not necessarily emit one**: measured, selecting a skin then refreshing loses it, with not a single attribute left on body.
     * It stayed hidden because some skin was always auto-applying and emitting the event as a side effect.
     *
     * The choice was made explicitly, so this skin simply honours it rather than taking the long way round.
     */
    return true
  }
  if (stored !== null) {
    // The user picked another skin (or a built-in); this one keeps out of it entirely.
    return false
  }
  if (stored !== null) {
    // The user picked another skin (or a built-in); this one keeps out of it entirely.
    return false
  }
  if (scope[CLAIM_KEY] !== undefined) {
    ctx.logger.info('[niulai] another skin already claimed the auto-apply slot (%s); this one waits to be picked', String(scope[CLAIM_KEY]))
    return false
  }
  scope[CLAIM_KEY] = THEME_ID
  return true
}

function mountStage(ctx: Context, autoApply: boolean, picked: boolean): () => void {
  const body = document.body

  let attached = false
  /**
   * Whether the startup window has passed. Inside it the theme is held on Niulai; after it, nothing is touched.
   *
   * 🔴 Why "stop after one successful switch" does not work (the previous version did exactly that, and broke):
   *
   * ui-theme's `setTheme` persists only **built-in** preferences to the Host — `isThemePreference('niulai')` is false,
   * and third-party theme ids never reach persistence. When the Host snapshot arrives it runs `adopt()`, **overriding**
   * the current preference with the built-in value stored there. So once the order is plugin-switches-then-snapshot-arrives,
   * Niulai is quietly swapped back with no error at all — and "stop after one successful switch" means the plugin has
   * already let go and never switches back, giving the symptom "installed a skin, refreshed a few times, back to default".
   * Which comes first is a race, hence the intermittency.
   *
   * Hence the window: for a few seconds after load, every `theme/change` presses the theme back to Niulai, so `adopt()`
   * is corrected whether it arrives early or late; after the window the plugin lets go entirely and a switch made in Settings → Appearance is not taken back.
   * The cost is reapplying on every refresh — the inevitable consequence of the harness not persisting third-party
   * theme ids. To change permanently, set `autoApply` to false or uninstall the plugin.
   */
  let settled = false
  const settleTimer = setTimeout(() => { settled = true }, AUTO_APPLY_WINDOW_MS)

  /** Whether the registry has settled (see REGISTRY_SETTLE_MS). */
  let registrySettled = false
  const registryTimer = setTimeout(() => {
    registrySettled = true
    sync()
  }, REGISTRY_SETTLE_MS)

  const sync = (): void => {
    const activeId = ctx.theme.getTheme().active.id
    /*
     * `picked` (the user chose this skin in the market) takes effect immediately, without waiting for the registry
     * to settle and regardless of how many are installed — it is an explicit choice. Everything else goes through the "auto-apply only when alone" arbitration.
     */
    const mayApply = picked || (registrySettled && soleSkin(ctx))
    if (activeId !== THEME_ID && autoApply && !settled && mayApply) {
      try {
        ctx.theme.setTheme(THEME_ID)
      } catch (error) {
        ctx.logger.warn('[niulai] auto-apply failed; please select it under Settings → Appearance', error)
      }
      return
    }
    const active = ctx.theme.getTheme().active.id === THEME_ID
    if (active === attached) {
      return
    }
    if (active) {
      body.style.setProperty(COVER_VARIABLE, `url("${COVER_URL}")`)
      body.style.setProperty(AVATAR_VARIABLE, `url("${NIULAI_COW_AVATAR}")`)
      body.setAttribute(BODY_ATTRIBUTE, '')
      restoreDockOpen(body)
    } else {
      body.removeAttribute(BODY_ATTRIBUTE)
    body.removeAttribute(DOCK_OPEN_ATTRIBUTE)
      body.removeAttribute(DOCK_OPEN_ATTRIBUTE)
      body.style.removeProperty(COVER_VARIABLE)
      body.style.removeProperty(AVATAR_VARIABLE)
    }
    attached = active
  }

  sync()
  const off = ctx.on('theme/change', sync)

  return () => {
    off()
    clearTimeout(settleTimer)
    clearTimeout(registryTimer)
    body.removeAttribute(BODY_ATTRIBUTE)
    body.style.removeProperty(COVER_VARIABLE)
    body.style.removeProperty(AVATAR_VARIABLE)
  }
}
/**
 * On reactivation, restore the dock's expanded marker from the user's stored preference.
 *
 * Deactivation removes the attribute (so 21 skins' markers do not pile up on body), and the dock component's
 * effect writes only when the expanded state **changes**, so it never restores itself — hence this restore from storage. Expanded by default.
 * @param body - document.body。
 */
function restoreDockOpen(body: HTMLElement): void {
  let open = true
  try {
    open = window.localStorage.getItem(DOCK_STORAGE_KEY) !== 'false'
  } catch {
    // Unreadable in private mode falls back to expanded.
  }
  if (open) {
    body.setAttribute(DOCK_OPEN_ATTRIBUTE, '')
  } else {
    body.removeAttribute(DOCK_OPEN_ATTRIBUTE)
  }
}

/**
 * Did the user select this skin in the skin market?
 * @returns True when this skin applies itself rather than waiting for the market to replay.
 */
function userPicked(): boolean {
  try {
    return localStorage.getItem(MARKET_THEME_KEY) === THEME_ID
  } catch {
    return false
  }
}

/**
 * Is this the only skin currently in the registry?
 *
 * 🔴 The check lives in the `theme/change` callback rather than at plugin apply time — other skins may still be
 * loading then, and the count would inevitably be 1. The theme registry fills asynchronously, so recount on every change.
 *
 * Rule: auto-apply when only one is installed (installing it makes it take effect, which is what a single-skin
 * user expects); with several installed **nobody claims it**, the harness default look stays, and the user chooses under Settings → Skin Market → Installed → Appearance.
 * Which of several loads first depends on bundle order, so claiming it would mean a random skin on every start.
 *
 * `light` / `dark` are built-ins and do not count as skins.
 * @param ctx - Plugin context.
 * @returns Whether this is the only third-party theme in the registry.
 */
function soleSkin(ctx: Context): boolean {
  const builtin = new Set(['light', 'dark'])
  const skins = ctx.theme.getTheme().themes.filter(theme => !builtin.has(theme.id))
  return skins.length <= 1
}

/**
 * No auto-apply before the registry has settled.
 *
 * 🔴 This closes a hole in soleSkin: the theme registry fills **asynchronously** (each skin's bundle loads on
 * its own), so the first to register sees only itself, soleSkin is true, and it auto-applies anyway. With 21
 * installed the symptom is a different skin hijacking each start, following load order. Measured: this is exactly how wukong took over.
 *
 * So the check is deferred past REGISTRY_SETTLE_MS, by which point every bundle has run and the count is real.
 * The delay fits inside the 8-second auto-apply window, so a single skin still applies automatically, just slightly later.
 */
const REGISTRY_SETTLE_MS = 1_500

/**
 * Mount the right-hand rail.
 *
 * Our own host node and React root: the panel belongs to no harness slot, its lifetime is entirely this plugin's
 * responsibility, and disposing unmounts the tree and removes the node, restoring the UI.
 *
 * @returns disposer。
 */
function mountDock(): () => void {
  const host = document.createElement('div')
  host.setAttribute('data-niulai-dock', '')
  document.body.append(host)
  const root = createRoot(host)
  root.render(createElement(NiulaiRunDock))
  return () => {
    // Unmount asynchronously: React forbids a synchronous unmount inside its own render cycle.
    queueMicrotask(() => { root.unmount() })
    host.remove()
    document.body.removeAttribute('data-niulai-dock-open')
  }
}
