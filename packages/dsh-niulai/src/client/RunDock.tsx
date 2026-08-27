/**
 * Niulai's run overview as a <b>right-hand rail</b>: always present, collapsible.
 *
 * Why build our own rail instead of mounting into the harness's details rail: that slot is `{ kind: 'single' }` and
 * already held by the official DetailsPanel, so third-party registration throws. Forcing DOM into its container
 * would fight the "click a tool row for details" flow. Hence our own: `position: fixed` against the right edge,
 * a body marker making the main area yield an equal width while expanded, and only a handle when collapsed.
 * The official rail is never touched, and both can coexist.
 *
 * The collapsed state lives in localStorage and survives a refresh — the rail is a long-lived fixture, and springing
 * back every time would be annoying.
 */

import { useCallback, useEffect, useState } from 'react'
import { NiulaiRunPanel } from './RunPanel.tsx'
import css from './RunDock.module.css'

/** Storage key for the expanded state. */
const STORAGE_KEY = 'niulai.dock.open'

/** Set on body while expanded, so the stylesheet can free up the main area. */
const OPEN_ATTRIBUTE = 'data-niulai-dock-open'

/** Marker set on body while this skin is active; matches BODY_ATTRIBUTE in client/index.ts. */
const SKIN_ATTRIBUTE = 'data-dsh-niulai'

function readOpen(): boolean {
  try {
    // Expanded by default: the panel exists to be seen, and collapse is remembered only once the user chooses it.
    return window.localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    // localStorage throws in private mode; fall back to the default expanded state, which changes nothing functionally.
    return true
  }
}

export function NiulaiRunDock() {
  const [open, setOpen] = useState<boolean>(readOpen)

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

  return (
    <aside className={css.dock} data-open={open || undefined} aria-label="Niulai run overview">
      <button
        type="button"
        className={css.handle}
        onClick={toggle}
        aria-expanded={open}
        title={open ? 'Collapse the Niulai panel' : 'Expand the Niulai panel'}
      >
        {open ? '›' : '‹'}
      </button>
      {open && (
        <div className={css.body}>
          <div className={css.header}>Niulai · run overview</div>
          <NiulaiRunPanel />
        </div>
      )}
    </aside>
  )
}
