# dsh-wukong-flame-mountain · 黑神话悟空 · 焚山版

DeepSeek Harness（dsh）的暗色皮肤：黑墨、古金与余烬橙，新会话页是一整幅焚山主视觉。

![新会话页](preview/dark.webp)

## 它改了什么

| 面 | 内容 |
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

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 神通调用 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 卷宗注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

原型稿右栏的 `Workspace context`（哪些文件被索引了）harness 没有对应投影，
`Keyboard` 是静态速查表——都不做，不拿假数据凑。

## 安装

**皮肤集市**（推荐）：在 dsh 的皮肤集市里搜「悟空」安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-wukong-flame-mountain
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-wukong-flame-mountain 加进 ~/.dsh/profiles/web/package.json 的 dependencies 与 dsh.profile.bundles
```

改完**必须重启 dsh**：profile 树要重新组装，不重启界面还是旧的。

## 🔴 autoApply 的副作用

装上默认就切到本皮肤（`autoApply`，默认 `true`）。原因是 harness **不持久化第三方主题 id**，
而且**内置的「设置 → 外观」只有 浅色 / 深色 / 跟随系统 三个格子**，第三方主题不在那里——
要手动切换得用皮肤集市自己的面板（**设置 → 皮肤市场**）。

代价：**每次刷新都会重新应用**，你切走只对当次有效。想永久换走把 `autoApply` 设成 `false`，
或者卸载本插件。实现上是启动后 8 秒的窗口（要盖过 Host 偏好快照的覆盖），窗口一过彻底松手。

## 做不到的

- **hero 的大标题文案**（原型是楷体「踏 火 前 行」）：harness 的空屏标题走内置 locale，
  第三方 `locale.register` 同名直接抛错，只给新增不给替换。硬用伪元素盖会连带盖住其它语言，
  所以保留宿主原文。
- 原型右栏那几张卡（Workspace context / Keyboard）：见上。

## 版本要求

需要 **dsh 0.1.1-rc.2 或更新**。品牌位的接管依赖 slot 的 `priority` 影子化；更老的版本上
这三处注册会抛错并被吞掉，**只是退回官方品牌标**，配色与主视觉照常工作。

## 素材

主视觉是一张 1672×941 的插画，压成 webp（q92，307 KB）内联进 bundle，不外链图床——
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
