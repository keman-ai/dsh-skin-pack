✔ dsh-cyber-tao/README.md
观

DeepSeek Harness（dsh）的皮肤：黑曜石底、青铜描边、宣纸白文字，朱砂强调、玉石青状态，新会话页是一整幅山门主视觉

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色黑曜石 `#0a0d10`，面板 `#13181d`，全场一条 `rgba(228,207,168,.12)` 的暗金描边，
  文字宣纸白 `#efe7d7`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **一层符纸格纹**：`body::before` 铺 140px 的暗金网格，8% 不透明度、`mix-blend-mode: screen` —— 原型稿的材质层。
  弱到不干扰任何文字，`pointer-events: none` 保证不拦点击。
- **新会话页整幅封面**：道童、山门云海与那幅「参悟天机 · 道通万象」的书法。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚「道」字铜章，副标「赛博道观」。
- **人格化文案**：思考中 → 「道童正在参悟天机……」；失败 → 「天机紊乱，请重新推演。」；
  需要你确认时前缀一句「此事涉及因果，请真人裁决」——**原文照旧留着**，那才是你做判断的依据。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿自己把规则写死成一句话：**黑曜石底色、青铜描边、宣纸白文字、朱砂强调、玉石青状态**。
五个词对应五种用量，越界就不是这套皮肤了：

| 色 | 值 | 用在哪 |
|---|---|---|
| 黑曜石 | `#0a0d10` / `#13181d` | 底与面板——绝大部分界面 |
| 青铜 | `rgba(228,207,168,.12)` | 描边。暗底上的分层全靠这条细线 |
| 宣纸白 | `#efe7d7` | 正文 |
| 朱砂 | `#b94235` | **强调**：会话列表里选中的那一项、危险操作的悬停。只给「就是它」的那一个 |
| 玉石青 | `#6e9788` | **状态**：正在跑。与成功绿拉开一档，运行和成功不会看成同一件事 |
| 赤金 | `#e0c58f → #c8a768` | 主操作按钮（原型 `.new-btn` 那条渐变） |

还有一句同样是原型稿写的：**道观气质要深，但产品可用性不能被吞掉**。
所以三栏布局、信息密度、按钮与卡片层级一处不动，只在氛围、用词、材质上「修仙化」。

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
| 经卷注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型稿右栏那条 `Goal · 72% · 5 / 7 checkpoints`、三个写死的 `Context files`
（`ui-theme/src/client/index.ts` 8.1 KB 之类）、以及封面上的「今日修行 · 76 心神值」，
**harness 都没有对应的投影**。

装饰可以，假状态不行：一个永远显示 76 的心神值，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以这些一律不做，右栏只留能对上真实数据的卡。

原型 Agent copy 里的 `Tool run → 正在调用神通……` 与 `Context → 正在翻阅经卷……` 也没做：
harness 的工具行只有 ok / error 两态，没有 running 可挂点，硬凑会做成一个永远亮着的假状态。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-cyber-tao
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-cyber-tao 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面来自原型稿的整屏设计图，裁去了稿子里的假侧栏、假面板与标题按钮，只留画面（652x500 webp，内联成 data URI）。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
