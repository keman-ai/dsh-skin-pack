/**
 * AI Work Mode皮肤 · host 半。
 *
 * 皮肤的全部行为都在浏览器里（注册主题、铺主视觉、接管品牌位、挂状态台），host 这半只是
 * Loader 的挂载点：`cordis.patch.yml` 把这个包插进树，Loader import 本文件，浏览器半再由
 * `package.json` 的 `dsh.client` 声明加载。留空插件比不留更明确——没有它，Loader 那一行就
 * 指向一个没有入口的包（集市的安装期校验会直接判 `BUILD_SCRIPT_BLOCKED` 卸回去）。
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
   * 默认开是因为 harness 的第三方主题 id 不进内置 settings schema，选择不持久化，
   * 而内置的「设置 → 外观」只列 浅色 / 深色 / 跟随系统：不自动应用的话，每次启动都得重选。
   */
  autoApply?: boolean
}

export function apply(ctx: Context, config: Config = {}): void {
  const mode = config.autoApply === false ? '需在「设置 → 皮肤市场」里手动选' : '已自动应用'
  ctx.logger.info('[ai-work] AI Work Mode已挂载（%s）', mode)
}
