# dsh-whale-girl · Whale Girl Lounge

A light skin for DeepSeek Harness (dsh): three levels of pale blue, pearl white and deep-sea navy, with a full-bleed whale girl cover on the new-session page.

![新会话页](preview/light.webp)

## What it changes

| Surface | Content |
|---|---|
| Palette | A full set of `--dsw-alias-*` / `--dsw-specific-*` semantic tokens on the light base. The primary action is DeepSeek Blue, **green is reserved for online and success**, and amber for actions needing confirmation |
| New session | A full whale girl cover with the composer at its lower edge. **The hero appears on the empty screen only** — it collapses on entering a conversation or the trajectory, returning to real working state |
| Brand slots | The sidebar and new-session marks become a whale silhouette, with the subtitle `Whale Girl Lounge` |
| Status dock | Always present on the conversation page: a reduced cover plus three cards — session state, usage and plan — collapsible (the choice is remembered) |
| Component language | An 8–12px radius, 1px low-contrast borders, almost no shadow |

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending` (`approval` / `question`). **Appears only when something is genuinely waiting**, on an amber card |
| Current Session | State (ready / busy) | `ConversationSnapshot.running` |
| | How long this turn and the current tool have run | The `startTime` of the unfinished turn in `turnTimings` and `runningCalls[].time`, ticking every second |
| | Inbox (queued and steering message counts) | `queue`'s `placement` |
| | Model | The latest assistant message's `provenance.model` (a Trajectory view node) |
| Context | Occupancy % with a bar, and token load | `contextPressure`'s `projectedTokens` / `contextWindow` |
| | The composition bar: System / tool schema / conversation | The `contextBreakdown` projection |
| Permission | The active permission and sandbox mode, with a description | The `permissions` projection (folded from `permission/preset`, `sandbox/mode` and `approval/policy`) |
| Usage | Input / output / cache hits / LLM and tool time / turns and steps | The `tokenUsage` and `sessionStats` projections |
| Plan | Todos completed and the current one | The `todos` projection (the card is absent when there is no list) |

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load above, which is anchored to the provider's reported value. The UI says so too; do not sum them.

The figures share a source and an accounting with the official line below the composer (context uses `projectedTokens`
and drops immediately after compaction; input sums three disjoint billing buckets; time is `llmMs + toolMs`, not wall clock).

**What is not done**: the five "Assistant Systems online" rows in the prototype's right column are pure decoration with no
matching heartbeat projection, so nothing is fabricated. The dock also does **not** take over the harness's own details
rail — that one holds "click a tool call to see its Input / Output", the only lead there is when debugging. This skin opens its own, and both coexist.

The dock collapses automatically on the new-session page (hero) and while a session replays (settling): there is no state
to show then, and the cover should not be chopped up. It also collapses below 1180px.

## Install

**Skin market** (recommended): search for "Whale Girl" in dsh's skin market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-whale-girl
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-whale-girl to ~/.dsh/profiles/web/package.json's dependencies and dsh.profile.bundles
```

After changing it you **must restart dsh**: the profile tree has to be recomposed, and without a restart the UI stays as it was.

## 🔴 The side effect of autoApply

Installing switches to this skin by default (`autoApply`, default `true`), because the harness **does not persist**
**third-party theme ids**: `ui-theme`'s `setTheme` writes only built-in preferences to `settings.yaml`, and a third-party id lives only in the current process.

Also worth knowing: the **built-in Settings → Appearance has only three cells, light / dark / follow system**, and
third-party themes are not among them. Switching manually requires the skin market's own panel (**Settings → Skin Market**), so with `autoApply` off
you have to reselect there on every start.

The costs are:

- **It reapplies on every refresh.** Switching away lasts only for that session; a refresh returns to Whale Girl.
- To change permanently: set `autoApply` to `false` in the config, or uninstall the plugin.

It is implemented as an 8-second window after startup, during which every theme change is pressed back to this skin
(long enough to outlast the Host preference snapshot's override). After the window the plugin lets go and stops competing.

## Version requirements

Requires **dsh 0.1.1-rc.2 or newer**. The brand-slot takeover relies on slot `priority` shadowing
(only equal priorities count as a conflict; different priorities shadow, and the lower number renders). On older versions
these three registrations throw and are swallowed, **merely falling back to the official brand mark**, while the palette and cover keep working.

## Uninstall

Installed from the market, uninstall from the market. A manual install has three places to clear (deleting `node_modules` alone is not an uninstall):

```bash
rm -rf ~/.dsh/profiles/web/node_modules/dsh-whale-girl
# remove the package from the profile package.json's dependencies and dsh.profile.bundles
# remove the matching insert row from the profile's cordis.patch.yml (this is where a market install lives)
```

Then restart dsh: the UI returns to a built-in theme and the official brand mark comes back on its own.

`ui-theme.preference` in `settings.yaml` is **your own built-in theme preference**, not something this plugin wrote
(third-party ids never reach disk), so leave it alone.

## Assets

The cover is a 1672×941 illustration compressed to webp (q92, 427 KB) and inlined into the bundle rather than linked from an image host —
from an image host — it has to work offline and on an intranet. How it is generated and its resolution ceiling are documented at the top of `src/client/cover.generated.ts`.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
