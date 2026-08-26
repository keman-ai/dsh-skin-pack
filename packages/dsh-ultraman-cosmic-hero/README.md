# dsh-ultraman-cosmic-hero · 宇宙英雄

DeepSeek Harness（dsh）的暗色皮肤：深空蓝黑 + 彩色计时器三色，新会话页是一整幅宇宙英雄主视觉。

![新会话页](preview/dark.webp)

## 它改了什么

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

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Energy Core | 核心颜色与状态 | 由上面的占用推导，见上表 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 光线调用 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 上下文注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

原型右栏的「Harness Systems」那五行 ONLINE 与两张「Hero Modes」模式卡都是纯装饰，
harness 没有对应投影——不做，也不拿假数据凑。

## 安装

**皮肤集市**（推荐）：在皮肤集市里搜「宇宙英雄」安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-ultraman-cosmic-hero
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-ultraman-cosmic-hero 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

改完**必须重启 dsh**：profile 树要重新组装，不重启界面还是旧的。

## 🔴 autoApply 的副作用

装上默认就切到本皮肤（`autoApply`，默认 `true`）。原因是 harness **不持久化第三方主题 id**，
而且**内置的「设置 → 外观」只有 浅色 / 深色 / 跟随系统 三个格子**，第三方主题不在那里——
要手动切换得用皮肤集市自己的面板（**设置 → 皮肤市场**）。

代价：**每次刷新都会重新应用**，你切走只对当次有效。想永久换走把 `autoApply` 设成 `false`，
或者卸载本插件。实现上是启动后 8 秒的窗口（要盖过 Host 偏好快照的覆盖），窗口一过彻底松手。

## 关于文案

**本皮肤不替换任何宿主文案。** 这份原型稿只画了 New Session 一屏，没有 Agent 文案规范；
没有依据就自己加人格化台词是加戏。前面几套皮肤替换文案，是因为它们的设计稿里明确列了对照表。

## 版本要求

需要 **dsh 0.1.1-rc.2 或更新**。品牌位的接管依赖 slot 的 `priority` 影子化；更老的版本上
这三处注册会抛错并被吞掉，**只是退回官方品牌标**，配色与主视觉照常工作。

## 素材

主视觉是一张 2048×1150 的插画，压成 webp（q92，215 KB）内联进 bundle，不外链图床——
断网 / 内网也要能看。生成方式与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
