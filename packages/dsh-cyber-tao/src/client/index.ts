/**
 * 赛博道观 · 浏览器半。
 *
 * 做四件事，稳定性依次递减，所以分开写：
 *
 * 1. **注册主题** —— 配色交给 `ctx.theme`，presenter 负责刷成 body 上的 inline 变量。
 *    只依赖语义 token，harness 改版不会动 token 的含义，这层能长期活着。
 * 2. **挂主视觉** —— 往 body 打一个自有属性、把封面以 CSS 变量交给样式表。只用自己的属性和
 *    自己的变量，不钩 harness 的类名或结构。
 * 3. **接管品牌位** —— 用 `priority: -1` 影子化官方的标与站名（见 Brand.tsx）。这一件跟皮肤的
 *    激活状态绑定：皮肤停用就撤销注册，界面自动回到官方标。
 * 4. **右侧状态台** —— 自建 fixed 栏 + 一个零渲染的采集器（见 StatusDock / StatusProbe）。
 *
 * 全部走 `ctx.effect` / disposer，卸载时属性摘掉、变量清掉、主题注销、注册撤销，界面回到原样。
 */

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { Context } from '@deepseek-ai/cordis'
import { TaoMark, TaoName } from './Brand.tsx'
import { TaoStatusDock } from './StatusDock.tsx'
import { TaoEnergyRail } from './EnergyRail.tsx'
import { TaoStatusProbe } from './StatusProbe.tsx'
import { TAO_TOKENS } from './tokens.ts'
import './tao.module.css'

export { TAO_PALETTE, TAO_TOKENS } from './tokens.ts'

/** 主题 id，也是 `setTheme` 的参数。三处 id 必须一致：本常量、skin.json、cordis.patch.yml。 */
export const THEME_ID = 'tao'

/** Body marker: the single hook for the decorative CSS, and a convenient handle for user overrides. */
export const BODY_ATTRIBUTE = 'data-dsh-tao'

/** 主视觉变量名：CSS 里读它，值在这里注入，图片资源不进样式表（否则样式表被撑爆且不好清）。 */
const COVER_VARIABLE = '--tao-cover'

/**
 * The dock's expanded marker and storage key, matching the same-named constants in StatusDock.
 *
 * 🔴 These belong to theme switching too: the dock component is **always mounted** (visibility is left to CSS)
 * and its effect stamps the expanded marker onto body regardless of whether the skin is active. With 21 installed,
 * body carries 21 `data-*-dock-open` attributes — the CSS is all prefixed with `body[data-dsh-*]` so styles never
 * cross, but the pile-up is residue that looks like a leak when debugging. So it is removed on deactivation and restored from storage on reactivation.
 */
const DOCK_OPEN_ATTRIBUTE = 'data-tao-dock-open'
const DOCK_STORAGE_KEY = 'tao.dock.open'

/**
 * 封面地址。由 host 半在 `/skin-cover/tao.webp` 上提供（见 src/index.ts 的 COVER_ROUTE）。
 *
 * 🔴 不再内联 data URI：21 套皮肤同时装载时，每套几百 KB 的 base64 会把浏览器主线程压死
 *（实测首屏 90 秒渲染不出来）。现在浏览器只在皮肤**真的激活**、CSS 用到这个变量时才去取图。
 */
const COVER_URL = '/skin-cover/tao.webp'

/**
 * The startup window for auto-apply.
 *
 * 要盖过的是 ui-theme 的 `adopt()` —— Host 偏好快照到达时把主题覆盖回内置值。实测它在 300ms
 * 上下到达，冷启动更慢，取 8 秒留足余量；窗口一过插件彻底松手。
 */
const AUTO_APPLY_WINDOW_MS = 8_000

/**
 * 品牌位的三个 slot 与它们要的组件。
 *
 * 注册 priority 取 -1：官方 `ui-brand-official` 在默认 0，priority 升序、**数字小的渲染**，
 * 所以 -1 会影子化官方那份（不是卸载它——我们撤销注册后官方立刻回来）。
 */
const BRAND_SLOTS = [
  { name: 'sidebar.brand.mark', component: TaoMark },
  { name: 'sidebar.brand.name', component: TaoName },
  { name: 'conversation.hero.brand.mark', component: TaoMark },
] as const

