/**
 * 鲸跃横幅 · 浏览器半。
 *
 * It does three things, in decreasing order of robustness, hence kept separate:
 *
 * 1. **Register the theme** — the palette goes to `ctx.theme`, and the presenter paints it as inline variables on body.
 *    It depends on semantic tokens only, and harness redesigns do not change what a token means, so this layer lasts.
 * 2. **Mount the cover layer** — stamp our own attribute on body and hand the cover image to the stylesheet as
 *    a CSS variable. Only our own attributes and variables; no hooks into harness class names or structure.
 * 3. **Take over the brand slots** — shadow the official mark and wordmark with `priority: -1` (see Brand.tsx).
 *    This one is bound to the active state: deactivating the skin deregisters it and the official mark returns.
 *
 * All three go through `ctx.effect` / disposers, so unloading removes attributes, clears variables, unregisters
 * the theme and revokes the registrations, restoring the UI.
 */

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { Context } from '@deepseek-ai/cordis'
import { WaveMark, WaveName } from './Brand.tsx'
import { WaveStatusDock } from './StatusDock.tsx'
import { WaveEnergyRail } from './EnergyRail.tsx'
import { WaveStatusProbe } from './StatusProbe.tsx'
import { WAVE_TOKENS } from './tokens.ts'
import './wave.module.css'

export { WAVE_PALETTE, WAVE_TOKENS } from './tokens.ts'

/** Theme id, and the argument to `setTheme`. Three ids must agree: this constant, skin.json and cordis.patch.yml. */
export const THEME_ID = 'whale-wave'

/** Body marker: the single hook for the decorative CSS, and a convenient handle for user overrides. */
export const BODY_ATTRIBUTE = 'data-dsh-whale-wave'

/** The cover variable: read by the CSS, injected here, keeping the image out of the stylesheet (which would otherwise bloat and be hard to clean up). */
const COVER_VARIABLE = '--wave-banner'

/**
 * The dock's expanded marker and storage key, matching the same-named constants in StatusDock.
 *
 * 🔴 These belong to theme switching too: the dock component is **always mounted** (visibility is left to CSS)
 * and its effect stamps the expanded marker onto body regardless of whether the skin is active. With 21 installed,
 * body carries 21 `data-*-dock-open` attributes — the CSS is all prefixed with `body[data-dsh-*]` so styles never
 * cross, but the pile-up is residue that looks like a leak when debugging. So it is removed on deactivation and restored from storage on reactivation.
 */
const DOCK_OPEN_ATTRIBUTE = 'data-whale-wave-dock-open'
const DOCK_STORAGE_KEY = 'whale-wave'

/**
 * 封面地址。由 host 半在 `/skin-cover/whale-wave.webp` 上提供（见 src/index.ts 的 COVER_ROUTE）。
 *
 * 🔴 No more inline data URIs: with several skins loaded, a few hundred KB of base64 each crushes the browser's
 * main thread (measured: with 21 installed the first paint did not arrive in 90 seconds). The browser now fetches
 * the image only once the skin is **actually active** and the CSS uses this variable.
 */
const COVER_URL = '/skin-cover/whale-wave.webp'


/**
 * The startup window for auto-apply.
 *
 * What must be outlasted is ui-theme's `adopt()`, which overrides the theme back to a built-in value when the
 * Host preference snapshot arrives. Measured at roughly 300ms, slower on a cold start, so 8 seconds leaves ample room; after the window the plugin lets go entirely.
 */
const AUTO_APPLY_WINDOW_MS = 8_000

/**
 * The three brand slots and the components they take.
 *
 * Registered at priority -1: the official `ui-brand-official` sits at the default 0, priority ascends and the
 * **lower number renders**, so -1 shadows the official one (it is not unloaded — the moment we deregister, it returns).
 */
const BRAND_SLOTS = [
  { name: 'sidebar.brand.mark', component: WaveMark },
  { name: 'sidebar.brand.name', component: WaveName },
  { name: 'conversation.hero.brand.mark', component: WaveMark },
] as const

/** The theme service and slot registry; `inject` guarantees they are ready first. */
export const inject = ['theme', 'slots']

/** Browser-half config, with the same field names as the host half. */
export interface Config {
  /**
   * 装上就切到鲸跃，默认开。
   *
   * Why the switch exists: the harness's third-party theme ids **never enter the built-in settings schema**, so
   * the choice lives only in the process and is never written to `$DSH_HOME/settings.yaml`; and the built-in
   * Settings → Appearance row **lists only light / dark / follow system**, with third-party themes simply absent.
   * Without auto-apply the user would reselect in the skin market panel on every start — installing a skin and not
   * seeing it is the default outcome of this mechanism.
   *
   * Turning it off returns to "installing only makes it available; pick it in the skin market".
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  /*
   * The right-hand dock: our own fixed node with its own React root.
   *
   * It does not take over the harness's `details` slot — it **could** (a `single` conflict only arises at equal
   * priority), but that rail holds "click a tool call to see its Input / Output", the only lead there is when
   * debugging, so replacing it with a dock is a net loss. Both coexist without interfering.
   *
   * 挂载不区分皮肤是否激活，可见性交给 CSS（`body[data-dsh-whale-wave]` 才 display）——
   * The rule is "not active means not present", so no half-built UI shows during the window before the skin takes effect.
   */
  ctx.effect(() => mountDock(), 'whale-wave: status dock')

