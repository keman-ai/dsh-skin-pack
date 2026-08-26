/**
 * 波妞水面 · 浏览器半。
 *
 * 做三件事，稳定性依次递减，所以分开写：
 *
 * 1. **注册主题** —— 配色交给 `ctx.theme`，presenter 负责刷成 body 上的 inline 变量。
 *    只依赖语义 token，harness 改版不会动 token 的含义，这层能长期活着。
 * 2. **挂封面层** —— 往 body 打一个自有属性、把封面图以 CSS 变量交给样式表。只用自己的
 *    属性和自己的变量，不钩 harness 的类名或结构。
 * 3. **接管品牌位** —— 用 `priority: -1` 影子化官方的品牌标与站名（见 Brand.tsx）。
 *    这一件跟皮肤的激活状态绑定：皮肤停用就撤销注册，界面自动回到官方标。
 *
 * 三件都走 `ctx.effect` / disposer，卸载时属性摘掉、变量清掉、主题注销、注册撤销，
 * 界面回到原样。
 */

import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { Context } from '@deepseek-ai/cordis'
import { PonyoMark, PonyoName } from './Brand.tsx'
import { PonyoStatusDock } from './StatusDock.tsx'
import { NforestEnergyRail } from './EnergyRail.tsx'
import { PonyoStatusProbe } from './StatusProbe.tsx'
import { PONYO_TOKENS } from './tokens.ts'
import './ponyo.module.css'

export { PONYO_PALETTE, PONYO_TOKENS } from './tokens.ts'

/** 主题 id，也是 `setTheme` 的参数。三处 id 必须一致：本常量、skin.json、cordis.patch.yml。 */
export const THEME_ID = 'ponyo'

/** body 标记：装饰 CSS 的唯一挂点，同时便于用户自写覆盖规则。 */
export const BODY_ATTRIBUTE = 'data-dsh-ponyo'

/** 封面变量名：CSS 里读它，值在这里注入，图片资源不进样式表（否则样式表被撑爆且不好清）。 */
const COVER_VARIABLE = '--ponyo-cover'

/**
 * 状态台的展开标记与存储键，与 StatusDock 里的同名常量一一对应。
 *
 * 🔴 这两个也归主题切换管：状态台组件是**一直挂着**的（可见性交给 CSS），它在自己的
 * effect 里把展开标记打到 body 上，不关心皮肤是否激活。装 21 套时 body 上就同时挂着
 * 21 个 `data-*-dock-open`——CSS 都带 `body[data-dsh-*]` 前缀所以不会串样式，但属性堆在
 * 那里就是残留，排查时看着像串台。所以皮肤停用时顺手摘掉，重新激活时按存的值还原。
 */
const DOCK_OPEN_ATTRIBUTE = 'data-ponyo-dock-open'
const DOCK_STORAGE_KEY = 'ponyo'

/**
 * 封面地址。由 host 半在 `/skin-cover/ponyo.webp` 上提供（见 src/index.ts 的 COVER_ROUTE）。
 *
 * 🔴 不再内联 data URI：多套皮肤同时装载时，每套几百 KB 的 base64 会把浏览器主线程压死
 *（实测 21 套同装时首屏 90 秒渲染不出来）。现在浏览器只在皮肤**真的激活**、CSS 用到这个
 * 变量时才去取图。
 */
const COVER_URL = '/skin-cover/ponyo.webp'


/**
 * 自动应用的启动窗口。
 *
 * 要盖过的是 ui-theme 的 `adopt()` —— Host 偏好快照到达时把主题覆盖回内置值。实测它在
 * 300ms 上下到达，冷启动更慢，取 8 秒留足余量；窗口一过插件彻底松手。
 */
const AUTO_APPLY_WINDOW_MS = 8_000

/**
 * 品牌位的三个 slot 与它们要的组件。
 *
 * 注册 priority 取 -1：官方 `ui-brand-official` 在默认 0，priority 升序、**数字小的渲染**，
 * 所以 -1 会影子化官方那份（不是卸载它——我们撤销注册后官方立刻回来）。
 */
