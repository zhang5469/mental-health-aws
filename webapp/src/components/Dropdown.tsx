/* ──────────────────────────────────────────────
   Dropdown.tsx — custom-styled replacement for <select>.
   Native select popups use OS colors that clash with the
   gradient theme, so this renders its own glassy option list.
────────────────────────────────────────────── */

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface DropdownProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
  disabled?: boolean
}

function Dropdown({ options, value, onChange, ariaLabel, disabled }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  /* Close the menu when clicking anywhere outside it, or pressing Escape */
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="dropdown" ref={rootRef}>
      {/* The closed control — shows the current choice + a chevron */}
      <button
        type="button"
        className="dropdown-toggle"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <span>{selected?.label ?? ''}</span>
        <ChevronDown size={16} className={`dropdown-chevron${open ? ' open' : ''}`} />
      </button>

      {/* The open option list */}
      {open && (
        <ul className="dropdown-menu" role="listbox">
          {options.map((o) => (
            <li key={o.value} role="option" aria-selected={o.value === value}>
              <button
                type="button"
                className={`dropdown-option${o.value === value ? ' selected' : ''}`}
                onClick={() => { onChange(o.value); setOpen(false) }}
              >
                <span>{o.label}</span>
                {o.value === value && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
