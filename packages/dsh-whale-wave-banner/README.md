# dsh-whale-wave-banner · 鲸跃横幅

DeepSeek Harness（dsh）的浅色皮肤：DeepSeek 蓝 + 白 + 极浅灰蓝，新会话页是一张横幅封面，
输入区独立在封面下方。

![新会话页](preview/light.webp)

## What it changes

| Surface | Content |
|---|---|
| 配色 | 一整套 `--dsw-alias-*` / `--dsw-specific-*` 语义 token（浅色基座），描边全是带蓝的 1px 淡线 |
| 新会话页 | **横幅只占上半屏**，20px 圆角卡片；输入区独立在下方，两者不重叠，封面上不叠任何文案 |
| 品牌位 | 侧栏与新会话页的标就是横幅裁方（复用同一张内联图），站名副标 `Whale Wave Theme` |
| 右侧状态台 | 对话页常驻：缩小版横幅 + 六类真实状态，可收起（记住选择） |

### 🔴 这套跟其它几套的做法相反

原型稿 Appearance 面板里的实现建议，第 1、2 条是全部要害：

> 1. New Session 顶部直接使用这张横幅图，**不在封面里叠加任何大段说明文案**。
> 2. **输入区独立放在封面下方**，避免破坏主视觉。

它的 handoff 里也写着 `hero.copy = none` / `composer = below cover`。所以别的皮肤把输入框
贴底压在整幅图上，这套**不能**那么做——横幅吃掉输入区以上的全部高度，输入区在它下面。

（实现细节：一开始按原图比例 `aspect-ratio: 2.5/1` 画，结果封面比可用空间矮，中间空出一大条，
看着像没加载完。原型的 `.home` 是 `grid-template-rows: minmax(0,1fr) auto`——封面吃掉全部剩余
高度、图用 `object-fit: cover` 裁掉多余。改成填满 + `background-size: cover` 才对上。）

第 4 条同样是硬约束：**色彩控制在 DeepSeek 蓝 + 白 + 极浅灰蓝**。所以这套皮肤里几乎没有第五种
颜色：绿只在「在线 / 成功」出现，连「正在运行」都用品牌蓝的亮一档，而不是另起一个强调色。

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

原型右栏那五行「Harness Systems ONLINE」是纯装饰、`Theme Mode` 三行是写死的主题说明——
都不做，不拿假数据凑。

## About the copy

**本皮肤不替换任何宿主文案。** 这份原型稿没有 Agent 文案规范，没有依据就自己加人格化台词是加戏。

## Install

**皮肤集市**（推荐）：搜「鲸跃」安装，装完**重启 dsh**。

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-whale-wave-banner
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-whale-wave-banner 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

After changing it you **must restart dsh**: the profile tree has to be recomposed, and without a restart the UI stays as it was.

## 🔴 The side effect of autoApply

Installing switches to this skin by default (`autoApply`, default `true`). The reason is that the harness **does not persist third-party theme ids**,
and the **built-in Settings → Appearance has only three cells: light / dark / follow system**, with no third-party themes —
switching manually requires the skin market's own panel (**Settings → Skin Market**).

The cost: **it reapplies on every refresh**, so switching away lasts only for that session. To change permanently, set `autoApply` to `false`
或者卸载本插件。

## Version requirements

Requires **dsh 0.1.1-rc.2 or newer**. The brand-slot takeover relies on slot `priority` shadowing; on older versions
这三处注册会抛错并被吞掉，**只是退回官方品牌标**，配色与横幅照常工作。

## Assets

横幅是一张 1983×793 的插画，压成 webp（q92）只有 **56 KB**——扁平色块比照片级插画好压得多。
原型稿把同一张图内嵌了三次（封面 / 品牌标 / 头像，md5 相同，单份 1.08 MB），这里只内联一份，
品牌标那处从中间裁方。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物。

## License

MIT © Science Roam Limited