const BRAND_SLOTS = [
  { name: 'sidebar.brand.mark', component: PonyoMark },
  { name: 'sidebar.brand.name', component: PonyoName },
  { name: 'conversation.hero.brand.mark', component: PonyoMark },
] as const

/** 主题服务与 slot 注册表；`inject` 保证它们先就绪。 */
export const inject = ['theme', 'slots']

/** 浏览器半的配置，与 host 半同名字段。 */
export interface Config {
  /**
   * 装上就切到波妞水面，默认开。
   *
   * 为什么需要这个开关：harness 的第三方主题 id **不进内置 settings schema**，选择只在
   * 进程内活着，不写进 `$DSH_HOME/settings.yaml`；而内置的「设置 → 外观」那一行**只列
   * 浅色 / 深色 / 跟随系统**三个内置偏好，第三方主题压根不在其中。不自动应用的话，用户
   * 每次启动 dsh 都得去皮肤集市的面板里重选一遍——装了皮肤却看不到皮肤，是这套机制下的
   * 默认结果。
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
   * 挂载不区分皮肤是否激活，可见性交给 CSS（`body[data-dsh-ponyo]` 才 display）——
   * 判据写成"没激活 = 不存在"，避免皮肤生效前那段窗口里露出半成品界面。
   */
  ctx.effect(() => mountDock(), 'ponyo: status dock')

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
    id: 'ponyo-status',
    // 排在官方 stats（order 0）之后；反正不画东西，只是不去打乱既有顺序。
    order: 100,
  }, PonyoStatusProbe)), 'ponyo: status probe')

  /*
   * 侧栏底部的能量槽（原型稿那条写死的能量值的真数据版）。
   *
   * `sidebar.footer.action` 是 `{ kind: 'list' }`，紧挨着「设置」那一行，追加不顶掉任何人。
   * 它的 scope 是 `root`，拿不到会话投影——所以这个组件不读 props，而是订阅 status-store，
   * 数据由上面那个 session scope 的采集器写入。一次采集，两处显示。
   */
  ctx.effect(() => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'ponyo-energy',
    order: 100,
  }, NforestEnergyRail)), 'ponyo: energy rail')

  // 注册与挂载放同一个 effect 并保证顺序：mountStage 里会 setTheme，
  // 而 setTheme 一个未注册的 id 会直接抛错。
  ctx.effect(() => {
    const unregister = ctx.theme.register({ id: THEME_ID, colorScheme: 'light', tokens: PONYO_TOKENS })
    const unmount = mountStage(ctx, shouldAutoApply(ctx, config.autoApply !== false), userPicked())
    return () => {
      unmount()
      unregister()
    }
  }, 'ponyo: theme + cover + brand')
}

/** 皮肤集市记住用户选择的键（见 dsh-skin-market 的 appearance.ts）。 */
const MARKET_THEME_KEY = 'skin-market.theme'

/** 本次页面生命周期里"谁占了自动应用名额"的全局标记。 */
const CLAIM_KEY = '__dshSkinAutoApplyClaim__'

