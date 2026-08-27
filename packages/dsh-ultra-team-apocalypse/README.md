# dsh-ultra-team-apocalypse · Ultra Team Apocalypse

A skin for DeepSeek Harness (dsh): a charred dark-red ground, firelight orange for the primary action, battle red for failure alone, energy cyan for running alone, and a full-bleed apocalypse squad visual on the new-session page

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: ground and panels are a **charred dark red-black** (`#120909` / `#1a1010`, not neutral black),
  there is exactly one border colour, `rgba(255,151,85,.16)` tinted with firelight, and the body text is a warm off-white `#fff2e6`.
  约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **A full banner on the new-session page**: five figures standing in burning ruins, with a 15px radius, an orange border and a large shadow;
  the composer sits at the card's lower edge, with the scrim darkened a little further at the bottom to keep it legible. The banner collapses on entering a conversation or the trajectory.
- **Brand takeover**: the sidebar and hero marks both become an energy-core badge, with the subtitle "Ultra Team · Apocalypse".
- **A right-hand status dock**: always present; see the table below. Its energy-core orb **changes colour with real context occupancy**
  (cyan → amber → red), sitting at a grey idle with no data rather than pretending to be STABLE.

## Palette rules

🔴 **This draft has no Theme rules section** (unlike others in the same batch, which fix the ratios) and gives only a set of `:root` variables.
So the division was read from **how it actually uses** them:

| Colour | Value | The role read from it |
|---|---|---|
| Charred dark red | `#120909` / `#1a1010` / `#251311` | Ground and panels. **Not neutral black** — it is eight tenths of the interface |
| Firelight orange | `#ff7b2c` | The primary action. The prototype's `.new` is `linear-gradient(135deg,#f0522d,#bb251f)` |
| Border | `rgba(255,151,85,.16)` | **The only one anywhere**; all layering rests on it |
| Battle red | `#ef3b2f` | Danger and failure |
| Timer yellow | `#ffdc60` | Warning |
| Energy cyan | `#57d9ff` | **Running** |
| Recovery green | `#65dfa3` | Success |

🔴 **Orange and red must stay apart**: orange is what you are meant to do (the primary action), red is that something went wrong.
The artwork is already all fire, and mixing the two would make everything look ablaze — so a real error would go unseen.

🔴 **The type carries a smoky warmth**: body `#fff2e6`, secondary `#b08f7b` — the same light as the fire.
Neutral grey would look pasted on, and this is the rule light and warm skins most often miss.

🔴 **A third panel level was added**: the prototype gives two (`--panel` / `--panel2`) and the harness wants three.
The third rises one step further rather than reusing panel2, or overlays and the selected state become indistinguishable.

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| Sortie log | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The prototype's right column has five `AI / MM / TL / CX / FS — ONLINE` rows under Harness Systems, two Team Modes cards
(Battle Mode / Strategy Mode), an "Energy Matrix — Matrix State: STABLE", and on the cover
"TEAM COVER ONLINE" and "SYSTEM READY" — **the harness has a projection for none of them**.

Decoration is fine; fake state is not. The energy core was **made real** instead: the orb's colour follows the
`contextPressure` projection (cyan → amber → red), sitting at a grey idle with no data. A core permanently reading STABLE would be worse than none.

**This draft gives no agent-copy specification either** (others in the batch list six lines), so not one line of host copy is replaced.
Unfounded personified copy is embellishment.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-ultra-team-apocalypse
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-ultra-team-apocalypse to the profile package.json's dependencies and dsh.profile.bundles
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

The cover is the prototype's clean illustration (1774×887), uncropped, at native resolution with cwebp q95 — a hard-lined cel style frays the moment it is scaled down.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
