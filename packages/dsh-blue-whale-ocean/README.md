✔ dsh-blue-whale-ocean/README.md
洋

DeepSeek Harness（dsh）的皮肤：深海蓝打底、透明青蓝做描边与状态、冰白只做高光，新会话页是一整幅鲸鱼海面横幅

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色深海蓝 `#051c33`，面板两级往上抬，全场一条带青蓝的暗描边
  `rgba(173,226,255,.15)`，文字 `#eef9ff`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉。
- **新会话页整张横幅**：从空中俯看的鲸鱼与它的尾迹，16px 圆角配青蓝描边和很深的投影；
  输入区独立放在下方，两者不重叠；封面左上角留一枚身份角标。进对话页后横幅收起。
- **品牌标接管**：冰白芯 → 青蓝环 → 深海底的圆标，副标「Blue Whale Ocean」。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿自己在对话里把规则写清楚了：

> 已将整套主题统一成**深海蓝、透明青蓝与冰白高光**。

handoff 里写得更直接：`theme = deep ocean / cyan light / ice white`、`mode = deep ocean`。

| 色 | 值 | 用在哪 |
|---|---|---|
| 深海蓝 | `#051c33` / `#082845` / `#0d3559` | 底与面板——绝大部分界面 |
| 透明青蓝 | `#79dfff` | 描边、强调、**正在跑**。水面透下来的那层光 |
| 冰白 | `#d9f3ff` | **高光**。只给最需要被看见的一两处，铺开就不是高光了 |
| 中蓝 | `#3da7e4 → #2472b9` | 主操作。原型 `.new` 那条 135° 渐变 |

🔴 **青不做实心按钮**：它在这套里是「描边与状态」的语言，实心铺开会把海面的通透压没，
所以主操作让给中蓝渐变。

🔴 **警告与错误是推出来的**：原型只画了正常流程，没给这两个色。琥珀借冰白的方向推一个
偏冷的暖调，红压到低饱和——这套的性格是通透，不该出现刺眼的东西。

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
| 上下文注入 | 每条注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。
窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏的「Harness Systems」几行 ONLINE、几张模式卡、一个固定的能量值，
以及封面右上角的「◌ DEEP WATER ONLINE」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一个永远不变的能量值，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。

**这套稿子也没给 Agent copy 规范**，所以宿主文案一句都不替换。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-blue-whale-ocean
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-blue-whale-ocean 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张俯拍照片（1418x1179），横切成 1418x700 对齐横幅比例，cwebp q95 原生分辨率——水面细碎的高光点经不起缩图。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
