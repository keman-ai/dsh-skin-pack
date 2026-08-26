✔ dsh-night-forest-companion/README.md
伴

DeepSeek Harness（dsh）的皮肤：月夜蓝打底、月光青做描边与状态、主操作走蓝，新会话页是一整幅夜林横幅

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色月夜蓝 `#071423`，面板森林深色 `#0b1c2e`，全场一条带月光青的暗描边
  `rgba(150,205,255,.16)`，文字 `#eef8ff`。约 80 个 `--dsw-alias-*` / `--dsw-specific-*`
  一次性换掉，界面的每一层都跟着走。
- **新会话页整张横幅**：树枝上的一大两小、夜空与那弯月，16px 圆角配月光青描边和很深的投影；
  输入区独立放在下方，两者不重叠；封面左上角留一枚身份角标。进入对话与轨迹页后横幅收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚月环标，副标「Night Forest Companion」。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿自己在对话里把规则写清楚了：

> 已将主题整体收束到**月夜蓝、森林深色与柔和冷光**。

handoff 里写得更直接：`theme = night blue / moon cyan / soft glow`、`mode = calm companion`。

| 色 | 值 | 用在哪 |
|---|---|---|
| 月夜蓝 / 森林深色 | `#071423` / `#0b1c2e` | 底与面板——绝大部分界面 |
| 月光青 | `#7bdcff` | 描边、强调、**正在跑**。画里那圈月光 |
| 蓝 | `#467fff` | 主操作。原型 `.new` 的 `linear-gradient(135deg,#4b84ff,#2f62ce)` |

🔴 **月光青不做实心按钮**：它在这套里是「描边与状态」的语言，铺成大块会把夜的安静打破。
主操作因此走蓝。

🔴 **这套皮肤一个暖色都没有，是有意的**：`calm companion` 的意思就是不要有任何东西跳出来喊你。
原型只画了正常流程、没给警告与错误色，所以警告压在低饱和的柔黄（`#dcc98a`）、
错误压在低饱和的粉红（`#e0808f`）上——**绝不用橙红**。

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 夜行记录 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 上下文注入 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏的「Harness Systems」五行 `AI / MM / CX / VS / FS — ONLINE`、
「Companion Modes」四张模式卡（Calm / Wonder / Focus / Memory）、
「Moonlight Energy」那个 `Energy Level 82% · Night Sync 100%`，
以及封面右上角的「☾ MOONLIGHT READY」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一个永远停在 82% 的能量值，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

**这套稿子也没给 Agent copy 规范**，所以宿主文案一句都不替换。
没有依据的人格化文案是自己加戏。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-night-forest-companion
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-night-forest-companion 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1672x941），一刀不裁，cwebp q95 原生分辨率——大面积平涂的夜空最吃编码质量，压一档就在蓝色渐变上起色带。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
