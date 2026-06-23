import type { Course } from '../../types'

// Java Silver 対策（骨組み）。
// 試験対策コースの枠。現時点では「準備中」ステータスで表示する。

export const javaSilver: Course = {
  id: 'java-silver',
  title: 'Java Silver 対策',
  subtitle: 'Java SE 認定資格 (Silver) に向けた頻出テーマの問題演習。',
  level: '中級',
  color: '#0891b2',
  icon: '🏅',
  status: 'wip',
  lessons: [
    {
      id: 'overview',
      title: '1. 試験範囲の概要',
      summary: '出題範囲と学習の進め方。（準備中）',
      steps: [
        {
          type: 'slide',
          id: 'coming-soon',
          title: '準備中',
          body:
            'このコースは現在準備中です。データ型・演算子・制御構文・配列・クラス設計・例外処理など、Silver 試験の頻出テーマを問題形式で扱う予定です。',
        },
      ],
    },
  ],
}
