/**
 * 把一个独立皮肤仓改造成 monorepo 里的一个包。
 *
 * 幂等：改造过的包再跑一次不会出错，方便分批搬。
 *
 * 做四件事：
 *  1. devDependencies 收到 root —— 构建工具链 28 个包完全一样，留在各包意味着升级要改 28 处
 *  2. tsconfig 改成 extends 根部 base —— 严格度必须全仓一致，不能让某个包偷偷放松
 *  3. repository / homepage / bugs 指向 monorepo 的子目录 —— npm 的 repository.directory
 *     就是为这个场景设计的，集市的 repo_url 也用同一形态（RepoKey 认子路径）
 *  4. lib/ 不再进 git —— 独立仓时代它必须提交，因为皮肤靠 github:owner/repo 安装、
 *     而 pnpm 默认不跑 git 源的构建脚本。monorepo 装不了 git 子目录，分发改走 Release
 *     tarball（npm pack 时 lib/ 已构建并按 files 打进包），提交它只会让仓库白白变大
 *
 * 用法：node scripts/adopt.mjs <包目录名>...
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const REPO = 'keman-ai/dsh-skin-pack'

/** 构建工具链，与 root package.json 的 devDependencies 一致。 */
const SHARED_DEV_DEPS = new Set([
  '@types/node', '@types/react', '@types/react-dom',
  'lightningcss', 'react', 'react-dom', 'tsdown', 'typescript',
])

const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.error('用法: node scripts/adopt.mjs <包目录名>...')
  process.exit(1)
}

for (const name of targets) {
  const dir = join('packages', name)
  if (!existsSync(dir)) {
    console.error(`✗ ${name}: 目录不存在`)
    process.exitCode = 1
    continue
  }

  // ── package.json ────────────────────────────────────────────────────────
  const pkgPath = join(dir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

  if (pkg.devDependencies) {
    // 只删共享的那几个；某个皮肤将来真有自己独有的构建依赖，留在它自己这
    const own = Object.fromEntries(
      Object.entries(pkg.devDependencies).filter(([d]) => !SHARED_DEV_DEPS.has(d)),
    )
    if (Object.keys(own).length > 0) {
      pkg.devDependencies = own
    } else {
      delete pkg.devDependencies
    }
  }

  pkg.repository = {
    type: 'git',
    url: `git+https://github.com/${REPO}.git`,
    directory: `${dir}`,
  }
  pkg.homepage = `https://github.com/${REPO}/tree/main/${dir}#readme`
  pkg.bugs = { url: `https://github.com/${REPO}/issues` }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')

  // ── tsconfig.json ───────────────────────────────────────────────────────
  const tsPath = join(dir, 'tsconfig.json')
  const ts = JSON.parse(readFileSync(tsPath, 'utf8'))
  const include = ts.include ?? ['src/**/*', 'types/**/*', 'tsdown.config.ts']
  writeFileSync(tsPath, JSON.stringify({ extends: '../../tsconfig.base.json', include }, null, 2) + '\n')

  // ── .gitignore ──────────────────────────────────────────────────────────
  // 独立仓时代 lib/ 必须提交，这里反过来：它由 CI 构建，只进 tarball 不进 git
  writeFileSync(join(dir, '.gitignore'), 'node_modules\nlib\n*.tgz\n')

  console.log(`✓ ${name}  (${pkg.name})`)
}
