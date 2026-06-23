import { useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion'
import type { ExerciseStep } from '../types'
import { validateExercise, type ValidationResult } from '../lib/validate'
import { useTheme } from '../lib/theme'
import { MiniMarkdown } from './MiniMarkdown'

interface Props {
  step: ExerciseStep
  done: boolean
  onSolved: () => void
}

export function ExerciseView({ step, done, onSolved }: Props) {
  const { theme } = useTheme()
  const reduce = useReducedMotion()
  const shake = useAnimationControls()

  // 穴埋め: starterCode を `___` で分割したテキスト断片
  const segments = useMemo(
    () => (step.kind === 'blank' ? step.starterCode.split('___') : []),
    [step],
  )
  const blankCount = Math.max(segments.length - 1, 0)

  const [answers, setAnswers] = useState<string[]>(() =>
    Array(blankCount).fill(''),
  )
  const [code, setCode] = useState(step.kind === 'write' ? step.starterCode : '')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [solved, setSolved] = useState(done)
  const [hintsShown, setHintsShown] = useState(0)

  function handleCheck() {
    const res = validateExercise(step, { answers, code })
    setResult(res)
    if (res.correct && !solved) {
      setSolved(true)
      onSolved()
    }
    if (!res.correct) {
      if (!reduce) {
        shake.start({
          x: [0, -9, 9, -7, 7, -3, 0],
          transition: { duration: 0.42 },
        })
      }
      if (hintsShown < step.hints.length) {
        setHintsShown((n) => Math.min(n + 1, step.hints.length))
      }
    }
  }

  function handleReset() {
    setAnswers(Array(blankCount).fill(''))
    setCode(step.kind === 'write' ? step.starterCode : '')
    setResult(null)
  }

  return (
    <div className="exercise">
      <div className="slide-kind exercise-kind">演習</div>
      <h2 className="slide-title">{step.title}</h2>
      <div className="slide-body">
        <MiniMarkdown text={step.prompt} />
      </div>

      <motion.div className="editor-area" animate={shake}>
        {step.kind === 'blank' ? (
          <pre className="code-block blank-code">
            <code>
              {segments.map((seg, i) => (
                <span key={i}>
                  {seg}
                  {i < blankCount && (
                    <input
                      className={
                        'blank-input' +
                        (result?.wrongBlankIndexes?.includes(i)
                          ? ' blank-wrong'
                          : '') +
                        (solved ? ' blank-ok' : '')
                      }
                      type="text"
                      value={answers[i]}
                      disabled={solved}
                      aria-label={`空欄 ${i + 1}`}
                      onChange={(e) => {
                        const next = [...answers]
                        next[i] = e.target.value
                        setAnswers(next)
                      }}
                    />
                  )}
                </span>
              ))}
            </code>
          </pre>
        ) : (
          <div className="cm-wrap">
            <CodeMirror
              value={code}
              height="220px"
              theme={theme === 'dark' ? oneDark : 'light'}
              extensions={[java()]}
              editable={!solved}
              onChange={(v) => setCode(v)}
            />
          </div>
        )}
      </motion.div>

      <div className="exercise-actions">
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={handleCheck}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          答え合わせ
        </motion.button>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>
          リセット
        </button>
        {step.hints.length > 0 && !solved && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              setHintsShown((n) => Math.min(n + 1, step.hints.length))
            }
            disabled={hintsShown >= step.hints.length}
          >
            ヒントを見る ({hintsShown}/{step.hints.length})
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {result && !result.correct && (
          <motion.div
            key="err"
            className="feedback feedback-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {result.message ?? 'まだ正解ではありません。'}
          </motion.div>
        )}
        {solved && (
          <motion.div
            key="ok"
            className="feedback feedback-ok"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
          >
            正解です！🎉 +20 XP
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {hintsShown > 0 && (
          <motion.div
            className="hints"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="hints-title">ヒント</div>
            <ol>
              {step.hints.slice(0, hintsShown).map((h, i) => (
                <li key={i}>
                  <pre className="hint-text">{h}</pre>
                </li>
              ))}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {solved && (
          <motion.div
            className="console"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="console-title">実行結果</div>
            <pre className="console-output">{step.expectedOutput}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
