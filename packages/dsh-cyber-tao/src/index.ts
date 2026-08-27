/**
 * 赛博道观皮肤 · host 半。
 *
 * All of the skin's behaviour lives in the browser (registering the theme, spreading the hero, taking over the
 * brand slots, mounting the dock); this host half is only the Loader's mount point. `cordis.patch.yml` inserts
 * this package into the tree, the Loader imports this file, and the browser half is loaded from `package.json`'s
 * `dsh.client` declaration. An empty plugin is clearer than none — without it that row points at a package with no entry.
 *
 * @module dsh-cyber-tao
 */

import type { Context } from '@deepseek-ai/cordis'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { TAO_COVER } from './cover.generated.ts'

/** Plugin name (the `name` of the loader entry). */
export const name = 'tao'

/**
 * 🔴 The cover is served over an HTTP route and no longer inlined into the browser half.
 *
 * The cause was measured: with 21 skins installed into one profile the UI **would not open**. Each skin's
 * 都是 `<script>` 同步引入的，而封面以 data URI 直接编进了 bundle——单套 230–860 KB，
 * 21 套合计 9.4 MB 全部要先下完、解析完，主线程直接被压死（90 秒都渲染不出首屏，
 * and the console showed no errors at all — it simply hung.
 *
 * So the image moved to the host half: on the Node side base64 is decoded once at startup, and the browser half keeps only a URL
 * 字符串。bundle 从 231 KB 掉到几十 KB，图片则由浏览器在**皮肤真的激活时**才去取，
 * 还能吃上 HTTP 缓存。
 *
 * ⚠️ The path must be globally unique: `webServer.register` throws outright on a duplicate path
 * (the route table is a bundle-level convention, so a conflict is a config error). The theme id guarantees it here.
 */
export const COVER_ROUTE = '/skin-cover/tao.webp'

/** Cover bytes. The data URI is decoded once on this side and kept in memory (a few hundred KB, immaterial on the Node side). */
const COVER_BYTES = Buffer.from(TAO_COVER.slice(TAO_COVER.indexOf(',') + 1), 'base64')

/** The host half needs webServer for the cover route; without it (headless, say) this row never activates. */
export const inject = ['webServer']

/** Theme id, matching the browser half; host-side scripts can import it to tell whether the skin is in use. */
export const THEME_ID = 'tao'

/** Configured in cordis.yml; the Loader passes it to the browser half along with this row. */
export interface Config {
  /**
   * 装上就切到赛博道观，默认开。关掉则只注册、不应用，等用户自己去皮肤集市里选。
   *
   * On by default because third-party theme ids never enter the built-in settings schema and the choice is not
   * persisted, while Settings → Appearance lists only light / dark / follow system: without auto-apply, every start would need reselecting.
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  /*
   * 封面路由。内容按内容寻址不变，所以给一年的不可变缓存——切来切去不会重复下载。
   */
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
  }), `tao: ${COVER_ROUTE}`)

  const mode = config.autoApply === false ? 'select it manually under Settings → Skin Market' : 'applied automatically'
  ctx.logger.info('[tao] 赛博道观已挂载（%s）', mode)
}
