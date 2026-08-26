✔ dsh-ultra-team-apocalypse/README.md
队 · 末日

DeepSeek Harness（dsh）的皮肤：焦黑暗红打底、火光橙做主操作、战斗红只给失败、能量青只给运行中，新会话页是一整幅末日小队主视觉

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底与面板是**烧焦的暗红黑**（`#120909` / `#1a1010`，不是中性黑），
  全场只有一条描边 `rgba(255,151,85,.16)`（带火光橙），正文米白偏暖 `#fff2e6`。
  约 80 个 `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **新会话页整幅横幅**：五个人站在燃烧的废墟里，15px 圆角配橙描边和大投影；
  输入区贴在卡片下沿，压幕在底部多压一段保证读得清。进入对话与轨迹页后横幅收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚能量核心徽标，副标「Ultra Team · Apocalypse」。
- **右侧状态台**：常驻一根，见下表。其中「能量核心」那颗球**跟着真实的上下文占用变色**
  （青 → 琥珀 → 红），没有数据时是灰的 idle，不假装 STABLE。

## 配色规则

🔴 **这套稿子没有 Theme rules 那一节**（不像同批的其它几套写死了配比），只给了一组 `:root` 变量。
所以配比是从它**实际怎么用**这些变量里读出来的：

| 色 | 值 | 读出来的职责 |
|---|---|---|
| 焦黑暗红 | `#120909` / `#1a1010` / `#251311` | 底与面板。**不是中性黑**——整套界面的八成是它 |
| 火光橙 | `#ff7b2c` | 主操作。原型 `.new` 是 `linear-gradient(135deg,#f0522d,#bb251f)` |
| 描边 | `rgba(255,151,85,.16)` | **全场只有这一条**，分层全靠它 |
| 战斗红 | `#ef3b2f` | 危险与失败 |
| 计时黄 | `#ffdc60` | 警告 |
| 能量青 | `#57d9ff` | **正在跑** |
| 恢复绿 | `#65dfa3` | 成功 |

🔴 **橙和红必须分开**：橙是「你要做的事」（主操作），红是「出事了」。
这套画面本身就是一片火，两个色再混在一起，界面会变成"哪里都在烧"，真出错时反而看不见。

🔴 **文字带烟熏的暖**：正文 `#fff2e6`、次要 `#b08f7b`，跟这片火光是同一套光。
放中性灰会像贴上去的——这是浅色/暖色皮肤最容易被忽略的一条。

🔴 **面板补第三级**：原型只给了两级（`--panel` / `--panel2`），harness 要三级。
第三级往上再抬一档而不是复用 panel2，否则弹层和选中态会分不出来。

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 出击记录 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 上下文注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏的「Harness Systems」五行 `AI / MM / TL / CX / FS — ONLINE`、「Team Modes」两张模式卡
（Battle Mode / Strategy Mode）、「Energy Matrix — Matrix State: STABLE」，以及封面上的
「TEAM COVER ONLINE」「SYSTEM READY」，**harness 都没有对应的投影**。

装饰可以，假状态不行。其中「能量核心」那一块**改成了真的**：球的颜色跟着 `contextPressure`
投影走（青 → 琥珀 → 红），没有数据时是灰的 idle。一个永远显示 STABLE 的核心不如不做。

**这套稿子也没给 Agent copy 规范**（同批的其它几套都给了六条），所以宿主文案一句都不替换。
没有依据的人格化文案是自己加戏。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-ultra-team-apocalypse
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-ultra-team-apocalypse 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1774x887），一刀不裁，cwebp q95 原生分辨率——硬边描线的赛璐璐风格缩一档线条就毛了。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
