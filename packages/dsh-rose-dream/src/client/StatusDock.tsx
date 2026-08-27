/**
 * The right-hand dock: a reduced rose cover plus this session's real state.
 *
 * The prototype's right column has three cards — current session / tool calls / quick actions. What is built here is **whatever maps to real data**:
 * waiting on you, state and timing, model, context occupancy and composition, permission mode, usage, todo progress.
 * the four rows under tool calls (one done in 2.1s, an injection running at 8.4s…) are hardcoded demo data in the draft,
 * The sidebar's energy figure is the same — the harness has no matching projection, and nothing is fabricated.
 *
 * Why build our own rail instead of taking over the harness's details slot:
 * it **can** be taken over (a `{ kind: 'single' }` conflict only arises at equal priority, and registering at -1
 * shadows the official one), but that rail holds "click a tool call to see its Input / Output" — the only lead
 * there is when debugging, so replacing it with a status dock is a net loss. Hence our own: `position: fixed`
 * against the right edge, a body marker making the main area yield an equal width while expanded, and only a handle when collapsed. Both can coexist.
 *
 * The collapsed state lives in localStorage: the dock is a long-lived fixture, and springing back on every refresh would be annoying.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { getStatus, subscribeStatus } from './status-store.ts'
import css from './StatusDock.module.css'

/** Storage key for the expanded state. */
const STORAGE_KEY = 'rose.dock.open'

/** Set on body while expanded, so the stylesheet can free up the main area. */
const OPEN_ATTRIBUTE = 'data-rose-dock-open'

/** Marker set on body while this skin is active; matches BODY_ATTRIBUTE in client/index.ts. */
const SKIN_ATTRIBUTE = 'data-dsh-rose'

function readOpen(): boolean {
  try {
    // Expanded by default: the dock exists to be seen, and collapse is remembered only once the user chooses it.
    return window.localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    // localStorage throws in private mode; fall back to the default expanded state, which changes nothing functionally.
    return true
  }
}

