# dsh-forest-adventure · Forest Adventure

A skin for DeepSeek Harness (dsh): forest green as the ground, moss green for the primary action, stream teal only for running and daylight yellow only as an accent, with a full forest hero on the new-session page.

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: a forest-green ground `#08150f`, moss tones from the third panel level up, and exactly two borders —
  grass `rgba(187,212,180,.14)` and stream teal `rgba(94,183,199,.12)` — with `#eef1e8` text. Around 80
  `--dsw-alias-*` / `--dsw-specific-*` variables change at once, and every layer of the interface follows.
- **A full-bleed cover on the new-session page**: the pair on the raft, the rope bridge, the wisteria and the stream. The cover retracts once you enter the chat or trajectory pages.
- **Brand mark takeover**: both the sidebar and hero marks become a forest-toned square, subtitled "Forest Adventure".
- **Personified copy**: thinking becomes "walking through the forest for an answer…", and anything needing confirmation is prefixed with
  "this cannot continue without your confirmation" — **the original text stays**, since that is what you actually judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's Theme rules fix each colour's job:

> **Forest green** as the ground, **stream teal and moss green** as the state colours, and **daylight yellow only as a warm accent**.

| Colour | Value | Used for |
|---|---|---|
| Forest green | `#08150f` → `#1f3b2b` | Ground and the three panel levels — most of the interface |
| Moss green | `#6fa36d` / `#a7cb87` | The primary action and **done** |
| Stream teal | `#5eb7c7` | **Running** |
| Daylight yellow | `#d7c77e` | Accent only, in exactly two places: the warning state and the end of the context-usage bar |

🔴 **The two state colours must stay clearly apart**: green means done, teal means in progress. Keeping them in one family (both green, separated by brightness)
makes it impossible to tell at a glance whether a task finished or is still running — the most expensive misreading there is in daily use.

🔴 **The draft's purple is never used**: `--flower: #9a7fbb` (the wisteria in the picture) appears only as decoration throughout the prototype,
with no semantics at all. Assigning it one would be inventing rules on the designer's behalf, so it appears nowhere in the token set.

One more line is equally binding: **New Session may use the full scene, while Chat / Trajectory return to a quiet working interface**.
So the cover is drawn on the hero only, leaving the three-column layout and its information density untouched.

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| Forest tracks | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The three hardcoded `Workspace files` in the prototype's right column (`forest-inspiration.md` at 2.1 KB and the like),
the static shortcut table, the "Credits 68,250 / 108,000" at the foot of the sidebar and the "Forest mode ready" badge in the cover's
top-right corner **all have no matching projection in the harness**.

Decoration is fine; fake state is not. A credit gauge frozen at 68,250 convinces nobody the second time they see it,
and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

The four suggestion chips on the hero (`Explore this repository` / `Write a gentle story`…) are not built either:
they are hardcoded copy in the draft, whereas the harness's suggestions come from session context, and hardcoding a set would only ever produce the same four lines.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-forest-adventure
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-forest-adventure to the profile package.json's dependencies and dsh.profile.bundles
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

The cover is the clean illustration from the prototype (1536×1024), cropped to 1423×1024 at the hero's aspect ratio, kept at cwebp q95 to preserve the fine texture of the leaves and water, and inlined as a data URI.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
