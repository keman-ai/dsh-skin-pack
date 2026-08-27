# dsh-cosmic-opera · 宇宙歌剧

DeepSeek Harness（dsh）的皮肤：深蓝太空底 + 紫/蓝/青三档强调，新会话页是一整幅旋涡星系封面

![New session](preview/dark.webp)

## What it changes

| Surface | Content |
|---|---|
| 配色 | 深蓝太空底（#050814）+ 三级蓝黑面板；描边分两路——大面积分层用冷蓝、强调边用星云紫 |
| 全局 | 一层 14% 的星点。没有它，界面只是一片深蓝 |
| 新会话页 | 一整幅全屏旋涡星系封面：两团星云光晕 + 左右压幕 + 自下而上的暗幕，输入框贴底压在画面上 |
| 品牌位 | 侧栏与新会话页的标换成任务徽标（深蓝渐变方块 + 冷蓝描边 + 等宽代号 `DH`），副标 `Cosmic Opera` |
| 身份化文案 | 思考中 → `Charting the unknown…`、失败 → `Navigation anomaly detected.` |
| 右侧状态台 | 对话页常驻：缩小版封面 + 六类真实状态，可收起（记住选择） |

### 史诗感全押在封面上，界面反而克制

原型稿 Theme rules 的原话：「这是偏**宇宙歌剧 / 史诗感**的方案：视觉重心放在旋涡星系、行星弧面、
深空光芒和探索叙事；但 **New Mission 之外的界面密度仍然保持真实 Harness 产品结构**。」

所以强调只有三档，各有各的位置：

- **紫**（#8e73ff）= 主操作实心，`＋ 新会话` 则是深蓝渐变 + 冷蓝描边；
- **蓝**（#79c2ff）= 描边与数据；
- **青绿**（#75d4cb）= 正在运行。原型把它放在遥测数值上，这里落到运行态，
  好让"在跑"跟蓝色的数据、紫色的主操作三者都分得开；
- 暖色 #ffb775 **只给需要你注意的状态**，不参与任何常规按钮。

封面只画在 hero，对话页与轨迹页一点不铺。

### 🔴 封面是从 UI 概念稿里裁出来的

原型给的那张"封面"**本身是一整套 UI 概念稿的截图**（1536×1024，里面有假侧栏、假任务面板、
还有印在画上的 "New Mission" 标题）。直接拿它当 hero 背景会出现**界面里套界面**——实测截图
就是两层 UI 叠在一起。

所以这里裁掉稿子的外壳，只留画面：

```bash
cwebp -q 92 -crop 665 0 600 700 cover.png -o cover.webp
```

第一版从 x=600 起裁，左边缘还留着那行 "UNDERSTAND." 的尾巴，往右再挪 65px 才干净。

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
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏那四张卡里只有 `Mission` 能对上真实数据，其余全是写死的装饰，harness 没有对应投影，
一律不做——**装饰可以，假状态不行**：

- 「Systems」六行 `ONLINE` / `ACTIVE`
- 「Next Waypoint」的 `ETA 02:14:36`
- 「Shortcuts」那张静态快捷键速查表
- 顶栏那三格 Universe Time / Coordinates / Signal Status

Agent copy 六条里也只做了能找到锚点的两条：`Tool / Context / Success` 在 harness 里没有可挂的
中间态（工具行只有 ok / error 两态，没有 running），不硬凑。

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-cosmic-opera
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-cosmic-opera 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面裁自原型那张 1536×1110 的 UI 概念稿（只取画面区域），压成 webp（q92，93 KB）内联进 bundle。裁法与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
