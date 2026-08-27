# dsh-blue-whale-ocean · Blue Whale Ocean

DeepSeek Harness（dsh）的皮肤：深海蓝打底、透明青蓝做描边与状态、冰白只做高光，新会话页是一整幅鲸鱼海面横幅

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色深海蓝 `#051c33`，面板两级往上抬，全场一条带青蓝的暗描边
  `rgba(173,226,255,.15)`，文字 `#eef9ff`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉。
- **新会话页整张横幅**：从空中俯看的鲸鱼与它的尾迹，16px 圆角配青蓝描边和很深的投影；
  输入区独立放在下方，两者不重叠；封面左上角留一枚身份角标。进对话页后横幅收起。
- **品牌标接管**：冰白芯 → 青蓝环 → 深海底的圆标，副标「Blue Whale Ocean」。
- **A right-hand status dock**: always present; see the table below.

## Palette rules

原型稿自己在对话里把规则写清楚了：

> 已将整套主题统一成**深海蓝、透明青蓝与冰白高光**。

handoff 里写得更直接：`theme = deep ocean / cyan light / ice white`、`mode = deep ocean`。

| Colour | Value | Used for |
|---|---|---|
| 深海蓝 | `#051c33` / `#082845` / `#0d3559` | 底与面板——绝大部分界面 |
| 透明青蓝 | `#79dfff` | 描边、强调、**正在跑**。水面透下来的那层光 |
| 冰白 | `#d9f3ff` | **高光**。只给最需要被看见的一两处，铺开就不是高光了 |
| 中蓝 | `#3da7e4 → #2472b9` | 主操作。原型 `.new` 那条 135° 渐变 |

🔴 **青不做实心按钮**：它在这套里是「描边与状态」的语言，实心铺开会把海面的通透压没，
所以主操作让给中蓝渐变。

🔴 **警告与错误是推出来的**：原型只画了正常流程，没给这两个色。琥珀借冰白的方向推一个
偏冷的暖调，红压到低饱和——这套的性格是通透，不该出现刺眼的东西。

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

原型右栏的「Harness Systems」几行 ONLINE、几张模式卡、一个固定的能量值，
以及封面右上角的「◌ DEEP WATER ONLINE」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一个永远不变的能量值，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。

**This draft gives no agent-copy specification either**, so not one line of host copy is replaced.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-blue-whale-ocean
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-blue-whale-ocean 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张俯拍照片（1418x1179），横切成 1418x700 对齐横幅比例，cwebp q95 原生分辨率——水面细碎的高光点经不起缩图。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
