/**
 * 用到的那部分 DeepSeek Harness API 声明，照 `0.1.1-rc.2` 的源码抄写，每处标了出处。
 *
 * 为什么自带而不是依赖 npm 包：npm 上的 `@deepseek-ai/dsh-client-*` 依赖链不完整，装不下来。
 * 这些模块运行时全是 external —— 主题服务与 slot 注册表由跑着本插件的 harness 提供，
 * 插件只通过 `ctx.theme` / `ctx.slots` 拿它们，不 import 它们的实现。
 *
 * 宿主行为与这里的声明对不上时，先回 harness 源码核对，别改代码去迁就声明。
 */

declare module '@deepseek-ai/cordis' {
  /** cordis Logger 门面是 `Record<'error'|'info'|'warn'|'debug', LoggerMethod>`，这里按用到的列。 */
  export interface Logger {
    info(message: unknown, ...args: readonly unknown[]): void
    warn(message: unknown, ...args: readonly unknown[]): void
    error(message: unknown, ...args: readonly unknown[]): void
    debug(message: unknown, ...args: readonly unknown[]): void
  }

  /** 释放一次注册。 */
  export type Disposer = () => void

  // ── packages/client/ui-theme/src/client/index.ts ──

  /** 主题 token 字典：以变量名为键的 `--dsw-alias-*` 覆盖。 */
  export type ThemeTokens = Record<string, string>

  /** 一个可选主题：id、明暗基座、以及 alias 层覆盖。 */
  export interface ThemeDefinition {
    /** 主题 id（`setTheme` 的参数）。`system` 是偏好不是 id，注册会抛。 */
    id: string
    /**
     * 建立在哪套基座调色板上。presenter 据此切 `body[data-ds-dark-theme]`，**不看 id**。
     */
    colorScheme: 'light' | 'dark'
    /** alias 层覆盖，作为 inline CSS 变量盖在基座之上。 */
    tokens: ThemeTokens
  }

  /** 每次变更发布的不可变主题状态。 */
  export interface ThemeSnapshot {
    /** 持久化的偏好，可能是 `system`。 */
    preference: string
    /** 解析后的当前主题（`system` 经 prefers-color-scheme 解析），覆盖层已折叠进 tokens。 */
    active: ThemeDefinition
    /** 已注册主题，按注册顺序。 */
    themes: readonly ThemeDefinition[]
    /** 单调递增的变更计数。 */
    revision: number
  }

  /** 主题服务，客户端插件通过 `ctx.theme` 取用。 */
  export interface ThemeService {
    /**
     * 注册一个主题。id 重复会抛。
     * @returns disposer；注销当前生效的主题会把偏好重置回默认，
     *   界面不会停留在一个已注销主题的 token 上。
     */
    register(definition: ThemeDefinition): Disposer
    /** 当前主题状态。 */
    getTheme(): ThemeSnapshot
    /** 切到某个已注册主题；未知 id 会抛。 */
    setTheme(id: string): void
  }

  // ── packages/client/ui-slots/src/index.ts ──

  /**
   * 品牌位注册项。
   *
   * 🔴 `priority` 是 rc.2 的关键：`SlotCore.register` 只在**同一个 priority** 上判占用
   *（`single` 的那一格、`list` 的同 id、`keyed` 的同 key），不同 priority 是**影子化**——
   * `entriesOfSlot` 取每格里 priority 最小的那个存活条目来渲染。官方组件注册在默认 0，
   * 所以第三方用 -1 就能接管，用正数则是"官方那份不在才轮到我"的兜底位。
   *
   * 早期版本没有这个维度（single 被占就直接抛错、第三方只能追加 list），本插件的品牌位
   * 依赖新行为，**装到更老的 harness 上会退回官方标**（register 抛错，被 attachBrand 吞掉
   * 并记一条警告），配色与封面不受影响。
   */
  export interface BrandSlotRegistration {
    name: 'sidebar.brand.mark' | 'sidebar.brand.name' | 'conversation.hero.brand.mark'
    /** 影子化排序，升序、最小的渲染；默认 0。 */
    priority?: number
  }

  /**
   * `conversation.composer.dock` 条目注册项。
   *
   * 该 slot 是 `{ kind: 'list', scope: 'session' }`（见 ui-conversation 的 apply.ts /
   * contract/slots.ts），官方 StatsLine 以 `id: 'stats'`、`order: 0` 挂在上面；
   * list 的占用冲突条件是**同 id 且同 priority**，换个 id 追加不会顶掉它。
   * scope 是 session，所以标准套件会把 `useSession` / `useProjection` 注进组件 props。
   */
  export interface DockSlotRegistration {
    name: 'conversation.composer.dock'
    /** 条目 id，同一 slot 内唯一。 */
    id: string
    /** 展示排序，数字越大越靠后。 */
    order?: number
  }

  /**
   * `sidebar.footer.action` 条目注册项。
   *
   * 该 slot 是 `{ kind: 'list', scope: 'root' }`（见 ui-sidebar 的 contract/slots.ts），
   * 渲染在侧栏最底部、「设置」那一行的**上方**，宿主只递一个 `wide`（false 是 56px 轨道态）。
   *
   * ⚠️ scope 是 **root**，所以标准套件**不会**把 `useSession` / `useProjection` 注进来。
   * 能量槽因此不从 props 取数，改为订阅 status-store——那边由挂在
   * `conversation.composer.dock`（session scope）的采集器写入。
   */
  export interface SidebarFooterSlotRegistration {
    name: 'sidebar.footer.action'
    /** 条目 id，同一 slot 内唯一。 */
    id: string
    /** 展示排序，数字越大越靠后。 */
    order?: number
  }

  /** slot 服务，只列本插件用到的。 */
  export interface SlotsService {
    /** 在目标 slot 就绪时执行注册；返回 disposer。 */
    inject(name: string, register: () => Disposer): Disposer
    /** 注册一个 slot 条目。 */
    register(
      registration: BrandSlotRegistration | DockSlotRegistration | SidebarFooterSlotRegistration,
      component: unknown,
    ): Disposer
  }

  /** 插件 apply 收到的上下文（本插件用到的成员）。 */
  export interface Context {
    logger: Logger
    /** `inject: ['slots']` 之后可用。 */
    slots: SlotsService
    /** `inject: ['theme']` 声明之后才可用。 */
    theme: ThemeService
    /** 注册即副作用：返回的 disposer 绑定在当前 fiber 上。 */
    effect(callback: () => Disposer | void, label?: string): Disposer
    /**
     * 订阅事件。主题变更事件是 `theme/change`，在注册表或激活主题变化时触发。
     * @returns 退订函数。
     */
    on(event: 'theme/change', listener: (snapshot?: ThemeSnapshot) => void): Disposer
  }
}
