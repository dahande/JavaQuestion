import type { Course } from '../../types'

// Java II オブジェクト指向（骨組み）。
// レッスンのタイトルは並べつつ、先頭1レッスンのみ中身を用意している。

export const javaOop: Course = {
  id: 'java-oop',
  title: 'Java II オブジェクト指向',
  subtitle: 'クラスとインスタンス、継承、インタフェースを学びます。',
  level: '初級',
  color: '#7c3aed',
  icon: '🧩',
  status: 'ready',
  lessons: [
    {
      id: 'class',
      title: '1. クラスとインスタンス',
      summary: '設計図(クラス)から実体(インスタンス)を作ります。',
      steps: [
        {
          type: 'slide',
          id: 'what-class',
          title: 'クラスとは',
          body:
            'クラスは「設計図」です。データ（フィールド）とふるまい（メソッド）をまとめて定義します。設計図から作られた実体を **インスタンス（オブジェクト）** と呼びます。',
          code:
            'class User {\n  String name;\n  void hello() {\n    System.out.println("私は" + name + "です");\n  }\n}',
        },
        {
          type: 'slide',
          id: 'new',
          title: 'インスタンスを作る',
          body:
            '`new クラス名()` でインスタンスを作ります。フィールドには `.` でアクセスできます。',
          code:
            'User u = new User();\nu.name = "佐藤";\nu.hello(); // 私は佐藤です',
        },
        {
          type: 'exercise',
          id: 'ex-new-blank',
          title: 'インスタンスを作ろう',
          prompt:
            '`User` クラスのインスタンスを作り、名前を設定して `hello()` を呼び出す部分の空欄をうめてください。',
          kind: 'blank',
          starterCode:
            'class User {\n  String name;\n  void hello() {\n    System.out.println("私は" + name + "です");\n  }\n}\npublic class Main {\n  public static void main(String[] args) {\n    User u = ___ User();\n    u.name = "佐藤";\n    u.___();\n  }\n}',
          blanks: [['new'], ['hello']],
          expectedOutput: '私は佐藤です',
          hints: [
            'インスタンス生成のキーワードは new です。',
            '定義したメソッド名は hello です。',
          ],
        },
      ],
    },
    {
      id: 'constructor',
      title: '2. コンストラクタ',
      summary: 'インスタンス生成時の初期化処理を学びます。（準備中）',
      steps: [
        {
          type: 'slide',
          id: 'coming-soon',
          title: '準備中',
          body:
            'このレッスンは現在準備中です。コンストラクタを使ったフィールドの初期化を扱う予定です。お楽しみに！',
        },
      ],
    },
    {
      id: 'inheritance',
      title: '3. 継承',
      summary: '既存クラスを引き継いで拡張します。（準備中）',
      steps: [
        {
          type: 'slide',
          id: 'coming-soon',
          title: '準備中',
          body:
            'このレッスンは現在準備中です。extends を使った継承とメソッドのオーバーライドを扱う予定です。',
        },
      ],
    },
    {
      id: 'interface',
      title: '4. インタフェース',
      summary: '実装すべきメソッドの約束を定義します。（準備中）',
      steps: [
        {
          type: 'slide',
          id: 'coming-soon',
          title: '準備中',
          body:
            'このレッスンは現在準備中です。interface と implements を扱う予定です。',
        },
      ],
    },
  ],
}
