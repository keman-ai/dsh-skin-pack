✔ dsh-forest-adventure/README.md
游

DeepSeek Harness（dsh）的皮肤：森林深绿打底、苔藓绿做主操作、溪水青只给运行中、日光黄只做点缀，新会话页是一整幅林间主视觉

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色林绿 `#08150f`，三级面板往上是苔藓色，全场两条描边——草绿的
  `rgba(187,212,180,.14)` 与溪水青的 `rgba(94,183,199,.12)`，文字 `#eef1e8`。约 80 个
  `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **新会话页整幅封面**：木筏上的一大一小、吊桥、紫藤与溪水。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚林色方标，副标「Forest Adventure」。
- **人格化文案**：思考中 → 「正在穿过森林寻找答案……」；需要你确认时前缀一句
  「需要你的确认后才能继续」——**原文照旧留着**，那才是你做判断的依据。
- **A right-hand status dock**: always present; see the table below.

## Palette rules

原型稿的 Theme rules 写死了每种颜色的职责：

> 以**森林深绿**为底，**溪水青与苔藓绿**作为状态色，**日光黄只做温暖点缀**。

| Colour | Value | Used for |
|---|---|---|
| 森林深绿 | `#08150f` → `#1f3b2b` | 底与三级面板——绝大部分界面 |
| 苔藓绿 | `#6fa36d` / `#a7cb87` | 主操作 + **做完了** |
| 溪水青 | `#5eb7c7` | **正在跑** |
| 日光黄 | `#d7c77e` | 只做点缀。这里只有两个位置：警告态、上下文占用条的末端 |

🔴 **两个状态色分工必须拉开**：绿是"做完了"，青是"正在做"。做成同色系（比如都用绿、靠亮度区分）
会让人第一眼分不清任务是完成了还是还在跑——这是长期使用里最贵的一种误读。

🔴 **稿子里的紫一处不用**：`--flower: #9a7fbb`（画里那串紫藤）在原型全场只出现在装饰上，
没有任何语义。给它安一个语义等于替设计师瞎定规矩，所以整套 token 里一处都没有它。

还有一句同样写死在稿子里：**New Session 可以使用完整场景，Chat / Trajectory 回归安静的工作界面**。
所以封面只画在 hero，三栏布局与信息密度一处不动。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 林间足迹 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏那三个写死的 `Workspace files`（`forest-inspiration.md` 2.1 KB 之类）、
那张静态快捷键表、侧栏底部的「Credits 68,250 / 108,000」，以及封面右上角的
「Forest mode ready」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一条永远停在 68,250 的额度槽，第二次看见就没人信了，
and the real numbers beside it get doubted along with it. So the right column keeps only cards backed by real data.

hero 上那四颗建议 chip（`Explore this repository` / `Write a gentle story`…）也没做：
它们在稿子里是写死的文案，而 harness 的建议来自会话上下文，硬编一组只会给出永远一样的四句话。

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-forest-adventure
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-forest-adventure 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1536x1024），按 hero 的宽高比裁成 1423x1024，cwebp q95 保住叶子与水面的细纹，内联成 data URI。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
