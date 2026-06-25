import type { RunResult } from '../lib/runner'

/** 実行結果（標準出力・エラー・コンパイルエラー）を表示するコンソール */
export function RunOutput({
  result,
  running,
}: {
  result: RunResult | null
  running: boolean
}) {
  if (running) {
    return (
      <div className="console">
        <div className="console-title">実行中…</div>
        <pre className="console-output console-running">
          サーバーでコンパイル・実行しています…
        </pre>
      </div>
    )
  }
  if (!result) return null

  if (result.error) {
    return (
      <div className="console">
        <div className="console-title">エラー</div>
        <pre className="console-output console-err">{result.error}</pre>
      </div>
    )
  }
  if (result.compileError) {
    return (
      <div className="console">
        <div className="console-title">コンパイルエラー</div>
        <pre className="console-output console-err">{result.compileError}</pre>
      </div>
    )
  }

  return (
    <div className="console">
      <div className="console-title">
        実行結果{result.exitCode != null ? `（終了コード ${result.exitCode}）` : ''}
      </div>
      <pre className="console-output">
        {result.stdout || '(標準出力なし)'}
      </pre>
      {result.stderr && (
        <pre className="console-output console-err">{result.stderr}</pre>
      )}
    </div>
  )
}