  /*
   * The status probe.
   *
   * The dock is our own node and receives no slot-injected `useProjection` / `useSession`, so a zero-render entry
   * on `conversation.composer.dock` reads them on its behalf (see StatusProbe / status-store).
   * That slot is `{ kind: 'list' }` and the official StatsLine is on it too (id `stats`, order 0), so appending
   * does not displace it.
   *
   * Use `inject` rather than a bare register: the target slot is declared by ui-conversation, this plugin's load
   * order after it is not guaranteed, and inject waits for it to be ready.
   */
  ctx.effect(() => ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'whale-wave-status',
    // Ordered after the official stats (order 0); it draws nothing anyway and simply avoids disturbing the existing order.
    order: 100,
  }, WaveStatusProbe)), 'whale-wave: status probe')

  /*
   * The sidebar energy gauge — the real-data version of the prototype's hardcoded energy value.
   *
   * `sidebar.footer.action` is `{ kind: 'list' }`, right beside the Settings row, and appending displaces nobody.
   * Its scope is `root` and it receives no session projection, so this component reads no props and subscribes to
   * status-store instead, written by the session-scoped probe above. Collected once, displayed twice.
   */
  ctx.effect(() => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'wave-energy',
    order: 100,
  }, WaveEnergyRail)), 'wave: energy rail')

  // Registration and mounting share one effect, in order: mountStage calls setTheme,
  // And setTheme throws outright on an unregistered id.
  ctx.effect(() => {
    const unregister = ctx.theme.register({ id: THEME_ID, colorScheme: 'light', tokens: WAVE_TOKENS })
    const unmount = mountStage(ctx, shouldAutoApply(ctx, config.autoApply !== false), userPicked())
    return () => {
      unmount()
      unregister()
    }
  }, 'whale-wave: theme + cover + brand')
}

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
    ctx.logger.info('[whale-wave] 已有皮肤占了自动应用名额（%s），本套改为待选', String(scope[CLAIM_KEY]))
    return false
  }
  scope[CLAIM_KEY] = THEME_ID
  return true
}

/**
 * Open and close the decorations and brand slots with the active state, and hold the theme during the startup window.
 *
 * The decorations **exist only while this skin is active**: with the user back on a built-in theme while the
 * cover is still spread and the mark still hangs, the palette is no longer this skin's, which is pure visual pollution.
 *
 * @param ctx - Plugin context.
 * @param autoApply - Whether to switch to this skin automatically.
 * @returns A disposer: removes attributes, clears variables, deregisters the brand slots, clears timers and unsubscribes.
 */
