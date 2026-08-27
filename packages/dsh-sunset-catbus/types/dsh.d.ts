/**
 * Declarations for the parts of the DeepSeek Harness API we use, transcribed from the `0.1.1-rc.2` source, each with its origin noted.
 *
 * Why vendored instead of depending on the npm packages: the `@deepseek-ai/dsh-client-*` dependency chain on npm is incomplete and cannot be installed.
 * These modules are all external at runtime — the theme service and slot registry come from the harness hosting
 * this plugin, which reaches them only through `ctx.theme` / `ctx.slots` and never imports their implementations.
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
     * Which base palette it builds on. The presenter toggles `body[data-ds-dark-theme]` from this, **not from the id**.
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

  /** The theme service, reached by client plugins through `ctx.theme`. */
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

  // ── packages/client/ui-slots/src/index.ts ──

  /**
   * A brand-slot registration entry.
   *
   * 🔴 `priority` is the key change in rc.2: `SlotCore.register` only detects occupancy **at the same priority**
   * (a `single` cell, a `list` id, a `keyed` key), while different priorities **shadow** instead —
   * `entriesOfSlot` renders the surviving entry with the lowest priority in each cell. Official components register
   * at the default 0, so a third party takes over with -1, while a positive number is a fallback used only when the official one is absent.
   *
   * Earlier versions had no such dimension (an occupied single threw outright and third parties could only append
   * to a list). This plugin's brand slots rely on the new behaviour, so **on an older harness it falls back to the
   * official mark** (register throws, attachBrand swallows it with a warning), leaving the palette and cover unaffected.
   */
  export interface BrandSlotRegistration {
    name: 'sidebar.brand.mark' | 'sidebar.brand.name' | 'conversation.hero.brand.mark'
    /** Shadowing order: ascending, lowest renders; defaults to 0. */
    priority?: number
  }

  /**
   * A `conversation.composer.dock` entry registration.
   *
   * That slot is `{ kind: 'list', scope: 'session' }` (see apply.ts / contract/slots.ts in ui-conversation), and
   * the official StatsLine sits on it as `id: 'stats'`, `order: 0`;
   * a list conflict requires **the same id at the same priority**, so appending under another id displaces nothing.
   * The scope is session, so the standard kit injects `useSession` / `useProjection` into the component's props.
   */
  export interface DockSlotRegistration {
    name: 'conversation.composer.dock'
    /** Entry id, unique within one slot. */
    id: string
    /** Display order; larger numbers come later. */
    order?: number
  }

  /**
   * A `sidebar.footer.action` entry registration.
   *
   * That slot is `{ kind: 'list', scope: 'root' }` (see contract/slots.ts in ui-sidebar), rendered at the very
   * bottom of the sidebar **above** the Settings row, and the host passes only `wide` (false is the 56px track state).
   *
   * ⚠️ The scope is **root**, so the standard kit does **not** inject `useSession` / `useProjection`.
   * The gauge therefore takes no data from props and subscribes to status-store instead, written by the probe on
   * `conversation.composer.dock` (session scope).
   */
  export interface SidebarFooterSlotRegistration {
    name: 'sidebar.footer.action'
    /** Entry id, unique within one slot. */
    id: string
    /** Display order; larger numbers come later. */
    order?: number
  }

  /** The slot service; only what this plugin uses is listed. */
  export interface SlotsService {
    /** Register once the target slot is ready; returns a disposer. */
    inject(name: string, register: () => Disposer): Disposer
    /** Register one slot entry. */
    register(
      registration: BrandSlotRegistration | DockSlotRegistration | SidebarFooterSlotRegistration,
      component: unknown,
    ): Disposer
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
