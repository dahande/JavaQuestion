// アプリ全体で使う学習コンテンツのデータ構造。
// コース -> レッスン -> ステップ（スライド / 演習）の3階層。

export type CourseStatus = 'ready' | 'wip'

export interface Course {
  id: string
  title: string
  subtitle: string
  /** 難易度ラベル（例: 入門 / 初級 / 中級） */
  level: string
  /** カードのアクセントカラー（CSSカラー値） */
  color: string
  /** カードに表示する絵文字アイコン */
  icon: string
  status: CourseStatus
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  summary: string
  steps: Step[]
}

export type Step = SlideStep | ExerciseStep

export interface SlideStep {
  type: 'slide'
  id: string
  title: string
  /** 本文（簡易マークダウン: 段落・**強調**・`コード`・- 箇条書き に対応） */
  body: string
  /** 補足として表示するコードサンプル（任意） */
  code?: string
}

/**
 * 演習ステップ。2方式をサポートする。
 * - kind: 'blank' … starterCode 内の `___` を入力欄にして blanks と照合
 * - kind: 'write' … 全文入力。solution / requiredTokens で照合
 * いずれも擬似実行で expectedOutput を「実行結果」として表示する。
 */
export interface ExerciseStep {
  type: 'exercise'
  id: string
  title: string
  /** 演習で何をするかの説明文（簡易マークダウン対応） */
  prompt: string
  kind: 'blank' | 'write'
  /** ひな形コード。blank の場合 `___` がそのまま入力欄になる */
  starterCode: string
  /** kind: 'blank' のとき、各空欄の正解候補（順番どおり）。各要素は許容回答の配列 */
  blanks?: string[][]
  /** kind: 'write' のとき、正解コード候補（正規化して比較） */
  solution?: string[]
  /** kind: 'write' のとき、必ず含まれているべきトークン（正規表現文字列） */
  requiredTokens?: string[]
  /** 正解時に擬似コンソールへ表示する出力 */
  expectedOutput: string
  /** 段階的に開示するヒント */
  hints: string[]
}