/**
 * 多套皮肤同时装着时，决定这一套要不要自动应用。
 *
 * 🔴 这一层是必须的。皮肤的 `autoApply` 配在 Loader 行上，**host 半读得到，浏览器半读不到**
 *（client 的 boot 行只带 id / url / rev / inject / external，不带 config）。所以哪怕在
 * `cordis.patch.yml` 里把每套都写成 `autoApply: false`，浏览器里仍然是每套都想把主题按成自己：
 * 装 3 套就足以让第二套注册品牌位时撞车，整个界面白屏。
 *
 * 两条规则：
 *   1. **用户选过就一切听用户的**——皮肤集市把选择记在 localStorage，那才是权威，
 *      任何皮肤都不再自动应用（否则刷新一次就把用户的选择顶掉）；
 *   2. 用户没选过时，**只有第一个加载到的皮肤能占这个名额**，其余安静注册、等着被选。
 *
 * @param ctx - 插件上下文，仅用于记日志。
 * @param configured - host 半配的意图（浏览器半拿不到，只在单皮肤场景下由默认值生效）。
 * @returns 这一套是否自动应用。
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
    // 隐私模式下读不到就当没选过，按下面的先到先得走。
  }
  if (stored === THEME_ID) {
    /*
     * 🔴 用户在集市里选的就是本套——自己应用，不指望集市替我们重放。
     *
     * 集市的 `restoreSaved` 只在 `theme/change` 事件里等目标主题出现，而**注册主题本身
     * 不一定发这个事件**：实测点选切换 → 刷新，皮肤就丢了，body 上一个属性都没有。
     * 以前没暴露，是因为总有某套皮肤在自动应用、顺带把事件发了出来。
     *
     * 选择是用户明确表达过的，本套认账即可，不必绕一圈。
     */
    return true
  }
  if (stored !== null) {
    // 用户选的是别的皮肤（或内置），本套一律不插手。
    return false
  }
  if (stored !== null) {
    // 用户选的是别的皮肤（或内置），本套一律不插手。
    return false
  }
  if (scope[CLAIM_KEY] !== undefined) {
    ctx.logger.info('[ponyo] 已有皮肤占了自动应用名额（%s），本套改为待选', String(scope[CLAIM_KEY]))
    return false
  }
  scope[CLAIM_KEY] = THEME_ID
  return true
}

