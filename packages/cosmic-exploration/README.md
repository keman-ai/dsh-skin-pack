# dsh-cosmic-exploration · 宇宙探索

DeepSeek Harness（dsh）的皮肤：深蓝太空底 + 冷蓝与星云紫，新会话页是一整幅宇宙探索封面

![新会话页](preview/dark.webp)

## 它改了什么

| 面 | 内容 |
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

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| SHIP SYSTEMS | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| CONTEXT FEED | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| COMPACTED | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏那四张卡里，只有 `Current Mission` 能对上真实数据，其余全是写死的装饰，
harness 没有对应投影，一律不做——**装饰可以，假状态不行**：

- 「Ship Systems」五行 `ONLINE` / `SYNCED` / `STANDBY`
- 「Telemetry」里的 Signal 97.2%、Route score 82
- 「Shortcuts」那张静态快捷键速查表
- hero 左侧那四格任务参数（Mission / Sector / Signal Strength / Jump Window）

Agent copy 六条里也只做了能找到锚点的两条：`Tool / Context / Success` 在 harness 里没有可挂的
中间态（工具行只有 ok / error 两态，没有 running），不硬凑。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-cosmic-exploration
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-cosmic-exploration 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是一张 1672×941 的插画，压成 webp（q92，222 KB）内联进 bundle，不外链图床——断网 / 内网也要能看。生成方式与分辨率上限写在 `src/client/cover.generated.ts` 的头部注释里。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
