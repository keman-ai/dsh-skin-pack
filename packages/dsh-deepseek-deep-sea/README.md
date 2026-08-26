✔ dsh-deepseek-deep-sea/README.md
 Deep Sea

DeepSeek Harness（dsh）的皮肤：深海蓝打底、冷青做描边与状态、DeepSeek 蓝做主操作，新会话页是一整幅深海主视觉

![新会话页](preview/dark.webp)

## 它改了什么

- **整套语义 token**：底色深海蓝 `#03101f`，三级面板依次抬升，全场两条带冷青的暗描边
  （`rgba(118,204,255,.13)` / `rgba(94,215,255,.14)`），文字 `#eef8ff`。约 80 个
  `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **新会话页整幅封面**：鲸鱼娘、海底遗迹、鲸鱼全息屏与气泡。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚鲸鱼方标（内联 svg，不是 emoji），副标「大肥鲸鱼娘 · Deep Sea」。
- **人格化文案**：思考中 → 「正在潜入上下文……」；失败 → 「好像撞到暗礁了，请重试。」；
  需要你确认时前缀一句「大肥鲸鱼娘需要你的确认后才能继续」——**原文照旧留着**，那才是你做判断的依据。
- **右侧状态台**：常驻一根，见下表。

## 配色规则

原型稿的 Theme rules 写死了两条，这套皮肤的全部分寸都在里面：

> **主色保持 DeepSeek 蓝系**，鲸鱼娘元素只作为品牌人格化，**不覆盖工具和代码信息**。
> 角色视觉集中在 New Dive / Empty State；Chat、Dive Path、Details **回归真实 Harness 工作态**。

所以用色是**一条蓝的深浅**，不是彩色拼盘：

| 色 | 值 | 用在哪 |
|---|---|---|
| 深海蓝 | `#03101f` → `#0f2d4a` | 底与三级面板——绝大部分界面 |
| 冷青 | `#5ed7ff` | 描边、强调、**正在跑**。海底那种发光线，暗底上的分层全靠它 |
| DeepSeek 蓝 | `#4e7ff2` | 主操作按钮。品牌色本身 |
| 金 | `#e8ba72` | 全场唯一的暖色。原型只用在角色的蝴蝶结上，这里只给上下文占用条的末端 |

🔴 **冷青不做实心按钮**：它在这套里是"描边与状态"的语言，铺成大块会把海底的安静打破。
同理，金**只有一个位置**——「一点暖」铺开就不再是一点暖了。

### 右侧状态台显示什么

| 卡片 | 字段 | 来源 |
|---|---|---|
| 等你拿主意 | 待授权的工具名、待回答的问题数 | `ConversationSnapshot.pending`。**只在真有东西等你时出现** |
| Current Session | 状态、本轮已跑、当前工具耗时、收件箱、模型 | `running` / `turnTimings` / `runningCalls` / `queue`；模型取最近一条助手消息的 `provenance.model` |
| Context | 占用 % + Token 负载 + System / 工具 schema / 对话 构成条 | `contextPressure` + `contextBreakdown` 投影 |
| Permission | 当前权限·沙箱模式 | `permissions` 投影 |
| Usage | 输入 / 输出 / 缓存命中 / 耗时 / 轮次 | `tokenUsage` + `sessionStats` 投影 |
| Plan | 待办进度 | `todos` 投影（没有清单时整张卡不出现） |
| 下潜作业 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 海底档案 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| 已折叠 | 压缩次数、折叠条目数与 token | trajectory 的 `compaction` 节点。**没压缩过就不出现** |

⚠️ **工具耗时可能缺席**：只有配对的 `tool/call` 还在会话窗口内时才算得出来。窗口滚过去的老调用只报名字与成败——宁可空着，也不编一个好看的秒数。

⚠️ **构成不是总量**：`contextBreakdown` 三项用固定密度估算（对中文与 JSON schema 系统性低估），
加起来**不等于** Token 负载（那个锚在供应商上报值）。界面上也写了这句。

## 刻意没做的

原型右栏的「Ocean Systems」五行 `ONLINE / SYNCED`、「Companion」那句
`Status: following · Mood: happy · Signal: strong`、那张静态快捷键表，以及侧栏底部的
「Ocean compute · 82%」和封面右上角的「DEEP SEA MODE READY」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一条永远停在 82% 的算力槽，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

原型 Agent copy 里的 `Tool → 正在调用工具……` 与 `Context → 正在读取海底档案……` 也没做：
harness 的工具行只有 ok / error 两态，没有 running 可挂点，硬凑会做成一个永远亮着的假状态。

## 安装

**皮肤集市**（推荐）：在集市里搜到它并安装，装完**重启 dsh**。

手工装（开发期）：

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-deepseek-deep-sea
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-deepseek-deep-sea 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
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

封面是原型稿里那张干净插画（1672x941），按 hero 的宽高比裁成 1312x941，内联成 data URI。

## 开发

```bash
npm run check   # tsc --noEmit
npm run build   # 产出 lib/index.js（host 半）与 lib/client.js（浏览器半）
```

`lib/` **要提交进仓库**：皮肤靠 `github:owner/repo` 安装，装的是仓库里的构建产物；
源码更新了产物没更新，别人装到的还是旧版（集市还会因为入口文件缺失直接把包卸回去）。

## License

MIT © Science Roam Limited
