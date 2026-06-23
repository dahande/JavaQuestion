import { Link } from 'react-router-dom'
import { courses, courseStepKeys } from '../data/courses'
import { completionRate, levelFromXp, resetProgress } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { ProgressBar } from '../components/ProgressBar'

export function HomePage() {
  const { xp } = useProgress()
  const { level } = levelFromXp(xp)

  return (
    <div className="page">
      <section className="hero">
        <h1>ブラウザで学ぶ Java 入門</h1>
        <p className="subtitle">
          スライドで学んで、その場でコードを書く。手を動かしながら Java の基礎を身につけよう。
        </p>
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
        <h2 className="section-title">コース一覧</h2>
        <div className="course-grid">
          {courses.map((course) => {
            const rate = completionRate(courseStepKeys(course))
            return (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="course-card"
                style={{ ['--accent' as string]: course.color }}
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
              </Link>
            )
          })}
        </div>
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
