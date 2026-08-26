✔ dsh-dark-xianxia/README.md
 · 修仙版

DeepSeek Harness（dsh）的皮肤：墨青黑打底、古金做边与按钮、玉青只给运行中、朱砂只给危险，新会话页是一整幅召请天机主视觉

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色墨青黑 `#071012`，面板暖灰黑，全场两条带古金的暗描边
  （`rgba(189,151,88,.18)` / `.28`），文字 `#e8dfca`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*`
  一次性换掉，界面的每一层都跟着走。
- **顶部一团灵气**：`body::before` 铺原型那条 `radial-gradient(circle at 50% 0%, rgba(45,92,94,.16), transparent 34%)`，
  让墨黑底不至于死板。`pointer-events: none` 保证不拦点击。
- **新会话页整幅封面**：书法「参悟天机 · 万象归一」、仗剑的道友与那条神龙。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚「天」字金章，副标「天机阁 · 修仙版」。
- **人格化文案**：思考中 → 「道童正在参悟天机……」；失败 → 「天机紊乱，请重新推演。」；
  需要你确认时前缀一句「此事涉及因果，请真人裁决」——**原文照旧留着**，那才是你做判断的依据。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿的 Theme rules 把配比写成了一句数字，这是这套皮肤最硬的约束：

> **70% 墨青黑 / 18% 暖灰黑 / 8% 古金 / 3% 玉青 / 1% 朱砂**

| 色 | 值 | 占比 | 用在哪 |
|---|---|---|---|
| 墨青黑 | `#071012` | 70% | 底 |
| 暖灰黑 | `#0b1619` / `#0f1d21` / `#13252a` | 18% | 面板、输入框、气泡 |
| 古金 | `#c09b5c` / `#e0bd7b` | 8% | 描边、主操作、品牌字。「8%」的意思是**边和按钮**，不是大面积铺 |
| 玉青 | `#4d9b8f` | 3% | 只给**正在跑** |
| 朱砂 | `#bf5a47` | 1% | 只给**危险与失败**。原型全场只有「终止运行」那一处 |

🔴 **成功态也走玉青**：这套稿子的调色盘里根本没有绿，硬塞一个会同时破坏「3% 玉青」和「70% 墨青黑」
两条配比。宁可让成功与运行同色系（用亮度区分 `#74b5a9` / `#4d9b8f`），也不引入第六种颜色。

还有一句同样写死在稿子里：**强世界观视觉集中在 New Session / Empty State，进入工作流后回到克制的
深色开发工具界面，这样才适合真实长期使用**。所以封面只画在 hero，三栏布局与信息密度一处不动。

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
| 经卷查阅 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏「神通调用」那四行——天机推演阵 `已完成 2.1s`、灵脉探测术 `已完成 3.7s`、
经卷查阅·玉清篇 `运行中 8.4s`、阵法模拟·九宫 `等待中`——是稿子里写死的演示数据；
侧栏底部那条「灵力 68,250 / 108,000」和顶栏的「天机未泄，静待道友下令」同理。

**harness 没有对应的投影**。装饰可以，假状态不行：一条永远停在 68,250 的灵力槽，
第二次看见就没人信了，而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

原型 Agent copy 里的 `Tool → 正在调用神通……` 与 `Context → 正在翻阅经卷……` 也没做：
harness 的工具行只有 ok / error 两态，没有 running 可挂点，硬凑会做成一个永远亮着的假状态。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-dark-xianxia
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-dark-xianxia 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面来自原型稿的整屏设计图，裁去了稿子自己的「召请天机」标题与顶栏残边，只留画面（660x475 webp，内联成 data URI）。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
