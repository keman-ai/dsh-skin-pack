# dsh-emerald-megacity · Emerald Megacity

A skin for DeepSeek Harness (dsh): ink green as the ground, emerald for the primary action, jade green only for running and warm gold only for borders and emphasis.

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: an ink-green ground `#071512`, two rising panel levels and a single dark border tinted warm gold,
  `rgba(235,214,164,.14)` — the afterglow of all those city lights. Around 80 `--dsw-alias-*` /
  `--dsw-specific-*` variables change at once.
- **A full banner on the new-session page**: the spire, the suspension bridge and the floating towers, with a 16px radius, a warm-gold border and a deep shadow;
  the composer sits separately below and the two never overlap. The banner retracts once you enter the chat page.
- **Brand mark takeover**: a round mark of warm-gold core, emerald ring and ink-green ground, subtitled "Emerald Megacity".
- **A right-hand status dock**: always present; see the table below.

## Palette rules

Three things make up this palette: **an emerald city, warm gold lights and misty green air**.

| Colour | Value | Used for |
|---|---|---|
| Ink green | `#071512` / `#0b211c` / `#102c25` | Ground and panels — most of the interface |
| Emerald | `#2f7e66` | The primary action |
| Jade green | `#7db99f` | **Running**. The deeper step presses, the lighter one glows |
| Warm gold | `#d9ad62` | Borders and emphasis. All those city lights in the picture |
| Misty green | `#b7c9c2` | Secondary text |

🔴 **Warm gold is never a solid block**: it is light, and once it spreads the city's cool haze is gone — so it lands only on borders and emphasis.

🔴 **Secondary text uses a green-tinted mist, not a neutral grey**: this city's air is green, and a neutral grey detaches from the picture.

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| Tool calls | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window.
Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The hardcoded ONLINE rows in the prototype's right column, its mode cards, its fixed energy value and the status badge in the cover's top-right corner
**all have no matching projection in the harness**, and none are built.

Decoration is fine; fake state is not. An energy value that never changes convinces nobody the second time they see it,
and the real numbers beside it get doubted along with it.

**This draft gives no agent-copy specification either**, so not one line of host copy is replaced.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-emerald-megacity
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-emerald-megacity to the profile package.json's dependencies and dsh.profile.bundles
```

After changing it you **must restart dsh**: the profile tree has to be recomposed, and without a restart the UI stays as it was.

## 🔴 The side effect of autoApply

Installing switches to this skin by default (`autoApply`, default `true`). The reason is that the harness **does not persist third-party theme ids**,
and the **built-in Settings → Appearance has only three cells: light / dark / follow system**, with no third-party themes —
switching manually requires the skin market's own panel (**Settings → Skin Market**).

The cost: **it reapplies on every refresh**, so switching away lasts only for that session. To change permanently, set `autoApply` to `false`
or uninstall the plugin. It is implemented as an 8-second window after startup (long enough to outlast the Host preference snapshot), after which it lets go entirely.

## Version requirements

Requires **dsh 0.1.1-rc.2 or newer**. The brand-slot takeover relies on slot `priority` shadowing (only equal
priorities count as a conflict; different priorities shadow, and the lower number renders). On older versions these three registrations throw and are swallowed,
**merely falling back to the official brand mark**, while the palette and cover keep working.

## Assets

The cover is the megacity image from the prototype (1672×941), close enough to the banner's ratio to need no crop, at cwebp q95 in native resolution — the fine warm points of all those city lights cannot survive compression.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
