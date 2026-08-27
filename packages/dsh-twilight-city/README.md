# dsh-twilight-city · Twilight City

A skin for DeepSeek Harness (dsh): a deep night-sky blue ground, sunset orange, purple and pink for atmosphere, warm yellow lighting only the buttons and sky blue only for running, with a full twilight-city hero on the new-session page.

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: a night-sky ground `#0a1020`, city blue from the third panel level up, and exactly two borders —
  a neutral `rgba(255,255,255,.08)` and a sunset-orange `rgba(255,138,76,.14)` — with `#eef1f7` text.
  Around 80 `--dsw-alias-*` / `--dsw-specific-*` variables change at once, and every layer of the interface follows.
- **Skylight**: `body::before` lays down the prototype's two radials — warm yellow at the top left, sky blue at the top right,
  one warm and one cool, exactly the sky at that moment of dusk. `pointer-events: none` keeps it from catching clicks.
- **A full-bleed cover on the new-session page**: the two figures on the steps, the distant city lights and that one shooting star. The cover retracts once you enter the chat or trajectory pages.
- **Brand mark takeover**: both the sidebar and hero marks become a square bearing the character 暮 (dusk), subtitled "Twilight City".
- **Personified copy**: thinking becomes "walking through the dusk for an answer…", and anything needing confirmation is prefixed with
  "this cannot continue without your confirmation" — **the original text stays**, since that is what you actually judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's Theme rules fix each colour's job:

> **Deep night-sky blue** as the ground, **sunset orange and purple-pink cloud** as the emotional emphasis, and **warm yellow only to light windows and buttons**.

| Colour | Value | Used for |
|---|---|---|
| Night-sky blue | `#0a1020` → `#202d47` | Ground and the three panel levels — most of the interface |
| Sunset orange | `#ff8a4c` | Emotional emphasis: warm borders, emphasis, hover and warnings |
| Cloud purple / pink | `#8459d9` / `#c96594` | Emotional emphasis. Pink lands on the one that deserves a second look — hovering a destructive action |
| Warm yellow | `#f1b56f` | Lights **windows and buttons** only: the primary action and selected items |
| Sky blue | `#69a9ff` / `#5b7be4` | **Running** |

🔴 **Emotional emphasis is not a state colour.** Orange, purple and pink carry atmosphere, not whether a task succeeded —
give the warmth of a hover and the fact of completion the same colour and the interface talks constantly while saying nothing clearly.

🔴 **Why running is sky blue**: it is the only colour on the draft's palette that is **both present and unassigned any emotional duty**,
which leaves it free for state. A cool colour also stands well clear of all this warmth and is recognised at a glance.

🔴 **Success takes a low-saturation teal-green `#7fc9a8`**: the palette has no green, but success must stay clear of both running (sky blue)
and the primary action (warm yellow). This is the quietest choice available amid all that warmth.

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| Tool trace | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The three hardcoded `Workspace files` in the prototype's right column (`twilight-cover.png` at 2.4 MB and the like),
the static shortcut table, the "Credits 72,300 / 108,000" at the foot of the sidebar and the "Twilight mode ready" badge in the cover's
top-right corner **all have no matching projection in the harness**.

Decoration is fine; fake state is not. A credit gauge frozen at 72,300 convinces nobody the second time they see it,
and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

**The Error and Success persona lines are not built either**: this draft's agent copy gives only Thinking and Permission,
with no specification for failure or success. What is missing is not invented — persona copy without a basis is embellishment.

The four suggestion chips on the hero (`Explore this repository` / `Write a reflective story`…) are the same case:
they are hardcoded copy in the draft, whereas the harness's suggestions come from session context, and hardcoding a set would only ever produce the same four lines.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-twilight-city
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-twilight-city to the profile package.json's dependencies and dsh.profile.bundles
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

The cover is the clean illustration from the prototype (2048×1137), cropped to 1580×1137 at the hero's aspect ratio and encoded at cwebp q95 in native resolution — the sunset gradient and the scattered city lights cannot survive downscaling.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
