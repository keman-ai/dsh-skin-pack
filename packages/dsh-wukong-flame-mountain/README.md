# dsh-wukong-flame-mountain · 黑神话悟空 · 焚山版

DeepSeek Harness（dsh）的暗色皮肤：黑墨、古金与余烬橙，新会话页是一整幅焚山主视觉。

![New session](preview/dark.webp)

## What it changes

| Surface | Content |
|---|---|
| 配色 | 一整套 `--dsw-alias-*` / `--dsw-specific-*` 语义 token（暗色基座）+ 全局 170px 经纬细纹 |
| 新会话页 | 整幅焰发悟空横版主视觉 + 输入框贴底。**强角色视觉只出现在空屏**——进对话页就收起 |
| 品牌位 | 侧栏与新会话页的标换成「悟」字金印，站名副标 `黑神话悟空 · 焚山版` |
| 右侧状态台 | 对话页常驻：缩小版主视觉 + 六类真实状态，可收起（记住选择） |
| 身份化文案 | 思考中 →「正在思考……」、失败 →「执行失败，请重试。」 |

### 🔴 配比是设计稿写死的

> 72% 黑墨 / 14% 暗褐 Surface / 8% 古金 / 3% 青铜 / 2% 余烬橙 / 1% 危险红

这不是色卡，是**用量约束**，实现时逐条守住：

- **古金**只给主操作与品牌位，不铺面；
- **余烬橙**只给"正在运行"那一档语义（`state-business-*`）——它出现得越少，「在跑」这个信号越有效；
- 连 **`＋ 新建会话` 都不是金色实心**（原型里它是金字 + 金描边 + 暗底），真正的金色实心只属于发送；
- 身份化文案刻意克制：设计稿两处写明「避免过度仙侠化文案」「只接管视觉气质与少量身份化文案，
  交互 / 信息架构 / 权限逻辑继续遵循 DeepSeek Harness」。

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
| 卷宗注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

原型稿右栏的 `Workspace context`（哪些文件被索引了）harness 没有对应投影，
`Keyboard` 是静态速查表——都不做，不拿假数据凑。

## Install

**皮肤集市**（推荐）：在 dsh 的皮肤集市里搜「悟空」安装，装完**重启 dsh**。

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-wukong-flame-mountain
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-wukong-flame-mountain 加进 ~/.dsh/profiles/web/package.json 的 dependencies 与 dsh.profile.bundles
```

After changing it you **must restart dsh**: the profile tree has to be recomposed, and without a restart the UI stays as it was.

## 🔴 The side effect of autoApply

Installing switches to this skin by default (`autoApply`, default `true`). The reason is that the harness **does not persist third-party theme ids**,
and the **built-in Settings → Appearance has only three cells: light / dark / follow system**, with no third-party themes —
switching manually requires the skin market's own panel (**Settings → Skin Market**).

The cost: **it reapplies on every refresh**, so switching away lasts only for that session. To change permanently, set `autoApply` to `false`
or uninstall the plugin. It is implemented as an 8-second window after startup (long enough to outlast the Host preference snapshot), after which it lets go entirely.

## 做不到的

- **hero 的大标题文案**（原型是楷体「踏 火 前 行」）：harness 的空屏标题走内置 locale，
  第三方 `locale.register` 同名直接抛错，只给新增不给替换。硬用伪元素盖会连带盖住其它语言，
  所以保留宿主原文。
- 原型右栏那几张卡（Workspace context / Keyboard）：见上。

## Version requirements

Requires **dsh 0.1.1-rc.2 or newer**. The brand-slot takeover relies on slot `priority` shadowing; on older versions
these three registrations throw and are swallowed, **merely falling back to the official brand mark**, while the palette and hero keep working.

## Assets

主视觉是一张 1672×941 的插画，压成 webp（q92，307 KB）内联进 bundle，不外链图床——
from an image host — it has to work offline and on an intranet. How it is generated and its resolution ceiling are documented at the top of `src/client/cover.generated.ts`.

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
