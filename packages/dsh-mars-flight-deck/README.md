# dsh-mars-flight-deck · Mars Flight Deck

A skin for DeepSeek Harness (dsh): spaceflight black as the ground, cool blue for telemetry and borders, thruster orange for the primary action and Nominal green only for success, with a full flight-deck hero on the new-session page.

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: a spaceflight-black ground `#05080d`, deep blue consoles from the third panel level up, and exactly two borders —
  a cool blue `rgba(142,181,203,.12)` (the instrument hairlines) and an orange `rgba(255,122,46,.14)` (emphasis frames) —
  with `#e8edf2` text. Around 80 `--dsw-alias-*` / `--dsw-specific-*` variables change at once.
- **Cabin light**: `body::before` lays down the prototype's two radials — cool blue along the top and thruster orange at the top right,
  so the dead-black ground feels like sitting in a cabin with the instruments lit. `pointer-events: none` keeps it from catching clicks.
- **A full-bleed cover on the new-session page**: the viewport, Mars up close and the whole instrument row. The cover retracts once you enter the chat or trajectory pages.
- **Brand mark takeover**: both the sidebar and hero marks become an `FD` (Flight Deck) square, subtitled "Mars Flight Deck".
- **Personified copy**: thinking → `Computing trajectory…`; failure → `Mission anomaly detected.`;
  anything needing confirmation is prefixed with `Command authorization required` — **the original text stays**, since that is what you actually judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's theme rules state the ratio as a single figure, and it is this skin's hardest constraint:

> **80% spaceflight black and deep blue consoles, 10% cool blue telemetry, 6% thruster orange for interaction emphasis,
> 3% Nominal green for state and 1% red for anomalies**

| Colour | Value | Share | Used for |
|---|---|---|---|
| Spaceflight black / deep blue panels | `#05080d` → `#142331` | 80% | Ground and the three panel levels |
| Cool blue telemetry | `#7fb4d3` | 10% | Borders, secondary data and **running** |
| Thruster orange | `#ff7a2e` | 6% | **Interaction emphasis**: the primary action and selected items |
| Nominal green | `#73b89a` | 3% | Reserved for **all nominal** (the success state) |
| Red | `#d9503f` | 1% | Reserved for **anomalies** |

🔴 **Orange and green must never trade places**: orange is what you are about to do, green is what is already done.
Confusing the two on a flight deck costs you the ability to tell at a glance whether to act. So the primary action, hover and selection all take orange,
success always takes green, and neither ever borrows from the other.

🔴 **Cool blue is never a solid button**: here it is the language of telemetry and borders, and spreading it across large areas flattens the instrument panel's layering.

One more line is equally binding: **New Mission uses the full flight-deck scene, while Console / Flight Path return to a low-distraction engineering interface**.
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
| SYSTEM OPS | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| CONTEXT UPLINK | The source and form of each context injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| COMPACTED | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The five `PROP / NAV / LSS / COM / PWR — ONLINE` rows under Systems in the prototype's right column, the
`54,621 KM` / `2.56 KM/S` / `0.38 G` under Telemetry, the static shortcut table, the "Compute Load 71%" at the foot of the sidebar
and the "ALL SYSTEMS NOMINAL" in the cover's top-right corner **all have no matching projection in the harness**.

Decoration is fine; fake state is not — especially in this skin. A systems panel permanently reading NOMINAL is exactly
the most misleading thing possible in a flight-deck context, and the **real** numbers beside it get doubted along with it.
So the right column keeps only cards backed by real data.

The four mission presets on the hero (`Analyze orbital trajectory` / `Inspect system anomaly`…) are not built either:
they are hardcoded copy in the draft, whereas the harness's suggestions come from session context, and hardcoding a set would only ever produce the same four lines.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-mars-flight-deck
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-mars-flight-deck to the profile package.json's dependencies and dsh.profile.bundles
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

The cover is the clean illustration from the prototype (1536×1024), cropped to 1423×1024 at the hero's aspect ratio and encoded at cwebp q95 in native resolution — the instrument hairlines and the crater texture on Mars cannot survive downscaling.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
