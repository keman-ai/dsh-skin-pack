/**
 * 从各皮肤的 skin.json + preview/ 生成 README 的截图墙。
 *
 * 手写 28 条目录必然会跟实际情况漂移（改个 tagline、加个皮肤就忘了同步），
 * 所以这一段永远由脚本生成，CI 里可以顺带校验它是不是最新的。
 *
 * 用法：node scripts/readme.mjs
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BEGIN = '<!-- SKINS:BEGIN -->'
const END = '<!-- SKINS:END -->'
const COLUMNS = 3

const rows = []
for (const name of readdirSync('packages', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()) {
  const dir = join('packages', name)
  const skin = JSON.parse(readFileSync(join(dir, 'skin.json'), 'utf8'))
  const previewDir = join(dir, 'preview')
  const shot = existsSync(previewDir)
    ? readdirSync(previewDir).find((f) => /\.(webp|png|jpg|jpeg)$/i.test(f))
    : undefined
  rows.push({ name, skin, image: shot ? `${dir}/preview/${shot}` : undefined })
}

const cells = rows.map(({ name, skin, image }) => {
  const title = `<b>${skin.name}</b>`
  const scheme = skin.colorScheme === 'light' ? '浅色' : skin.colorScheme === 'dark' ? '暗色' : ''
  const img = image
    ? `<a href="packages/${name}"><img src="${image}" alt="${skin.name}" width="100%"></a><br>`
    : ''
  return [
    '<td width="33%" valign="top">',
    `${img}${title}${scheme ? ` <sub>${scheme}</sub>` : ''}<br>`,
    `<sub>${skin.tagline ?? ''}</sub><br>`,
    `<sub><code>packages/${name}</code></sub>`,
    '</td>',
  ].join('\n')
})

const table = ['<table>']
for (let i = 0; i < cells.length; i += COLUMNS) {
  table.push('<tr>')
  table.push(...cells.slice(i, i + COLUMNS))
  table.push('</tr>')
}
table.push('</table>')

const section = [BEGIN, `<sub>共 ${rows.length} 套皮肤，本段由 \`scripts/readme.mjs\` 生成，请勿手改。</sub>`, '', ...table, END].join('\n')

const readme = readFileSync('README.md', 'utf8')
const start = readme.indexOf(BEGIN)
const stop = readme.indexOf(END)
if (start < 0 || stop < 0) {
  console.error(`README.md 里找不到 ${BEGIN} / ${END} 标记`)
  process.exit(1)
}
writeFileSync('README.md', readme.slice(0, start) + section + readme.slice(stop + END.length))
console.log(`✓ 截图墙已更新，${rows.length} 套皮肤`)
