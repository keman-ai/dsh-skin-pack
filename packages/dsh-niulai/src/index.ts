/**
 * The Niulai Field skin · host half.
 *
 * All of the skin's behaviour lives in the browser (registering the theme, spreading the background); this host half
 * is only the Loader's mount point. `cordis.patch.yml` inserts this package into the tree, the Loader imports this
 * file, and the browser half is loaded from `package.json`'s `dsh.client` declaration. An empty plugin is clearer than none —
 * without it, that Loader row points at a package with no entry.
 *
 * @module dsh-niulai
 */

import type { Context } from '@deepseek-ai/cordis'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { NIULAI_COW_COVER } from './cover.generated.ts'

/** Plugin name (the `name` of the loader entry). */
export const name = 'niulai'

/** The host half needs webServer for the cover route; without it (headless, say) this row never activates. */
export const inject = ['webServer']

/**
 * 🔴 The field panorama is served over an HTTP route and no longer inlined into the browser half.
 *
 * With several skins installed, every data-URI cover is pulled synchronously into the main thread by a `<script>` —
 * measured with 21 installed, the first paint did not arrive in 90 seconds. On the Node side base64 is decoded once, and the browser fetches the image only once the skin is actually active.
 *
 * The avatar is only 13 KB and stays inlined in the browser half: it appears in session rows, is needed earlier than
 * the cover, and is not worth an extra request.
 */
export const COVER_ROUTE = '/skin-cover/niulai.webp'

/** Cover bytes. The data URI is decoded once on this side. */
const COVER_BYTES = Buffer.from(NIULAI_COW_COVER.slice(NIULAI_COW_COVER.indexOf(',') + 1), 'base64')

/** Theme id, matching the browser half; host-side scripts can import it to tell whether the skin is in use. */
export const THEME_ID = 'niulai'

/** Configured in cordis.yml; the Loader passes it to the browser half along with this row. */
export interface Config {
  /**
   * Switch to Niulai on install; on by default. Turning it off registers without applying, leaving the user to select it under Settings → Appearance.
   *
   * On by default because the harness's third-party theme ids never enter the built-in settings schema, so the
   * choice is not persisted: without auto-apply, every dsh start would need reselecting.
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  /* The cover route. Its content never changes, so a one-year immutable cache. */
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
  }), `niulai: ${COVER_ROUTE}`)

  const mode = config.autoApply === false ? 'select it manually under Settings → Appearance' : 'applied automatically'
  ctx.logger.info('[niulai] Niulai Field mounted (%s)', mode)
}
