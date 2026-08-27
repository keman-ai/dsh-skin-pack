# dsh-ultraman-cosmic-hero · 宇宙英雄

DeepSeek Harness（dsh）的暗色皮肤：深空蓝黑 + 彩色计时器三色，新会话页是一整幅宇宙英雄主视觉。

![New session](preview/dark.webp)

## What it changes

| 面 | 内容 |
|---|---|
| 配色 | 一整套 `--dsw-alias-*` / `--dsw-specific-*` 语义 token（暗色基座），描边全部是带青色倾向的 1px 细线 |
| 新会话页 | 15px 圆角卡片 + 青描边 + 大投影里铺满主视觉，输入框贴在卡片下沿；进对话页自动收起 |
| 品牌位 | 侧栏与新会话页的标换成「青芯 / 深蓝环 / 红外壳」的计时器剖面徽标，站名副标 `Cosmic Hero Skin` |
| 右侧状态台 | 对话页常驻：缩小版主视觉 + 六类真实状态 + **会变色的能量核心**，可收起（记住选择） |

### 配色分工（从原型稿读出来的）

- **蓝**＝主操作，界面里唯一的实心大按钮（`＋ 新会话`）；
- **青**＝描边、图标、以及「正在运行」；
- **绿**＝就绪 / 成功；**琥珀**＝需要你确认的操作；
- **红是稀缺色**——原型里它只出现在徽标外圈上，所以这里只留给错误态，一出现就有分量。

### 能量核心是真的

原型稿右栏那颗 `Energy Core` 是装饰：固定颜色 + 写死的 `STABLE`。这里让它跟着**真实的上下文
占用**变色，用的正是彩色计时器的三色：

| 占用 | 核心 | 核心状态 |
|---|---|---|
| < 60% | 青 | `STABLE` |
| < 85% | 琥珀 | `CAUTION` |
| ≥ 85% | 红 | `CRITICAL` |
| 无数据 | 灰蓝 | `—`（不假装稳定） |

上方的占用条用同一套分档取**单色**，而不是照抄原型那条三色渐变——原型的条宽写死 72%，
渐变铺在上面刚好读成"青→琥珀→红"；而我们的条宽等于真实占用，占用 3% 时整条渐变会被压进 3%
的宽度里，三色挤成一小撮，看着像已经告急，与事实相反。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Energy Core | 核心颜色与状态 | 由上面的占用推导，见上表 |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 光线调用 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

原型右栏的「Harness Systems」那五行 ONLINE 与两张「Hero Modes」模式卡都是纯装饰，
harness 没有对应投影——不做，也不拿假数据凑。

## Install

**皮肤集市**（推荐）：在皮肤集市里搜「宇宙英雄」安装，装完**重启 dsh**。

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-ultraman-cosmic-hero
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-ultraman-cosmic-hero 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

After changing it you **must restart dsh**: the profile tree has to be recomposed, and without a restart the UI stays as it was.

## 🔴 The side effect of autoApply

Installing switches to this skin by default (`autoApply`, default `true`). The reason is that the harness **does not persist third-party theme ids**,
and the **built-in Settings → Appearance has only three cells: light / dark / follow system**, with no third-party themes —
switching manually requires the skin market's own panel (**Settings → Skin Market**).

The cost: **it reapplies on every refresh**, so switching away lasts only for that session. To change permanently, set `autoApply` to `false`
or uninstall the plugin. It is implemented as an 8-second window after startup (long enough to outlast the Host preference snapshot), after which it lets go entirely.

## 关于文案

**本皮肤不替换任何宿主文案。** 这份原型稿只画了 New Session 一屏，没有 Agent 文案规范；
没有依据就自己加人格化台词是加戏。前面几套皮肤替换文案，是因为它们的设计稿里明确列了对照表。

## Version requirements

需要 **dsh 0.1.1-rc.2 或更新**。品牌位的接管依赖 slot 的 `priority` 影子化；更老的版本上
这三处注册会抛错并被吞掉，**只是退回官方品牌标**，配色与主视觉照常工作。

## Assets

主视觉是一张 2048×1150 的插画，压成 webp（q92，215 KB）内联进 bundle，不外链图床——
断网 / 内网也要能看。生成方式与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
