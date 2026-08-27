# dsh-night-flight-companion · Night Flight Companion

A dark skin for DeepSeek Harness (dsh): deep night blue, moonlight cyan and a touch of warm cream, with a full night-flight banner on the new-session page.

![New session](preview/dark.webp)

## What it changes

| Surface | Content |
|---|---|
| Palette | A full set of `--dsw-alias-*` / `--dsw-specific-*` semantic tokens on the dark base, with every border a 1px line tinted moonlight cyan |
| New session | The banner takes all the height above the composer (a 16px radius, a moonlight-cyan border, a deep shadow), the composer sits separately below, and an identity badge occupies the top-left corner |
| Brand slots | The sidebar and new-session marks are a pure-CSS **moon ring** (a bright lunar core, a blue ring, a night ground and a cyan glow), with the subtitle `Night Flight Companion` |
| Status dock | Always present on the chat page: a reduced banner plus six kinds of real state, collapsible (the choice is remembered) |

### Only one warm colour

The whole skin rests on deep night blue and moonlight cyan, and its only warm colour is **moonlight cream `#ded0ae`**. The prototype uses it solely at the end of the energy-bar
gradient (`linear-gradient(90deg,#5f88da,#7bd8ff,#ded0ae)`), like the lamp wrapped in night in the picture — so here too it gets
exactly one place: **the end of the context-usage bar**. Spread wider it stops being a touch of warmth.

Red is toned down too: the last thing this skin should contain is anything that glares, so the error colour is a low-saturation `#e5798a`.

### The layout follows the prototype

The prototype states the rule itself: New Session uses **the whole banner as the hero visual** with **the composer separately below**,
while keeping the full Harness workspace. Its `#home` is likewise `column` plus `.hero { flex: 1 }` with a separate `.composer` below.
So the banner does not sit over the composer, and carries no copy beyond the identity badge in its top-left corner.

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| Flight log | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures are fixed-density estimates and **do not add up** to the token load.

## Four things deliberately not done

These are all **hardcoded decoration** in the prototype with no matching projection in the harness, so none are built — decoration is fine; fake state is not:

- the four `ONLINE` rows under Harness Systems in the right column
- the four Flight Modes cards in the right column
- the 85% and 100% under Moonlight Energy in the right column
- the "☾ MOONLIGHT ONLINE" badge in the cover's top-right corner

**No host copy is replaced either**: this prototype gives no agent-copy specification, and inventing lines without a basis is embellishment.

## One implementation detail

The dock's thumbnail crops with **`background-position: left center`** rather than centred — the banner's subject (the three figures in flight
and the umbrella) sits in the **left third** of the image, with a wide moonlit valley to the right, so a centred crop would yield nothing but night.

## Install

**Skin market** (recommended): search for "Night Flight", install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-night-flight-companion
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-night-flight-companion to the profile package.json's dependencies and dsh.profile.bundles
```

## 🔴 The side effect of autoApply

Installing switches to this skin by default. The harness **does not persist third-party theme ids**, and the built-in Settings → Appearance offers only
three cells — light / dark / follow system — so switching manually requires the skin market's own panel. The cost is that it reapplies on every refresh:
switching away lasts only for that session. To change permanently, set `autoApply` to `false` or uninstall.

## Version requirements

Requires **dsh 0.1.1-rc.2 or newer** (the brand-slot takeover relies on slot `priority` shadowing; older versions simply fall back to
the official brand mark, with the palette and banner working as usual).

## Assets

The banner is a 1672×941 illustration compressed to webp (q92, 231 KB) and inlined into the bundle rather than linked from an image host.
How it is generated and its resolution ceiling are documented at the top of `src/client/cover.generated.ts`.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` must be committed: skins install via `github:owner/repo`, which installs the build output from the repository.

## License

MIT © Science Roam Limited
