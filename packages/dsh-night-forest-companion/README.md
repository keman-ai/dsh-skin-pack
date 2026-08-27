# dsh-night-forest-companion · Night Forest Companion

A skin for DeepSeek Harness (dsh): moonlit night blue as the ground, moonlight cyan for borders and state and blue for the primary action, with a full night-forest banner on the new-session page.

![New session](preview/dark.webp)

## What it changes

- **A full set of semantic tokens**: a moonlit night-blue ground `#071423`, forest-dark panels `#0b1c2e` and a single dark border tinted moonlight cyan
  `rgba(150,205,255,.16)`, with `#eef8ff` text. Around 80 `--dsw-alias-*` / `--dsw-specific-*` variables
  change at once, and every layer of the interface follows.
- **A full banner on the new-session page**: the three figures on the branch, the night sky and the crescent moon, with a 16px radius, a moonlight-cyan border and a deep shadow;
  the composer sits separately below and the two never overlap, with an identity badge in the cover's top-left corner. The banner retracts once you enter the chat or trajectory pages.
- **Brand mark takeover**: both the sidebar and hero marks become a moon-ring mark, subtitled "Night Forest Companion".
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype states the rule plainly in its own notes:

> The theme is drawn together into **moonlit night blue, forest dark and a soft cool glow**.

The handoff is blunter still: `theme = night blue / moon cyan / soft glow`, `mode = calm companion`.

| Colour | Value | Used for |
|---|---|---|
| Night blue / forest dark | `#071423` / `#0b1c2e` | Ground and panels — most of the interface |
| Moonlight cyan | `#7bdcff` | Borders, emphasis and **running**. The ring of moonlight in the picture |
| Blue | `#467fff` | The primary action. The prototype's `.new`: `linear-gradient(135deg,#4b84ff,#2f62ce)` |

🔴 **Moonlight cyan is never a solid button**: here it is the language of borders and state, and spreading it across large areas would break the quiet of the night.
The primary action therefore takes blue.

🔴 **This skin has no warm colour at all, deliberately**: `calm companion` means nothing should jump out and shout at you.
The prototype drew only the happy path and gave no warning or error colour, so warnings settle on a low-saturation soft yellow (`#dcc98a`)
and errors on a low-saturation pink (`#e0808f`) — **never orange-red**.

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| Night-walk log | Tool name · real duration · outcome | Trajectory `tool-result` nodes (duration = `time - callTime`) plus the snapshot's `runningCalls`. **Appears only once a call has happened** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

The five `AI / MM / CX / VS / FS — ONLINE` rows under Harness Systems in the prototype's right column,
the four Companion Modes cards (Calm / Wonder / Focus / Memory),
the `Energy Level 82% · Night Sync 100%` under Moonlight Energy
and the "☾ MOONLIGHT READY" in the cover's top-right corner **all have no matching projection in the harness**.

Decoration is fine; fake state is not. An energy value frozen at 82% convinces nobody the second time they see it,
and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

**This draft gives no agent-copy specification either**, so not one line of host copy is replaced.
Unfounded personified copy is embellishment.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-night-forest-companion
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-night-forest-companion to the profile package.json's dependencies and dsh.profile.bundles
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

The cover is the clean illustration from the prototype (1672×941), uncropped, at cwebp q95 in native resolution — a night sky of large flat areas is the most demanding case for the encoder, and one step down bands the blue gradient.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
