/**
 * Pack every skin whose version has not been published into a tarball and attach it to a GitHub Release.
 *
 * Distribution goes through Release assets rather than npm, and no longer through `github:owner/repo`:
 *  · npm — not published (the owner's decision), and the market used to hand out the bare package name, so clicking install 404s
 *  · github: — pnpm has no notion of installing from a subdirectory of a git repository, so this route simply does not work in a monorepo
 *  · Release tarball — free, unmetered, a few hundred KB installed in seconds, and npm pack ships lib/ already built,
 *    so pnpm's build-script authorisation never triggers (one fewer "allow code to run on your machine" prompt for the user)
 *
 * Whether something was published is decided by the existence of a Release tag, not a local git tag: CI does not check out every
 * tag, so judging from local state would republish. Tags look like `niulai-v0.1.0`.
 *
 * Usage:
 *   node scripts/release.mjs --dry     print what would be published without touching the remote
 *   node scripts/release.mjs           publish for real (requires gh to be authenticated)
 */

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, mkdirSync, rmSync, renameSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DRY = process.argv.includes('--dry')
const DIST = 'dist'

function sh(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim()
}

/** Does the Release exist? gh exits non-zero for a missing tag, which is treated as "not published" rather than an error. */
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
  console.log('Nothing to publish (every version already has a matching Release)')
  process.exit(0)
}

console.log(`${pending.length} package(s) to publish:`)
for (const { name, pkg, tag } of pending) console.log(`  ${name}  ${pkg.name}@${pkg.version}  → ${tag}`)
if (DRY) process.exit(0)

rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })

for (const { name, tag, pkg } of pending) {
  const dir = join('packages', name)
  // npm pack does not run prepublishOnly (since npm 7 it fires only on npm publish),
  // so the build must have run separately beforehand — skip it and you pack an empty shell without lib/,
  // which the market's entry check catches on install and rolls back.
  if (!existsSync(join(dir, 'lib', 'index.js'))) {
    console.error(`✗ ${name}: lib/index.js does not exist; run pnpm build first`)
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
      'Install:',
      '```sh',
      `dsh plugin --profile web add -w <the download URL of the .tgz on this page>`,
      '```',
      '',
      `or search for it under Settings → Skin Market in dsh.`,
    ].join('\n'),
  ])
  console.log(`✓ ${tag}  ${file}`)
}

console.log('')
console.log('Remember to point the matching market entry\'s installSpec at the new tarball URL,')
console.log('otherwise clicking install still resolves the old spec.')
