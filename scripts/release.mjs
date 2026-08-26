/**
 * 把版本号还没发过的皮肤打成 tarball 并挂上 GitHub Release。
 *
 * 分发走 Release 附件而不是 npm，也不再走 `github:owner/repo`：
 *  · npm —— 不发（业主定的），而集市此前按 package_name 下发裸包名，用户点安装会 404
 *  · github: —— pnpm 没有「从 git 仓库子目录安装」这回事，monorepo 下这条路根本不通
 *  · Release tarball —— 免费、不限流量、几百 KB 秒装，且 npm pack 出来的包里 lib/ 已构建，
 *    不触发 pnpm 对构建脚本的授权拦截（用户少一次「允许在你机器上执行代码」的弹窗）
 *
 * 「发过没发过」以 Release tag 是否存在为准，不依赖本地 git tag：CI 里 checkout 不带全部
 * tag，拿本地状态判断会重复发。tag 形如 `niulai-v0.1.0`。
 *
 * 用法：
 *   node scripts/release.mjs --dry     只打印会发什么，不动远端
 *   node scripts/release.mjs           真发（需要 gh 已认证）
 */

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, mkdirSync, rmSync, renameSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const DIST = 'dist'

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim()
}

/** Release 存在吗。gh 对不存在的 tag 返回非 0，这里把它当成「没发过」而不是错误。 */
function released(tag) {
  try {
    sh('gh', ['release', 'view', tag], { stdio: ['ignore', 'pipe', 'ignore'] })
    return true
  } catch {
    return false
  }
}

const pending = []
for (const name of readdirSync('packages', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()) {
  const pkg = JSON.parse(readFileSync(join('packages', name, 'package.json'), 'utf8'))
  const tag = `${name}-v${pkg.version}`
  if (released(tag)) continue
  pending.push({ name, tag, pkg })
}

if (pending.length === 0) {
  console.log('没有需要发布的包（所有版本号都已有对应 Release）')
  process.exit(0)
}

console.log(`待发布 ${pending.length} 个：`)
for (const { name, pkg, tag } of pending) console.log(`  ${name}  ${pkg.name}@${pkg.version}  → ${tag}`)
if (DRY) process.exit(0)

rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })

for (const { name, tag, pkg } of pending) {
  const dir = join('packages', name)
  // npm pack 不跑 prepublishOnly（npm 7+ 起它只在 npm publish 时触发），
  // 所以构建必须在这之前独立跑过 —— 漏了会打出一个没有 lib/ 的空壳，
  // 装上去在集市的入口校验那关被拦下并回滚。
  if (!existsSync(join(dir, 'lib', 'index.js'))) {
    console.error(`✗ ${name}: lib/index.js 不存在，先跑 pnpm build`)
    process.exit(1)
  }
  const file = sh('npm', ['pack', '--silent'], { cwd: dir }).split('\n').pop()
  renameSync(join(dir, file), join(DIST, file))

  sh('gh', ['release', 'create', tag,
    join(DIST, file),
    '--title', `${pkg.name} v${pkg.version}`,
    '--notes', [
      `**${pkg.description ?? pkg.name}**`,
      '',
      '安装：',
      '```sh',
      `dsh plugin --profile web add -w <本页 .tgz 的下载地址>`,
      '```',
      '',
      `或在 dsh 的「设置 → 皮肤市场」里搜索安装。`,
    ].join('\n'),
  ])
  console.log(`✓ ${tag}  ${file}`)
}

console.log('')
console.log('别忘了把集市里对应条目的 installSpec 换成新的 tarball 地址，')
console.log('否则用户点安装装到的还是旧 spec。')
