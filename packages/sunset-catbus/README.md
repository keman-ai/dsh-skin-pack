✔ dsh-sunset-catbus/README.md
巴士

DeepSeek Harness（dsh）的皮肤：深棕打底、夕阳橙做主操作、麦田金做描边与强调、冷蓝只给运行中，新会话页是一整幅黄昏横幅

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色深棕 `#160d08`（**不是黑**），面板暖棕两级，全场一条带麦田金的暗描边
  `rgba(255,191,103,.16)`，文字 `#fff4e7`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*`
  一次性换掉，界面的每一层都跟着走。
- **新会话页整张横幅**：猫巴士、麦田与落日，16px 圆角配麦田金描边和很深的投影；
  输入区独立放在下方，两者不重叠；封面左上角留一枚身份角标。进入对话与轨迹页后横幅收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚落日标，副标「Sunset Catbus」。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿自己在对话里把规则写清楚了：

> 已将主题统一成**夕阳橙、麦田金和深棕色**。

handoff 里写得更直接：`theme = warm orange / golden field / dark brown`、`mode = companion journey`。

| 色 | 值 | 用在哪 |
|---|---|---|
| 深棕 | `#160d08` / `#24150d` / `#302016` | 底与面板——绝大部分界面 |
| 夕阳橙 | `#f49a43` | 主操作。原型 `.new` 的 `linear-gradient(135deg,#f39a43,#bd5e27)` |
| 麦田金 | `#ffd07a` | 描边与强调。画里那片被夕阳照亮的麦子 |
| 冷蓝 | `#6ab6ff` | **正在跑** |

🔴 **底是深棕，不是黑**。这套的底带着黄昏的余温，换成中性黑，整张封面会像贴在另一个界面上——
这是暖色皮肤最容易做塌的一处。

🔴 **全暖盘里，"正在跑"反过来取冷**：`#6ab6ff` 是稿子调色盘里唯一的冷色，正好留给状态。
在一片橙金里，冷色是唯一能一眼认出来的东西。

🔴 **警告是这套里的难题**：整盘都是橙金，橙色警告根本浮不出来。所以警告取**麦田金的高亮档**，
靠亮度而不是色相区分；错误取砖红 `#e0674f`——比夕阳橙更深更红，在暖色里仍然读得出"这是坏消息"。

🔴 **金不做实心按钮**：它在这套里是"描边与强调"的语言，金色大按钮会跟封面抢光。

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 途中停靠 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 上下文注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏的「Harness Systems」五行 `AI / MM / CX / VS / FS — ONLINE`、
「Journey Modes」四张模式卡（Wonder / Focus / Memory / Story）、
「Golden Hour Energy」那个 `Energy Level 88% · Journey Sync 100%`，
以及封面右上角的「☀ GOLDEN HOUR」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一个永远停在 88% 的能量值，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

**这套稿子也没给 Agent copy 规范**，所以宿主文案一句都不替换。
没有依据的人格化文案是自己加戏。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-sunset-catbus
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-sunset-catbus 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1672x941），一刀不裁，cwebp q95 原生分辨率——麦田的笔触与逆光的尘土缩一档就糊成一片黄。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
