# dsh-sunset-catbus · Sunset Catbus

DeepSeek Harness（dsh）的皮肤：深棕打底、夕阳橙做主操作、麦田金做描边与强调、冷蓝只给运行中，新会话页是一整幅黄昏横幅

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色深棕 `#160d08`（**不是黑**），面板暖棕两级，全场一条带麦田金的暗描边
  `rgba(255,191,103,.16)`，文字 `#fff4e7`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*`
  change at once, and every layer of the interface follows.
- **新会话页整张横幅**：猫巴士、麦田与落日，16px 圆角配麦田金描边和很深的投影；
  输入区独立放在下方，两者不重叠；封面左上角留一枚身份角标。进入对话与轨迹页后横幅收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚落日标，副标「Sunset Catbus」。
- **A right-hand status dock**: always present; see the table below.

## Palette rules

原型稿自己在对话里把规则写清楚了：

> 已将主题统一成**夕阳橙、麦田金和深棕色**。

handoff 里写得更直接：`theme = warm orange / golden field / dark brown`、`mode = companion journey`。

| Colour | Value | Used for |
|---|---|---|
| 深棕 | `#160d08` / `#24150d` / `#302016` | 底与面板——绝大部分界面 |
| 夕阳橙 | `#f49a43` | 主操作。原型 `.new` 的 `linear-gradient(135deg,#f39a43,#bd5e27)` |
| 麦田金 | `#ffd07a` | 描边与强调。画里那片被夕阳照亮的麦子 |
| 冷蓝 | `#6ab6ff` | **正在跑** |

🔴 **底是深棕，不是黑**。这套的底带着黄昏的余温，换成中性黑，整张封面会像贴在另一个界面上——
这是暖色皮肤最容易做塌的一处。

🔴 **全暖盘里，"正在跑"反过来取冷**：`#6ab6ff` 是稿子调色盘里唯一的冷色，正好留给状态。
在一片橙金里，冷色是唯一能一眼认出来的东西。

🔴 **警告是这套里的难题**：整盘都是橙金，橙色警告根本浮不出来。所以警告取**麦田金的高亮档**，
靠亮度而不是色相区分；错误取砖红 `#e0674f`——比夕阳橙更深更红，在暖色里仍然读得出"这是坏消息"。

🔴 **金不做实心按钮**：它在这套里是"描边与强调"的语言，金色大按钮会跟封面抢光。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 途中停靠 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏的「Harness Systems」五行 `AI / MM / CX / VS / FS — ONLINE`、
「Journey Modes」四张模式卡（Wonder / Focus / Memory / Story）、
「Golden Hour Energy」那个 `Energy Level 88% · Journey Sync 100%`，
以及封面右上角的「☀ GOLDEN HOUR」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一个永远停在 88% 的能量值，第二次看见就没人信了，
and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

**This draft gives no agent-copy specification either**, so not one line of host copy is replaced.
Unfounded personified copy is embellishment.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-sunset-catbus
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-sunset-catbus 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1672x941），一刀不裁，cwebp q95 原生分辨率——麦田的笔触与逆光的尘土缩一档就糊成一片黄。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
