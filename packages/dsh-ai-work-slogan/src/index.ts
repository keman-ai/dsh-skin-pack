/**
 * AI Work Mode皮肤 · host 半。
 *
 * All of the skin's behaviour lives in the browser (registering the theme, spreading the hero, taking over the
 * brand slots, mounting the dock); this host half is only the Loader's mount point. `cordis.patch.yml` inserts
 * this package into the tree, the Loader imports this file, and the browser half is loaded from `package.json`'s
 * `dsh.client` declaration. An empty plugin is clearer than none — without it that row points at a package with no entry.
 *
 * @module dsh-ai-work-slogan
 */

import type { Context } from '@deepseek-ai/cordis'

/** Plugin name (the `name` of the loader entry). */
export const name = 'ai-work'

/** Theme id, matching the browser half; host-side scripts can import it to tell whether the skin is in use. */
export const THEME_ID = 'ai-work'

/** Configured in cordis.yml; the Loader passes it to the browser half along with this row. */
export interface Config {
  /**
   * 装上就切到AI 工作模式，默认开。关掉则只注册、不应用，等用户自己去皮肤集市里选。
   *
   * On by default because third-party theme ids never enter the built-in settings schema and the choice is not
   * persisted, while Settings → Appearance lists only light / dark / follow system: without auto-apply, every start would need reselecting.
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  const mode = config.autoApply === false ? 'select it manually under Settings → Skin Market' : 'applied automatically'
  ctx.logger.info('[ai-work] AI Work Mode已挂载（%s）', mode)
}
