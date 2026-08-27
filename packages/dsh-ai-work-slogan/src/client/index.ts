/**
 * AI Work Mode · 浏览器半。
 *
 * 做四件事，稳定性依次递减，所以分开写：
 *
 * 1. **Register the theme** — the palette goes to `ctx.theme`, and the presenter paints it as inline variables on body.
 *    It depends on semantic tokens only, and harness redesigns do not change what a token means, so this layer lasts.
 * 2. **打 body 标记** —— 装饰 CSS 全挂在这个自有属性下。这套没有主视觉图要注入，
 *    空屏的口号与白色方标分别由样式表和品牌位组件负责。
 * 3. **接管品牌位** —— 用 `priority: -1` 影子化官方的标与站名（见 Brand.tsx）。这一件跟皮肤的
 *    激活状态绑定：皮肤停用就撤销注册，界面自动回到官方标。
 * 4. **右侧状态台** —— 自建 fixed 栏 + 一个零渲染的采集器（见 StatusDock / StatusProbe）。
 *
 * 全部走 `ctx.effect` / disposer，卸载时属性摘掉、变量清掉、主题注销、注册撤销，界面回到原样。
 */

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { Context } from '@deepseek-ai/cordis'
import { WorkMark, WorkName } from './Brand.tsx'
import { WorkStatusDock } from './StatusDock.tsx'
import { WorkEnergyRail } from './EnergyRail.tsx'
import { WorkStatusProbe } from './StatusProbe.tsx'
import { WORK_TOKENS } from './tokens.ts'
import './aiwork.module.css'

export { WORK_PALETTE, WORK_TOKENS } from './tokens.ts'
export { DEEPSEEK_ICON } from './icon.generated.ts'

/** Theme id, and the argument to `setTheme`. Three ids must agree: this constant, skin.json and cordis.patch.yml. */
export const THEME_ID = 'ai-work'

/** Body marker: the single hook for the decorative CSS, and a convenient handle for user overrides. */
export const BODY_ATTRIBUTE = 'data-dsh-ai-work'

/**
 * The dock's expanded marker and storage key, matching the same-named constants in StatusDock.
 *
 * 🔴 These belong to theme switching too: the dock component is **always mounted** (visibility is left to CSS)
 * and its effect stamps the expanded marker onto body regardless of whether the skin is active. With 21 installed,
 * body carries 21 `data-*-dock-open` attributes — the CSS is all prefixed with `body[data-dsh-*]` so styles never
 * cross, but the pile-up is residue that looks like a leak when debugging. So it is removed on deactivation and restored from storage on reactivation.
 */
const DOCK_OPEN_ATTRIBUTE = 'data-ai-work-dock-open'
const DOCK_STORAGE_KEY = 'ai-work.dock.open'

/*
 * ⚠️ 这套皮肤**没有主视觉图**，所以也没有"把封面塞进 CSS 变量"那一步。
 *
 * 它的空屏靠一句口号 + 一块白色方标（见 aiwork.module.css 与 Brand.tsx），鲸鱼标由品牌位组件
 * 自己引用常量渲染。前几套皮肤在这里注入 `--xxx-cover`，这套删掉——留着一个没人读的变量，
 * 下一个看代码的人会去找那张不存在的图。
 */

/**
 * The startup window for auto-apply.
 *
 * 要盖过的是 ui-theme 的 `adopt()` —— Host 偏好快照到达时把主题覆盖回内置值。实测它在 300ms
 * 上下到达，冷启动更慢，取 8 秒留足余量；窗口一过插件彻底松手。
 */
const AUTO_APPLY_WINDOW_MS = 8_000

/**
 * The three brand slots and the components they take.
 *
 * Registered at priority -1: the official `ui-brand-official` sits at the default 0, priority ascends and the
 * **lower number renders**, so -1 shadows the official one (it is not unloaded — the moment we deregister, it returns).
 */
const BRAND_SLOTS = [
  { name: 'sidebar.brand.mark', component: WorkMark },
  { name: 'sidebar.brand.name', component: WorkName },
  { name: 'conversation.hero.brand.mark', component: WorkMark },
] as const

/** The theme service and slot registry; `inject` guarantees they are ready first. */
export const inject = ['theme', 'slots']

