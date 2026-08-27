/**
 * 森林同行皮肤 · host 半。
 *
 * 皮肤的全部行为都在浏览器里（注册主题、铺封面、接管品牌位），host 这半只是 Loader 的
 * 挂载点：`cordis.patch.yml` 把这个包插进树，Loader import 本文件，浏览器半再由
 * `package.json` 的 `dsh.client` 声明加载。留空插件比不留更明确——没有它，Loader 那一行
 * 就指向一个没有入口的包（集市的安装期校验会直接判 `BUILD_SCRIPT_BLOCKED` 卸回去）。
 *
 * @module dsh-forest-companion
 */

import type { Context } from '@deepseek-ai/cordis'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { FOREST_COVER } from './cover.generated.ts'

/** Plugin name (the `name` of the loader entry). */
export const name = 'forest'

/** The host half needs webServer for the cover route; without it (headless, say) this row never activates. */
export const inject = ['webServer']

/**
 * 🔴 The cover is served over an HTTP route and no longer inlined into the browser half.
 *
 * The cause was measured: with 21 skins installed into one profile the UI **would not open**. Each skin's
 * 都是 `<script>` 同步引入的，而封面以 data URI 直接编进了 bundle——单套 150–860 KB，
 * 合计 9.4 MB 全部要先下完、解析完，主线程直接被压死（实测 90 秒渲染不出首屏，
 * and the console showed no errors at all — it simply hung.
 *
 * So the image moved to the host half: on the Node side base64 is decoded once at startup, and the browser half keeps only a URL
 * 字符串。bundle 掉到几十 KB，图片则由浏览器在**皮肤真的激活时**才去取，还能吃 HTTP 缓存。
 *
 * ⚠️ 路径必须全局唯一：`webServer.register` 对同一路径重复注册会直接抛错
 *（路由表是组合层约定，冲突即配置错误）。这里用主题 id 兜底。
 */
export const COVER_ROUTE = '/skin-cover/forest.webp'

/** 封面字节。data URI 只在这一侧解一次，之后常驻内存（几百 KB，Node 侧无所谓）。 */
const COVER_BYTES = Buffer.from(FOREST_COVER.slice(FOREST_COVER.indexOf(',') + 1), 'base64')

/** Theme id, matching the browser half; host-side scripts can import it to tell whether the skin is in use. */
export const THEME_ID = 'forest'

/** Configured in cordis.yml; the Loader passes it to the browser half along with this row. */
export interface Config {
  /**
   * 装上就切到森林，默认开。关掉则只注册、不应用，等用户自己去「设置 → 外观」选。
   *
   * 默认开是因为 harness 的第三方主题 id 不进内置 settings schema，选择不持久化：
   * 不自动应用的话，每次启动 dsh 都得重选一遍。
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  /* 封面路由。内容不变，所以给一年的不可变缓存——皮肤切来切去不会重复下载。 */
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
  }), `forest: ${COVER_ROUTE}`)

  const mode = config.autoApply === false ? '需在「设置 → 外观」里手动选' : '已自动应用'
  ctx.logger.info('[forest] 森林同行已挂载（%s）', mode)
}
