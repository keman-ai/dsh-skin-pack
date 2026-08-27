✔ dsh-cyber-tao/README.md
观

DeepSeek Harness（dsh）的皮肤：黑曜石底、青铜描边、宣纸白文字，朱砂强调、玉石青状态，新会话页是一整幅山门主视觉

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色黑曜石 `#0a0d10`，面板 `#13181d`，全场一条 `rgba(228,207,168,.12)` 的暗金描边，
  文字宣纸白 `#efe7d7`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **一层符纸格纹**：`body::before` 铺 140px 的暗金网格，8% 不透明度、`mix-blend-mode: screen` —— 原型稿的材质层。
  弱到不干扰任何文字，`pointer-events: none` 保证不拦点击。
- **新会话页整幅封面**：道童、山门云海与那幅「参悟天机 · 道通万象」的书法。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚「道」字铜章，副标「赛博道观」。
- **人格化文案**：思考中 → 「道童正在参悟天机……」；失败 → 「天机紊乱，请重新推演。」；
  需要你确认时前缀一句「此事涉及因果，请真人裁决」——**原文照旧留着**，那才是你做判断的依据。
- **A right-hand status dock**: always present; see the table below.

## Palette rules

原型稿自己把规则写死成一句话：**黑曜石底色、青铜描边、宣纸白文字、朱砂强调、玉石青状态**。
五个词对应五种用量，越界就不是这套皮肤了：

| 色 | 值 | 用在哪 |
|---|---|---|
| 黑曜石 | `#0a0d10` / `#13181d` | 底与面板——绝大部分界面 |
| 青铜 | `rgba(228,207,168,.12)` | 描边。暗底上的分层全靠这条细线 |
| 宣纸白 | `#efe7d7` | 正文 |
| 朱砂 | `#b94235` | **强调**：会话列表里选中的那一项、危险操作的悬停。只给「就是它」的那一个 |
| 玉石青 | `#6e9788` | **状态**：正在跑。与成功绿拉开一档，运行和成功不会看成同一件事 |
| 赤金 | `#e0c58f → #c8a768` | 主操作按钮（原型 `.new-btn` 那条渐变） |

还有一句同样是原型稿写的：**道观气质要深，但产品可用性不能被吞掉**。
所以三栏布局、信息密度、按钮与卡片层级一处不动，只在氛围、用词、材质上「修仙化」。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 神通调用 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 经卷注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型稿右栏那条 `Goal · 72% · 5 / 7 checkpoints`、三个写死的 `Context files`
（`ui-theme/src/client/index.ts` 8.1 KB 之类）、以及封面上的「今日修行 · 76 心神值」，
**harness 都没有对应的投影**。

装饰可以，假状态不行：一个永远显示 76 的心神值，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以这些一律不做，右栏只留能对上真实数据的卡。

原型 Agent copy 里的 `Tool run → 正在调用神通……` 与 `Context → 正在翻阅经卷……` 也没做：
harness 的工具行只有 ok / error 两态，没有 running 可挂点，硬凑会做成一个永远亮着的假状态。

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-cyber-tao
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-cyber-tao 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面来自原型稿的整屏设计图，裁去了稿子里的假侧栏、假面板与标题按钮，只留画面（652x500 webp，内联成 data URI）。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
