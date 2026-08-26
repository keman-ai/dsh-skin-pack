/**
 * 双胞胎鲸鱼娘皮肤 · host 半。
 *
 * 皮肤的全部行为都在浏览器里（注册主题、铺封面、接管品牌位），host 这半只是 Loader 的
 * 挂载点：`cordis.patch.yml` 把这个包插进树，Loader import 本文件，浏览器半再由
 * `package.json` 的 `dsh.client` 声明加载。留空插件比不留更明确——没有它，Loader 那一行
 * 就指向一个没有入口的包（集市的安装期校验会直接判 `BUILD_SCRIPT_BLOCKED` 卸回去）。
 *
 * @module dsh-deepseek-twin-whale
 */

import type { Context } from '@deepseek-ai/cordis'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { TWINWHALE_COVER } from './cover.generated.ts'

/** 插件名（loader 行的 name）。 */
export const name = 'twinwhale'

/** host 半要 webServer 提供封面路由；没有它（比如 headless）这一行不会激活。 */
export const inject = ['webServer']

/**
 * 🔴 封面走 HTTP 路由，不再内联进浏览器半。
 *
 * 起因是实测：把 21 套皮肤同时装进一个 profile 后界面**打不开**。每套皮肤的 client bundle
 * 都是 `<script>` 同步引入的，而封面以 data URI 直接编进了 bundle——单套 150–860 KB，
 * 合计 9.4 MB 全部要先下完、解析完，主线程直接被压死（实测 90 秒渲染不出首屏，
 * 且控制台零报错，纯粹是卡）。
 *
 * 所以图片挪到 host 半：这里是 Node 侧，只在启动时解一次 base64，浏览器半只留一个 URL
 * 字符串。bundle 掉到几十 KB，图片则由浏览器在**皮肤真的激活时**才去取，还能吃 HTTP 缓存。
 *
 * ⚠️ 路径必须全局唯一：`webServer.register` 对同一路径重复注册会直接抛错
 *（路由表是组合层约定，冲突即配置错误）。这里用主题 id 兜底。
 */
export const COVER_ROUTE = '/skin-cover/twinwhale.webp'

/** 封面字节。data URI 只在这一侧解一次，之后常驻内存（几百 KB，Node 侧无所谓）。 */
const COVER_BYTES = Buffer.from(TWINWHALE_COVER.slice(TWINWHALE_COVER.indexOf(',') + 1), 'base64')

/** 主题 id，与浏览器半一致；宿主侧脚本可以引它来判断皮肤是否在用。 */
export const THEME_ID = 'twinwhale'

/** 配置在 cordis.yml 里给，Loader 会连同这一行一起传给浏览器半。 */
export interface Config {
  /**
   * 装上就切到双胞胎鲸鱼娘，默认开。关掉则只注册、不应用，等用户自己去「设置 → 外观」选。
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
  }), `twinwhale: ${COVER_ROUTE}`)

  const mode = config.autoApply === false ? '需在「设置 → 外观」里手动选' : '已自动应用'
  ctx.logger.info('[twinwhale] 双胞胎鲸鱼娘已挂载（%s）', mode)
}
