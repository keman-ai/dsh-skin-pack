/**
 * Declarations for the parts of the DeepSeek Harness API we use, transcribed from the `0.1.0-rc.7` source, each with its origin noted.
 *
 * Why vendored instead of depending on the npm packages: the `@deepseek-ai/dsh-client-*` dependency chain on npm is
 * incomplete and cannot be installed. These modules are all external at runtime — the theme service comes from the
 * harness hosting this plugin, which reaches it only through `ctx.theme` and never imports its implementation.
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
     * Which base palette it builds on. The presenter toggles `body[data-ds-dark-theme]` from this,
     * **not from the id**.
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

  /** The theme service, reached by client plugins through `ctx.theme` (`ctx.provide('theme', …)`). */
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

  /** A view-tab registration (`conversation.view` is a list slot third parties may append to). */
  export interface ViewSlotRegistration {
    name: 'conversation.view'
    /** The view id, and the value `only:` matches when it is active. */
    id: string
    /** Order; larger numbers come later. The official trajectory uses 10. */
    order?: number
    /** The name shown on the tab, as a thunk so it follows language changes. */
    label: () => string
  }

  /**
   * A composer.dock entry registration.
   *
   * That slot is `{ kind: 'list', scope: 'session' }` (see apply.ts / contract/slots.ts in ui-conversation), the
   * official StatsLine sits on it at order 0, and a third-party append displaces nothing —
   * only a single-kind slot throws on a duplicate registration.
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
     * Register one slot entry.
     * 🔴 A `single` slot throws on a duplicate registration; only `list` allows several occupants
     * (`conversation.view` is one).
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