/** 主题服务与 slot 注册表；`inject` 保证它们先就绪。 */
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
   * 关掉它就回到「装上只是可选，去皮肤集市里手动选」的行为。
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  /*
   * 右侧状态台：自建 fixed 节点 + 自己的 React root。
   *
   * 不接管 harness 的 `details` slot —— 它现在**能**接管（`single` 的占用冲突只发生在同一
   * priority），但那根装的是「点某次工具调用看 Input / Output」，是排障唯一的线索，
   * 用状态台把它换掉是净损失。两根并存，互不干扰。
   *
   * 挂载不区分皮肤是否激活，可见性交给 CSS（`body[data-dsh-tao]` 才 display）——
   * 判据写成"没激活 = 不存在"，避免皮肤生效前那段窗口里露出半成品界面。
   */
  ctx.effect(() => mountDock(), 'tao: status dock')

  /*
   * 状态采集器。
   *
   * 状态台是自建节点，拿不到 slot 注入的 `useProjection` / `useSession`，所以在
   * `conversation.composer.dock` 上挂一个零渲染条目替它读（见 StatusProbe / status-store）。
   * 那个 slot 是 `{ kind: 'list' }`，官方 StatsLine 也在上面（id `stats`、order 0），
   * 追加不会顶掉它。
   *
   * 用 `inject` 而不是直接 register：目标 slot 由 ui-conversation 声明，本插件的加载顺序
   * 不保证在它之后，inject 会等它就绪再注册。
   */
  ctx.effect(() => ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
    name: 'conversation.composer.dock',
    id: 'tao-status',
    // Ordered after the official stats (order 0); it draws nothing anyway and simply avoids disturbing the existing order.
    order: 100,
  }, TaoStatusProbe)), 'tao: status probe')

  /*
   * 侧栏底部的能量槽（原型稿那条「今日修行 · 心神值」的真数据版）。
   *
   * `sidebar.footer.action` 是 `{ kind: 'list' }`，紧挨着「设置」那一行，追加不顶掉任何人。
   * 它的 scope 是 `root`，拿不到会话投影——所以这个组件不读 props，而是订阅 status-store，
   * 数据由上面那个 session scope 的采集器写入。一次采集，两处显示。
   */
  ctx.effect(() => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'tao-energy',
    order: 100,
  }, TaoEnergyRail)), 'tao: energy rail')

  // 注册与挂载放同一个 effect 并保证顺序：mountStage 里会 setTheme，
  // And setTheme throws outright on an unregistered id.
  ctx.effect(() => {
    const unregister = ctx.theme.register({ id: THEME_ID, colorScheme: 'dark', tokens: TAO_TOKENS })
    const unmount = mountStage(ctx, shouldAutoApply(ctx, config.autoApply !== false), userPicked())
    return () => {
      unmount()
      unregister()
    }
  }, 'tao: theme + cover + brand')
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
  if (scope[CLAIM_KEY] !== undefined) {
    ctx.logger.info('[tao] 已有皮肤占了自动应用名额（%s），本套改为待选', String(scope[CLAIM_KEY]))
    return false
  }
  scope[CLAIM_KEY] = THEME_ID
  return true
}

/**
 * 跟随激活状态开合装饰与品牌位，并在启动窗口内把主题按住。
 *
 * 装饰**只在本皮肤激活时存在**：用户切回内置主题而主视觉还铺着、印章还挂着，配色已经不是这套了，
 * 那是纯粹的视觉污染。
 *
 * @param ctx - Plugin context.
 * @param autoApply - 是否自动切到本皮肤。
 * @returns disposer：摘属性、清变量、撤销品牌注册、清定时器、退订。
 */
