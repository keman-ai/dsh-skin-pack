/**
 * Convert a standalone skin repository into a package inside the monorepo.
 *
 * Idempotent: running it again on an already-converted package is harmless, which makes migrating in batches easy.
 *
 * It does four things:
 *  1. Hoists devDependencies to the root — the build toolchain is identical across every package, and leaving it in each one means editing dozens of files to upgrade
 *  2. Points tsconfig at the root base — strictness has to be uniform across the repo, with no package quietly relaxing it
 *  3. Points repository / homepage / bugs at the monorepo subdirectory — npm's repository.directory
 *     exists for exactly this case, and the market's repo_url uses the same shape (RepoKey understands subpaths)
 *  4. Keeps lib/ out of git — as a standalone repository it had to be committed, since skins installed via github:owner/repo
 *     and pnpm does not run build scripts for git sources by default. A monorepo subdirectory cannot be installed from git, so distribution moved to Release
 *     tarballs (lib/ is already built at npm pack time and packed per files), and committing it would only bloat the repository
 *
 * Usage: node scripts/adopt.mjs <package directory>...   (the directory name is the package name, e.g. dsh-niulai)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const REPO = 'keman-ai/dsh-skin-pack'

/** The build toolchain, matching the root package.json's devDependencies. */
const SHARED_DEV_DEPS = new Set([
  '@types/node', '@types/react', '@types/react-dom',
  'lightningcss', 'react', 'react-dom', 'tsdown', 'typescript',
])

const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.error('Usage: node scripts/adopt.mjs <package directory>...')
  process.exit(1)
}

for (const name of targets) {
  const dir = join('packages', name)
  if (!existsSync(dir)) {
    console.error(`✗ ${name}: directory does not exist`)
    process.exitCode = 1
    continue
  }

  // ── package.json ────────────────────────────────────────────────────────
  const pkgPath = join(dir, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))

  if (pkg.devDependencies) {
    // Only the shared ones are removed; if a skin ever gains a build dependency of its own, it stays with that skin
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
  // As a standalone repository lib/ had to be committed; here it is the opposite — CI builds it, and it goes into the tarball rather than git
  writeFileSync(join(dir, '.gitignore'), 'node_modules\nlib\n*.tgz\n')

  console.log(`✓ ${name}  (${pkg.name})`)
}
