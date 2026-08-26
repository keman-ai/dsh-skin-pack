# dsh-cosmic-opera · 宇宙歌剧

DeepSeek Harness（dsh）的皮肤：深蓝太空底 + 紫/蓝/青三档强调，新会话页是一整幅旋涡星系封面

![新会话页](preview/dark.webp)

## 它改了什么

| 面 | 内容 |
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

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏那四张卡里只有 `Mission` 能对上真实数据，其余全是写死的装饰，harness 没有对应投影，
一律不做——**装饰可以，假状态不行**：

- 「Systems」六行 `ONLINE` / `ACTIVE`
- 「Next Waypoint」的 `ETA 02:14:36`
- 「Shortcuts」那张静态快捷键速查表
- 顶栏那三格 Universe Time / Coordinates / Signal Status

Agent copy 六条里也只做了能找到锚点的两条：`Tool / Context / Success` 在 harness 里没有可挂的
中间态（工具行只有 ok / error 两态，没有 running），不硬凑。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-cosmic-opera
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-cosmic-opera 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

改完**必须重启 dsh**：profile 树要重新组装，不重启界面还是旧的。

## 🔴 autoApply 的副作用

装上默认就切到本皮肤（`autoApply`，默认 `true`）。原因是 harness **不持久化第三方主题 id**，
而且**内置的「设置 → 外观」只有 浅色 / 深色 / 跟随系统 三个格子**，第三方主题不在那里——
要手动切换得用皮肤集市自己的面板（**设置 → 皮肤市场**）。

代价：**每次刷新都会重新应用**，你切走只对当次有效。想永久换走把 `autoApply` 设成 `false`，
或者卸载本插件。实现上是启动后 8 秒的窗口（要盖过 Host 偏好快照的覆盖），窗口一过彻底松手。

## 版本要求

需要 **dsh 0.1.1-rc.2 或更新**。品牌位的接管依赖 slot 的 `priority` 影子化（同一 priority 才算
占用冲突，不同 priority 是影子化、数字小的渲染）；更老的版本上这三处注册会抛错并被吞掉，
**只是退回官方品牌标**，配色与封面照常工作。

## 素材

封面裁自原型那张 1536×1110 的 UI 概念稿（只取画面区域），压成 webp（q92，93 KB）内联进 bundle。裁法与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
