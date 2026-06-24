import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { getLesson } from '../data/courses'
import { completeStep, isStepDone, stepKey } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { useDocumentMeta } from '../lib/seo'
import { SlideView } from '../components/SlideView'
import { ExerciseView } from '../components/ExerciseView'
import { ProgressBar } from '../components/ProgressBar'
import { StepIndicator } from '../components/StepIndicator'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function LessonPage() {
  const { courseId = '', lessonId = '' } = useParams()
  const navigate = useNavigate()
  const found = getLesson(courseId, lessonId)
  // 進捗（完了状態）が変わったら目次を再描画するために購読
  useProgress()
  const reduce = useReducedMotion()
  useDocumentMeta(
    found ? `${found.lesson.title} - ${found.course.title}` : 'レッスン',
    found
      ? `${found.lesson.title}: ${found.lesson.summary}（${found.course.title}）スライドと演習でJavaを学べます。`
      : 'レッスン | JavaLearn',
  )

  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const contentTopRef = useRef<HTMLDivElement>(null)

  // ステップ変更時に内容の先頭へスクロール
  useEffect(() => {
    contentTopRef.current?.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [index, reduce])

  const steps = found?.lesson.steps ?? []
  const stepCount = steps.length

  const goTo = useCallback(
    (target: number) => {
      if (target < 0 || target >= stepCount || target === index) return
      const current = steps[index]
      if (current?.type === 'slide') {
        completeStep(stepKey(courseId, lessonId, current.id), false)
      }
      setDirection(target > index ? 1 : -1)
      setIndex(target)
    },
    [stepCount, index, steps, courseId, lessonId],
  )

  // キーボード ←/→ でステップ移動（入力欄フォーカス中は無効）
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      if (typing) return
      if (e.key === 'ArrowRight') goTo(index + 1)
      else if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goTo, index])

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
  const step = steps[index]
  const key = stepKey(courseId, lessonId, step.id)
  const isLast = index === steps.length - 1
  const stepDone = isStepDone(key)

  const lessonIdx = course.lessons.findIndex((l) => l.id === lessonId)
  const nextLesson = course.lessons[lessonIdx + 1]

  const variants = {
    enter: (dir: number) =>
      reduce ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? 60 : -60 },
    center: { opacity: 1, x: 0 },
    exit: (dir: number) =>
      reduce ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? -60 : 60 },
  }

  return (
    <div className="page lesson-page">
      <nav className="breadcrumb">
        <Link to="/">ホーム</Link> <span>/</span>{' '}
        <Link to={`/course/${course.id}`}>{course.title}</Link> <span>/</span>{' '}
        {lesson.title}
      </nav>

      <div className="lesson-sticky">
        <div className="lesson-progress-top">
          <ProgressBar
            rate={Math.round(((index + 1) / steps.length) * 100)}
            color={course.color}
          />
          <span className="lesson-step-count">
            {index + 1} / {steps.length}
          </span>
        </div>
        <StepIndicator
          steps={steps}
          currentIndex={index}
          isDone={(i) =>
            isStepDone(stepKey(courseId, lessonId, steps[i].id))
          }
          onJump={goTo}
          color={course.color}
        />
      </div>

      <div ref={contentTopRef} className="step-scroll-anchor" />

      <div className="step-stage">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.article
            key={step.id}
            className="step-card"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: EASE }}
          >
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
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="step-nav">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          ← 前へ
        </button>

        {!isLast ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => goTo(index + 1)}
          >
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
                  setDirection(1)
                  setIndex(0)
                  navigate(`/course/${course.id}/lesson/${nextLesson.id}`)
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

      <p className="kbd-hint">
        ヒント: <kbd>←</kbd> <kbd>→</kbd> キーでもステップを移動できます
      </p>
    </div>
  )
}
