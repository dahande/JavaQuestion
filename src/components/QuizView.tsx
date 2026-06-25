import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { QuizStep } from '../types'
import { MiniMarkdown } from './MiniMarkdown'
import { CodeBlock } from './CodeBlock'

interface Props {
  step: QuizStep
  done: boolean
  onSolved: () => void
}

function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const sb = [...b].sort()
  return [...a].sort().every((v, i) => v === sb[i])
}

export function QuizView({ step, done, onSolved }: Props) {
  const multi = step.answer.length > 1
  const [selected, setSelected] = useState<number[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(done)

  const isCorrect = useMemo(
    () => sameSet(selected, step.answer),
    [selected, step.answer],
  )

  function toggle(i: number) {
    if (submitted) return
    if (multi) {
      setSelected((s) =>
        s.includes(i) ? s.filter((x) => x !== i) : [...s, i],
      )
    } else {
      setSelected([i])
    }
  }

  function handleSubmit() {
    if (selected.length === 0) return
    setSubmitted(true)
    if (isCorrect && !correct) {
      setCorrect(true)
      onSolved()
    }
  }

  function handleRetry() {
    setSelected([])
    setSubmitted(false)
  }

  return (
    <div className="quiz">
      <div className="slide-kind quiz-kind">
        問題{multi ? `（${step.answer.length}つ選択）` : ''}
      </div>
      <h2 className="slide-title">{step.title}</h2>
      <div className="slide-body">
        <MiniMarkdown text={step.question} />
      </div>
      {step.code && <CodeBlock code={step.code} />}

      <ul className="choices">
        {step.choices.map((choice, i) => {
          const chosen = selected.includes(i)
          const isAns = step.answer.includes(i)
          let state = ''
          if (submitted) {
            if (isAns) state = ' choice-correct'
            else if (chosen) state = ' choice-wrong'
          } else if (chosen) {
            state = ' choice-chosen'
          }
          return (
            <li key={i}>
              <button
                type="button"
                className={'choice' + state}
                onClick={() => toggle(i)}
                disabled={submitted}
                aria-pressed={chosen}
              >
                <span className="choice-mark" aria-hidden="true">
                  {submitted
                    ? isAns
                      ? '✓'
                      : chosen
                        ? '✕'
                        : String.fromCharCode(65 + i)
                    : String.fromCharCode(65 + i)}
                </span>
                <span className="choice-text">{choice}</span>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="exercise-actions">
        {!submitted ? (
          <motion.button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={selected.length === 0}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            解答する
          </motion.button>
        ) : (
          !correct && (
            <button type="button" className="btn btn-ghost" onClick={handleRetry}>
              もう一度
            </button>
          )
        )}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            className={
              'feedback ' + (isCorrect ? 'feedback-ok' : 'feedback-error')
            }
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {isCorrect ? '正解です！🎉 +20 XP' : '不正解… 解説を確認しましょう。'}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {submitted && (
          <motion.div
            className="explanation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.28 }}
          >
            <div className="explanation-title">解説</div>
            <div className="explanation-body">
              <MiniMarkdown text={step.explanation} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
