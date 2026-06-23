import { Link, useParams } from 'react-router-dom'
import { getCourse, lessonStepKeys } from '../data/courses'
import { completionRate } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { ProgressBar } from '../components/ProgressBar'

export function CoursePage() {
  const { courseId = '' } = useParams()
  // 進捗が変わったら再描画するために購読する
  useProgress()
  const course = getCourse(courseId)

  if (!course) {
    return (
      <div className="page">
        <p>コースが見つかりませんでした。</p>
        <Link to="/" className="btn btn-ghost">
          ホームへ戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">ホーム</Link> <span>/</span> {course.title}
      </nav>

      <header className="course-header" style={{ ['--accent' as string]: course.color }}>
        <span className="course-icon-lg" aria-hidden="true">
          {course.icon}
        </span>
        <div>
          <h1>{course.title}</h1>
          <p className="subtitle">{course.subtitle}</p>
        </div>
      </header>

      <ol className="lesson-list">
        {course.lessons.map((lesson) => {
          const keys = lessonStepKeys(course.id, lesson)
          const rate = completionRate(keys)
          const isDone = rate === 100
          return (
            <li key={lesson.id}>
              <Link
                to={`/course/${course.id}/lesson/${lesson.id}`}
                className="lesson-item"
              >
                <span
                  className={'lesson-check' + (isDone ? ' done' : '')}
                  aria-hidden="true"
                >
                  {isDone ? '✓' : ''}
                </span>
                <span className="lesson-main">
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-summary">{lesson.summary}</span>
                  <span className="lesson-progress">
                    <ProgressBar rate={rate} color={course.color} />
                  </span>
                </span>
                <span className="lesson-rate">{rate}%</span>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
