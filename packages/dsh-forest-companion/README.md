# dsh-forest-companion · 森林同行

DeepSeek Harness（dsh）的暗色皮肤：深森林绿 + 柔和米色 + 一点粉，新会话页是一整幅森林陪伴封面。

![New session](preview/dark.webp)

## What it changes

| Surface | Content |
|---|---|
| 配色 | 一整套 `--dsw-alias-*` / `--dsw-specific-*` 语义 token（暗色基座），描边全是带草绿的 1px 细线 |
| 新会话页 | 封面吃掉输入区以上的全部高度（16px 圆角、草绿描边、很深的投影），输入区独立在下方，左上角一枚身份角标 |
| 品牌位 | 侧栏与新会话页的标是纯 CSS 的**林间光斑**（米色芯 → 灰绿环 → 深林底 + 绿色辉光），站名副标 `Forest Companion Skin` |
| 右侧状态台 | 对话页常驻：缩小版封面 + 六类真实状态，可收起（记住选择） |

### 配色是原型自己定的三个词

原型稿在对话里写的是「深森林绿、柔和米色与**一点粉色人物呼应**」，handoff 里也写着
`theme = deep green / soft cream / warm pink`。三个词对应三种用量：

- **深森林绿**：底、面板、描边、主操作——绝大部分界面；
- **柔和米色 `#e9e0c5`**：只出现在能量条末端与品牌标的芯上，像穿过树冠的那束光；
- **一点粉 `#d96f95`**：原型全场只用了两处，而且都极淡——封面上那团 **5%** 的光晕，
  和「当前模式」卡的描边。**"一点"就是它的定义**，铺开就不再是呼应画里那个人物了。
  这里把它落在封面光晕（照抄那 5%）与危险操作的悬停上，另外错误色也往粉上靠
  （`#e07f9f`）——原型没给错误色，而粉是它唯一的暖冷对比色，这样既守住"不刺眼"，
  也不用凭空引入第五种颜色。

「正在运行」用的是青绿 `#4db9b0`，跟成功绿拉开一档——运行和成功不该看成同一件事。

### 版式跟着原型走

原型自己写了规则：「New Session **保留整张封面**，**输入区独立放在下方**；左右栏继续保留
完整 Harness 的会话、系统、模式与状态信息」，`#home` 也是 `column` + `.hero { flex: 1 }` +
下方独立的 `.composer`。所以封面不压输入区，上面除了左上角那枚身份角标外不放任何文案。

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

⚠️ **构成不是总量**：`contextBreakdown` 三项是固定密度估算，加起来**不等于** Token 负载。

## 刻意没做的四处

原型里这些都是**写死的装饰**，harness 没有对应投影，一律不做——装饰可以，假状态不行：

- 右栏「Harness Systems」五行 `ONLINE`
- 右栏「Companion Modes」四张模式卡
- 右栏「Forest Energy」那个 83% 与 100%
- 封面右上角那枚「☘ GROVE ONLINE」

**也不替换任何宿主文案**：这份原型没有 Agent 文案规范，没有依据就自己加台词是加戏。

## Install

**皮肤集市**（推荐）：搜「森林」安装，装完**重启 dsh**。

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-forest-companion
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-forest-companion 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

## 🔴 The side effect of autoApply

装上默认就切到本皮肤。harness **不持久化第三方主题 id**，且内置「设置 → 外观」只有
浅色 / 深色 / 跟随系统三个格子——手动切换要用皮肤集市自己的面板。代价是每次刷新都会重新应用，
你切走只对当次有效；想永久换走把 `autoApply` 设成 `false` 或卸载。

## Version requirements

需要 **dsh 0.1.1-rc.2 或更新**（品牌位接管依赖 slot 的 `priority` 影子化；更老的版本只是退回
官方品牌标，配色与横幅照常）。

## Assets

封面是一张 2048×1110 的插画，压成 webp（q92，140 KB）内联进 bundle，不外链图床。
生成方式与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` 要提交进仓库：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物。

## License

MIT © Science Roam Limited
