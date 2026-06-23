import { useMemo, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { java } from '@codemirror/lang-java'
import type { ExerciseStep } from '../types'
import { validateExercise, type ValidationResult } from '../lib/validate'
import { MiniMarkdown } from './MiniMarkdown'

interface Props {
  step: ExerciseStep
  done: boolean
  onSolved: () => void
}

export function ExerciseView({ step, done, onSolved }: Props) {
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
    if (!res.correct && hintsShown < step.hints.length) {
      // 間違えるたびに次のヒントを1つ開示
      setHintsShown((n) => Math.min(n + 1, step.hints.length))
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

      <div className="editor-area">
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
              extensions={[java()]}
              editable={!solved}
              onChange={(v) => setCode(v)}
            />
          </div>
        )}
      </div>

      <div className="exercise-actions">
        <button type="button" className="btn btn-primary" onClick={handleCheck}>
          答え合わせ
        </button>
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

      {result && !result.correct && (
        <div className="feedback feedback-error">
          {result.message ?? 'まだ正解ではありません。'}
        </div>
      )}

      {solved && (
        <div className="feedback feedback-ok">正解です！🎉 +20 XP</div>
      )}

      {hintsShown > 0 && (
        <div className="hints">
          <div className="hints-title">ヒント</div>
          <ol>
            {step.hints.slice(0, hintsShown).map((h, i) => (
              <li key={i}>
                <pre className="hint-text">{h}</pre>
              </li>
            ))}
          </ol>
        </div>
      )}

      {solved && (
        <div className="console">
          <div className="console-title">実行結果</div>
          <pre className="console-output">{step.expectedOutput}</pre>
        </div>
      )}
    </div>
  )
}
