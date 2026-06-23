import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { levelFromXp } from '../lib/progress'

const THEME_KEY = 'javalearn:theme'

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  return { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }
}

export function Header() {
  const { theme, toggle } = useTheme()
  const { xp } = useProgress()
  const { level, intoLevel, needed } = levelFromXp(xp)

  return (
    <header className="topbar">
      <Link className="topbar-brand" to="/">
        <span className="topbar-logo" aria-hidden="true">J</span>
        <span>JavaLearn</span>
      </Link>

      <div className="topbar-actions">
        <div className="level-badge" title={`累計 ${xp} XP`}>
          <span className="level-num">Lv.{level}</span>
          <span className="level-bar" aria-hidden="true">
            <span
              className="level-bar-fill"
              style={{ width: `${(intoLevel / needed) * 100}%` }}
            />
          </span>
          <span className="level-xp">{xp} XP</span>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={toggle}
          aria-label="テーマを切り替え"
          title="テーマを切り替え (ダーク / ライト)"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}
