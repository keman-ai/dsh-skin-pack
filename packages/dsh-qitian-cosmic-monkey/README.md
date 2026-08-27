✔ dsh-qitian-cosmic-monkey/README.md
海

DeepSeek Harness（dsh）的皮肤：深夜宇宙蓝打底、余烬金做边与主操作、星辉蓝只给运行中，新会话页是一整幅大圣星海主视觉

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色宇宙蓝 `#070b13`，三级面板往上是蓝黑，全场一条带余烬金的暗描边
  `rgba(240,188,112,.14)`，文字用带暖调的 `#efe9dc`。约 80 个 `--dsw-alias-*` /
  `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **新会话页整幅横幅**：大圣、星海与云海日出，14px 圆角配金描边和深投影；
  输入区独立放在下方，两者不重叠。进入对话与轨迹页后横幅收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚金环标，副标「齐天星海」。
- **人格化文案**：思考中 → 「大圣正在观照星海……」；失败 → 「星轨偏移，请重新推演。」；
  需要你确认时前缀一句「此行或涉天机，请真人定夺」——**原文照旧留着**，那才是你做判断的依据。
- **A right-hand status dock**: always present; see the table below.

## Palette rules

原型稿的 Theme rules 把配比写成了一句数字，这是这套皮肤最硬的约束：

> **64% 深夜宇宙蓝 / 16% 蓝黑 Surface / 9% 日落余烬金 / 6% 星辉蓝 / 4% 雾灰文字 / 1% 危险态红**

| 色 | 值 | 占比 | 用在哪 |
|---|---|---|---|
| 深夜宇宙蓝 | `#070b13` / `#0a1020` | 64% | 底 |
| 蓝黑 Surface | `#0c1424` → `#16213a` | 16% | 面板、气泡、输入框 |
| 日落余烬金 | `#d39a52` / `#f1bc70` | 9% | 描边、主操作、品牌字。画里那道日出的光 |
| 星辉蓝 | `#315fae` / `#6e94e9` | 6% | 只给**正在跑**。它是「星海」那一半 |
| 雾灰 | `#c6bcaa` / `#847e73` | 4% | 次要文字 |
| 红 | `#ca5a49` | 1% | 只给危险与失败 |

🔴 **雾灰是暖调，不是中性灰**：`#c6bcaa` 偏黄。纯灰（`#8a8a8a` 那一类）放进这套暖金里会显脏，
第一眼说不出哪里不对，但整个界面会"掉色"。

🔴 **成功态走余烬橙而不是绿**：这套调色盘里根本没有绿，硬塞一个会同时破坏「9% 金」和
「64% 宇宙蓝」两条配比。用 `#e0a06a` 与主操作金拉开亮度和色相。

🔴 **稿子里的紫一处不用**：`--purple: #765799`（星云那一片）在原型全场只出现在装饰渐变上，
没有任何语义。给它安一个语义等于替设计师瞎定规矩。

还有一句同样写死在稿子里：**New Session 承担宏大叙事和角色世界观；进入工作状态后压低视觉噪声，
保持真正的开发工具可读性**。所以横幅只画在 hero，三栏布局与信息密度一处不动。

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
| 天书注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏「神通调用」那四行——星海推演术 `已完成 2.3s`、火眼金睛检索 `已完成 3.1s`、
筋斗云任务拆解 `运行中 7.9s`、斗战复杂度评估 `等待中`——是稿子里写死的演示数据；
侧栏底部那条「战意 85,200 / 120,000」、顶栏的「星海浩渺，静候圣心一念」
与封面右上角的「星海之门已开启」同理。

**harness 没有对应的投影**。装饰可以，假状态不行：一条永远停在 85,200 的战意槽，
第二次看见就没人信了，而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

原型 Agent copy 里的 `Tool → 正在施展神通……` 与 `Context → 正在翻阅天书……` 也没做：
harness 的工具行只有 ok / error 两态，没有 running 可挂点，硬凑会做成一个永远亮着的假状态。

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-qitian-cosmic-monkey
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-qitian-cosmic-monkey 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1672x941），一刀不裁，cwebp q95 原生分辨率——星云的噪点与云海的层次经不起缩图。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
