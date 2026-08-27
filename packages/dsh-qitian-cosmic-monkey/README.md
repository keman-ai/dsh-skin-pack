✔ dsh-qitian-cosmic-monkey/README.md
Sea

A skin for DeepSeek Harness (dsh): a midnight cosmic blue ground, ember gold for borders and the primary action, starlight blue for running alone, and a full-bleed Monkey King starscape on the new-session page

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: a cosmic blue ground `#070b13` with three blue-black panel levels above it, and exactly one dark border tinted ember gold
  `rgba(240,188,112,.14)`, with warm-toned text `#efe9dc`. About 80 `--dsw-alias-*` /
  `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **A full banner on the new-session page**: the Monkey King, the starscape and a sunrise over a sea of clouds, with a 14px radius, a gold border and a deep shadow;
  the composer sits separately below without overlapping. The banner collapses on entering a conversation or the trajectory.
- **Brand takeover**: the sidebar and hero marks both become a gold-ring mark, with the subtitle "Qitian Starscape".
- **Personified copy**: thinking → "The Sage is contemplating the starscape…"; failure → "The star track has drifted — recalculate.";
  and a confirmation prompt is prefixed with "this may touch on fate; a human decides" — **the original text stays**, since that is what you judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's theme rules state the ratio as a single figure, and it is this skin's hardest constraint:

> **64% midnight cosmic blue / 16% blue-black surface / 9% sunset ember gold / 6% starlight blue / 4% misty grey text / 1% danger red**

| Colour | Value | Share | Used for |
|---|---|---|---|
| Midnight cosmic blue | `#070b13` / `#0a1020` | 64% | The ground |
| Blue-black surface | `#0c1424` → `#16213a` | 16% | Panels, bubbles, the composer |
| Sunset ember gold | `#d39a52` / `#f1bc70` | 9% | Borders, the primary action, the wordmark. The sunrise light in the picture |
| Starlight blue | `#315fae` / `#6e94e9` | 6% | For **running** alone. It is the starscape half |
| Misty grey | `#c6bcaa` / `#847e73` | 4% | Secondary text |
| Red | `#ca5a49` | 1% | Danger and failure alone |

🔴 **The misty grey is warm, not neutral**: `#c6bcaa` leans yellow. A pure grey such as `#8a8a8a` looks dirty against this warm gold —
you cannot name what is wrong at first glance, but the whole interface loses its colour.

🔴 **Success uses ember orange, not green**: this palette has no green at all, and forcing one would break both the
9% gold and the 64% cosmic blue ratios. `#e0a06a` separates it from the primary gold by luminance and hue.

🔴 **The draft's purple is used nowhere**: `--purple: #765799` (the nebula) appears in the prototype only on decorative gradients
and carries no meaning. Assigning it one would be inventing rules on the designer's behalf.

One more line is fixed in the draft: **New Session carries the grand narrative and the character's world; once working,
visual noise drops and the readability of a real development tool is preserved.** So the banner is painted on the hero only, and the three-column layout and information density are untouched.

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
| Celestial scripture | The source and form of each context injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The four rows under the prototype's tool-call card — each with a hardcoded duration such as `done 2.3s` or
`running 7.9s` — are demo data written into the draft;
the same goes for the battle-spirit gauge at the foot of the sidebar, the line in the top bar,
and the "gate to the starscape is open" in the cover's top corner.

**The harness has no matching projection.** Decoration is fine; fake state is not. A battle-spirit gauge frozen at 85,200 is
disbelieved the second time it is seen, and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

The prototype's agent copy for Tool and Context is also not implemented:
The harness's tool rows have only ok / error and no running to hang on, and forcing one would produce a permanently lit fake state.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-qitian-cosmic-monkey
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-qitian-cosmic-monkey to the profile package.json's dependencies and dsh.profile.bundles
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

The cover is the prototype's clean illustration (1672×941), uncropped, at native resolution with cwebp q95 — the nebula's grain and the cloud sea's gradations do not survive downscaling.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
