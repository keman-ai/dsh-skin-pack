# dsh-ai-work-slogan · AI Work Mode

A dark skin for DeepSeek Harness (dsh): a deep-sea blue gradient, frosted-glass panels, a white primary action, and a slogan on the empty screen.

![New session](preview/dark.webp)

## What it changes

| Surface | Content |
|---|---|
| Ground | **One vertical gradient** (#071936 → #0a2a60 → #2f79ef) with a pool of blue light at the top — brighter towards the bottom, the reverse of a usual dark theme |
| Panels | Sidebar, dock and cards are all translucent glass (6–10% white with a 14px backdrop blur), bordered by thin translucent white lines |
| Primary action | **Deep blue on white.** Against all this blue, white is the only thing stronger |
| Empty screen | The host heading becomes the skin's slogan plus a line of explanation; the brand slot is a white rounded square holding the DeepSeek whale |
| Status dock | Always present on the conversation page: a brand row plus six kinds of real state, collapsible (the choice is remembered) |

**This skin contains no illustration at all** (beyond a 5 KB whale mark): the visuals are gradient, glass and type. The whole package is 51 KB,
the smallest of any skin here.

### 🔴 Which layer the gradient goes on was measured, not guessed

The first version painted it on the root container and the UI came out flat deep blue. Probing layer by layer showed **two** opaque grounds covering it:

1. `_frame` — filling the viewport and painting `bg-base`. The gradient moved onto it instead (`background-image` naturally covers
   `background-color`）。
2. `[data-phase]` (ConversationRoot) — another 1320×950 layer on top. Only once it is transparent does the gradient actually show.

One more: the composer's fade must be **confined to `[data-phase='active']`**. Earlier skins spread a full image across the hero
and the fade was invisible; here the hero is an open gradient, and applied to every phase it cuts a straight dark band across it.

### Where the slogan comes from

The harness forbids third parties overriding built-in copy (`locale.register` throws on a duplicate name; it offers addition, never replacement), so this goes through a
pseudo-element: the host heading is collapsed with `font-size: 0`, `::after` shows the slogan, and the explanation below fills the heading's empty container.

⚠️ **The cost: the Chinese slogan appears even with the UI in English.** This is a Chinese-slogan skin by design; if that bothers you, use it for the palette alone.
The anchors are hashed CSS Module class names and belong to the degradation zone: after a host redesign the slogan reverts to the original text, without an error.

⚠️ The four capability cards along the bottom of the prototype's hero are **not implemented** —
in the real product that space belongs to the composer and the workspace picker, four static cards would push the primary action down, and they express
no runtime state at all.

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
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures are fixed-density estimates and **do not add up** to the token load.

The prototype's five ONLINE rows under Harness Systems and the four Work Modes cards are decoration with no matching projection, so they are not built.

## Install

**Skin market** (recommended): search for "AI Work Mode", install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-ai-work-slogan
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# then add dsh-ai-work-slogan to the profile package.json's dependencies and dsh.profile.bundles
```

## 🔴 The side effect of autoApply

Installing switches to this skin by default. The harness **does not persist third-party theme ids**, and the built-in Settings → Appearance offers only
three cells — light / dark / follow system — so switching manually requires the skin market's own panel. The cost is that it reapplies on every refresh:
switching away lasts only for that session. To change permanently, set `autoApply` to `false` or uninstall.

## Version requirements

Requires **dsh 0.1.1-rc.2 or newer** (the brand-slot takeover relies on slot `priority` shadowing; older versions simply fall back to
the official brand mark, with the palette working as usual).

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` must be committed: skins install via `github:owner/repo`, which installs the build output from the repository.

## License

MIT © Science Roam Limited
