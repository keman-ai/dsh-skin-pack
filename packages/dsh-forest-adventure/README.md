✔ dsh-forest-adventure/README.md
游

DeepSeek Harness（dsh）的皮肤：森林深绿打底、苔藓绿做主操作、溪水青只给运行中、日光黄只做点缀，新会话页是一整幅林间主视觉

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色林绿 `#08150f`，三级面板往上是苔藓色，全场两条描边——草绿的
  `rgba(187,212,180,.14)` 与溪水青的 `rgba(94,183,199,.12)`，文字 `#eef1e8`。约 80 个
  `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **新会话页整幅封面**：木筏上的一大一小、吊桥、紫藤与溪水。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚林色方标，副标「Forest Adventure」。
- **人格化文案**：思考中 → 「正在穿过森林寻找答案……」；需要你确认时前缀一句
  「需要你的确认后才能继续」——**原文照旧留着**，那才是你做判断的依据。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿的 Theme rules 写死了每种颜色的职责：

> 以**森林深绿**为底，**溪水青与苔藓绿**作为状态色，**日光黄只做温暖点缀**。

| 色 | 值 | 用在哪 |
|---|---|---|
| 森林深绿 | `#08150f` → `#1f3b2b` | 底与三级面板——绝大部分界面 |
| 苔藓绿 | `#6fa36d` / `#a7cb87` | 主操作 + **做完了** |
| 溪水青 | `#5eb7c7` | **正在跑** |
| 日光黄 | `#d7c77e` | 只做点缀。这里只有两个位置：警告态、上下文占用条的末端 |

🔴 **两个状态色分工必须拉开**：绿是"做完了"，青是"正在做"。做成同色系（比如都用绿、靠亮度区分）
会让人第一眼分不清任务是完成了还是还在跑——这是长期使用里最贵的一种误读。

🔴 **稿子里的紫一处不用**：`--flower: #9a7fbb`（画里那串紫藤）在原型全场只出现在装饰上，
没有任何语义。给它安一个语义等于替设计师瞎定规矩，所以整套 token 里一处都没有它。

还有一句同样写死在稿子里：**New Session 可以使用完整场景，Chat / Trajectory 回归安静的工作界面**。
所以封面只画在 hero，三栏布局与信息密度一处不动。

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 林间足迹 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 上下文注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏那三个写死的 `Workspace files`（`forest-inspiration.md` 2.1 KB 之类）、
那张静态快捷键表、侧栏底部的「Credits 68,250 / 108,000」，以及封面右上角的
「Forest mode ready」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一条永远停在 68,250 的额度槽，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

hero 上那四颗建议 chip（`Explore this repository` / `Write a gentle story`…）也没做：
它们在稿子里是写死的文案，而 harness 的建议来自会话上下文，硬编一组只会给出永远一样的四句话。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-forest-adventure
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-forest-adventure 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1536x1024），按 hero 的宽高比裁成 1423x1024，cwebp q95 保住叶子与水面的细纹，内联成 data URI。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
