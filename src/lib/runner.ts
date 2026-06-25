// ブラウザから実際にJavaコードをコンパイル・実行するためのクライアント。
// 公開API「Piston」(https://github.com/engineer-man/piston) を利用する。
// バックエンド不要で、ユーザーのブラウザから直接呼び出す。

const PISTON_BASE = 'https://emkc.org/api/v2/piston'

let cachedVersion: string | null = null

/** 利用可能なJavaのバージョンを取得（キャッシュ） */
async function getJavaVersion(signal?: AbortSignal): Promise<string> {
  if (cachedVersion) return cachedVersion
  try {
    const res = await fetch(`${PISTON_BASE}/runtimes`, { signal })
    if (res.ok) {
      const runtimes: Array<{ language: string; version: string }> =
        await res.json()
      const java = runtimes.find((r) => r.language === 'java')
      if (java) {
        cachedVersion = java.version
        return cachedVersion
      }
    }
  } catch {
    // フォールバックへ
  }
  cachedVersion = '15.0.2'
  return cachedVersion
}

export interface RunResult {
  /** コンパイル・実行まで到達したか（プログラムの終了コードとは別） */
  ran: boolean
  compileError?: string
  stdout: string
  stderr: string
  exitCode: number | null
  /** ネットワーク等の実行外エラー */
  error?: string
}

/**
 * Javaソースを実行して結果を返す。
 * public クラス名は Main を想定（ファイル名 Main.java として送信）。
 */
export async function runJava(
  source: string,
  stdin = '',
  timeoutMs = 20000,
): Promise<RunResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const version = await getJavaVersion(controller.signal)
    const res = await fetch(`${PISTON_BASE}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        language: 'java',
        version,
        files: [{ name: 'Main.java', content: source }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 8000,
      }),
    })

    if (res.status === 429) {
      return {
        ran: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        error: '実行リクエストが多すぎます。少し待ってからもう一度お試しください。',
      }
    }
    if (!res.ok) {
      return {
        ran: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        error: `実行サーバーがエラーを返しました (HTTP ${res.status})。`,
      }
    }

    const data = await res.json()
    const compile = data.compile
    const run = data.run ?? {}

    // コンパイルエラー
    if (compile && typeof compile.code === 'number' && compile.code !== 0) {
      return {
        ran: false,
        compileError: (compile.stderr || compile.output || '').trim(),
        stdout: '',
        stderr: '',
        exitCode: compile.code,
      }
    }

    return {
      ran: true,
      stdout: run.stdout ?? '',
      stderr: run.stderr ?? '',
      exitCode: typeof run.code === 'number' ? run.code : null,
    }
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === 'AbortError'
    return {
      ran: false,
      stdout: '',
      stderr: '',
      exitCode: null,
      error: aborted
        ? '実行がタイムアウトしました。処理が重すぎないか確認してください。'
        : 'コード実行サーバーに接続できませんでした。ネットワーク環境をご確認ください。',
    }
  } finally {
    clearTimeout(timer)
  }
}

/** 出力比較用の正規化（末尾空白・改行差を吸収） */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '')
}
