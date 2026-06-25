import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  examQuestions,
  EXAM_PASS_PERCENT,
  EXAM_TIME_MINUTES,
} from '../data/exam'
import { MiniMarkdown } from '../components/MiniMarkdown'
import { CodeBlock } from '../components/CodeBlock'
import { useDocumentMeta } from '../lib/seo'

type Phase = 'intro' | 'taking' | 'result'

function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const sb = [...b].sort()
  return [...a].sort().every((v, i) => v === sb[i])
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function ExamPage() {
  useDocumentMeta(
    'Java Silver SE 11 模擬試験（80問）',
    'Java SE 11 Programmer I (1Z0-815) の模擬試験。80問・制限時間90分・合格ライン63%。本番同様にまとめて採点し、合否と解説を表示します。',
  )

  const total = examQuestions.length
  const [phase, setPhase] = useState<Phase>('intro')
  const [answers, setAnswers] = useState<number[][]>(() =>
    Array.from({ length: total }, () => []),
  )
  const [current, setCurrent] = useState(0)
  const [remaining, setRemaining] = useState(EXAM_TIME_MINUTES * 60)

  const finish = useCallback(() => {
    setPhase('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // カウントダウンタイマー（0で自動採点）
  useEffect(() => {
    if (phase !== 'taking') return
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id)
          finish()
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, finish])

  const paletteRef = useRef<HTMLDivElement>(null)

  function start() {
    setAnswers(Array.from({ length: total }, () => []))
    setCurrent(0)
    setRemaining(EXAM_TIME_MINUTES * 60)
    setPhase('taking')
    window.scrollTo({ top: 0 })
  }

  function toggle(choiceIndex: number) {
    const q = examQuestions[current]
    const multi = q.answer.length > 1
    setAnswers((prev) => {
      const next = prev.map((a) => [...a])
      const cur = next[current]
      if (multi) {
        next[current] = cur.includes(choiceIndex)
          ? cur.filter((x) => x !== choiceIndex)
          : [...cur, choiceIndex]
      } else {
        next[current] = [choiceIndex]
      }
      return next
    })
  }

  const score = useMemo(
    () =>
      examQuestions.reduce(
        (acc, q, i) => acc + (sameSet(answers[i], q.answer) ? 1 : 0),
        0,
      ),
    [answers],
  )
  const percent = Math.round((score / total) * 100)
  const passed = percent >= EXAM_PASS_PERCENT
  const answeredCount = answers.filter((a) => a.length > 0).length

  // ---------- 開始画面 ----------
  if (phase === 'intro') {
    return (
      <div className="page exam-page">
        <nav className="breadcrumb">
          <Link to="/">ホーム</Link> <span>/</span> 模擬試験
        </nav>
        <div className="exam-intro">
          <span className="exam-badge">模擬試験</span>
          <h1>Java Silver SE 11 模擬試験</h1>
          <p className="subtitle">
            Java SE 11 Programmer I (1Z0-815) を想定した本番形式の模擬試験です。
          </p>
          <ul className="exam-meta-list">
            <li>
              <strong>{total}</strong> 問
            </li>
            <li>
              制限時間 <strong>{EXAM_TIME_MINUTES}</strong> 分
            </li>
            <li>
              合格ライン <strong>{EXAM_PASS_PERCENT}%</strong>
            </li>
          </ul>
          <div className="exam-note">
            <p>
              ・本番同様、解答中は正誤を表示しません。最後に「採点する」でまとめて判定します。
            </p>
            <p>・複数選択の問題は「（2つ選択）」のように表示されます。</p>
            <p>・制限時間が0になると自動的に採点されます。</p>
          </div>
          <motion.button
            type="button"
            className="btn btn-primary exam-start-btn"
            onClick={start}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            試験を開始する
          </motion.button>
        </div>
      </div>
    )
  }

  // ---------- 結果画面 ----------
  if (phase === 'result') {
    return (
      <div className="page exam-page">
        <div className={'exam-result-banner ' + (passed ? 'pass' : 'fail')}>
          <div className="exam-result-judge">{passed ? '合格' : '不合格'}</div>
          <div className="exam-result-score">
            {score} / {total}
          </div>
          <div className="exam-result-percent">
            正答率 {percent}%（合格ライン {EXAM_PASS_PERCENT}%）
          </div>
        </div>

        <div className="exam-result-actions">
          <button type="button" className="btn btn-primary" onClick={start}>
            もう一度受ける
          </button>
          <Link to="/course/java-silver" className="btn btn-ghost">
            分野別の問題で復習する
          </Link>
        </div>

        <h2 className="section-title">解答の確認</h2>
        <ol className="exam-review">
          {examQuestions.map((q, i) => {
            const correct = sameSet(answers[i], q.answer)
            return (
              <li
                key={q.id}
                className={'exam-review-item ' + (correct ? 'ok' : 'ng')}
              >
                <div className="exam-review-head">
                  <span className="exam-review-no">問{i + 1}</span>
                  <span className="exam-review-mark">
                    {correct ? '正解' : '不正解'}
                  </span>
                </div>
                <div className="exam-review-q">
                  <MiniMarkdown text={q.question} />
                </div>
                {q.code && <CodeBlock code={q.code} />}
                <ul className="exam-review-choices">
                  {q.choices.map((c, ci) => {
                    const isAns = q.answer.includes(ci)
                    const chose = answers[i].includes(ci)
                    return (
                      <li
                        key={ci}
                        className={
                          (isAns ? 'is-answer' : '') +
                          (chose && !isAns ? ' is-wrongpick' : '')
                        }
                      >
                        <span className="rc-letter">
                          {String.fromCharCode(65 + ci)}
                        </span>
                        <span>{c}</span>
                        {isAns && <span className="rc-tag">正解</span>}
                        {chose && (
                          <span className="rc-tag rc-you">あなたの解答</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
                <div className="exam-review-exp">
                  <strong>解説：</strong>
                  <MiniMarkdown text={q.explanation} />
                </div>
              </li>
            )
          })}
        </ol>

        <div className="exam-result-actions">
          <button type="button" className="btn btn-primary" onClick={start}>
            もう一度受ける
          </button>
        </div>
      </div>
    )
  }

  // ---------- 受験中 ----------
  const q = examQuestions[current]
  const multi = q.answer.length > 1
  const selected = answers[current]
  const timeLow = remaining <= 60

  return (
    <div className="page exam-page">
      <div className="exam-bar">
        <span className="exam-progress-text">
          問 {current + 1} / {total}
        </span>
        <span className="exam-answered">解答済み {answeredCount}</span>
        <span className={'exam-timer' + (timeLow ? ' low' : '')}>
          ⏱ {fmtTime(remaining)}
        </span>
      </div>

      <div ref={paletteRef} className="exam-palette">
        {examQuestions.map((_, i) => (
          <button
            key={i}
            type="button"
            className={
              'exam-pal-dot' +
              (i === current ? ' current' : '') +
              (answers[i].length > 0 ? ' answered' : '')
            }
            onClick={() => setCurrent(i)}
            aria-label={`問${i + 1}へ`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <article className="step-card exam-question">
        <div className="slide-kind quiz-kind">
          問{multi ? `（${q.answer.length}つ選択）` : ''}
        </div>
        <h2 className="slide-title">問 {current + 1}</h2>
        <div className="slide-body">
          <MiniMarkdown text={q.question} />
        </div>
        {q.code && <CodeBlock code={q.code} />}

        <ul className="choices">
          {q.choices.map((choice, ci) => {
            const chosen = selected.includes(ci)
            return (
              <li key={ci}>
                <button
                  type="button"
                  className={'choice' + (chosen ? ' choice-chosen' : '')}
                  onClick={() => toggle(ci)}
                  aria-pressed={chosen}
                >
                  <span className="choice-mark" aria-hidden="true">
                    {String.fromCharCode(65 + ci)}
                  </span>
                  <span className="choice-text">{choice}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </article>

      <div className="step-nav">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
        >
          ← 前へ
        </button>
        {current < total - 1 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
          >
            次へ →
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (
                confirm(
                  `採点します。未解答 ${total - answeredCount} 問は不正解扱いになります。よろしいですか？`,
                )
              ) {
                finish()
              }
            }}
          >
            採点する
          </button>
        )}
      </div>

      <div className="exam-submit-row">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (
              confirm(
                `採点します。未解答 ${total - answeredCount} 問は不正解扱いになります。よろしいですか？`,
              )
            ) {
              finish()
            }
          }}
        >
          いつでも採点する（{answeredCount}/{total} 解答済み）
        </button>
      </div>
    </div>
  )
}
