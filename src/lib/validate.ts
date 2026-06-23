import type { ExerciseStep } from '../types'

/** 比較用にコードを正規化する（空白・改行・末尾の差異を吸収） */
function normalize(code: string): string {
  return code
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n')
    // 連続する空白を1つに、記号まわりの空白を除去
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*([;{}()=+\-*/%<>,.])\s*/g, '$1')
    .trim()
}

/** 1つの空欄に対する回答が正解候補のいずれかと一致するか */
function matchBlank(answer: string, candidates: string[]): boolean {
  const a = answer.trim().toLowerCase()
  return candidates.some((c) => c.trim().toLowerCase() === a)
}

export interface ValidationResult {
  correct: boolean
  /** 不正解時のフィードバック（誤っている箇所のインデックスなど） */
  wrongBlankIndexes?: number[]
  message?: string
}

/** 穴埋め型演習の答え合わせ */
export function validateBlanks(
  exercise: ExerciseStep,
  answers: string[],
): ValidationResult {
  const blanks = exercise.blanks ?? []
  const wrong: number[] = []
  blanks.forEach((candidates, i) => {
    if (!matchBlank(answers[i] ?? '', candidates)) {
      wrong.push(i)
    }
  })
  if (wrong.length === 0) {
    return { correct: true }
  }
  return {
    correct: false,
    wrongBlankIndexes: wrong,
    message:
      wrong.length === blanks.length
        ? 'まだ正解ではありません。空欄を見直してみましょう。'
        : `${wrong.length}箇所の空欄が正しくありません。`,
  }
}

/** 記述型演習の答え合わせ */
export function validateWrite(
  exercise: ExerciseStep,
  code: string,
): ValidationResult {
  // 1) 解答候補との完全一致（正規化後）
  if (exercise.solution && exercise.solution.length > 0) {
    const target = normalize(code)
    if (exercise.solution.some((s) => normalize(s) === target)) {
      return { correct: true }
    }
  }
  // 2) 必須トークンがすべて含まれているか
  if (exercise.requiredTokens && exercise.requiredTokens.length > 0) {
    const missing = exercise.requiredTokens.filter(
      (t) => !new RegExp(t).test(code),
    )
    if (missing.length === 0) {
      return { correct: true }
    }
    return {
      correct: false,
      message: 'コードに足りない要素があります。ヒントを確認しましょう。',
    }
  }
  return {
    correct: false,
    message: 'まだ正解ではありません。お手本と見比べてみましょう。',
  }
}

/** 演習の種類に応じて答え合わせを行う */
export function validateExercise(
  exercise: ExerciseStep,
  input: { answers?: string[]; code?: string },
): ValidationResult {
  if (exercise.kind === 'blank') {
    return validateBlanks(exercise, input.answers ?? [])
  }
  return validateWrite(exercise, input.code ?? '')
}
