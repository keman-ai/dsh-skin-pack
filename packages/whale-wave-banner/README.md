# dsh-whale-wave-banner · 鲸跃横幅

DeepSeek Harness（dsh）的浅色皮肤：DeepSeek 蓝 + 白 + 极浅灰蓝，新会话页是一张横幅封面，
输入区独立在封面下方。

![新会话页](preview/light.webp)

## 它改了什么

| 面 | 内容 |
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

原型右栏那五行「Harness Systems ONLINE」是纯装饰、`Theme Mode` 三行是写死的主题说明——
都不做，不拿假数据凑。

## 关于文案

**本皮肤不替换任何宿主文案。** 这份原型稿没有 Agent 文案规范，没有依据就自己加人格化台词是加戏。

## 安装

**皮肤集市**（推荐）：搜「鲸跃」安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-whale-wave-banner
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-whale-wave-banner 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

改完**必须重启 dsh**：profile 树要重新组装，不重启界面还是旧的。

## 🔴 autoApply 的副作用

装上默认就切到本皮肤（`autoApply`，默认 `true`）。原因是 harness **不持久化第三方主题 id**，
而且**内置的「设置 → 外观」只有 浅色 / 深色 / 跟随系统 三个格子**，第三方主题不在那里——
要手动切换得用皮肤集市自己的面板（**设置 → 皮肤市场**）。

代价：**每次刷新都会重新应用**，你切走只对当次有效。想永久换走把 `autoApply` 设成 `false`，
或者卸载本插件。

## 版本要求

需要 **dsh 0.1.1-rc.2 或更新**。品牌位的接管依赖 slot 的 `priority` 影子化；更老的版本上
这三处注册会抛错并被吞掉，**只是退回官方品牌标**，配色与横幅照常工作。

## 素材

横幅是一张 1983×793 的插画，压成 webp（q92）只有 **56 KB**——扁平色块比照片级插画好压得多。
原型稿把同一张图内嵌了三次（封面 / 品牌标 / 头像，md5 相同，单份 1.08 MB），这里只内联一份，
品牌标那处从中间裁方。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物。

## License

MIT © Science Roam Limited
