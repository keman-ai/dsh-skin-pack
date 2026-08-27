/**
 * The Niulai run overview panel — the same dock as the whale girl skin's, with the thumbnail swapped for the cow and the palette for the field's.
 *
 * 🔴 <b>All data comes from the harness's official projections and session snapshots; no DOM is parsed any more.</b>
 * This once counted `[data-variant]` rows and guessed the preset and model from class names — written under the
 * mistaken belief that usage was unreachable and a whole event projection had to be written. In fact the harness
 * ships token-meter / session-stats / permission-presets / tool-todo with the projections already computed; all that was missing was passing the values out of a slot (see UsageProbe).
 * Replacing it removed an entire class of "a harness restructure makes this unreadable" coupling.
 *
 * Why the harness's details rail (the `details` slot) is not taken over: it **could** be (a `single` conflict only
 * arises at equal priority, and registering at -1 shadows the official entry), but that rail holds "click a tool
 * call to see its Input / Output" — the only lead there is when debugging, so replacing it with a dock is a net loss. Hence our own.
 */

import { useEffect, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { getUsage, subscribeUsage } from './usage-store.ts'
import css from './RunPanel.module.css'

/**
 * Token counts compress to 31.8K / 1.2M.
 * Aligned with the harness's `formatTokens` (one decimal place below three digits), so the rail and the official
 * context ring never show different numbers.
 */
function formatTokens(n: number): string {
  const scaled = (v: number): string =>
    v >= 100 ? String(Math.round(v)) : String(Math.round(v * 10) / 10)
  if (n < 1_000) return String(n)
  if (n < 1_000_000) return `${scaled(n / 1_000)}K`
  return `${scaled(n / 1_000_000)}M`
}

/**
 * Compact durations: 45.2s under a minute, then 2m42s. Also aligned with the official `formatDuration`.
 * @param ms - Milliseconds.
 * @returns The display string.
 */
function formatDuration(ms: number): string {
  const s = ms / 1_000
  if (s < 60) return `${Math.round(s * 10) / 10}s`
  const whole = Math.round(s)
  return `${Math.floor(whole / 60)}m${whole % 60}s`
}

function Row({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className={css.row}>
      <span className={css.rowLabel}>{label}</span>
      <span className={css.rowValue}>{children}</span>
    </div>
  )
}

/** The panel itself, mounted inside our own right-hand rail. */
export function NiulaiRunPanel() {
  const usage = useSyncExternalStore(subscribeUsage, getUsage, getUsage)

  /*
   * Repaints every second, and only while something is actually running.
   *
   * The probe passes a **timestamp** rather than an elapsed duration: the latter changes every second,
   * which would make the probe publish every second and re-render the whole rail. The clock is computed here, and the timer runs only while a turn or tool is in flight.
   */
  const timing = usage.turnStartedAt ?? usage.toolStartedAt
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (timing === undefined) {
      return
    }
    setNow(Date.now())
    const id = window.setInterval(() => { setNow(Date.now()) }, 1_000)
    return () => { window.clearInterval(id) }
  }, [timing])

  const busy = usage.running === true
  const tools = usage.runningTools ?? []
  const occupancy = usage.usedTokens !== undefined && usage.contextWindow !== undefined
    ? Math.min(100, Math.round(usage.usedTokens / usage.contextWindow * 100))
    : undefined

  const approvals = usage.pendingApprovals ?? []
  const questions = usage.pendingQuestions ?? 0
  const queued = usage.queuedCount ?? 0
  const steering = usage.steeringCount ?? 0
  const waitingOnYou = approvals.length > 0 || questions > 0

  // Context composition: all three are estimates, used only for proportions and never for a total.
  const ctx = [
    { key: 'system', label: 'System', tokens: usage.ctxSystemTokens },
    { key: 'tools', label: 'Tool schema', tokens: usage.ctxToolsTokens },
    { key: 'message', label: 'Conversation', tokens: usage.ctxMessageTokens },
  ].filter((part): part is { key: string, label: string, tokens: number } => part.tokens !== undefined)
  const ctxTotal = ctx.reduce((sum, part) => sum + part.tokens, 0)

  const dash = '—'
  return (
    <div className={css.root}>
      {/*
        A reduced cow image, using the same inline image (adding no size), with contain keeping the cow whole
        and a 3/2 ratio matching the draft's cover card.
      */}
      <div className={css.cover} style={{ backgroundImage: 'var(--niulai-cow-cover)' }}>
        <span className={css.coverName}>Niulai Field</span>
      </div>

      {/*
        "Waiting on you" sits at the top and appears only when something is genuinely waiting.
        It is the one state in this column that stalls until you act, which outranks any usage number.
      */}
      {waitingOnYou && (
        <section className={`${css.card} ${css.alert}`}>
          <div className={css.cardTitle}>Waiting on you</div>
          {approvals.map((tool, index) => (
            <Row key={`${tool}-${index}`} label="Awaiting approval">
              <span className={css.mono}>{tool}</span>
            </Row>
          ))}
          {questions > 0 && <Row label="Awaiting answer">{`${questions} question(s)`}</Row>}
          <p className={css.note}>Nothing continues until you confirm in the conversation.</p>
        </section>
      )}

      <section className={css.card}>
        <div className={css.cardTitle}>Current run</div>
        <Row label="State">
          <span className={css.status} data-running={busy || undefined}>
            {busy ? 'Niulai is at work' : 'Niulai is standing by'}
          </span>
        </Row>
        {usage.turnStartedAt !== undefined && (
          <Row label="This turn">
            <span className={css.busy}>{formatDuration(Math.max(0, now - usage.turnStartedAt))}</span>
          </Row>
        )}
        {tools.length > 0 && (
          <Row label="Running">
            <span className={css.mono}>
              {tools.join(' · ')}
              {usage.toolStartedAt !== undefined
                && ` · ${formatDuration(Math.max(0, now - usage.toolStartedAt))}`}
            </span>
          </Row>
        )}
        {(queued > 0 || steering > 0) && (
          <Row label="Inbox">
            {[queued > 0 ? `${queued} queued` : '', steering > 0 ? `${steering} steering` : '']
              .filter(Boolean).join(' · ')}
          </Row>
        )}
        <Row label="Model">{usage.model ?? dash}</Row>
      </section>

      <section className={css.card}>
        <div className={css.cardTitle}>Context</div>
        <Row label="Occupancy">{occupancy === undefined ? dash : `${occupancy}%`}</Row>
        {occupancy !== undefined && (
          <div className={css.progress}>
            <span style={{ width: `${occupancy}%` }} />
          </div>
        )}
        <Row label="Token load">
          {usage.usedTokens === undefined || usage.contextWindow === undefined
            ? dash
            : `${formatTokens(usage.usedTokens)} / ${formatTokens(usage.contextWindow)}`}
        </Row>
        {ctxTotal > 0 && (
          <>
            <div className={css.stack}>
              {ctx.map(part => (
                <span
                  key={part.key}
                  data-part={part.key}
                  style={{ width: `${part.tokens / ctxTotal * 100}%` }}
                />
              ))}
            </div>
            {ctx.map(part => (
              <Row key={part.key} label={part.label}>
                <span data-part={part.key} className={css.legend}>
                  {`${Math.round(part.tokens / ctxTotal * 100)}% · ${formatTokens(part.tokens)}`}
                </span>
              </Row>
            ))}
            {/*
              🔴 This sentence is mandatory: the three are fixed-density estimates (systematically low for CJK and JSON
              schema), so they do not add up to the token load above. This is composition, not a total.
            */}
            <p className={css.note}>The composition is estimated from a different source than the load above; the two must not be added.</p>
          </>
        )}
      </section>

      {usage.permissionLabel !== undefined && (
        <section className={css.card}>
          <div className={css.cardTitle}>Permission</div>
          <Row label="Mode">{usage.permissionLabel}</Row>
          {usage.permissionHint !== undefined && (
            <p className={css.note}>{usage.permissionHint}</p>
          )}
        </section>
      )}

      <section className={css.card}>
        <div className={css.cardTitle}>Usage</div>
        <Row label="Input">{usage.inputTokens === undefined ? dash : formatTokens(usage.inputTokens)}</Row>
        <Row label="Output">{usage.outputTokens === undefined ? dash : formatTokens(usage.outputTokens)}</Row>
        <Row label="Cache hits">
          {usage.cacheHitPercent === undefined ? dash : `${usage.cacheHitPercent}%`}
        </Row>
        <Row label="Time spent">
          {usage.llmMs === undefined && usage.toolMs === undefined
            ? dash
            : `LLM ${formatDuration(usage.llmMs ?? 0)} · tools ${formatDuration(usage.toolMs ?? 0)}`}
        </Row>
        <Row label="Turns">
          {usage.turns === undefined ? dash : `${usage.turns} turns · ${usage.steps ?? 0} steps`}
        </Row>
      </section>

      {/* The todo card appears only when there really is a list — a session with no plan should not see an empty card. */}
      {usage.todosTotal !== undefined && (
        <section className={css.card}>
          <div className={css.cardTitle}>Plan</div>
          <Row label="Progress">{`${usage.todosDone ?? 0} / ${usage.todosTotal}`}</Row>
          {usage.todoActive !== undefined && <p className={css.todo}>{usage.todoActive}</p>}
        </section>
      )}

    </div>
  )
}
