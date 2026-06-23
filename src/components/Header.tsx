import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgress } from '../lib/useProgress'
import { levelFromXp } from '../lib/progress'
import { useTheme } from '../lib/theme'

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
            <motion.span
              className="level-bar-fill"
              initial={false}
              animate={{ width: `${(intoLevel / needed) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            />
          </span>
          <span className="level-xp">{xp} XP</span>
        </div>
        <motion.button
          type="button"
          className="icon-btn"
          onClick={toggle}
          aria-label="テーマを切り替え"
          title="テーマを切り替え (ダーク / ライト)"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9, rotate: -20 }}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </motion.button>
      </div>
    </header>
  )
}