function mountStage(ctx: Context, autoApply: boolean, picked: boolean): () => void {
  const body = document.body
  let attached = false
  /** 品牌位的注册 disposer，只在皮肤激活期间存在。 */
  let brandDisposers: (() => void)[] = []
  /** 推迟接管品牌位的定时器（见下面 sync 里的说明）。 */
  let brandTimer: ReturnType<typeof setTimeout> | undefined

  /**
   * 启动窗口是否已过。窗口内负责把主题按住，窗口后完全不干预。
   *
   * 🔴 不能写成「切成功一次就收手」：ui-theme 的 `setTheme` 只把内置偏好写盘
   *（`isThemePreference('tao')` 是 false，第三方 id 根本不进持久化），而 Host 快照到达时
   * `adopt()` 会拿盘上存的内置值**覆盖**当前偏好。顺序一旦是「插件先切好 → 快照后到」，皮肤就被
   * 悄悄换回内置主题，**且没有任何报错**；此时插件已经放手，就再也切不回来——表现是
   * "装了皮肤，刷新几次又变回默认"。两者谁先谁后是竞态，所以时好时坏。
   *
   * 窗口制的代价：每次刷新都会重新应用，用户在设置里切走只对当次有效。想永久换走要把
   * `autoApply` 配成 false 或卸载本插件——这条已写进 README。
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
        // 🔴 别写"去「设置 → 外观」手动选"——实测那一行只有 浅色 / 深色 / 跟随系统 三个内置
        // 偏好（ui-theme 的 AppearanceRow 里 CUBES 是写死的三项），第三方主题根本不在里面。
        // 能手动切的地方是皮肤集市自己的面板（设置 → 皮肤市场）。
        ctx.logger.warn('[tao] 自动应用失败，可到「设置 → 皮肤市场」手动切换', error)
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
       * 🔴 接管品牌位要**推迟一拍**。
       *
       * 从别的皮肤切过来时，新旧两套响应的是**同一个** `theme/change`，谁先跑取决于插件
       * 注册顺序。若新皮肤先跑，它去注册 `conversation.hero.brand.mark`（single slot，
       * priority -1）时，旧皮肤还没来得及在自己的回调里注销——撞车、被 attachBrand 吞掉，
       * 结果是**切过去了但品牌位还是官方标**。实测切 4 次能撞上 2 次，且完全静默。
       *
       * setTimeout(0) 把接管排到本轮所有 theme/change 回调之后，那时旧皮肤必定已注销。
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
 * 挂载右侧状态台。
 *
 * 自建宿主节点 + React root：状态台不属于 harness 的任何 slot，生命周期完全由本插件负责，
 * dispose 时卸载组件树并移走节点，界面回到原样。
 *
 * @returns disposer。
 */
function mountDock(): () => void {
  const host = document.createElement('div')
  // 样式表按这个属性收起整根（hero / settling / 窄屏），所以属性名不能改。
  host.setAttribute('data-tao-dock', '')
  document.body.append(host)
  const root = createRoot(host)
  root.render(createElement(TaoStatusDock))
  return () => {
    // Unmount asynchronously: React forbids a synchronous unmount inside its own render cycle.
    queueMicrotask(() => { root.unmount() })
    host.remove()
    document.body.removeAttribute('data-tao-dock-open')
  }
}

/**
 * 接管品牌位。
 *
 * 用 `ctx.slots.inject(name, …)` 而不是裸调 `register`：目标 slot 由 ui-sidebar /
 * ui-conversation 声明，本插件的加载顺序不保证在它们之后，`inject` 会等目标就绪再注册。
 *
 * 单个 slot 注册失败不该拖垮整套皮肤（配色才是主体），所以逐个 try 住并只记一条警告。
 *
 * @param ctx - Plugin context.
 * @returns 每个成功注册的 disposer。
 */
function attachBrand(ctx: Context): (() => void)[] {
  const disposers: (() => void)[] = []
  for (const slot of BRAND_SLOTS) {
    disposers.push(ctx.slots.inject(slot.name, () => {
      /*
       * 🔴 try 必须在**回调里面**。
       *
       * `inject` 只是"等目标 slot 就绪再执行"，register 的抛错发生在**回调被调用的那一刻**，
       * 不在 inject() 这一行——把 try 写在外面等于没写。实测代价很大：同时装两套以上皮肤时，
       * 第二套注册 `conversation.hero.brand.mark` 撞上第一套的 priority -1，抛出的错没人接，
       * 直接冒泡成未捕获异常，**整个界面白屏、控制台只有那一条 slot 冲突**。
       *
       * 单个 slot 接管失败不该拖垮整套皮肤（配色才是主体），所以吞掉并只记一条警告。
       */
      try {
        return ctx.slots.register({
          name: slot.name,
          // 官方在默认 0；-1 影子化它（升序、最小的渲染），皮肤停用后官方那份自动回来。
          priority: -1,
        }, slot.component)
      } catch (error) {
        ctx.logger.warn('[tao] 品牌位 %s 接管失败，保留官方标', slot.name, error)
        return () => {}
      }
    }))
  }
  return disposers
}
