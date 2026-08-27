✔ dsh-deepseek-deep-sea/README.md
 Deep Sea

A skin for DeepSeek Harness (dsh): a deep-sea blue ground, cool cyan for borders and state, DeepSeek Blue for the primary action, and a full-bleed deep-sea visual on the new-session page

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: a deep-sea blue ground `#03101f`, three panel levels rising in turn, and exactly two dark borders tinted cool cyan
  (`rgba(118,204,255,.13)` / `rgba(94,215,255,.14)`), with text in `#eef8ff`. About 80
  `--dsw-alias-*` / `--dsw-specific-*` variables change at once, and every layer of the interface follows.
- **A full cover on the new-session page**: the whale girl, undersea ruins, a whale hologram and bubbles. It collapses on entering a conversation or the trajectory.
- **Brand takeover**: the sidebar and hero marks both become a square whale mark (inline SVG, not an emoji), with the subtitle "Whale Girl · Deep Sea".
- **Personified copy**: thinking → "Diving into the context…"; failure → "Looks like we hit a reef — please retry.";
  and a confirmation prompt is prefixed with "the whale girl needs your confirmation to continue" — **the original text stays**, since that is what you judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's Theme rules fix two things, and all of this skin's restraint follows from them:

> **Keep the primary colour in the DeepSeek blue family**; the whale girl is brand personification only and **must not cover tool or code information**.
> Character visuals belong to New Dive and the empty state; Chat, Dive Path and Details **return to the real Harness working state**.

So the palette is **one blue at several depths**, not an assortment of colours:

| Colour | Value | Used for |
|---|---|---|
| Deep-sea blue | `#03101f` → `#0f2d4a` | Ground and the three panel levels — most of the interface |
| Cool cyan | `#5ed7ff` | Borders, emphasis and **running**. The glowing line of the deep, and all layering on a dark ground rests on it |
| DeepSeek Blue | `#4e7ff2` | The primary action button. The brand colour itself |
| Gold | `#e8ba72` | The only warm colour anywhere. The prototype uses it on the character's bow alone; here it goes only at the end of the context bar |

🔴 **Cool cyan is never a solid button**: here it is the language of borders and state, and spread across a large area it would break the deep's quiet.
Likewise gold has **exactly one place** — a touch of warmth spread wide stops being a touch.

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| Dive operations | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| Seafloor archive | The source and form of each context injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The prototype's right column has five `ONLINE / SYNCED` rows under Ocean Systems, a Companion line reading
`Status: following · Mood: happy · Signal: strong`, a static shortcut table, plus "Ocean compute · 82%" at the
foot of the sidebar and "DEEP SEA MODE READY" in the cover's top corner — **the harness has a projection for none of them**.

Decoration is fine; fake state is not. A compute gauge frozen at 82% is disbelieved the second time it is seen,
and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

The prototype's agent copy for Tool and Context is also not implemented:
The harness's tool rows have only ok / error and no running to hang on, and forcing one would produce a permanently lit fake state.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-deepseek-deep-sea
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-deepseek-deep-sea to the profile package.json's dependencies and dsh.profile.bundles
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

The cover is the prototype's clean illustration (1672×941), cropped to 1312×941 for the hero's aspect ratio and inlined as a data URI.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
