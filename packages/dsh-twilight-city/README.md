# dsh-twilight-city · Twilight City

DeepSeek Harness（dsh）的皮肤：深蓝夜空打底、晚霞橙紫粉做氛围、暖黄只点亮按钮、天空蓝只给运行中，新会话页是一整幅黄昏城市主视觉

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色夜空蓝 `#0a1020`，三级面板往上是城市蓝，全场两条描边——
  中性的 `rgba(255,255,255,.08)` 与晚霞橙的 `rgba(255,138,76,.14)`，文字 `#eef1f7`。
  约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **天光**：`body::before` 铺原型那两条 radial——左上一团暖黄、右上一团天空蓝，
  一边暖一边冷，正好是黄昏那一刻天空的样子。`pointer-events: none` 保证不拦点击。
- **新会话页整幅封面**：台阶上的两个人、远处的万家灯火与那道流星。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚「暮」字方标，副标「Twilight City」。
- **人格化文案**：思考中 → 「正在穿过黄昏寻找答案……」；需要你确认时前缀一句
  "this cannot continue without your confirmation" — **the original text stays**, since that is what you actually judge by.
- **A right-hand status dock**: always present; see the table below.

## Palette rules

The prototype's Theme rules fix each colour's job:

> 以**深蓝夜空**为底，**晚霞橙和紫粉云层**作为情绪重点，**暖黄色只负责点亮窗口与按钮**。

| Colour | Value | Used for |
|---|---|---|
| 深蓝夜空 | `#0a1020` → `#202d47` | 底与三级面板——绝大部分界面 |
| 晚霞橙 | `#ff8a4c` | 情绪重点：暖描边、强调、hover、警告 |
| 云层紫 / 粉 | `#8459d9` / `#c96594` | 情绪重点。粉落在「需要你多看一眼的那一个」——危险操作的悬停 |
| 暖黄 | `#f1b56f` | 只点亮**窗口与按钮**：主操作、选中项 |
| 天空蓝 | `#69a9ff` / `#5b7be4` | **正在跑** |

🔴 **「情绪重点」不等于「状态色」**。橙紫粉负责氛围，不负责告诉你任务成没成——
把 hover 的那点暖和「跑完了」用同一个颜色，界面会一直在说话但什么都没说清。

🔴 **「正在跑」为什么是天空蓝**：它是稿子调色盘里唯一一个**既在盘上、又没被分配情绪职责**的
颜色，正好留给状态。而且冷色跟这一整片暖调拉得开，一眼能认出来。

🔴 **成功态取一档低饱和青绿 `#7fc9a8`**：盘里没有绿，但「成功」必须跟「正在跑」（天空蓝）
和「主操作」（暖黄）都区分得开。这是这一整片暖调里最不吵的选择。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 工具轨迹 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏那三个写死的 `Workspace files`（`twilight-cover.png` 2.4 MB 之类）、
那张静态快捷键表、侧栏底部的「Credits 72,300 / 108,000」，以及封面右上角的
「Twilight mode ready」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一条永远停在 72,300 的额度槽，第二次看见就没人信了，
and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

**Error 与 Success 两条人格化文案也没做**：这套稿子的 Agent copy 只给了 Thinking 与 Permission
两条，没有失败与成功的规范。缺的不自己编——没有依据的人格化文案是自己加戏。

hero 上那四颗建议 chip（`Explore this repository` / `Write a reflective story`…）同理：
they are hardcoded copy in the draft, whereas the harness's suggestions come from session context, and hardcoding a set would only ever produce the same four lines.

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-twilight-city
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-twilight-city 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（2048x1137），按 hero 的宽高比裁成 1580x1137，cwebp q95 原生分辨率——晚霞的渐变与万家灯火的碎点经不起缩图。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
