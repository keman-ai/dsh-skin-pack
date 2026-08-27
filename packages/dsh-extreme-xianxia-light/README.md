# dsh-extreme-xianxia-light · Misty Xianxia

A skin for DeepSeek Harness (dsh): paper white and mist white as the ground, ink grey for text, pale gold for borders and buttons and jade green only for running, with a full xianxia hero on the new-session page.

![New session page](preview/light.webp)

## What it changes

- **A full set of semantic tokens (light)**: a paper-white ground `#f4f3f0` rising to pure white panels and mist-white dividers, with exactly two warm grey lines
  (`#d7d2c8` / `#c9c2b5`) and ink-grey `#313331` text — this skin contains **no pure black**. Around 80
  `--dsw-alias-*` / `--dsw-specific-*` variables change at once, and every layer of the interface follows.
- **The ground is not one flat sheet of paper white**: `body::before` lays a soft white glow along the top, giving the paper some thickness.
- **A full-bleed cover on the new-session page**: the calligraphy, the sword-bearing adept and the white dragon.
  Its lower edge is a **paper-white gradient** rather than a darkening, bleeding the art into the interface's paper. The cover retracts once you enter the chat or trajectory pages.
- **Brand mark takeover**: both the sidebar and hero marks become a paper-white seal bearing the character 天 (heaven), subtitled "Misty Xianxia".
- **Personified copy**: thinking → "The acolyte is contemplating the workings of fate…"; failure → "The workings are disturbed — recalculate.";
  and a confirmation prompt is prefixed with "this carries consequences; a human decides" — **the original text stays**, since that is what you judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's theme rules state the ratio as a single figure, and it is this skin's hardest constraint:

> **80% grey-white / mist-white base; 12% ink grey for hierarchy; 5% pale gold for interaction; 2% jade green for running; 1% cinnabar for danger**

| Colour | Value | Share | Used for |
|---|---|---|---|
| Paper white / mist white | `#f4f3f0` / `#eceae5` / `#e3e0da` | 80% | Ground, panels and the composer |
| Ink grey | `#313331` / `#676b68` / `#8f918d` | 12% | Text and hierarchy. **No pure black** — black would press the mist into shadow |
| Pale gold | `#b18a50` | 5% | Borders, the primary action and the wordmark. 5% means **edges and text**, not a large solid button |
| Jade green | `#6d948d` / `#4f7871` | 2% | Reserved for **running** |
| Cinnabar | `#b55a52` | 1% | Reserved for **danger and failure** |

🔴 **Success also takes jade green**: this draft's palette contains no green at all, and forcing one in would break both the 2% jade and the 80% grey-white
proportions. Better to let success and running share a family (separated by depth, `#4f7871` / `#6d948d`) than to introduce a seventh colour.

🔴 **A light skin needs two extra rules**:
- **Text on inverted blocks** (`label-primary-foreground`) cannot stay white: the primary button is solid pale gold, where white lacks contrast and
  black is too hard, so a warmer step of paper white, `#fdfcf9`, is used.
- **Toasts and tooltips invert to a dark ground** (`#3a3c39`): a light overlay floating on paper white has no separation.

One more line is equally binding: **strong xianxia atmosphere, stronger SaaS usability**; the hero visual concentrates on New Session and the empty state,
and the working state is never covered wall to wall. So the cover is drawn on the hero only, leaving the three-column layout and its information density untouched.

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

The four rows under Arts invoked in the prototype's right column — a divination array at `done 2.1s`, a scripture reading at `running 8.4s`,
a formation simulation at `queued` — are hardcoded demo data in the draft; so are the "Spirit energy 68,250 / 108,000" at the foot of the sidebar
and the top bar's standing-by line.

**The harness has no matching projection.** Decoration is fine; fake state is not. A spirit-energy gauge frozen at 68,250
disbelieved the second time it is seen, and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

The draft's agent copy for `Tool` (invoking an art…) and `Context` (leafing through the scriptures…) is not built either:
The harness's tool rows have only ok / error and no running to hang on, and forcing one would produce a permanently lit fake state.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-extreme-xianxia-light
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-extreme-xianxia-light to the profile package.json's dependencies and dsh.profile.bundles
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

The cover comes from the prototype's full-screen mockup, with its fake sidebar, fake details rail and title cropped away so that only the art remains (695×500 webp, inlined as a data URI).

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