/**
 * 跟随激活状态开合装饰与品牌位，并在启动窗口内把主题按住。
 *
 * 装饰**只在本皮肤激活时存在**：用户切回内置主题而封面还铺着、鲸鱼标还挂着，配色已经
 * 不是这套了，那是纯粹的视觉污染。
 *
 * @param ctx - 插件上下文。
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
   *（`isThemePreference('ponyo')` 是 false，第三方 id 根本不进持久化），而 Host 快照
   * 到达时 `adopt()` 会拿盘上存的内置值**覆盖**当前偏好。顺序一旦是「插件先切好 → 快照后到」，
   * 皮肤就被悄悄换回内置主题，**且没有任何报错**；此时插件已经放手，就再也切不回来——
   * 表现是"装了皮肤，刷新几次又变回默认"。两者谁先谁后是竞态，所以时好时坏。
   *
   * 窗口制的代价：每次刷新都会重新应用，用户在设置里切走只对当次有效。想永久换走要把
   * `autoApply` 配成 false 或卸载本插件——这条已写进 README。
   */
  let settled = false
  const settleTimer = setTimeout(() => { settled = true }, AUTO_APPLY_WINDOW_MS)

  /** 注册表是否已长齐（见 REGISTRY_SETTLE_MS）。 */
  let registrySettled = false
  const registryTimer = setTimeout(() => {
    registrySettled = true
    sync()
  }, REGISTRY_SETTLE_MS)

  const sync = (): void => {
    /*
     * `picked`（用户在集市里选的就是本套）直接生效，不等注册表长齐、也不管装了几套——
     * 那是用户的明确选择。其余情况才走"只装一套才自动应用"的仲裁。
     */
    const mayApply = picked || (registrySettled && soleSkin(ctx))
    if (ctx.theme.getTheme().active.id !== THEME_ID && autoApply && !settled && mayApply) {
      try {
        ctx.theme.setTheme(THEME_ID)
      } catch (error) {
        // 🔴 别写"去「设置 → 外观」手动选"——实测那一行只有 浅色 / 深色 / 跟随系统 三个内置
        // 偏好（ui-theme 的 AppearanceRow 里 CUBES 是写死的三项），第三方主题根本不在里面。
        // 能手动切的地方是皮肤集市自己的面板（设置 → 皮肤市场）。
        ctx.logger.warn('[ponyo] 自动应用失败，可到「设置 → 皮肤市场」手动切换', error)
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
       * priority -1）时旧皮肤还没注销——撞车、被 attachBrand 吞掉，结果是**切过去了但
       * 品牌位还是官方标**。实测切 4 次能撞上 2 次，且完全静默。
       *
       * setTimeout(0) 把接管排到本轮所有 theme/change 回调之后。
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
 * 接管品牌位。
 *
 * 用 `ctx.slots.inject(name, …)` 而不是裸调 `register`：目标 slot 由 ui-sidebar /
 * ui-conversation 声明，本插件的加载顺序不保证在它们之后，`inject` 会等目标就绪再注册。
 *
 * 单个 slot 注册失败不该拖垮整套皮肤（配色才是主体），所以逐个 try 住并只记一条警告。
 *
 * @param ctx - 插件上下文。
 * @returns 每个成功注册的 disposer。
 */
/**
 * 皮肤重新激活时，按用户存的偏好还原状态台的展开标记。
 *
 * 停用时这个属性被摘掉了（免得 21 套的标记堆在 body 上），而状态台组件的 effect 只在
 * 展开状态**变化**时才写，不会自己补回来——所以这里按存储值还原。默认展开。
 * @param body - document.body。
 */
function restoreDockOpen(body: HTMLElement): void {
  let open = true
  try {
    open = window.localStorage.getItem(DOCK_STORAGE_KEY) !== 'false'
  } catch {
    // 隐私模式读不到就按默认展开。
  }
  if (open) {
    body.setAttribute(DOCK_OPEN_ATTRIBUTE, '')
  } else {
    body.removeAttribute(DOCK_OPEN_ATTRIBUTE)
  }
}

/**
 * 用户在皮肤集市里选中的是不是本套。
 * @returns 是则本套自行应用，不等集市重放。
 */
function userPicked(): boolean {
  try {
    return localStorage.getItem(MARKET_THEME_KEY) === THEME_ID
  } catch {
    return false
  }
}

/**
 * 当前注册表里是不是只有本套皮肤。
 *
 * 🔴 判断放在 `theme/change` 的回调里，而不是插件 apply 的那一刻——那时别的皮肤可能还没加载完，
 * 数出来必然是 1。主题注册表是异步长齐的，所以每次变化都重新数。
 *
 * 规则：只装一套时自动应用（装了就见效，符合单皮肤用户的预期）；装了多套时**谁都不抢**，
 * 保持 harness 默认外观，由用户在「设置 → 皮肤市场 → 已安装 → 外观」里选。
 * 多套里谁先谁后取决于 bundle 加载顺序，抢先生效等于每次启动随机换一套。
 *
 * `light` / `dark` 是内置项，不算皮肤。
 * @param ctx - 插件上下文。
 * @returns 注册表里的第三方主题是否只有本套。
 */
function soleSkin(ctx: Context): boolean {
  const builtin = new Set(['light', 'dark'])
  const skins = ctx.theme.getTheme().themes.filter(theme => !builtin.has(theme.id))
  return skins.length <= 1
}

/**
 * 注册表"长齐"之前不许自动应用。
 *
 * 🔴 这条是补 soleSkin 的漏：主题注册表是**异步**长齐的（每套皮肤的 bundle 各自加载），
 * 最先注册的那套在只看到自己时 soleSkin 就是 true，于是它照样自动应用了——装了 21 套，
 * 表现是"每次启动被某一套劫持，且随加载顺序变"。实测就是这么被 wukong 抢走的。
 *
 * 所以推迟到 REGISTRY_SETTLE_MS 之后再判：那时所有 bundle 都已执行完，数出来的才是真数。
 * 这段延迟落在 8 秒自动应用窗口之内，单皮肤场景照样能自动生效，只是晚一点点。
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
  host.setAttribute('data-ponyo-dock', '')
  document.body.append(host)
  const root = createRoot(host)
  root.render(createElement(PonyoStatusDock))
  return () => {
    // 异步卸载：React 不允许在自己的渲染周期内同步 unmount。
    queueMicrotask(() => { root.unmount() })
    host.remove()
    document.body.removeAttribute('data-ponyo-dock-open')
  }
}

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
        ctx.logger.warn('[ponyo] 品牌位 %s 接管失败，保留官方标', slot.name, error)
        return () => {}
      }
    }))
  }
  return disposers
}
