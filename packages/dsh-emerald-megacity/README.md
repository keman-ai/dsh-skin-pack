# dsh-emerald-megacity · Emerald Megacity

DeepSeek Harness（dsh）的皮肤：墨绿打底、翡翠做主操作、玉青只给运行中、暖金只做描边与强调

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色墨绿 `#071512`，面板两级往上抬，全场一条带暖金的暗描边
  `rgba(235,214,164,.14)`——正是那片万家灯火的余光。约 80 个 `--dsw-alias-*` /
  `--dsw-specific-*` 一次性换掉。
- **新会话页整张横幅**：尖塔、吊桥与悬空的楼群，16px 圆角配暖金描边和很深的投影；
  输入区独立放在下方，两者不重叠。进对话页后横幅收起。
- **品牌标接管**：暖金芯 → 翡翠环 → 墨绿底的圆标，副标「Emerald Megacity」。
- **A right-hand status dock**: always present; see the table below.

## Palette rules

这套的用色是三样东西：**翡翠绿的城、暖金的灯、雾青的空气**。

| Colour | Value | Used for |
|---|---|---|
| 墨绿 | `#071512` / `#0b211c` / `#102c25` | 底与面板——绝大部分界面 |
| 翡翠 | `#2f7e66` | 主操作 |
| 玉青 | `#7db99f` | **正在跑**。深的按，浅的亮 |
| 暖金 | `#d9ad62` | 描边与强调。画里那片万家灯火 |
| 雾青 | `#b7c9c2` | 次要文字 |

🔴 **暖金不做实心块**：它是灯，一旦铺开，整座城的冷雾感就没了——所以只落在描边与强调上。

🔴 **次要文字用带绿的雾青，不用中性灰**：这座城的空气是绿的，中性灰会从画面里脱开。

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
| 上下文注入 | 每条注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。
窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏那几行写死的 ONLINE、几张模式卡与固定的能量值，以及封面右上角的状态角标，
**harness 都没有对应的投影**，一律不做。

装饰可以，假状态不行：一个永远不变的能量值，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。

**This draft gives no agent-copy specification either**, so not one line of host copy is replaced.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-emerald-megacity
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-emerald-megacity 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张巨城图（1672x941），比例与横幅接近，一刀不裁，cwebp q95 原生分辨率——万家灯火那些细碎暖点经不起压缩。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
