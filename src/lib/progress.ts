// localStorage を使った進捗・XP・レベル管理。
// 完了したステップIDの集合と累計XPを保存する。

const STORAGE_KEY = 'javalearn:progress:v1'
const XP_PER_SLIDE = 5
const XP_PER_EXERCISE = 20

export interface ProgressState {
  /** 完了したステップID `${courseId}/${lessonId}/${stepId}` の集合 */
  completed: string[]
  xp: number
}

type Listener = (state: ProgressState) => void
const listeners = new Set<Listener>()

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressState>
      return {
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      }
    }
  } catch {
    // 破損時は初期状態
  }
  return { completed: [], xp: 0 }
}

let state: ProgressState = load()

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // 保存失敗は無視（プライベートモード等）
  }
  listeners.forEach((l) => l(state))
}

export function getProgress(): ProgressState {
  return state
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function stepKey(
  courseId: string,
  lessonId: string,
  stepId: string,
): string {
  return `${courseId}/${lessonId}/${stepId}`
}

export function isStepDone(key: string): boolean {
  return state.completed.includes(key)
}

/** ステップを完了にする。新規完了なら種類に応じてXPを加算する */
export function completeStep(key: string, isExercise: boolean): void {
  if (state.completed.includes(key)) return
  state = {
    completed: [...state.completed, key],
    xp: state.xp + (isExercise ? XP_PER_EXERCISE : XP_PER_SLIDE),
  }
  persist()
}

/** 進捗をすべてリセットする */
export function resetProgress(): void {
  state = { completed: [], xp: 0 }
  persist()
}

/** XP からレベルを算出（100XPごとに1レベル、Lv.1 始まり） */
export function levelFromXp(xp: number): { level: number; intoLevel: number; needed: number } {
  const level = Math.floor(xp / 100) + 1
  const intoLevel = xp % 100
  return { level, intoLevel, needed: 100 }
}

/** 指定したステップキー群のうち完了している割合(0-100) */
export function completionRate(stepKeys: string[]): number {
  if (stepKeys.length === 0) return 0
  const done = stepKeys.filter((k) => state.completed.includes(k)).length
  return Math.round((done / stepKeys.length) * 100)
}
