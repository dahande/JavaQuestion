import type { Course } from '../../types'

// Java I 入門コース（作り込み）。
// 各レッスンは「数枚のスライド + 演習」で構成し、Progate のように
// 読んで理解 -> 手を動かす、の流れになるようにしている。

export const javaIntro: Course = {
  id: 'java-intro',
  title: 'Java I 入門',
  subtitle: 'はじめてのJava。出力・変数・条件分岐・ループ・配列・メソッドまで。',
  level: '入門',
  color: '#2563eb',
  icon: '☕',
  status: 'ready',
  lessons: [
    {
      id: 'output',
      title: '1. 文字を出力する',
      summary: 'System.out.println で画面に文字を表示します。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: 'Javaへようこそ',
          body:
            'Java は世界中で使われている人気のプログラミング言語です。Android アプリ、業務システム、Webサービスなど幅広く活躍しています。\n\nこのコースでは、実際にコードを書きながら Java の基礎を学んでいきます。まずは画面に文字を表示するところから始めましょう。',
        },
        {
          type: 'slide',
          id: 'println',
          title: 'println で出力する',
          body:
            '画面に文字を表示するには `System.out.println()` を使います。カッコの中に表示したい内容を書きます。\n\n文字列（テキスト）はダブルクォーテーション `"` で囲みます。文の終わりには必ずセミコロン `;` をつけます。',
          code:
            'public class Main {\n  public static void main(String[] args) {\n    System.out.println("こんにちは");\n  }\n}',
        },
        {
          type: 'exercise',
          id: 'ex-hello',
          title: 'Hello, World! を出力',
          prompt:
            '`System.out.println` を使って、`Hello, World!` と表示してください。文字列はダブルクォーテーションで囲み、最後にセミコロンを忘れずに。',
          kind: 'write',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    // ここにコードを書いてください\n\n  }\n}',
          requiredTokens: ['System\\.out\\.println', '"Hello, World!"'],
          expectedOutput: 'Hello, World!',
          hints: [
            'System.out.println( ) のカッコの中に表示したい文字列を入れます。',
            '文字列は "Hello, World!" のようにダブルクォーテーションで囲みます。',
            '答え: System.out.println("Hello, World!");',
          ],
        },
        {
          type: 'exercise',
          id: 'ex-blank-print',
          title: '空欄をうめよう',
          prompt:
            '`さようなら` と出力されるように、空欄をうめてください。',
          kind: 'blank',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    System.out.___("___");\n  }\n}',
          blanks: [['println'], ['さようなら']],
          expectedOutput: 'さようなら',
          hints: [
            '改行付きで出力するメソッドは println です。',
            '表示したい文字をそのまま2つ目の空欄に入れます。',
          ],
        },
      ],
    },
    {
      id: 'variables',
      title: '2. 変数と型',
      summary: '値に名前をつけて再利用する「変数」を学びます。',
      steps: [
        {
          type: 'slide',
          id: 'what',
          title: '変数とは',
          body:
            '変数は値を入れておく「箱」のようなものです。`型 変数名 = 値;` の形で作ります（これを宣言と代入と呼びます）。\n\n一度作った変数は、名前で何度でも使えます。',
          code:
            'int age = 20;\nString name = "田中";\nSystem.out.println(name);',
        },
        {
          type: 'slide',
          id: 'types',
          title: '基本的な型',
          body:
            'Java では値の種類ごとに「型」を指定します。よく使うものは次の通りです。\n\n- `int` … 整数 (例: 10, -3)\n- `double` … 小数 (例: 3.14)\n- `String` … 文字列 (例: "hello")\n- `boolean` … 真偽値 (true / false)',
        },
        {
          type: 'exercise',
          id: 'ex-var',
          title: '変数を作って出力',
          prompt:
            'int型の変数 `score` を作って `100` を代入し、その値を出力してください。',
          kind: 'write',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n\n  }\n}',
          requiredTokens: ['int\\s+score\\s*=\\s*100', 'System\\.out\\.println\\s*\\(\\s*score\\s*\\)'],
          expectedOutput: '100',
          hints: [
            '整数の型は int です。「int score = 100;」のように書きます。',
            '出力は System.out.println(score); のように変数名をそのまま入れます。',
            '答え:\nint score = 100;\nSystem.out.println(score);',
          ],
        },
        {
          type: 'exercise',
          id: 'ex-var-blank',
          title: '型をうめよう',
          prompt:
            '文字列 `"Java"` を入れる変数を作ります。適切な型と出力メソッドで空欄をうめてください。',
          kind: 'blank',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    ___ language = "Java";\n    System.out.___(language);\n  }\n}',
          blanks: [['String'], ['println']],
          expectedOutput: 'Java',
          hints: [
            '文字列の型は String です（先頭は大文字）。',
            '出力メソッドは println です。',
          ],
        },
      ],
    },
    {
      id: 'operators',
      title: '3. 計算と文字列の連結',
      summary: '四則演算と、文字列をつなげる + を学びます。',
      steps: [
        {
          type: 'slide',
          id: 'math',
          title: '計算をする',
          body:
            '数値は `+ - * /` で計算できます。`%` は割り算の余りです。\n\n計算結果はそのまま出力したり、変数に入れたりできます。',
          code: 'int a = 7;\nint b = 3;\nSystem.out.println(a + b); // 10\nSystem.out.println(a % b); // 1',
        },
        {
          type: 'slide',
          id: 'concat',
          title: '文字列をつなげる',
          body:
            '`+` は文字列をつなげる（連結する）ためにも使えます。文字列と数値を `+` でつなぐと、数値は自動的に文字列になります。',
          code: 'String name = "田中";\nint age = 20;\nSystem.out.println(name + "さんは" + age + "歳");',
        },
        {
          type: 'exercise',
          id: 'ex-calc',
          title: '足し算の結果を出力',
          prompt: '`5 + 8` の計算結果を出力してください。',
          kind: 'write',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n\n  }\n}',
          requiredTokens: ['System\\.out\\.println\\s*\\(\\s*5\\s*\\+\\s*8\\s*\\)'],
          expectedOutput: '13',
          hints: [
            'カッコの中で計算式をそのまま書けます。',
            '答え: System.out.println(5 + 8);',
          ],
        },
        {
          type: 'exercise',
          id: 'ex-concat-blank',
          title: '連結をうめよう',
          prompt:
            '`合計は15点` と出力されるように空欄をうめてください。',
          kind: 'blank',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    int total = 15;\n    System.out.println("合計は" ___ total ___ "点");\n  }\n}',
          blanks: [['+'], ['+']],
          expectedOutput: '合計は15点',
          hints: [
            '文字列と変数をつなげる記号は + です。',
          ],
        },
      ],
    },
    {
      id: 'if',
      title: '4. 条件分岐 (if)',
      summary: '条件によって処理を切り替える if文を学びます。',
      steps: [
        {
          type: 'slide',
          id: 'if-basic',
          title: 'if文の書き方',
          body:
            '`if` を使うと「もし〜なら」という条件で処理を分けられます。条件が成り立つ（true の）ときだけカッコ `{ }` の中が実行されます。\n\n比較には `==`（等しい）, `!=`（等しくない）, `>` `<` `>=` `<=` を使います。',
          code:
            'int score = 80;\nif (score >= 60) {\n  System.out.println("合格");\n}',
        },
        {
          type: 'slide',
          id: 'else',
          title: 'else で「そうでなければ」',
          body:
            '条件が成り立たなかったときの処理は `else` に書きます。さらに条件を足したいときは `else if` を使います。',
          code:
            'int score = 50;\nif (score >= 60) {\n  System.out.println("合格");\n} else {\n  System.out.println("不合格");\n}',
        },
        {
          type: 'exercise',
          id: 'ex-if-blank',
          title: 'if文をうめよう',
          prompt:
            '`age` が `20` 以上のとき `成人` と表示されるように空欄をうめてください。',
          kind: 'blank',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    int age = 25;\n    ___ (age ___ 20) {\n      System.out.println("成人");\n    }\n  }\n}',
          blanks: [['if'], ['>=']],
          expectedOutput: '成人',
          hints: [
            '条件分岐のキーワードは if です。',
            '「20以上」は >= で表します。',
          ],
        },
        {
          type: 'exercise',
          id: 'ex-if-write',
          title: 'else を書こう',
          prompt:
            '`number` が偶数なら `偶数`、そうでなければ `奇数` と出力する if-else を完成させてください（`number % 2 == 0` で偶数判定）。',
          kind: 'write',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    int number = 4;\n    // ここに if-else を書く\n\n  }\n}',
          requiredTokens: [
            'if\\s*\\(\\s*number\\s*%\\s*2\\s*==\\s*0\\s*\\)',
            '"偶数"',
            'else',
            '"奇数"',
          ],
          expectedOutput: '偶数',
          hints: [
            'if (number % 2 == 0) { ... } else { ... } の形です。',
            'true の側で "偶数"、else の側で "奇数" を出力します。',
            '答え:\nif (number % 2 == 0) {\n  System.out.println("偶数");\n} else {\n  System.out.println("奇数");\n}',
          ],
        },
      ],
    },
    {
      id: 'loop',
      title: '5. 繰り返し (for / while)',
      summary: '同じ処理を繰り返すループを学びます。',
      steps: [
        {
          type: 'slide',
          id: 'for',
          title: 'for文',
          body:
            '`for` は決まった回数だけ繰り返すときに使います。`for (初期化; 条件; 更新)` の3つを指定します。\n\n下の例は 1 から 3 まで順に出力します。',
          code:
            'for (int i = 1; i <= 3; i++) {\n  System.out.println(i);\n}',
        },
        {
          type: 'slide',
          id: 'while',
          title: 'while文',
          body:
            '`while` は条件が成り立つ間ずっと繰り返します。回数が決まっていないときに便利です。ループ内で条件を変化させないと無限ループになるので注意しましょう。',
          code:
            'int i = 0;\nwhile (i < 3) {\n  System.out.println(i);\n  i++;\n}',
        },
        {
          type: 'exercise',
          id: 'ex-for-blank',
          title: 'for文をうめよう',
          prompt:
            '`0`, `1`, `2` と順番に出力されるように、for文の空欄をうめてください。',
          kind: 'blank',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    for (int i = 0; i ___ 3; i___) {\n      System.out.println(i);\n    }\n  }\n}',
          blanks: [['<'], ['++']],
          expectedOutput: '0\n1\n2',
          hints: [
            '3未満なので i < 3 です。',
            '1ずつ増やすのは i++ です。',
          ],
        },
        {
          type: 'exercise',
          id: 'ex-for-write',
          title: '1〜5の合計',
          prompt:
            'for文を使って 1 から 5 までの合計を計算し、結果を出力してください（変数 `sum` を使います）。',
          kind: 'write',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    int sum = 0;\n    // for文で 1〜5 を足す\n\n    System.out.println(sum);\n  }\n}',
          requiredTokens: [
            'for\\s*\\(',
            'sum\\s*\\+=|sum\\s*=\\s*sum\\s*\\+',
            'System\\.out\\.println\\s*\\(\\s*sum\\s*\\)',
          ],
          expectedOutput: '15',
          hints: [
            'for (int i = 1; i <= 5; i++) で 1〜5 を回します。',
            'ループの中で sum += i; とすると合計が求まります。',
            '答え:\nfor (int i = 1; i <= 5; i++) {\n  sum += i;\n}\nSystem.out.println(sum);',
          ],
        },
      ],
    },
    {
      id: 'array',
      title: '6. 配列',
      summary: '複数の値をまとめて扱う配列を学びます。',
      steps: [
        {
          type: 'slide',
          id: 'array-basic',
          title: '配列の作り方',
          body:
            '配列を使うと、同じ型の値をまとめて1つの変数で扱えます。`型[] 名前 = {値, 値, ...};` で作ります。\n\n要素には `配列名[番号]` でアクセスします。番号（インデックス）は **0から** 始まる点に注意しましょう。',
          code:
            'int[] scores = {80, 90, 100};\nSystem.out.println(scores[0]); // 80\nSystem.out.println(scores.length); // 3',
        },
        {
          type: 'slide',
          id: 'array-loop',
          title: '配列とループ',
          body:
            '配列の全要素を順に処理するには for文と組み合わせます。`配列名.length` で要素数が分かります。',
          code:
            'int[] scores = {80, 90, 100};\nfor (int i = 0; i < scores.length; i++) {\n  System.out.println(scores[i]);\n}',
        },
        {
          type: 'exercise',
          id: 'ex-array-blank',
          title: '要素を取り出そう',
          prompt:
            '配列 `fruits` の2番目の要素 `みかん` を出力してください（インデックスに注意）。',
          kind: 'blank',
          starterCode:
            'public class Main {\n  public static void main(String[] args) {\n    String[] fruits = {"りんご", "みかん", "ぶどう"};\n    System.out.println(fruits[___]);\n  }\n}',
          blanks: [['1']],
          expectedOutput: 'みかん',
          hints: [
            'インデックスは0から始まります。1番目が0、2番目が…',
          ],
        },
      ],
    },
    {
      id: 'method',
      title: '7. メソッド',
      summary: '処理に名前をつけてまとめるメソッドを学びます。',
      steps: [
        {
          type: 'slide',
          id: 'method-basic',
          title: 'メソッドとは',
          body:
            'メソッドは「処理のまとまり」に名前をつけたものです。同じ処理を何度も書かずに、呼び出すだけで使えます。\n\n`戻り値の型 名前(引数) { ... }` の形で定義します。値を返さない場合は型に `void` を使います。',
          code:
            'static void greet() {\n  System.out.println("こんにちは");\n}\n// 呼び出し\ngreet();',
        },
        {
          type: 'slide',
          id: 'method-return',
          title: '引数と戻り値',
          body:
            'メソッドは値を受け取って（引数）、結果を返す（戻り値）ことができます。値を返すには `return` を使います。',
          code:
            'static int add(int a, int b) {\n  return a + b;\n}\nint result = add(3, 4); // 7',
        },
        {
          type: 'exercise',
          id: 'ex-method-blank',
          title: 'メソッドをうめよう',
          prompt:
            '2つの数を掛けて返すメソッド `multiply` を完成させてください。',
          kind: 'blank',
          starterCode:
            'public class Main {\n  static int multiply(int a, int b) {\n    ___ a * b;\n  }\n  public static void main(String[] args) {\n    System.out.println(multiply(4, 5));\n  }\n}',
          blanks: [['return']],
          expectedOutput: '20',
          hints: [
            '値を返すキーワードは return です。',
          ],
        },
      ],
    },
  ],
}
