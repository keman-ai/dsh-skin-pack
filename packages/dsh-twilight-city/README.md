✔ dsh-twilight-city/README.md
市

DeepSeek Harness（dsh）的皮肤：深蓝夜空打底、晚霞橙紫粉做氛围、暖黄只点亮按钮、天空蓝只给运行中，新会话页是一整幅黄昏城市主视觉

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色夜空蓝 `#0a1020`，三级面板往上是城市蓝，全场两条描边——
  中性的 `rgba(255,255,255,.08)` 与晚霞橙的 `rgba(255,138,76,.14)`，文字 `#eef1f7`。
  约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **天光**：`body::before` 铺原型那两条 radial——左上一团暖黄、右上一团天空蓝，
  一边暖一边冷，正好是黄昏那一刻天空的样子。`pointer-events: none` 保证不拦点击。
- **新会话页整幅封面**：台阶上的两个人、远处的万家灯火与那道流星。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚「暮」字方标，副标「Twilight City」。
- **人格化文案**：思考中 → 「正在穿过黄昏寻找答案……」；需要你确认时前缀一句
  「需要你的确认后才能继续」——**原文照旧留着**，那才是你做判断的依据。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿的 Theme rules 写死了每种颜色的职责：

> 以**深蓝夜空**为底，**晚霞橙和紫粉云层**作为情绪重点，**暖黄色只负责点亮窗口与按钮**。

| 色 | 值 | 用在哪 |
|---|---|---|
| 深蓝夜空 | `#0a1020` → `#202d47` | 底与三级面板——绝大部分界面 |
| 晚霞橙 | `#ff8a4c` | 情绪重点：暖描边、强调、hover、警告 |
| 云层紫 / 粉 | `#8459d9` / `#c96594` | 情绪重点。粉落在「需要你多看一眼的那一个」——危险操作的悬停 |
| 暖黄 | `#f1b56f` | 只点亮**窗口与按钮**：主操作、选中项 |
| 天空蓝 | `#69a9ff` / `#5b7be4` | **正在跑** |

🔴 **「情绪重点」不等于「状态色」**。橙紫粉负责氛围，不负责告诉你任务成没成——
把 hover 的那点暖和「跑完了」用同一个颜色，界面会一直在说话但什么都没说清。

🔴 **「正在跑」为什么是天空蓝**：它是稿子调色盘里唯一一个**既在盘上、又没被分配情绪职责**的
颜色，正好留给状态。而且冷色跟这一整片暖调拉得开，一眼能认出来。

🔴 **成功态取一档低饱和青绿 `#7fc9a8`**：盘里没有绿，但「成功」必须跟「正在跑」（天空蓝）
和「主操作」（暖黄）都区分得开。这是这一整片暖调里最不吵的选择。

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 工具轨迹 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 上下文注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏那三个写死的 `Workspace files`（`twilight-cover.png` 2.4 MB 之类）、
那张静态快捷键表、侧栏底部的「Credits 72,300 / 108,000」，以及封面右上角的
「Twilight mode ready」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一条永远停在 72,300 的额度槽，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

**Error 与 Success 两条人格化文案也没做**：这套稿子的 Agent copy 只给了 Thinking 与 Permission
两条，没有失败与成功的规范。缺的不自己编——没有依据的人格化文案是自己加戏。

hero 上那四颗建议 chip（`Explore this repository` / `Write a reflective story`…）同理：
它们在稿子里是写死的文案，而 harness 的建议来自会话上下文，硬编一组只会给出永远一样的四句话。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-twilight-city
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-twilight-city 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（2048x1137），按 hero 的宽高比裁成 1580x1137，cwebp q95 原生分辨率——晚霞的渐变与万家灯火的碎点经不起缩图。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