/** Browser-half config, with the same field names as the host half. */
export interface Config {
  /**
   * 装上就切到本皮肤，默认开。
   *
   * 为什么需要这个开关：harness 的第三方主题 id **不进内置 settings schema**，选择只在进程内
   * 活着，不写进 `$DSH_HOME/settings.yaml`；而内置的「设置 → 外观」那一行**只列
   * 浅色 / 深色 / 跟随系统**三个内置偏好，第三方主题压根不在其中。不自动应用的话，用户每次
   * 启动 dsh 都得去皮肤集市的面板里重选一遍——装了皮肤却看不到皮肤，是这套机制下的默认结果。
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
   * 挂载不区分皮肤是否激活，可见性交给 CSS（`body[data-dsh-ai-work]` 才 display）——
   * The rule is "not active means not present", so no half-built UI shows during the window before the skin takes effect.
   */
  ctx.effect(() => mountDock(), 'ai-work: status dock')

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
    id: 'ai-work-status',
    // Ordered after the official stats (order 0); it draws nothing anyway and simply avoids disturbing the existing order.
    order: 100,
  }, WorkStatusProbe)), 'ai-work: status probe')

  /*
   * 侧栏底部的能量槽（原型稿那条写死的能量值的真数据版）。
   *
   * `sidebar.footer.action` is `{ kind: 'list' }`, right beside the Settings row, and appending displaces nobody.
   * Its scope is `root` and it receives no session projection, so this component reads no props and subscribes to
   * status-store instead, written by the session-scoped probe above. Collected once, displayed twice.
   */
  ctx.effect(() => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'work-energy',
    order: 100,
  }, WorkEnergyRail)), 'work: energy rail')

  // Registration and mounting share one effect, in order: mountStage calls setTheme,
  // And setTheme throws outright on an unregistered id.
  ctx.effect(() => {
    const unregister = ctx.theme.register({ id: THEME_ID, colorScheme: 'dark', tokens: WORK_TOKENS })
    const unmount = mountStage(ctx, shouldAutoApply(ctx, config.autoApply !== false), userPicked())
    return () => {
      unmount()
      unregister()
    }
  }, 'ai-work: theme + cover + brand')
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
    ctx.logger.info('[ai-work] 已有皮肤占了自动应用名额（%s），本套改为待选', String(scope[CLAIM_KEY]))
    return false
  }
  scope[CLAIM_KEY] = THEME_ID
  return true
}

/**
 * Open and close the decorations and brand slots with the active state, and hold the theme during the startup window.
 *
 * 装饰**只在本皮肤激活时存在**：用户切回内置主题而主视觉还铺着、印章还挂着，配色已经不是这套了，
 * 那是纯粹的视觉污染。
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
  /** 推迟接管品牌位的定时器（切换时让旧皮肤先注销，见 sync）。 */
  let brandTimer: ReturnType<typeof setTimeout> | undefined

  /**
   * Whether the startup window has passed. Inside it the theme is held; after it, nothing is touched.
   *
   * 🔴 It cannot be "stop after one successful switch": ui-theme's `setTheme` persists built-in preferences only
   *（`isThemePreference('ai-work')` 是 false，第三方 id 根本不进持久化），而 Host 快照到达时
   * `adopt()` 会拿盘上存的内置值**覆盖**当前偏好。顺序一旦是「插件先切好 → 快照后到」，皮肤就被
   * 悄悄换回内置主题，**且没有任何报错**；此时插件已经放手，就再也切不回来——表现是
   * "装了皮肤，刷新几次又变回默认"。两者谁先谁后是竞态，所以时好时坏。
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
        ctx.logger.warn('[ai-work] 自动应用失败，可到「设置 → 皮肤市场」手动切换', error)
      }
      return
    }
    const active = ctx.theme.getTheme().active.id === THEME_ID
    if (active === attached) {
      return
    }
    if (active) {
      body.setAttribute(BODY_ATTRIBUTE, '')
      restoreDockOpen(body)
      /*
       * 🔴 接管品牌位推迟一拍：切换时新旧两套响应同一个 theme/change，新皮肤先跑就会撞上
       * 旧皮肤还没注销的 single slot，被静默吞掉，表现是"切过去了但品牌位还是官方标"。
       */
      clearTimeout(brandTimer)
      brandTimer = setTimeout(() => { brandDisposers = attachBrand(ctx) }, 0)
    } else {
      clearTimeout(brandTimer)
      body.removeAttribute(BODY_ATTRIBUTE)
    body.removeAttribute(DOCK_OPEN_ATTRIBUTE)
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
    clearTimeout(brandTimer)
    clearTimeout(settleTimer)
    clearTimeout(registryTimer)
    body.removeAttribute(BODY_ATTRIBUTE)
    for (const dispose of brandDisposers) dispose()
    brandDisposers = []
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
  host.setAttribute('data-ai-work-dock', '')
  document.body.append(host)
  const root = createRoot(host)
  root.render(createElement(WorkStatusDock))
  return () => {
    // Unmount asynchronously: React forbids a synchronous unmount inside its own render cycle.
    queueMicrotask(() => { root.unmount() })
    host.remove()
    document.body.removeAttribute('data-ai-work-dock-open')
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
        ctx.logger.warn('[ai-work] 品牌位 %s 接管失败，保留官方标', slot.name, error)
        return () => {}
      }
    }))
  }
  return disposers
}
