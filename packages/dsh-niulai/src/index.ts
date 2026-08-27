/**
 * 牛来原野皮肤 · host 半。
 *
 * 皮肤的全部行为都在浏览器里（注册主题、铺背景），host 这半只是 Loader 的挂载点：
 * `cordis.patch.yml` 把这个包插进树，Loader import 本文件，浏览器半再由
 * `package.json` 的 `dsh.client` 声明加载。留空插件比不留更明确 ——
 * 没有它，Loader 那一行就指向一个没有入口的包。
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
 * 🔴 原野全景走 HTTP 路由，不再内联进浏览器半。
 *
 * 多套皮肤同装时，每套的 data URI 封面都会被 `<script>` 同步拉进主线程——实测 21 套时
 * 首屏 90 秒渲染不出来。挪到 Node 侧只解一次 base64，浏览器在皮肤真的激活时才去取图。
 *
 * 头像只有 13 KB，留在浏览器半内联：它出现在会话行里，比封面更早需要，
 * 为它多发一个请求不划算。
 */
export const COVER_ROUTE = '/skin-cover/niulai.webp'

/** 封面字节。data URI 只在这一侧解一次。 */
const COVER_BYTES = Buffer.from(NIULAI_COW_COVER.slice(NIULAI_COW_COVER.indexOf(',') + 1), 'base64')

/** Theme id, matching the browser half; host-side scripts can import it to tell whether the skin is in use. */
export const THEME_ID = 'niulai'

/** Configured in cordis.yml; the Loader passes it to the browser half along with this row. */
export interface Config {
  /**
   * 装上就切到牛来，默认开。关掉则只注册、不应用，等用户自己去「设置 → 外观」选。
   *
   * 默认开是因为 harness 的第三方主题 id 不进内置 settings schema，选择不持久化：
   * 不自动应用的话，每次启动 dsh 都得重选一遍。
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  /* 封面路由。内容不变，给一年的不可变缓存。 */
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

  const mode = config.autoApply === false ? '需在「设置 → 外观」里手动选' : '已自动应用'
  ctx.logger.info('[niulai] 牛来原野已挂载（%s）', mode)
}