/**
 * Compact token counts: 517 / 12.2K / 1.2M.
 *
 * Aligned with the official `formatTokens` (StatsLine.tsx), so one value does not appear as two different
 * numbers in the dock and below the composer.
 * @param n - Token count.
 * @returns The display string.
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

export function RoseStatusDock() {
  const [open, setOpen] = useState<boolean>(readOpen)
  const status = useSyncExternalStore(subscribeStatus, getStatus)

  /*
   * Repaints every second, and only while something is actually running.
   *
   * The probe passes a **timestamp** rather than an elapsed duration: the latter changes every second,
   * which would make the probe publish every second and re-render the whole rail. The clock is computed here, and the timer runs only while a turn or tool is in flight.
   */
  const timing = status.turnStartedAt ?? status.toolStartedAt
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (timing === undefined) {
      return
    }
    setNow(Date.now())
    const id = setInterval(() => { setNow(Date.now()) }, 1_000)
    return () => { clearInterval(id) }
  }, [timing])

  useEffect(() => {
    const body = document.body
    /*
     * 🔴 Touch this marker only while **this skin is active**.
     *
     * The status dock component is always mounted (visibility is left to CSS) and does not know whether its
     * skin is selected. With several installed, every dock would stamp its own `data-*-dock-open` onto body at
     * startup — the CSS is all prefixed with `body[data-dsh-*]` so styles never cross, but a dozen other skins'
     * markers piled on body look exactly like a leak when debugging.
     *
     * On activation, `restoreDockOpen` in client/index.ts restores it from storage; this only handles the user
     * opening and closing it by hand, at which point the skin is necessarily active.
     */
    if (body.hasAttribute(SKIN_ATTRIBUTE)) {
      if (open) {
        body.setAttribute(OPEN_ATTRIBUTE, '')
      } else {
        body.removeAttribute(OPEN_ATTRIBUTE)
      }
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, String(open))
    } catch {
      // Failing to store only affects whether it is remembered after a refresh; this toggle still works.
    }
    return () => { body.removeAttribute(OPEN_ATTRIBUTE) }
  }, [open])

  const toggle = useCallback(() => { setOpen(value => !value) }, [])

  const busy = status.running === true
  const tools = status.runningTools ?? []
  const occupancy = status.usedTokens !== undefined && status.contextWindow !== undefined
    ? Math.min(100, Math.round(status.usedTokens / status.contextWindow * 100))
    : undefined

  const toolCalls = status.toolCalls ?? []
  const moreTools = Math.max(0, (status.toolCallTotal ?? 0) - toolCalls.length)
  const contextEntries = status.contextInjections ?? []
  const moreContext = Math.max(0, (status.contextTotal ?? 0) - contextEntries.length)

  const approvals = status.pendingApprovals ?? []
  const questions = status.pendingQuestions ?? 0
  const queued = status.queuedCount ?? 0
  const steering = status.steeringCount ?? 0
  const waitingOnYou = approvals.length > 0 || questions > 0

  // Context composition: all three are estimates, used only for proportions and never for a total.
  const ctx = [
    { key: 'system', label: 'System', tokens: status.ctxSystemTokens },
    { key: 'tools', label: 'Tool schema', tokens: status.ctxToolsTokens },
    { key: 'message', label: 'Conversation', tokens: status.ctxMessageTokens },
  ].filter((part): part is { key: string; label: string; tokens: number } => part.tokens !== undefined)
  const ctxTotal = ctx.reduce((sum, part) => sum + part.tokens, 0)

  return (
    <aside className={css.dock} data-open={open || undefined} aria-label="Session status dock">
      <button
        type="button"
        className={css.handle}
        onClick={toggle}
        aria-expanded={open}
        title={open ? 'Collapse the status dock' : 'Expand the status dock'}
      >
        {open ? '›' : '‹'}
      </button>
      {open && (
        <div className={css.body}>
          <div className={css.header}>Session status</div>
          <div className={css.scroll}>
            {/*
              A reduced cover, using the same inline image (adding no size), centre-cropped with `cover` —
              The image is a wide shot of a figure and a dragon, and cropping the sides leaves the subject intact.
            */}
            <div className={css.cover} style={{ backgroundImage: 'var(--rose-cover)' }}>
              <span className={css.coverName}>Rose Dream</span>
            </div>

            {/*
              "Waiting on you" sits at the top and appears only when something is genuinely waiting.
              It is the one state in this column that stalls until you act, which outranks any usage number.
            */}
            {waitingOnYou && (
              <section className={`${css.card} ${css.alert}`}>
                <div className={css.cardTitle}>Waiting on you</div>
                {approvals.map((tool, index) => (
                  <Line key={`${tool}-${index}`} label="Awaiting approval">
                    <span className={css.mono}>{tool}</span>
                  </Line>
                ))}
                {questions > 0 && <Line label="Awaiting answer">{`${questions} question(s)`}</Line>}
                <p className={css.hint}>Nothing continues until you confirm in the conversation.</p>
              </section>
            )}

            <section className={css.card}>
              <div className={css.cardTitle}>Current Session</div>
              <Line label="State">
                <span className={busy ? css.busy : css.ok}>
                  {busy ? '● RUNNING' : '● READY'}
                </span>
              </Line>
              {status.turnStartedAt !== undefined && (
                <Line label="This turn">
                  <span className={css.busy}>{formatDuration(Math.max(0, now - status.turnStartedAt))}</span>
                </Line>
              )}
              {tools.length > 0 && (
                <Line label="Running">
                  <span className={css.mono}>
                    {tools.join(' · ')}
                    {status.toolStartedAt !== undefined
                      && ` · ${formatDuration(Math.max(0, now - status.toolStartedAt))}`}
                  </span>
                </Line>
              )}
              {(queued > 0 || steering > 0) && (
                <Line label="Inbox">
                  {[queued > 0 ? `${queued} queued` : '', steering > 0 ? `${steering} steering` : '']
                    .filter(Boolean).join(' · ')}
                </Line>
              )}
              <Line label="Model">{status.model ?? '—'}</Line>
            </section>

            {/*
              Tool calls — the real-data version of that card in the prototype's right column.
              The draft shows four hardcoded demo rows; here are the tools this session actually ran:
              Running calls come first with a per-second clock; finished ones are listed newest first with duration and outcome.
            */}
            {toolCalls.length > 0 && (
              <section className={css.card}>
                <div className={css.cardTitle}>Today's gathering</div>
                <ul className={css.log}>
                  {toolCalls.map((call, index) => (
                    <li key={`${call.name}-${index}`} className={css.logRow} data-state={callState(call)}>
                      <span className={css.logName}>{call.name}</span>
                      <span className={css.logMeta}>
                        {call.running === true
                          ? `running · ${formatDuration(Math.max(0, now - (call.startedAt ?? now)))}`
                          : call.failed === true
                            ? call.ms === undefined ? 'failed' : `failed · ${formatDuration(call.ms)}`
                            : call.ms === undefined ? 'done' : `done · ${formatDuration(call.ms)}`}
                      </span>
                    </li>
                  ))}
                </ul>
                {moreTools > 0 && <p className={css.hint}>{`${moreTools} earlier call(s) not shown`}</p>}
                {/*
                  🔴 This sentence must stay: a duration can only be computed while the matching tool/call is still inside the
                  session window, and older calls that scrolled past report only name and outcome. Better blank than an invented figure.
                */}
                {toolCalls.some(call => call.running !== true && call.ms === undefined) && (
                  <p className={css.hint}>Rows without a duration had their call head scroll out of the session window.</p>
                )}
              </section>
            )}

            {/*
              Context injections — what is actually pushed into the context each turn (AGENTS.md, skill directories, system prompts…).
              ⚠️ The prototype puts a token count on every row, but the harness has **no projection pricing individual
              injections**, so only source and form are shown, with no invented numbers.
            */}
            {contextEntries.length > 0 && (
              <section className={css.card}>
                <div className={css.cardTitle}>Context injections</div>
                <ul className={css.log}>
                  {contextEntries.map((entry, index) => (
                    <li key={`${entry.label}-${index}`} className={css.logRow} data-role={entry.role}>
                      <span className={css.logName}>{entry.label}</span>
                      {entry.form !== undefined && <span className={css.logTag}>{entry.form}</span>}
                    </li>
                  ))}
                </ul>
                {moreContext > 0 && <p className={css.hint}>{`${moreContext} earlier injection(s) not shown`}</p>}
              </section>
            )}


            <section className={css.card}>
              <div className={css.cardTitle}>Context</div>
              <Line label="Occupancy">{occupancy === undefined ? '—' : `${occupancy}%`}</Line>
              {occupancy !== undefined && (
                <div className={css.progress}>
                  <span style={{ width: `${occupancy}%` }} />
                </div>
              )}
              <Line label="Token load">
                {status.usedTokens === undefined || status.contextWindow === undefined
                  ? '—'
                  : `${formatTokens(status.usedTokens)} / ${formatTokens(status.contextWindow)}`}
              </Line>
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
                    <Line key={part.key} label={part.label}>
                      <span data-part={part.key} className={css.legend}>
                        {`${Math.round(part.tokens / ctxTotal * 100)}% · ${formatTokens(part.tokens)}`}
                      </span>
                    </Line>
                  ))}
                  {/*
                    🔴 This sentence is mandatory: the three are fixed-density estimates (systematically low for CJK and JSON
                    schema), so they do not add up to the token load above. This is composition, not a total.
                  */}
                  <p className={css.hint}>The composition is estimated from a different source than the load above; the two must not be added.</p>
                </>
              )}
            </section>

            {status.compactedCount !== undefined && (
              <section className={css.card}>
                <div className={css.cardTitle}>Folded away</div>
                <Line label="Compactions">{`${status.compactedCount}`}</Line>
                {status.compactedItems !== undefined && (
                  <Line label="Items folded">{`${status.compactedItems}`}</Line>
                )}
                {status.compactedTokens !== undefined && (
                  <Line label="Tokens folded">{formatTokens(status.compactedTokens)}</Line>
                )}
                <p className={css.hint}>Folded history is still in the conversation; the model just no longer sees it.</p>
              </section>
            )}

            {status.permissionLabel !== undefined && (
              <section className={css.card}>
                <div className={css.cardTitle}>Permission</div>
                <Line label="Mode">{status.permissionLabel}</Line>
                {status.permissionHint !== undefined && (
                  <p className={css.hint}>{status.permissionHint}</p>
                )}
              </section>
            )}

            <section className={css.card}>
              <div className={css.cardTitle}>Usage</div>
              <Line label="Input">
                {status.inputTokens === undefined ? '—' : formatTokens(status.inputTokens)}
              </Line>
              <Line label="Output">
                {status.outputTokens === undefined ? '—' : formatTokens(status.outputTokens)}
              </Line>
              <Line label="Cache hits">
                {status.cacheHitPercent === undefined ? '—' : `${status.cacheHitPercent}%`}
              </Line>
              <Line label="Time spent">
                {status.llmMs === undefined && status.toolMs === undefined
                  ? '—'
                  : `LLM ${formatDuration(status.llmMs ?? 0)} · tools ${formatDuration(status.toolMs ?? 0)}`}
              </Line>
              <Line label="Turns">
                {status.turns === undefined ? '—' : `${status.turns} turns · ${status.steps ?? 0} steps`}
              </Line>
            </section>

            {/* The todo card appears only when there really is a list — a session with no plan should not see an empty card. */}
            {status.todosTotal !== undefined && (
              <section className={css.card}>
                <div className={css.cardTitle}>Plan</div>
                <Line label="Progress">{`${status.todosDone ?? 0} / ${status.todosTotal}`}</Line>
                {status.todoActive !== undefined && (
                  <p className={css.todo}>{status.todoActive}</p>
                )}
              </section>
            )}

          </div>
        </div>
      )}
    </aside>
  )
}

/**
 * One tool call's display state: running / failed / succeeded. Colouring is left to the stylesheet via
 * `data-state` rather than composing class names here — recolouring a skin then touches only CSS.
 * @param call - One call's reading.
 * @returns The display state.
 */
function callState(call: { running?: boolean | undefined; failed?: boolean | undefined }): string {
  if (call.running === true) return 'running'
  return call.failed === true ? 'error' : 'ok'
}

/**
 * One label–value row, matching the two-column layout of the prototype's `.line`.
 * @param props - Label and value.
 * @returns One row.
 */
function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={css.line}>
      <span className={css.key}>{label}</span>
      <span className={css.value}>{children}</span>
    </div>
  )
}