function mountStage(ctx: Context, autoApply: boolean, picked: boolean): () => void {
  const body = document.body
  let attached = false
  /** Disposers for the brand-slot registrations, existing only while the skin is active. */
  let brandDisposers: (() => void)[] = []
  /** Timer deferring the brand-slot takeover (see the note in sync below). */
  let brandTimer: ReturnType<typeof setTimeout> | undefined

  /**
   * Whether the startup window has passed. Inside it the theme is held; after it, nothing is touched.
   *
   * 🔴 It cannot be "stop after one successful switch": ui-theme's `setTheme` persists built-in preferences only
   *（`isThemePreference('whale-wave')` 是 false，第三方 id 根本不进持久化），而 Host 快照
   * On arrival, `adopt()` **overrides** the current preference with the built-in value from disk. Once the order is
   * plugin-switches-then-snapshot-arrives, the skin is quietly swapped back to a built-in theme **with no error at
   * all**, and the plugin has already let go so it never switches back — the symptom being "installed a skin, refreshed a few times, back to default". The order is a race, hence the intermittency.
   *
   * The cost of the window: it reapplies on every refresh, so switching away in settings lasts only for that
   * session. To change permanently, set `autoApply` to false or uninstall the plugin — this is documented in the README.
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
    /*
     * `picked` (the user chose this skin in the market) takes effect immediately, without waiting for the registry
     * to settle and regardless of how many are installed — it is an explicit choice. Everything else goes through the "auto-apply only when alone" arbitration.
     */
    const mayApply = picked || (registrySettled && soleSkin(ctx))
    if (ctx.theme.getTheme().active.id !== THEME_ID && autoApply && !settled && mayApply) {
      try {
        ctx.theme.setTheme(THEME_ID)
      } catch (error) {
        // 🔴 Do not say "pick it under Settings → Appearance": measured, that row holds only the three built-in
        // preferences light / dark / follow system (CUBES in ui-theme's AppearanceRow is hardcoded to three), and third-party themes are simply not there.
        // The place to switch manually is the skin market's own panel (Settings → Skin Market).
        ctx.logger.warn('[whale-wave] 自动应用失败，可到「设置 → 皮肤市场」手动切换', error)
      }
      return
    }
    const active = ctx.theme.getTheme().active.id === THEME_ID
    if (active === attached) {
      return
    }
    if (active) {
      body.style.setProperty(COVER_VARIABLE, `url("${COVER_URL}")`)
      body.setAttribute(BODY_ATTRIBUTE, '')
      restoreDockOpen(body)
      /*
       * 🔴 The brand-slot takeover must be **deferred by one tick**.
       *
       * Switching from another skin, both respond to the **same** `theme/change`, and which runs first depends on
       * plugin registration order. If the new skin runs first, it registers `conversation.hero.brand.mark` (a single
       * slot at priority -1) while the old skin has not deregistered — they collide, attachBrand swallows it, and the
       * result is **a switched skin still showing the official mark**. Measured: two collisions in four switches, entirely silent.
       *
       * setTimeout(0) queues the takeover after every theme/change callback of this round.
       */
      clearTimeout(brandTimer)
      brandTimer = setTimeout(() => { brandDisposers = attachBrand(ctx) }, 0)
    } else {
      clearTimeout(brandTimer)
      body.removeAttribute(BODY_ATTRIBUTE)
      body.style.removeProperty(COVER_VARIABLE)
      body.removeAttribute(DOCK_OPEN_ATTRIBUTE)
      for (const dispose of brandDisposers) dispose()
      brandDisposers = []
    }
    attached = active
  }

  sync()
  const off = ctx.on('theme/change', sync)

  return () => {
    off()
    clearTimeout(settleTimer)
    clearTimeout(registryTimer)
    clearTimeout(brandTimer)
    body.removeAttribute(BODY_ATTRIBUTE)
    body.style.removeProperty(COVER_VARIABLE)
    body.removeAttribute(DOCK_OPEN_ATTRIBUTE)
    for (const dispose of brandDisposers) dispose()
    brandDisposers = []
  }
}

/**
 * Take over the brand slots.
 *
 * Use `ctx.slots.inject(name, …)` rather than a bare `register`: the target slots are declared by ui-sidebar /
 * ui-conversation, this plugin's load order after them is not guaranteed, and `inject` waits for the target.
 *
 * One failed slot registration must not take down the whole skin (the palette is the substance), so each is wrapped in try and only warns.
 *
 * @param ctx - Plugin context.
 * @returns A disposer for each successful registration.
 */
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
 * Mount the right-hand status dock.
 *
 * Our own host node and React root: the dock belongs to no harness slot, its lifetime is entirely this plugin's
 * responsibility, and disposing unmounts the tree and removes the node, restoring the UI.
 *
 * @returns disposer。
 */
function mountDock(): () => void {
  const host = document.createElement('div')
  // The stylesheet collapses the whole rail by this attribute (hero / settling / narrow screens), so its name must not change.
  host.setAttribute('data-whale-wave-dock', '')
  document.body.append(host)
  const root = createRoot(host)
  root.render(createElement(WaveStatusDock))
  return () => {
    // Unmount asynchronously: React forbids a synchronous unmount inside its own render cycle.
    queueMicrotask(() => { root.unmount() })
    host.remove()
    document.body.removeAttribute('data-whale-wave-dock-open')
  }
}

function attachBrand(ctx: Context): (() => void)[] {
  const disposers: (() => void)[] = []
  for (const slot of BRAND_SLOTS) {
    disposers.push(ctx.slots.inject(slot.name, () => {
      /*
       * 🔴 The try must be **inside the callback**.
       *
       * `inject` only means "run once the target slot is ready", and register throws **at the moment the callback
       * runs**, not on the inject() line — a try outside is no try at all. The cost is severe: with two or more skins
       * installed, the second registering `conversation.hero.brand.mark` collides with the first at priority -1, and
       * the throw goes uncaught, **blanking the entire UI with nothing in the console but that slot conflict**.
       *
       * One failed slot takeover must not take down the whole skin (the palette is the substance), so it is swallowed with a single warning.
       */
      try {
        return ctx.slots.register({
          name: slot.name,
          // The official one sits at the default 0; -1 shadows it (ascending, lowest renders), and it returns automatically when the skin is deactivated.
          priority: -1,
        }, slot.component)
      } catch (error) {
        ctx.logger.warn('[whale-wave] 品牌位 %s 接管失败，保留官方标', slot.name, error)
        return () => {}
      }
    }))
  }
  return disposers
}
