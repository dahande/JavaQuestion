// ブラウザから実際にJavaコードをコンパイル・実行するためのクライアント。
// バックエンド不要。認証不要の公開API（Wandbox / Piston）を順に試し、
// どちらかが使えれば結果を返す（片方が落ちても動くようにフォールバック）。
// public クラス名は Main を想定。

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

class BackendError extends Error {}

// ---------- Wandbox ----------
// 有効なJavaコンパイラ名は固定せず、list.json から動的に取得する
// （'openjdk-head' などは時期により無効化され HTTP 500 になるため）。
let wandboxJavaCompilers: string[] | null = null

async function getWandboxJavaCompilers(signal: AbortSignal): Promise<string[]> {
  if (wandboxJavaCompilers) return wandboxJavaCompilers
  const res = await fetch('https://wandbox.org/api/list.json', { signal })
  if (!res.ok) throw new BackendError(`Wandbox list HTTP ${res.status}`)
  const list: Array<{ name: string; language: string }> = await res.json()
  const javas = list
    .filter((c) => c.language === 'Java')
    .map((c) => c.name)
  // 安定版の openjdk を優先し、head 系は後回しにする
  const stable = javas.filter((n) => /openjdk/i.test(n) && !/head/i.test(n))
  const head = javas.filter((n) => /head/i.test(n))
  const rest = javas.filter((n) => !stable.includes(n) && !head.includes(n))
  wandboxJavaCompilers = [...stable, ...rest, ...head]
  if (wandboxJavaCompilers.length === 0) {
    throw new BackendError('Wandbox: 利用可能なJavaコンパイラが見つかりません')
  }
  return wandboxJavaCompilers
}

async function runWandbox(
  source: string,
  stdin: string,
  signal: AbortSignal,
): Promise<RunResult> {
  const compilers = await getWandboxJavaCompilers(signal)
  let lastStatus = 0
  // 先頭の候補から順に試し、500（コンパイラ不調）なら次へ
  for (const compiler of compilers.slice(0, 4)) {
    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({ compiler, code: source, stdin, save: false }),
    })
    if (res.status >= 500) {
      lastStatus = res.status
      continue
    }
    if (!res.ok) throw new BackendError(`Wandbox HTTP ${res.status}`)
    // 成功した候補を以後も使うよう先頭へ
    wandboxJavaCompilers = [
      compiler,
      ...compilers.filter((c) => c !== compiler),
    ]
    const d = await res.json()
    const status = String(d.status ?? '')
    const compileErr = (d.compiler_error ?? '').trim()
    const stdout = d.program_output ?? ''
    const stderr = d.program_error ?? ''
    if (compileErr && stdout === '' && stderr === '' && status !== '0') {
      return {
        ran: false,
        compileError: compileErr,
        stdout: '',
        stderr: '',
        exitCode: Number(status) || null,
      }
    }
    return {
      ran: true,
      stdout,
      stderr: stderr || (compileErr ? compileErr : ''),
      exitCode: Number.isNaN(Number(status)) ? null : Number(status),
    }
  }
  throw new BackendError(`Wandbox HTTP ${lastStatus || 'error'}`)
}

// ---------- Piston (emkc) ----------
let pistonVersion: string | null = null

async function runPiston(
  source: string,
  stdin: string,
  signal: AbortSignal,
): Promise<RunResult> {
  if (!pistonVersion) {
    const r = await fetch('https://emkc.org/api/v2/piston/runtimes', { signal })
    if (!r.ok) throw new BackendError(`Piston runtimes HTTP ${r.status}`)
    const runtimes: Array<{ language: string; version: string }> = await r.json()
    pistonVersion =
      runtimes.find((x) => x.language === 'java')?.version ?? '15.0.2'
  }
  const res = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      language: 'java',
      version: pistonVersion,
      files: [{ name: 'Main.java', content: source }],
      stdin,
    }),
  })
  if (!res.ok) throw new BackendError(`Piston HTTP ${res.status}`)
  const data = await res.json()
  const compile = data.compile
  const run = data.run ?? {}
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
}

const BACKENDS: Array<{
  name: string
  fn: (s: string, i: string, sig: AbortSignal) => Promise<RunResult>
}> = [
  { name: 'Wandbox', fn: runWandbox },
  { name: 'Piston', fn: runPiston },
]

/**
 * Javaソースを実行。複数の実行サーバーを順に試し、最初に成功したものを返す。
 */
export async function runJava(
  source: string,
  stdin = '',
  timeoutMs = 25000,
): Promise<RunResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const failures: string[] = []
  try {
    for (const backend of BACKENDS) {
      try {
        return await backend.fn(source, stdin, controller.signal)
      } catch (e) {
        if (controller.signal.aborted) {
          return {
            ran: false,
            stdout: '',
            stderr: '',
            exitCode: null,
            error: '実行がタイムアウトしました。処理が重すぎないか確認してください。',
          }
        }
        const msg = e instanceof Error ? e.message : String(e)
        failures.push(`${backend.name}: ${msg}`)
        // 次のバックエンドへフォールバック
      }
    }
    return {
      ran: false,
      stdout: '',
      stderr: '',
      exitCode: null,
      error:
        'コード実行サーバーに接続できませんでした。時間をおいて再度お試しください。\n（' +
        failures.join(' / ') +
        '）',
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
