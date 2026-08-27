✔ dsh-ultra-team-apocalypse/README.md
队 · 末日

DeepSeek Harness（dsh）的皮肤：焦黑暗红打底、火光橙做主操作、战斗红只给失败、能量青只给运行中，新会话页是一整幅末日小队主视觉

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底与面板是**烧焦的暗红黑**（`#120909` / `#1a1010`，不是中性黑），
  全场只有一条描边 `rgba(255,151,85,.16)`（带火光橙），正文米白偏暖 `#fff2e6`。
  约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **新会话页整幅横幅**：五个人站在燃烧的废墟里，15px 圆角配橙描边和大投影；
  输入区贴在卡片下沿，压幕在底部多压一段保证读得清。进入对话与轨迹页后横幅收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚能量核心徽标，副标「Ultra Team · Apocalypse」。
- **右侧状态台**：常驻一根，见下表。其中「能量核心」那颗球**跟着真实的上下文占用变色**
  （青 → 琥珀 → 红），没有数据时是灰的 idle，不假装 STABLE。

## Palette rules

🔴 **这套稿子没有 Theme rules 那一节**（不像同批的其它几套写死了配比），只给了一组 `:root` 变量。
所以配比是从它**实际怎么用**这些变量里读出来的：

| 色 | 值 | 读出来的职责 |
|---|---|---|
| 焦黑暗红 | `#120909` / `#1a1010` / `#251311` | 底与面板。**不是中性黑**——整套界面的八成是它 |
| 火光橙 | `#ff7b2c` | 主操作。原型 `.new` 是 `linear-gradient(135deg,#f0522d,#bb251f)` |
| 描边 | `rgba(255,151,85,.16)` | **全场只有这一条**，分层全靠它 |
| 战斗红 | `#ef3b2f` | 危险与失败 |
| 计时黄 | `#ffdc60` | 警告 |
| 能量青 | `#57d9ff` | **正在跑** |
| 恢复绿 | `#65dfa3` | 成功 |

🔴 **橙和红必须分开**：橙是「你要做的事」（主操作），红是「出事了」。
这套画面本身就是一片火，两个色再混在一起，界面会变成"哪里都在烧"，真出错时反而看不见。

🔴 **文字带烟熏的暖**：正文 `#fff2e6`、次要 `#b08f7b`，跟这片火光是同一套光。
放中性灰会像贴上去的——这是浅色/暖色皮肤最容易被忽略的一条。

🔴 **面板补第三级**：原型只给了两级（`--panel` / `--panel2`），harness 要三级。
第三级往上再抬一档而不是复用 panel2，否则弹层和选中态会分不出来。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 出击记录 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏的「Harness Systems」五行 `AI / MM / TL / CX / FS — ONLINE`、「Team Modes」两张模式卡
（Battle Mode / Strategy Mode）、「Energy Matrix — Matrix State: STABLE」，以及封面上的
「TEAM COVER ONLINE」「SYSTEM READY」，**harness 都没有对应的投影**。

装饰可以，假状态不行。其中「能量核心」那一块**改成了真的**：球的颜色跟着 `contextPressure`
投影走（青 → 琥珀 → 红），没有数据时是灰的 idle。一个永远显示 STABLE 的核心不如不做。

**这套稿子也没给 Agent copy 规范**（同批的其它几套都给了六条），所以宿主文案一句都不替换。
没有依据的人格化文案是自己加戏。

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-ultra-team-apocalypse
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-ultra-team-apocalypse 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1774x887），一刀不裁，cwebp q95 原生分辨率——硬边描线的赛璐璐风格缩一档线条就毛了。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
