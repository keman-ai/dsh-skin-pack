# dsh-cosmic-exploration · 宇宙探索

DeepSeek Harness（dsh）的皮肤：深蓝太空底 + 冷蓝与星云紫，新会话页是一整幅宇宙探索封面

![New session](preview/dark.webp)

## What it changes

| Surface | Content |
|---|---|
| 配色 | 深蓝太空底（#050814）+ 三级蓝黑面板；描边分两路——大面积分层用冷蓝、强调边用星云紫 |
| 全局 | 一层 14% 的星点（原型 `body:before` 的四颗散点）。没有它，界面只是一片深蓝 |
| 新会话页 | 一整幅全屏封面：两团星云光晕 + 左右压幕 + 自下而上的暗幕，输入框贴底压在画面上 |
| 品牌位 | 侧栏与新会话页的标换成任务徽标（深蓝渐变方块 + 冷蓝描边 + 等宽代号 `CX`），副标 `Cosmic Exploration` |
| 身份化文案 | 思考中 → `Charting the unknown…`、失败 → `Navigation anomaly detected.` |
| 右侧状态台 | 对话页常驻：缩小版封面 + 六类真实状态，可收起（记住选择） |

### 🔴 暖色只给状态，不给按钮

原型稿 Appearance 面板的 Theme rules 写死了：「以深蓝太空为主底，冷蓝与紫色星云做视觉高潮，
**少量暖色只用于重要状态与任务按钮**。New Mission 使用全屏宇宙探索封面，Console / Trajectory
回归低干扰、真实可用的 Harness 产品界面。」

落到实现上：

- **主操作是星云紫实心**（原型 hero 上那颗 `START EXPLORATION →` 就是紫渐变），
  `＋ 新会话` 则是深蓝渐变 + 冷蓝描边——强调色一旦铺开，就不再是"最重要的那一下"；
- **暖色（#ffb772 / #f0b46d）只留给需要你注意的状态**，不参与任何常规按钮；
- **「正在运行」用 Glow 冷蓝 `#61d0ff`**：它在这片深蓝里最亮，又不跟紫的主操作抢；
- 封面只画在 hero，对话页与轨迹页一点不铺——原型要求那两页"低干扰、真实可用"。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| SHIP SYSTEMS | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| CONTEXT FEED | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| COMPACTED | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏那四张卡里，只有 `Current Mission` 能对上真实数据，其余全是写死的装饰，
harness 没有对应投影，一律不做——**装饰可以，假状态不行**：

- 「Ship Systems」五行 `ONLINE` / `SYNCED` / `STANDBY`
- 「Telemetry」里的 Signal 97.2%、Route score 82
- 「Shortcuts」那张静态快捷键速查表
- hero 左侧那四格任务参数（Mission / Sector / Signal Strength / Jump Window）

Agent copy 六条里也只做了能找到锚点的两条：`Tool / Context / Success` 在 harness 里没有可挂的
中间态（工具行只有 ok / error 两态，没有 running），不硬凑。

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-cosmic-exploration
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-cosmic-exploration 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是一张 1672×941 的插画，压成 webp（q92，222 KB）内联进 bundle，不外链图床——断网 / 内网也要能看。生成方式与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
