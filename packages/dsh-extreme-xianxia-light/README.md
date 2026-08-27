✔ dsh-extreme-xianxia-light/README.md
境

DeepSeek Harness（dsh）的皮肤：纸白雾白打底、墨灰做文字、淡金做边与按钮、玉青只给运行中，新会话页是一整幅天机在握主视觉

![New session page](preview/light.webp)

## What it changes

- **整套语义 token（浅色）**：底色纸白 `#f4f3f0`，往上是纯白面板与雾白分隔带，全场两条暖灰实线
  （`#d7d2c8` / `#c9c2b5`），文字墨灰 `#313331`——这套里**没有纯黑**。约 80 个
  `--dsw-alias-*` / `--dsw-specific-*` variables change at once, and every layer of the interface follows.
- **底色不是一块死板的纸白**：`body::before` 铺一团顶部的柔白软光，让"纸"有厚度。
- **新会话页整幅封面**：书法「天机在握 · 万象归一」、仗剑的道友与那条白龙。
  封面底边是一层**纸白渐变**（不是压暗），把画洇进界面的纸里。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚「天」字纸白印章，副标「灰白仙境」。
- **Personified copy**: thinking → "The acolyte is contemplating the workings of fate…"; failure → "The workings are disturbed — recalculate.";
  and a confirmation prompt is prefixed with "this carries consequences; a human decides" — **the original text stays**, since that is what you judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's theme rules state the ratio as a single figure, and it is this skin's hardest constraint:

> **80% 灰白 / 雾白基底；12% 墨灰层级；5% 淡金交互；2% 玉青运行态；1% 朱砂危险态**

| Colour | Value | Share | Used for |
|---|---|---|---|
| 纸白 / 雾白 | `#f4f3f0` / `#eceae5` / `#e3e0da` | 80% | 底、面板、输入框 |
| 墨灰 | `#313331` / `#676b68` / `#8f918d` | 12% | 文字与层级。**没有纯黑**——纯黑会把「雾」压成「影」 |
| 淡金 | `#b18a50` | 5% | 描边、主操作、品牌字。「5%」的意思是**边和字**，不是实心大按钮 |
| 玉青 | `#6d948d` / `#4f7871` | 2% | 只给**正在跑** |
| 朱砂 | `#b55a52` | 1% | 只给**危险与失败** |

🔴 **成功态也走玉青**：这套稿子的调色盘里根本没有绿，硬塞一个会同时破坏「2% 玉青」和「80% 灰白」
两条配比。宁可让成功与运行同色系（用深浅区分 `#4f7871` / `#6d948d`），也不引入第七种颜色。

🔴 **浅色皮肤多两条要写**：
- **反白块上的文字**（`label-primary-foreground`）不能留白：主按钮是淡金实底，白字对比度不够、
  黑字太硬，取纸白偏暖的一档 `#fdfcf9`。
- **toast / tooltip 反过来做成暗底**（`#3a3c39`）：浮在纸白上的浅色浮层分不出层次。

还有一句同样写死在稿子里：**仙侠氛围强，SaaS 可用性更强**；主视觉集中在 New Session 与空状态，
工作态不满屏铺图。所以封面只画在 hero，三栏布局与信息密度一处不动。

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
| 经卷查阅 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏「神通调用」那四行——天机推演阵 `已完成 2.1s`、经卷查阅·玉清篇 `运行中 8.4s`、
阵法模拟·九宫 `等待中`——是稿子里写死的演示数据；侧栏底部那条「灵力 68,250 / 108,000」
和顶栏的「天机可测，静待道友下令」同理。

**harness 没有对应的投影**。装饰可以，假状态不行：一条永远停在 68,250 的灵力槽，
disbelieved the second time it is seen, and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

原型 Agent copy 里的 `Tool → 正在调用神通……` 与 `Context → 正在翻阅经卷……` 也没做：
The harness's tool rows have only ok / error and no running to hang on, and forcing one would produce a permanently lit fake state.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-extreme-xianxia-light
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-extreme-xianxia-light 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面来自原型稿的整屏设计图，裁去了稿子的假侧栏、假详情栏与「召请天机」标题，只留画面（695x500 webp，内联成 data URI）。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
