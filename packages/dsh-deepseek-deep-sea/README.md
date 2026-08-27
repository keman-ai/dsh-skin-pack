✔ dsh-deepseek-deep-sea/README.md
 Deep Sea

DeepSeek Harness（dsh）的皮肤：深海蓝打底、冷青做描边与状态、DeepSeek 蓝做主操作，新会话页是一整幅深海主视觉

![New session](preview/dark.webp)

## What it changes

- **整套语义 token**：底色深海蓝 `#03101f`，三级面板依次抬升，全场两条带冷青的暗描边
  （`rgba(118,204,255,.13)` / `rgba(94,215,255,.14)`），文字 `#eef8ff`。约 80 个
  `--dsw-alias-*` / `--dsw-specific-*` 一次性换掉，界面的每一层都跟着走。
- **新会话页整幅封面**：鲸鱼娘、海底遗迹、鲸鱼全息屏与气泡。进入对话与轨迹页后封面收起。
- **品牌标接管**：侧栏与 hero 的标都换成一枚鲸鱼方标（内联 svg，不是 emoji），副标「大肥鲸鱼娘 · Deep Sea」。
- **人格化文案**：思考中 → 「正在潜入上下文……」；失败 → 「好像撞到暗礁了，请重试。」；
  需要你确认时前缀一句「大肥鲸鱼娘需要你的确认后才能继续」——**原文照旧留着**，那才是你做判断的依据。
- **A right-hand status dock**: always present; see the table below.

## Palette rules

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

### What the status dock shows

| Card | Fields | Source |
|---|---|---|
| Waiting on you | Tools awaiting approval, questions awaiting an answer | `ConversationSnapshot.pending`. **Appears only when something is genuinely waiting** |
| Current Session | State, elapsed turn time, current tool duration, inbox, model | `running` / `turnTimings` / `runningCalls` / `queue`; the model comes from the latest assistant message's `provenance.model` |
| Context | Occupancy %, token load, and the System / tool-schema / conversation composition bar | The `contextPressure` and `contextBreakdown` projections |
| Permission | The active permission and sandbox mode | The `permissions` projection |
| Usage | Input / output / cache hits / time spent / turns | The `tokenUsage` and `sessionStats` projections |
| Plan | Todo progress | The `todos` projection (the card is absent when there is no list) |
| 下潜作业 | 工具名 · 真实耗时 · 成败 | trajectory 的 `tool-result` 节点（耗时 = `time - callTime`）＋快照的 `runningCalls`。**只在有过调用时出现** |
| 海底档案 | 每条上下文注入的来源与形态 | trajectory 的 `context` 节点（`provenance.label` / `form`） |
| Folded away | Compaction count, items and tokens folded | Trajectory `compaction` nodes. **Absent when nothing was compacted** |

⚠️ **A tool duration may be absent**: it can only be computed while the matching `tool/call` is still inside the session window. Older calls that scrolled past report only name and outcome — better blank than an invented figure.

⚠️ **Composition is not a total**: the three `contextBreakdown` figures use fixed-density estimates (systematically low for Chinese and JSON schema)
and **do not add up** to the token load, which is anchored to the provider's reported value. The UI says so too.

## Deliberately not done

原型右栏的「Ocean Systems」五行 `ONLINE / SYNCED`、「Companion」那句
`Status: following · Mood: happy · Signal: strong`、那张静态快捷键表，以及侧栏底部的
「Ocean compute · 82%」和封面右上角的「DEEP SEA MODE READY」，**harness 都没有对应的投影**。

装饰可以，假状态不行：一条永远停在 82% 的算力槽，第二次看见就没人信了，
而它旁边那些真数字会跟着一起被怀疑。所以右栏只留能对上真实数据的卡。

原型 Agent copy 里的 `Tool → 正在调用工具……` 与 `Context → 正在读取海底档案……` 也没做：
harness 的工具行只有 ok / error 两态，没有 running 可挂点，硬凑会做成一个永远亮着的假状态。

## Install

**Skin market** (recommended): find it in the market and install, then **restart dsh**.

Manual install (during development):

```bash
npm install && npm run build
DST=~/.dsh/profiles/web/node_modules/dsh-deepseek-deep-sea
mkdir -p "$DST" && cp -R lib cordis.patch.yml skin.json package.json README.md "$DST/"
# 再把 dsh-deepseek-deep-sea 加进 profile 的 package.json 的 dependencies 与 dsh.profile.bundles
```

After changing it you **must restart dsh**: the profile tree has to be recomposed, and without a restart the UI stays as it was.

## 🔴 The side effect of autoApply

Installing switches to this skin by default (`autoApply`, default `true`). The reason is that the harness **does not persist third-party theme ids**,
and the **built-in Settings → Appearance has only three cells: light / dark / follow system**, with no third-party themes —
switching manually requires the skin market's own panel (**Settings → Skin Market**).

The cost: **it reapplies on every refresh**, so switching away lasts only for that session. To change permanently, set `autoApply` to `false`
or uninstall the plugin. It is implemented as an 8-second window after startup (long enough to outlast the Host preference snapshot), after which it lets go entirely.

## Version requirements

Requires **dsh 0.1.1-rc.2 or newer**. The brand-slot takeover relies on slot `priority` shadowing (only equal
priorities count as a conflict; different priorities shadow, and the lower number renders). On older versions these three registrations throw and are swallowed,
**merely falling back to the official brand mark**, while the palette and cover keep working.

## Assets

封面是原型稿里那张干净插画（1672x941），按 hero 的宽高比裁成 1312x941，内联成 data URI。

## Development

```bash
npm run check   # tsc --noEmit
npm run build   # produces lib/index.js (host half) and lib/client.js (browser half)
```

`lib/` **must be committed**: skins install via `github:owner/repo`, which installs the build output from the repository;
if the source moves and the output does not, people install the old version (and the market uninstalls the package outright over the missing entry file).

## License

MIT © Science Roam Limited
