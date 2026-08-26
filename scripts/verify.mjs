/**
 * 全仓一致性校验。合并成 monorepo 之后，28 个包靠人工核对不现实，
 * 这些闸必须自动跑 —— 每一条都对应一类装上了却不生效、或者干脆装不上的故障。
 *
 * 用法：node scripts/verify.mjs
 * 退出码非 0 表示有包不合格，CI 据此拦下发布。
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const PACKAGES = 'packages'
const problems = []

/** 皮肤靠这三处 id 对齐；对不上会出现「装上了但切不过去」这类难查的问题。 */
function checkIds(dir, name, skin) {
  const patchPath = join(dir, 'cordis.patch.yml')
  if (!existsSync(patchPath)) {
    problems.push(`${name}: 缺 cordis.patch.yml —— 没有它插件永远不会被加载`)
    return
  }
  const patch = readFileSync(patchPath, 'utf8')
  // patch 里的 `- id: <值>`，取第一个 insert 项
  const patchId = /^\s*-?\s*id:\s*(\S+)/m.exec(patch)?.[1]
  if (patchId !== skin.id) {
    problems.push(`${name}: cordis.patch.yml 的 id=${patchId} ≠ skin.json 的 id=${skin.id}`)
  }

  for (const rel of ['src/index.ts', 'src/client/index.ts']) {
    const file = join(dir, rel)
    if (!existsSync(file)) continue
    const themeId = /export const THEME_ID\s*=\s*['"]([^'"]+)['"]/.exec(readFileSync(file, 'utf8'))?.[1]
    if (themeId !== undefined && themeId !== skin.id) {
      problems.push(`${name}: ${rel} 的 THEME_ID=${themeId} ≠ skin.json 的 id=${skin.id}`)
    }
  }
}

/**
 * 集市安装期会验包声明的入口是否真的存在，缺了就自动卸回去 ——
 * 因为缺入口的包写进配置后，Loader 下次启动会 ERR_MODULE_NOT_FOUND，整个 dsh 起不来。
 * 这里只能验 files 覆盖了入口，实际产物由 CI 构建后再验一次。
 */
function checkPackaging(name, pkg) {
  if (pkg.dsh?.bundle?.patch === undefined) {
    problems.push(`${name}: package.json 没声明 dsh.bundle.patch —— 集市会判 NOT_A_BUNDLE`)
  }
  const files = pkg.files ?? []
  for (const required of ['lib', 'cordis.patch.yml', 'skin.json']) {
    if (!files.includes(required)) {
      problems.push(`${name}: files 里缺 ${required}，它不会被打进 tarball`)
    }
  }
  const entries = [pkg.main, ...Object.values(pkg.exports ?? {})].filter((v) => typeof v === 'string')
  for (const entry of entries) {
    if (!entry.startsWith('./lib/') && !entry.startsWith('lib/') && !entry.endsWith('package.json')) {
      problems.push(`${name}: 入口 ${entry} 不在 lib/ 下，tarball 里会找不到`)
    }
  }
}

/** 包名与目录名的映射必须可预测：目录 <x> ↔ 包 dsh-<x>，否则脚本和集市数据都得逐个特判。 */
function checkNaming(name, pkg) {
  if (pkg.name !== `dsh-${name}`) {
    problems.push(`${name}: 包名 ${pkg.name} 不等于 dsh-${name}`)
  }
}

const dirs = readdirSync(PACKAGES, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

const ids = new Map()
for (const name of dirs) {
  const dir = join(PACKAGES, name)
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  const skinPath = join(dir, 'skin.json')
  if (!existsSync(skinPath)) {
    problems.push(`${name}: 缺 skin.json`)
    continue
  }
  const skin = JSON.parse(readFileSync(skinPath, 'utf8'))

  checkNaming(name, pkg)
  checkIds(dir, name, skin)
  checkPackaging(name, pkg)

  if (skin.package !== undefined && skin.package !== pkg.name) {
    problems.push(`${name}: skin.json 的 package=${skin.package} ≠ 包名 ${pkg.name}`)
  }

  // 主题 id 在同一个 profile 里是全局的：两个皮肤用同一个 id，装在一起会互相顶掉
  const prev = ids.get(skin.id)
  if (prev !== undefined) {
    problems.push(`id 冲突: ${prev} 与 ${name} 都用 id=${skin.id}，同时装会互相顶掉`)
  }
  ids.set(skin.id, name)
}

console.log(`检查了 ${dirs.length} 个皮肤`)
if (problems.length === 0) {
  console.log('✓ 全部通过')
} else {
  console.log(`✗ ${problems.length} 个问题：`)
  for (const p of problems) console.log('  -', p)
  process.exit(1)
}
