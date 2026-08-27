/**
 * 用到的那部分 DeepSeek Harness API 声明，照 `0.1.0-rc.7` 的源码抄写，每处标了出处。
 *
 * 为什么自带而不是依赖 npm 包：npm 上的 `@deepseek-ai/dsh-client-*` 依赖链不完整，
 * 装不下来。这些模块运行时全是 external —— 主题服务由跑着本插件的 harness 提供，
 * 插件只通过 `ctx.theme` 拿它，不 import 它的实现。
 *
 * When host behaviour disagrees with these declarations, check the harness source first — do not bend the code to fit the declarations.
 */

declare module '@deepseek-ai/cordis' {
  /** cordis's Logger facade is `Record<'error'|'info'|'warn'|'debug', LoggerMethod>`; only what we use is listed. */
  export interface Logger {
    info(message: unknown, ...args: readonly unknown[]): void
    warn(message: unknown, ...args: readonly unknown[]): void
    error(message: unknown, ...args: readonly unknown[]): void
    debug(message: unknown, ...args: readonly unknown[]): void
  }

  /** Release one registration. */
  export type Disposer = () => void

  // ── packages/client/ui-theme/src/client/index.ts ──

  /** Theme token map: `--dsw-alias-*` overrides keyed by variable name. */
  export type ThemeTokens = Record<string, string>

  /** One selectable theme: id, the light/dark base, and alias-layer overrides. */
  export interface ThemeDefinition {
    /** Theme id (the argument to `setTheme`). `system` is a preference, not an id, and registering it throws. */
    id: string
    /**
     * 建立在哪套基座调色板上。presenter 据此切 `body[data-ds-dark-theme]`，
     * **不看 id**。
     */
    colorScheme: 'light' | 'dark'
    /** Alias-layer overrides, applied over the base as inline CSS variables. */
    tokens: ThemeTokens
  }

  /** The immutable theme state published on every change. */
  export interface ThemeSnapshot {
    /** The persisted preference, possibly `system`. */
    preference: string
    /** The resolved current theme (`system` resolved via prefers-color-scheme), with overrides folded into tokens. */
    active: ThemeDefinition
    /** Registered themes, in registration order. */
    themes: readonly ThemeDefinition[]
    /** A monotonically increasing change counter. */
    revision: number
  }

  /** 主题服务，客户端插件通过 `ctx.theme` 取用（`ctx.provide('theme', …)`）。 */
  export interface ThemeService {
    /**
     * Register a theme. A duplicate id throws.
     * @returns A disposer. Unregistering the active theme resets the preference to the default,
     *   so the UI never stays on the tokens of an unregistered theme.
     */
    register(definition: ThemeDefinition): Disposer
    /** Current theme state. */
    getTheme(): ThemeSnapshot
    /** Switch to a registered theme; an unknown id throws. */
    setTheme(id: string): void
  }

  /** 视图 tab 注册项（`conversation.view` 是 list slot，第三方可追加）。 */
  export interface ViewSlotRegistration {
    name: 'conversation.view'
    /** 视图 id，也是激活时 `only:` 匹配的值。 */
    id: string
    /** 排序，数字越大越靠后；官方的 trajectory 用 10。 */
    order?: number
    /** tab 上显示的名字，thunk 形式以便跟随语言切换。 */
    label: () => string
  }

  /**
   * composer.dock 条目注册项。
   *
   * 该 slot 是 `{ kind: 'list', scope: 'session' }`（见 ui-conversation 的
   * apply.ts / contract/slots.ts），官方 StatsLine 以 order 0 挂在上面，
   * 第三方追加不会顶掉它 —— single 型才会重复注册抛错。
   */
  export interface DockSlotRegistration {
    name: 'conversation.composer.dock'
    id: string
    order?: number
  }

  /** The slot service; only what this plugin uses is listed. */
  export interface SlotsService {
    /** Register once the target slot is ready; returns a disposer. */
    inject(name: string, register: () => Disposer): Disposer
    /**
     * 注册一个 slot 条目。
     * 🔴 `single` 型 slot 重复注册会抛错，只有 `list` 型允许多个占用者
     * （`conversation.view` 正是 list）。
     */
    register(registration: ViewSlotRegistration | DockSlotRegistration, component: unknown): Disposer
  }

  /**
   * The HTTP route table provided by the webserver plugin (`packages/host/webserver`).
   *
   * `register` adds one named route and the returned disposer removes it. ⚠️ **A duplicate path in the same table
   * throws outright** (route patterns are a bundle-level convention, so a conflict is a config error), which is why a skin's cover route is made unique by its theme id.
   */
  export interface WebServerService {
    register(route: {
      kind: 'exact' | 'prefix'
      path: string
      handler: (req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void | Promise<void>
    }): Disposer
  }

  /** The context a plugin's apply receives (only the members this plugin uses). */
  export interface Context {
    logger: Logger
    /** Available after `inject: ['slots']`. */
    slots: SlotsService
    /** Available after `inject: ['webServer']`; the host half uses it to serve the cover route. */
    webServer: WebServerService
    /** Available only after declaring `inject: ['theme']`. */
    theme: ThemeService
    /** Registration is an effect: the returned disposer is bound to the current fiber. */
    effect(callback: () => Disposer | void, label?: string): Disposer
    /**
     * Subscribe to an event. The theme change event is `theme/change`, fired when the registry or the active theme changes.
     * @returns The unsubscribe function.
     */
    on(event: 'theme/change', listener: (snapshot?: ThemeSnapshot) => void): Disposer
  }
}
