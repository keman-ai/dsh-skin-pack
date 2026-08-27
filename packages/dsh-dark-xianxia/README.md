# dsh-dark-xianxia · Dark Xianxia

A skin for DeepSeek Harness (dsh): ink-teal black as the ground, antique gold for borders and buttons, jade green only for running and cinnabar only for danger, with a full divination hero on the new-session page.

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: an ink-teal black ground `#071012`, warm grey-black panels and exactly two dark borders tinted antique gold
  (`rgba(189,151,88,.18)` / `.28`), with `#e8dfca` text. Around 80 `--dsw-alias-*` / `--dsw-specific-*` variables
  change at once, and every layer of the interface follows.
- **A breath of qi along the top**: `body::before` lays down the prototype's `radial-gradient(circle at 50% 0%, rgba(45,92,94,.16), transparent 34%)`,
  keeping the ink-black ground from going flat. `pointer-events: none` keeps it from catching clicks.
- **A full-bleed cover on the new-session page**: the calligraphy, the sword-bearing adept and the dragon. The cover retracts once you enter the chat or trajectory pages.
- **Brand mark takeover**: both the sidebar and hero marks become a gold seal bearing the character 天 (heaven), subtitled "Tianji Pavilion · Xianxia".
- **Personified copy**: thinking → "The acolyte is contemplating the workings of fate…"; failure → "The workings are disturbed — recalculate.";
  and a confirmation prompt is prefixed with "this carries consequences; a human decides" — **the original text stays**, since that is what you judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's theme rules state the ratio as a single figure, and it is this skin's hardest constraint:

> **70% ink-teal black / 18% warm grey-black / 8% antique gold / 3% jade green / 1% cinnabar**

| Colour | Value | Share | Used for |
|---|---|---|---|
| Ink-teal black | `#071012` | 70% | The ground |
| Warm grey-black | `#0b1619` / `#0f1d21` / `#13252a` | 18% | Panels, the composer and bubbles |
| Antique gold | `#c09b5c` / `#e0bd7b` | 8% | Borders, the primary action and the wordmark. 8% means **edges and buttons**, not broad fills |
| Jade green | `#4d9b8f` | 3% | Reserved for **running** |
| Cinnabar | `#bf5a47` | 1% | Reserved for **danger and failure**. The prototype uses it in one place only: Stop run |

🔴 **Success also takes jade green**: this draft's palette contains no green at all, and forcing one in would break both the 3% jade and the 70% ink-black
proportions. Better to let success and running share a family (separated by brightness, `#74b5a9` / `#4d9b8f`) than to introduce a sixth colour.

One more line is equally binding: **the strong world-building visuals concentrate on New Session and the empty state, and once you enter the workflow it returns to a restrained
dark developer-tool interface, which is what suits real long-term use**. So the cover is drawn on the hero only, leaving the three-column layout and its information density untouched.

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
| Scripture reading | The source and form of each context injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The four rows under Arts invoked in the prototype's right column — a divination array at `done 2.1s`, a ley-line probe at `done 3.7s`,
a scripture reading at `running 8.4s` and a formation simulation at `queued` — are hardcoded demo data in the draft;
so are the "Spirit energy 68,250 / 108,000" at the foot of the sidebar and the top bar's standing-by line.

**The harness has no matching projection.** Decoration is fine; fake state is not. A spirit-energy gauge frozen at 68,250
disbelieved the second time it is seen, and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

The draft's agent copy for `Tool` (invoking an art…) and `Context` (leafing through the scriptures…) is not built either:
The harness's tool rows have only ok / error and no running to hang on, and forcing one would produce a permanently lit fake state.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-dark-xianxia
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-dark-xianxia to the profile package.json's dependencies and dsh.profile.bundles
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

The cover comes from the prototype's full-screen mockup, with the mockup's own title and the leftover top bar cropped away so that only the art remains (660×475 webp, inlined as a data URI).

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
