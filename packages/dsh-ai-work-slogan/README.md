# dsh-ai-work-slogan · AI 工作模式

DeepSeek Harness（dsh）的暗色皮肤：深海蓝渐变 + 毛玻璃面板 + 白色主操作，空屏是一句口号。

![新会话页](preview/dark.webp)

## 它改了什么

| 面 | 内容 |
|---|---|
| 底 | **一整片竖向渐变**（#071936 → #0a2a60 → #2f79ef）+ 顶部一团蓝光——越往下越亮，跟常规暗色主题相反 |
| 面板 | 侧栏、状态台、卡片全是半透明玻璃（白 6%–10% + 14px 背景模糊），描边是白色半透明细线 |
| 主操作 | **白底深蓝字**。在这片蓝上，白是唯一比蓝更强的东西 |
| 空屏 | 宿主标题换成口号「工作你不干，有的是 AI 干」+ 一行说明；品牌位是白色圆角方块 + DeepSeek 鲸鱼标 |
| 右侧状态台 | 对话页常驻：品牌行 + 六类真实状态，可收起（记住选择） |

**这套皮肤没有一张插画**（除了 5 KB 的鲸鱼标）：视觉全靠渐变、玻璃与字。整包 51 KB，
是所有皮肤里最小的。

### 🔴 渐变铺在哪一层，是量出来的

第一版铺在根容器上，界面却是一片平的深蓝。探针一路量下来才看到有**两层**不透明底色盖在上面：

1. `_frame`——铺满视口、画着 `bg-base`。渐变改画在它身上（`background-image` 天然盖过
   `background-color`）。
2. `[data-phase]`（ConversationRoot）——1320×950 又盖一层。把它设成透明，渐变才真的透出来。

还有一处：输入区的淡出遮罩必须**限定在 `[data-phase='active']`**。前几套皮肤的 hero 铺着整张图，
这层遮罩看不出来；这套 hero 底下是通透的渐变，一旦全阶段生效，就会在渐变中间切出一条笔直的暗带。

### 口号是怎么来的

harness 不允许第三方覆盖内置文案（`locale.register` 同名直接抛错，只给新增不给替换），所以走
伪元素：把宿主标题 `font-size: 0` 收起来，用 `::after` 显示口号，下方那行说明补在标题的空容器里。

⚠️ **代价：切到英文界面也会看到这句中文。** 这本来就是一套中文口号皮肤，介意的话可以只用它的配色。
锚点是 CSS Module 哈希类名，属于降级区：宿主改版后口号会退回原文，不报错。

⚠️ 原型 hero 底部那四张能力卡（深度调研 / 定时任务 / 文档生产 / 电脑协作）**没有做**——
在真实产品里那块位置属于输入框和工作区选择器，塞四张静态卡会把主操作挤下去，而且它们不表达
任何运行时状态。

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 工具调用 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 上下文注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项是固定密度估算，加起来**不等于** Token 负载。

原型右栏的「Harness Systems」五行 ONLINE 与「Work Modes」四张模式卡都是装饰，没有对应投影，不做。

## 安装

**皮肤集市**（推荐）：搜「AI 工作模式」安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-ai-work-slogan
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-ai-work-slogan 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

## 🔴 autoApply 的副作用

装上默认就切到本皮肤。harness **不持久化第三方主题 id**，且内置「设置 → 外观」只有
浅色 / 深色 / 跟随系统三个格子——手动切换要用皮肤集市自己的面板。代价是每次刷新都会重新应用，
你切走只对当次有效；想永久换走把 `autoApply` 设成 `false` 或卸载。

## 版本要求

需要 **dsh 0.1.1-rc.2 或更新**（品牌位接管依赖 slot 的 `priority` 影子化；更老的版本只是退回
官方品牌标，配色照常）。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` 要提交进仓库：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物。

## License

MIT © Science Roam Limited
