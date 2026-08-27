/**
 * Repo-wide consistency checks. Once merged into a monorepo, checking dozens of packages by hand is not realistic,
 * so these gates must run automatically — each one corresponds to a class of failure where the skin installs but does nothing, or will not install at all.
 *
 * Usage: node scripts/verify.mjs
 * A non-zero exit code means some package failed, and CI blocks the release on it.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const PACKAGES = 'packages'
const problems = []

/** A skin is aligned by these three ids; a mismatch produces the hard-to-diagnose case where it installs but will not switch on. */
function checkIds(dir, name, skin) {
  const patchPath = join(dir, 'cordis.patch.yml')
  if (!existsSync(patchPath)) {
    problems.push(`${name}: missing cordis.patch.yml — without it the plugin is never loaded`)
    return
  }
  const patch = readFileSync(patchPath, 'utf8')
  // The `- id: <value>` in the patch; the first insert item is used
  const patchId = /^\s*-?\s*id:\s*(\S+)/m.exec(patch)?.[1]
  if (patchId !== skin.id) {
    problems.push(`${name}: cordis.patch.yml id=${patchId} ≠ skin.json id=${skin.id}`)
  }

  for (const rel of ['src/index.ts', 'src/client/index.ts']) {
    const file = join(dir, rel)
    if (!existsSync(file)) continue
    const themeId = /export const THEME_ID\s*=\s*['"]([^'"]+)['"]/.exec(readFileSync(file, 'utf8'))?.[1]
    if (themeId !== undefined && themeId !== skin.id) {
      problems.push(`${name}: THEME_ID=${themeId} in ${rel} ≠ skin.json id=${skin.id}`)
    }
  }
}

/**
 * On install the market checks that the entry a package declares really exists, and uninstalls it again if not —
 * because once a package with a missing entry is written into the config, the Loader hits ERR_MODULE_NOT_FOUND on the next start and dsh will not boot at all.
 * All that can be checked here is that files covers the entry; the actual output is checked again after CI builds it.
 */
function checkPackaging(name, pkg) {
  if (pkg.dsh?.bundle?.patch === undefined) {
    problems.push(`${name}: package.json declares no dsh.bundle.patch — the market will judge it NOT_A_BUNDLE`)
  }
  const files = pkg.files ?? []
  for (const required of ['lib', 'cordis.patch.yml', 'skin.json']) {
    if (!files.includes(required)) {
      problems.push(`${name}: files is missing ${required}, so it will not be packed into the tarball`)
    }
  }
  const entries = [pkg.main, ...Object.values(pkg.exports ?? {})].filter((v) => typeof v === 'string')
  for (const entry of entries) {
    if (!entry.startsWith('./lib/') && !entry.startsWith('lib/') && !entry.endsWith('package.json')) {
      problems.push(`${name}: the entry ${entry} is not under lib/, so it will be missing from the tarball`)
    }
  }
}

/**
 * The directory name must match the package name character for character.
 *
 * This pins one name across the whole chain: the directory `packages/dsh-niulai`, the package `dsh-niulai`,
 * the Release tag `dsh-niulai-v0.1.0`, the tarball `dsh-niulai-0.1.0.tgz` and the identifier shown in the market.
 * Directories used to lack the prefix (`packages/niulai`), so tag and filename prefixes disagreed
 * and every reader had to do the mapping in their head first.
 */
function checkNaming(name, pkg) {
  if (pkg.name !== name) {
    problems.push(`${name}: package name ${pkg.name} does not match the directory name`)
  }
  if (!name.startsWith('dsh-')) {
    problems.push(`${name}: the directory name must start with dsh-`)
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
    problems.push(`${name}: missing skin.json`)
    continue
  }
  const skin = JSON.parse(readFileSync(skinPath, 'utf8'))

  checkNaming(name, pkg)
  checkIds(dir, name, skin)
  checkPackaging(name, pkg)

  if (skin.package !== undefined && skin.package !== pkg.name) {
    problems.push(`${name}: skin.json package=${skin.package} ≠ package name ${pkg.name}`)
  }

  // A theme id is global within a profile: two skins sharing one id will displace each other when installed together
  const prev = ids.get(skin.id)
  if (prev !== undefined) {
    problems.push(`id conflict: ${prev} and ${name} both use id=${skin.id}; installed together they displace each other`)
  }
  ids.set(skin.id, name)
}

console.log(`Checked ${dirs.length} skins`)
if (problems.length === 0) {
  console.log('✓ All checks passed')
} else {
  console.log(`✗ ${problems.length} problem(s):`)
  for (const p of problems) console.log('  -', p)
  process.exit(1)
}
