import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getLesson } from '../data/courses'
import { completeStep, isStepDone, stepKey } from '../lib/progress'
import { SlideView } from '../components/SlideView'
import { ExerciseView } from '../components/ExerciseView'
import { ProgressBar } from '../components/ProgressBar'

export function LessonPage() {
  const { courseId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const found = getLesson(courseId, lessonId)
  const [index, setIndex] = useState(0)

  if (!found) {
    return (
      <div className="page">
        <p>レッスンが見つかりませんでした。</p>
        <Link to="/" className="btn btn-ghost">
          ホームへ戻る
        </Link>
      </div>
    )
  }

  const { course, lesson } = found
  const steps = lesson.steps
  const step = steps[index]
  const key = stepKey(courseId, lessonId, step.id)
  const isLast = index === steps.length - 1
  const stepDone = isStepDone(key)

  // 次のレッスン（コース内）への導線
  const lessonIdx = course.lessons.findIndex((l) => l.id === lessonId)
  const nextLesson = course.lessons[lessonIdx + 1]

  function goNext() {
    if (step.type === 'slide') {
      completeStep(key, false)
    }
    if (!isLast) {
      setIndex((i) => i + 1)
    }
  }

  return (
    <div className="page lesson-page">
      <nav className="breadcrumb">
        <Link to="/">ホーム</Link> <span>/</span>{' '}
        <Link to={`/course/${course.id}`}>{course.title}</Link> <span>/</span>{' '}
        {lesson.title}
      </nav>

      <div className="lesson-progress-top">
        <ProgressBar
          rate={Math.round(((index + 1) / steps.length) * 100)}
          color={course.color}
        />
        <span className="lesson-step-count">
          {index + 1} / {steps.length}
        </span>
      </div>

      <article className="step-card">
        {step.type === 'slide' ? (
          <SlideView step={step} />
        ) : (
          <ExerciseView
            key={step.id}
            step={step}
            done={stepDone}
            onSolved={() => completeStep(key, true)}
          />
        )}
      </article>

      <div className="step-nav">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
        >
          ← 前へ
        </button>

        {!isLast ? (
          <button type="button" className="btn btn-primary" onClick={goNext}>
            次へ →
          </button>
        ) : (
          <div className="lesson-finish">
            <span className="finish-label">🎉 レッスン完了！</span>
            {nextLesson ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (step.type === 'slide') completeStep(key, false)
                  navigate(`/course/${course.id}/lesson/${nextLesson.id}`)
                  setIndex(0)
                }}
              >
                次のレッスンへ →
              </button>
            ) : (
              <Link to={`/course/${course.id}`} className="btn btn-primary">
                コースに戻る
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
