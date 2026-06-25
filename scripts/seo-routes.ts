// プリレンダリング/サイトマップ生成用に、全ルートのSEOメタ情報を列挙する。
// アプリの実データ（コース・問題）から生成して重複を避ける。
import { courses } from '../src/data/courses'
import { challenges } from '../src/data/challenges'
import { EXAM_PASS_PERCENT } from '../src/data/exam'

export interface RouteMeta {
  /** ルートのパス（先頭スラッシュなし。'' はトップ） */
  path: string
  title: string
  description: string
  priority: number
}

/** マークダウン記号や改行を除去して説明文を1行に整える */
function clean(s: string, max = 150): string {
  const t = s
    .replace(/[`*#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return t.length > max ? t.slice(0, max - 1) + '…' : t
}

export function getRoutes(): RouteMeta[] {
  const routes: RouteMeta[] = []

  routes.push({
    path: '',
    title: 'ブラウザで学ぶ無料Java入門・コーディング学習',
    description:
      'JavaLearnはProgateを参考にした無料のJava学習アプリ。スライドで学び、ブラウザ上で実際にコードを書いて実行。基礎・オブジェクト指向・Java Silver(1Z0-815)対策・80問模擬試験・コーディング問題まで。',
    priority: 1.0,
  })
  routes.push({
    path: 'coding',
    title: 'コーディング問題（実際にJavaを書いて実行・採点）',
    description:
      '実際にJavaコードを書いて本物の環境で実行・自動採点するコーディング問題集。配列・コレクション・例外処理・クラス設計・継承・インタフェースまで実践的に学べます。',
    priority: 0.9,
  })
  routes.push({
    path: 'playground',
    title: 'Javaコードプレイグラウンド（オンライン実行）',
    description:
      'ブラウザ上で自由にJavaコードを書いてコンパイル・実行できる無料オンライン実行環境。標準入力にも対応。',
    priority: 0.8,
  })
  routes.push({
    path: 'exam',
    title: `Java Silver SE 11 模擬試験 80問（合格ライン${EXAM_PASS_PERCENT}%）`,
    description:
      'Java SE 11 Programmer I (1Z0-815) を想定した本番形式の模擬試験80問。制限時間90分、まとめて採点し合否判定・解説つき。',
    priority: 0.9,
  })

  for (const c of courses) {
    routes.push({
      path: `course/${c.id}`,
      title: `${c.title}（${c.level}）`,
      description: clean(
        `${c.subtitle} 全${c.lessons.length}レッスンをスライドと演習で学べます。`,
      ),
      priority: 0.8,
    })
    for (const l of c.lessons) {
      routes.push({
        path: `course/${c.id}/lesson/${l.id}`,
        title: `${l.title} - ${c.title}`,
        description: clean(`${l.summary} ${c.title}のレッスン。`),
        priority: 0.6,
      })
    }
  }

  for (const ch of challenges) {
    routes.push({
      path: `coding/${ch.id}`,
      title: `${ch.title}（Javaコーディング問題・${ch.level}）`,
      description: clean(`${ch.category}: ${ch.description}`),
      priority: 0.6,
    })
  }

  return routes
}
