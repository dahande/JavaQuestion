import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { challenges } from '../data/challenges'
import { isStepDone } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { useDocumentMeta } from '../lib/seo'

const MotionLink = motion.create(Link)
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export function CodingPage() {
  useProgress()
  useDocumentMeta(
    'コーディング問題',
    '実際にJavaコードを書いて実行・自動採点するコーディング問題集。出力・標準入力・ループ・文字列・アルゴリズムまで。',
  )
  const solvedCount = challenges.filter((c) => isStepDone(`coding/${c.id}`))
    .length

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">ホーム</Link> <span>/</span> コーディング問題
      </nav>

      <header className="course-header" style={{ ['--accent' as string]: '#ea580c' }}>
        <span className="course-icon-lg" aria-hidden="true">⌨️</span>
        <div>
          <h1>コーディング問題</h1>
          <p className="subtitle">
            実際にコードを書いて実行・採点。{challenges.length}問中 {solvedCount} 問クリア。
          </p>
        </div>
      </header>

      <div className="playground-cta">
        <Link to="/playground" className="btn btn-ghost">
          🧪 自由に書けるプレイグラウンドを開く
        </Link>
      </div>

      <motion.ol
        className="lesson-list"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {challenges.map((c) => {
          const done = isStepDone(`coding/${c.id}`)
          return (
            <motion.li key={c.id} variants={itemVariants}>
              <MotionLink
                to={`/coding/${c.id}`}
                className="lesson-item"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.99 }}
              >
                <span
                  className={'lesson-check' + (done ? ' done' : '')}
                  aria-hidden="true"
                >
                  {done ? '✓' : ''}
                </span>
                <span className="lesson-main">
                  <span className="lesson-title">{c.title}</span>
                  <span className="lesson-summary">
                    {c.level}・{c.category}
                  </span>
                </span>
                <span className="lesson-rate">{done ? 'クリア' : '挑戦'}</span>
              </MotionLink>
            </motion.li>
          )
        })}
      </motion.ol>
    </div>
  )
}
