# dsh-night-flight-companion · 夜航同行

DeepSeek Harness（dsh）的暗色皮肤：深夜蓝 + 月光青 + 一点暖米色，新会话页是一整幅夜空飞行横幅。

![New session](preview/dark.webp)

## What it changes

| 面 | 内容 |
|---|---|
| 配色 | 一整套 `--dsw-alias-*` / `--dsw-specific-*` 语义 token（暗色基座），描边全是带月光青的 1px 细线 |
| 新会话页 | 横幅吃掉输入区以上的全部高度（16px 圆角、月光青描边、很深的投影），输入区独立在下方，左上角一枚身份角标 |
| 品牌位 | 侧栏与新会话页的标是纯 CSS 的**月环**（亮月芯 → 蓝环 → 夜色底 + 青色辉光），站名副标 `Night Flight Companion` |
| 右侧状态台 | 对话页常驻：缩小版横幅 + 六类真实状态，可收起（记住选择） |

### 只有一个暖色

整套皮肤压在深夜蓝与月光青上，唯一的暖色是**月光米色 `#ded0ae`**。原型只把它用在能量条渐变的
末端（`linear-gradient(90deg,#5f88da,#7bd8ff,#ded0ae)`），像画里那盏被夜色包住的灯——所以这里
也只给它一个位置：**上下文占用条的末端**。铺开就不再是"一点暖"了。

红也压过：这套最不该出现的就是刺眼的东西，错误色取的是低饱和的 `#e5798a`。

### 版式跟着原型走

原型自己在对话里写了规则：「New Session 使用**整张横幅作为主视觉**，**输入区独立放在下方**，
并保留完整 Harness 工作区」，`#home` 也是 `column` + `.hero { flex: 1 }` + 下方独立的 `.composer`。
所以横幅不压输入区，封面上除了左上角那枚身份角标外不放任何文案。

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 航段记录 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| Context injections | The source and form of each injection | Trajectory `context` nodes (`provenance.label` / `form`) |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **构成不是总量**：`contextBreakdown` 三项是固定密度估算，加起来**不等于** Token 负载。

## 刻意没做的四处

原型里这些都是**写死的装饰**，harness 没有对应投影，一律不做——装饰可以，假状态不行：

- 右栏「Harness Systems」四行 `ONLINE`
- 右栏「Flight Modes」四张模式卡
- 右栏「Moonlight Energy」那个 85% 与 100%
- 封面右上角那枚「☾ MOONLIGHT ONLINE」

**也不替换任何宿主文案**：这份原型没有 Agent 文案规范，没有依据就自己加台词是加戏。

## 一个实现上的细节

状态台那张缩略图按 **`background-position: left center`** 裁，不居中——横幅的主体（飞行中的
一大两小 + 那把伞）在画面**左三分之一**，右边是大片月光河谷，居中裁只会得到一片夜色。

## Install

**皮肤集市**（推荐）：搜「夜航」安装，装完**重启 dsh**。

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-night-flight-companion
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-night-flight-companion 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

## 🔴 The side effect of autoApply

装上默认就切到本皮肤。harness **不持久化第三方主题 id**，且内置「设置 → 外观」只有
浅色 / 深色 / 跟随系统三个格子——手动切换要用皮肤集市自己的面板。代价是每次刷新都会重新应用，
你切走只对当次有效；想永久换走把 `autoApply` 设成 `false` 或卸载。

## Version requirements

需要 **dsh 0.1.1-rc.2 或更新**（品牌位接管依赖 slot 的 `priority` 影子化；更老的版本只是退回
官方品牌标，配色与横幅照常）。

## Assets

横幅是一张 1672×941 的插画，压成 webp（q92，231 KB）内联进 bundle，不外链图床。
生成方式与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` 要提交进仓库：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物。

## License

MIT © Science Roam Limited
