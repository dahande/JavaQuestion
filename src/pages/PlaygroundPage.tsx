import { useState } from 'react'
import { Link } from 'react-router-dom'
import CodeMirror from '@uiw/react-codemirror'
import { java } from '@codemirror/lang-java'
import { oneDark } from '@codemirror/theme-one-dark'
import { motion } from 'framer-motion'
import { runJava, type RunResult } from '../lib/runner'
import { useTheme } from '../lib/theme'
import { useDocumentMeta } from '../lib/seo'
import { RunOutput } from '../components/RunOutput'

const DEFAULT_CODE =
  'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n\n    for (int i = 1; i <= 5; i++) {\n      System.out.println("i = " + i);\n    }\n  }\n}'

export function PlaygroundPage() {
  useDocumentMeta(
    'コードプレイグラウンド',
    'ブラウザ上で実際にJavaコードを書いて、コンパイル・実行できるプレイグラウンド。標準入力にも対応。',
  )
  const { theme } = useTheme()
  const [code, setCode] = useState(DEFAULT_CODE)
  const [stdin, setStdin] = useState('')
  const [result, setResult] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)

  async function run() {
    setRunning(true)
    setResult(null)
    const r = await runJava(code, stdin)
    setResult(r)
    setRunning(false)
  }

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/">ホーム</Link> <span>/</span> コードプレイグラウンド
      </nav>

      <header className="course-header" style={{ ['--accent' as string]: '#16a34a' }}>
        <span className="course-icon-lg" aria-hidden="true">🧪</span>
        <div>
          <h1>コードプレイグラウンド</h1>
          <p className="subtitle">
            自由にJavaを書いて実行できます。`public class Main` で書いてください。
          </p>
        </div>
      </header>

      <div className="cm-wrap">
        <CodeMirror
          value={code}
          height="320px"
          theme={theme === 'dark' ? oneDark : 'light'}
          extensions={[java()]}
          onChange={setCode}
        />
      </div>

      <details className="stdin-box">
        <summary>標準入力（任意）</summary>
        <textarea
          className="stdin-area"
          value={stdin}
          onChange={(e) => setStdin(e.target.value)}
          placeholder="Scanner などで読み取る入力をここに記述"
          rows={3}
        />
      </details>

      <div className="exercise-actions">
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={run}
          disabled={running}
          whileHover={{ scale: running ? 1 : 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          {running ? '実行中…' : '▶ 実行する'}
        </motion.button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setCode(DEFAULT_CODE)}
          disabled={running}
        >
          リセット
        </button>
      </div>

      <RunOutput result={result} running={running} />

      <p className="run-note">
        ※ 実行はオンラインの実行環境（Piston）を利用します。ネットワーク接続が必要です。
      </p>
    </div>
  )
}
