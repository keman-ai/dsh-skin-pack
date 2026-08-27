/**
 * The Seaside Boutique skin · host half.
 *
 * All of the skin's behaviour lives in the browser (registering the theme, spreading the hero, taking over the
 * brand slots, mounting the dock); this host half is only the Loader's mount point. `cordis.patch.yml` inserts
 * this package into the tree, the Loader imports this file, and the browser half is loaded from `package.json`'s
 * `dsh.client` declaration. An empty plugin is clearer than none — without it that row points at a package with no entry.
 *
 * @module dsh-seaside-boutique
 */

import type { Context } from '@deepseek-ai/cordis'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { SEASIDE_COVER } from './cover.generated.ts'

/** Plugin name (the `name` of the loader entry). */
export const name = 'seaside'

/** The host half needs webServer for the cover route; without it (headless, say) this row never activates. */
export const inject = ['webServer']

/**
 * 🔴 The cover is served over an HTTP route and no longer inlined into the browser half.
 *
 * The cause was measured: with 21 skins installed into one profile the UI **would not open**. Each skin's
 * client bundle is loaded by a synchronous `<script>`, and the cover was compiled into it as a data URI —
 * 150–860 KB each, 9.4 MB in total, all of which had to download and parse first, crushing the main thread
 * and the console showed no errors at all — it simply hung.
 *
 * So the image moved to the host half: on the Node side base64 is decoded once at startup, and the browser half keeps only a URL
 * string. Bundles drop to tens of KB, and the browser fetches the image only once the skin is **actually active**, with HTTP caching on top.
 *
 * ⚠️ The path must be globally unique: `webServer.register` throws outright on a duplicate path
 * (the route table is a bundle-level convention, so a conflict is a config error). The theme id guarantees it here.
 */
export const COVER_ROUTE = '/skin-cover/seaside.webp'

/** Cover bytes. The data URI is decoded once on this side and kept in memory (a few hundred KB, immaterial on the Node side). */
const COVER_BYTES = Buffer.from(SEASIDE_COVER.slice(SEASIDE_COVER.indexOf(',') + 1), 'base64')

/** Theme id, matching the browser half; host-side scripts can import it to tell whether the skin is in use. */
export const THEME_ID = 'seaside'

/** Configured in cordis.yml; the Loader passes it to the browser half along with this row. */
export interface Config {
  /**
   * Switch to Seaside Boutique on install; on by default. Turned off, it only registers without applying, leaving the user to pick it in the skin market.
   *
   * On by default because third-party theme ids never enter the built-in settings schema and the choice is not
   * persisted, while Settings → Appearance lists only light / dark / follow system: without auto-apply, every start would need reselecting.
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  /* The cover route. Its content never changes, so a one-year immutable cache — switching skins re-downloads nothing. */
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: COVER_ROUTE,
    handler: (_req: IncomingMessage, res: ServerResponse) => {
      res.writeHead(200, {
        'content-type': 'image/webp',
        'content-length': String(COVER_BYTES.byteLength),
        'cache-control': 'public, max-age=31536000, immutable',
      })
      res.end(COVER_BYTES)
    },
  }), `seaside: ${COVER_ROUTE}`)

  const mode = config.autoApply === false ? 'select it manually under Settings → Skin Market' : 'applied automatically'
  ctx.logger.info('[seaside] Seaside Boutique mounted (%s)', mode)
}
