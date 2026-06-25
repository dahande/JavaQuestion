import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { courses, courseStepKeys } from '../data/courses'
import { completionRate, levelFromXp, resetProgress } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { useDocumentMeta } from '../lib/seo'
import { ProgressBar } from '../components/ProgressBar'

const MotionLink = motion.create(Link)
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
}

export function HomePage() {
  const { xp } = useProgress()
  const { level } = levelFromXp(xp)
  useDocumentMeta(
    undefined,
    'Progateを参考にした無料のJava学習アプリ。スライドで学び、ブラウザ上でコードを書きながら、基礎からオブジェクト指向・Silver対策まで実践的に身につけられます。',
  )

  return (
    <div className="page">
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          ブラウザで学ぶ Java 入門
        </motion.h1>
        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          スライドで学んで、その場でコードを書く。手を動かしながら Java の基礎を身につけよう。
        </motion.p>
        <div className="hero-stats">
          <span className="stat">
            <strong>Lv.{level}</strong> レベル
          </span>
          <span className="stat">
            <strong>{xp}</strong> XP
          </span>
        </div>
      </section>

      <section>
        <Link to="/exam" className="exam-banner">
          <div className="exam-banner-main">
            <span className="exam-banner-icon" aria-hidden="true">📝</span>
            <div>
              <h2 className="exam-banner-title">Java Silver 模擬試験（80問）</h2>
              <p className="exam-banner-sub">
                本番形式・制限時間90分・合格ライン63%。まとめて採点して合否判定。
              </p>
            </div>
          </div>
          <span className="exam-banner-cta">挑戦する →</span>
        </Link>
      </section>

      <section className="feature-row">
        <Link to="/coding" className="feature-card coding">
          <span className="feature-icon" aria-hidden="true">⌨️</span>
          <div>
            <h3 className="feature-title">コーディング問題</h3>
            <p className="feature-sub">実際にコードを書いて実行・自動採点</p>
          </div>
        </Link>
        <Link to="/playground" className="feature-card playground">
          <span className="feature-icon" aria-hidden="true">🧪</span>
          <div>
            <h3 className="feature-title">プレイグラウンド</h3>
            <p className="feature-sub">自由にJavaを書いて動かす</p>
          </div>
        </Link>
      </section>

      <section>
        <h2 className="section-title">コース一覧</h2>
        <motion.div
          className="course-grid"
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          {courses.map((course) => {
            const rate = completionRate(courseStepKeys(course))
            return (
              <MotionLink
                key={course.id}
                to={`/course/${course.id}`}
                className="course-card"
                style={{ ['--accent' as string]: course.color }}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="course-card-top">
                  <span className="course-icon" aria-hidden="true">
                    {course.icon}
                  </span>
                  <span className="course-level">{course.level}</span>
                  {course.status === 'wip' && (
                    <span className="course-wip">準備中</span>
                  )}
                </div>
                <h3 className="course-title">{course.title}</h3>
                <p className="course-subtitle">{course.subtitle}</p>
                <div className="course-progress">
                  <ProgressBar rate={rate} color={course.color} />
                  <span className="course-rate">{rate}%</span>
                </div>
                <span className="course-meta">
                  {course.lessons.length} レッスン
                </span>
              </MotionLink>
            )
          })}
        </motion.div>
      </section>

      <section className="reset-section">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (confirm('学習の進捗をすべてリセットしますか？')) {
              resetProgress()
            }
          }}
        >
          進捗をリセット
        </button>
      </section>
    </div>
  )
}
