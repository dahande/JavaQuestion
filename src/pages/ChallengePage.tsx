import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { motion } from 'framer-motion'
import { getChallenge } from '../data/challenges'
import { runJava, normalizeOutput, type RunResult } from '../lib/runner'
import { completeStep, isStepDone } from '../lib/progress'
import { useProgress } from '../lib/useProgress'
import { useTheme } from '../lib/theme'
import { useDocumentMeta } from '../lib/seo'
import { MiniMarkdown } from '../components/MiniMarkdown'
import { RunOutput } from '../components/RunOutput'

interface TestResult {
  name: string
  pass: boolean
  got: string
  expected: string
}

export function ChallengePage() {
  const { id = '' } = useParams()
  useProgress()
  const challenge = getChallenge(id)
  useDocumentMeta(
    challenge ? `${challenge.title}（コーディング問題）` : 'コーディング問題',
    challenge
      ? `${challenge.title}: 実際にJavaコードを書いて実行・自動採点。${challenge.description.slice(0, 60)}`
      : 'コーディング問題',
  )
  const { theme } = useTheme()
  const progressKey = `coding/${id}`

  const [code, setCode] = useState(challenge?.starterCode ?? '')
  const [stdin, setStdin] = useState('')
  const [result, setResult] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [judging, setJudging] = useState(false)
  const [judgeIdx, setJudgeIdx] = useState(0)
  const [tests, setTests] = useState<TestResult[] | null>(null)
  const [hintsShown, setHintsShown] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  if (!challenge) {
    return (
      <div className="page">
        <p>問題が見つかりませんでした。</p>
        <Link to="/coding" className="btn btn-ghost">
          一覧へ戻る
        </Link>
      </div>
    )
  }

  const solved = isStepDone(progressKey)
  const allPass = tests != null && tests.every((t) => t.pass)

  async function runOnce() {
    setRunning(true)
    setResult(null)
    setTests(null)
    const r = await runJava(code, stdin)
    setResult(r)
    setRunning(false)
  }

  async function judge() {
    if (!challenge) return
    setJudging(true)
    setResult(null)
    setTests(null)
    const out: TestResult[] = []
    for (let i = 0; i < challenge.tests.length; i++) {
      const t = challenge.tests[i]
      setJudgeIdx(i)
      const r = await runJava(code, t.stdin)
      if (r.error || r.compileError) {
        // 実行不能なら全体エラーとして表示して中断
        setResult(r)
        setJudging(false)
        return
      }
      out.push({
        name: t.name,
        pass: normalizeOutput(r.stdout) === normalizeOutput(t.expected),
        got: r.stdout,
        expected: t.expected,
      })
    }
    setTests(out)
    if (out.every((t) => t.pass)) {
      completeStep(progressKey, true)
    }
    setJudging(false)
  }

  const busy = running || judging

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">ホーム</Link> <span>/</span>{' '}
        <Link to="/coding">コーディング問題</Link> <span>/</span> {challenge.title}
      </nav>

      <header className="challenge-header">
        <div>
          <span className="course-level">{challenge.level}</span>
          <h1>{challenge.title}</h1>
        </div>
        {solved && <span className="challenge-solved">✓ クリア済み</span>}
      </header>

      <div className="challenge-desc slide-body">
        <MiniMarkdown text={challenge.description} />
      </div>

      <div className="cm-wrap">
        <CodeMirror
          value={code}
          height="300px"
          theme={theme === 'dark' ? oneDark : 'light'}
          extensions={[java()]}
          onChange={setCode}
        />
      </div>

      <details className="stdin-box">
        <summary>おためし実行用の標準入力（任意）</summary>
        <textarea
          className="stdin-area"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="自分で動作確認するときの入力"
          rows={2}
        />
      </details>

      <div className="exercise-actions">
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={judge}
          disabled={busy}
          whileHover={{ scale: busy ? 1 : 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          {judging ? (
            <>
              <span className="btn-spinner" aria-hidden="true" />
              採点中…
            </>
          ) : (
            '提出して採点'
          )}
        </motion.button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={runOnce}
          disabled={busy}
        >
          {running ? '実行中…' : '▶ おためし実行'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setCode(challenge.starterCode)}
          disabled={busy}
        >
          リセット
        </button>
      </div>

      <RunOutput result={result} running={running} />

      {judging && (
        <motion.div
          className="judging-box"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="spinner" aria-hidden="true" />
          <div className="judging-main">
            <div className="judging-title">
              採点中… テスト {Math.min(judgeIdx + 1, challenge.tests.length)} /{' '}
              {challenge.tests.length} を実行
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${(judgeIdx / challenge.tests.length) * 100}%`,
                  backgroundColor: '#ea580c',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {tests && (
        <div className="testresults">
          <motion.div
            className={'testresults-summary ' + (allPass ? 'pass' : 'fail')}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            {allPass
              ? `全テスト通過！🎉${solved ? '' : ' +20 XP'}`
              : `${tests.filter((t) => t.pass).length} / ${tests.length} テスト通過`}
          </motion.div>
          <ul className="testcase-list">
            {tests.map((t, i) => (
              <motion.li
                key={i}
                className={t.pass ? 'tc ok' : 'tc ng'}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="tc-head">
                  <span className="tc-mark">{t.pass ? '✓' : '✕'}</span>
                  <span className="tc-name">テスト: {t.name}</span>
                </div>
                {!t.pass && (
                  <div className="tc-detail">
                    <div>
                      <span className="tc-label">期待</span>
                      <pre>{t.expected || '(なし)'}</pre>
                    </div>
                    <div>
                      <span className="tc-label">出力</span>
                      <pre>{t.got || '(なし)'}</pre>
                    </div>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="challenge-help">
        {challenge.hints.length > 0 && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              setHintsShown((n) => Math.min(n + 1, challenge.hints.length))
            }
            disabled={hintsShown >= challenge.hints.length}
          >
            ヒントを見る ({hintsShown}/{challenge.hints.length})
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setShowSolution((s) => !s)}
        >
          {showSolution ? '解答例を隠す' : '解答例を見る'}
        </button>
      </div>

      {hintsShown > 0 && (
        <div className="hints">
          <div className="hints-title">ヒント</div>
          <ol>
            {challenge.hints.slice(0, hintsShown).map((h, i) => (
              <li key={i}>
                <pre className="hint-text">{h}</pre>
              </li>
            ))}
          </ol>
        </div>
      )}

      {showSolution && (
        <div className="solution-box">
          <div className="hints-title">解答例</div>
          <pre className="code-block">
            <code>{challenge.solution}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
