import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCourse, lessonStepKeys } from '../data/courses'
import { completionRate } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { ProgressBar } from '../components/ProgressBar'

const MotionLink = motion.create(Link)
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
}

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

      <header
        className="course-header"
        style={{ ['--accent' as string]: course.color }}
      >
        <span className="course-icon-lg" aria-hidden="true">
          {course.icon}
        </span>
        <div>
          <h1>{course.title}</h1>
          <p className="subtitle">{course.subtitle}</p>
        </div>
      </header>

      <motion.ol
        className="lesson-list"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        {course.lessons.map((lesson) => {
          const keys = lessonStepKeys(course.id, lesson)
          const rate = completionRate(keys)
          const isDone = rate === 100
          return (
            <motion.li key={lesson.id} variants={itemVariants}>
              <MotionLink
                to={`/course/${course.id}/lesson/${lesson.id}`}
                className="lesson-item"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.99 }}
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
              </MotionLink>
            </motion.li>
          )
        })}
      </motion.ol>
    </div>
  )
}
