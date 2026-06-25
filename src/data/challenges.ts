// 実際にコードを書いて実行・採点するコーディング問題。
// 各問題はテストケース（標準入力 stdin と期待される標準出力 expected）を持ち、
// ユーザーのコードを本物のJavaで実行して出力を照合する。
// public クラスは Main を前提とする。

export interface CodingTest {
  name: string
  stdin: string
  expected: string
}

export interface Challenge {
  id: string
  title: string
  level: '入門' | '初級' | '中級'
  category: string
  /** 問題文（簡易マークダウン対応） */
  description: string
  starterCode: string
  tests: CodingTest[]
  hints: string[]
  solution: string
}

export const challenges: Challenge[] = [
  {
    id: 'hello',
    title: 'Hello, World!',
    level: '入門',
    category: '出力',
    description:
      '標準出力に `Hello, World!` と表示するプログラムを作成してください。',
    starterCode:
      'public class Main {\n  public static void main(String[] args) {\n    // ここに書く\n  }\n}',
    tests: [{ name: '出力', stdin: '', expected: 'Hello, World!' }],
    hints: ['System.out.println("...") を使います。'],
    solution:
      'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  },
  {
    id: 'sum-two',
    title: '2つの整数の和',
    level: '入門',
    category: '標準入力',
    description:
      '空白区切りで2つの整数が与えられます。その**合計**を出力してください。\n\n入力例: `3 5` → 出力: `8`',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    // 合計を出力\n  }\n}',
    tests: [
      { name: '3 5', stdin: '3 5', expected: '8' },
      { name: '10 20', stdin: '10 20', expected: '30' },
      { name: '負の数', stdin: '-4 9', expected: '5' },
    ],
    hints: ['sc.nextInt() で整数を読み取れます。', 'System.out.println(a + b);'],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}',
  },
  {
    id: 'even-odd',
    title: '偶数・奇数の判定',
    level: '入門',
    category: '条件分岐',
    description:
      '整数が1つ与えられます。偶数なら `even`、奇数なら `odd` と出力してください。',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // 判定して出力\n  }\n}',
    tests: [
      { name: '4', stdin: '4', expected: 'even' },
      { name: '7', stdin: '7', expected: 'odd' },
      { name: '0', stdin: '0', expected: 'even' },
    ],
    hints: ['n % 2 == 0 なら偶数です。', 'if-else で分岐します。'],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    System.out.println(n % 2 == 0 ? "even" : "odd");\n  }\n}',
  },
  {
    id: 'sum-1-to-n',
    title: '1からNまでの合計',
    level: '初級',
    category: 'ループ',
    description:
      '整数 N が与えられます。1 から N までの整数の合計を出力してください。\n\n入力例: `5` → 出力: `15`',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // 1..n の合計\n  }\n}',
    tests: [
      { name: '5', stdin: '5', expected: '15' },
      { name: '10', stdin: '10', expected: '55' },
      { name: '1', stdin: '1', expected: '1' },
    ],
    hints: ['for文で 1 から n まで足します。', 'int sum=0; for(int i=1;i<=n;i++) sum+=i;'],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    int sum = 0;\n    for (int i = 1; i <= n; i++) sum += i;\n    System.out.println(sum);\n  }\n}',
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz',
    level: '初級',
    category: 'ループ・条件分岐',
    description:
      '1 から 15 まで、各行に次を出力してください。\n\n- 3の倍数なら `Fizz`\n- 5の倍数なら `Buzz`\n- 両方の倍数なら `FizzBuzz`\n- それ以外はその数',
    starterCode:
      'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 15; i++) {\n      // 条件で出し分け\n    }\n  }\n}',
    tests: [
      {
        name: '1〜15',
        stdin: '',
        expected:
          '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
      },
    ],
    hints: [
      '15の倍数（3かつ5）を最初に判定します。',
      'i % 15 == 0 → FizzBuzz、i % 3 == 0 → Fizz、i % 5 == 0 → Buzz。',
    ],
    solution:
      'public class Main {\n  public static void main(String[] args) {\n    for (int i = 1; i <= 15; i++) {\n      if (i % 15 == 0) System.out.println("FizzBuzz");\n      else if (i % 3 == 0) System.out.println("Fizz");\n      else if (i % 5 == 0) System.out.println("Buzz");\n      else System.out.println(i);\n    }\n  }\n}',
  },
  {
    id: 'max-of-three',
    title: '3つの数の最大値',
    level: '初級',
    category: '条件分岐',
    description:
      '空白区切りで3つの整数が与えられます。最大値を出力してください。',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n    // 最大値を出力\n  }\n}',
    tests: [
      { name: '例1', stdin: '3 9 5', expected: '9' },
      { name: '例2', stdin: '12 4 7', expected: '12' },
      { name: '同値あり', stdin: '8 8 2', expected: '8' },
    ],
    hints: ['Math.max を入れ子で使えます。', 'Math.max(a, Math.max(b, c))'],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n    System.out.println(Math.max(a, Math.max(b, c)));\n  }\n}',
  },
  {
    id: 'reverse-string',
    title: '文字列の反転',
    level: '初級',
    category: '文字列',
    description:
      '1行の文字列が与えられます。逆順にして出力してください。\n\n入力例: `hello` → 出力: `olleh`',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    // 反転して出力\n  }\n}',
    tests: [
      { name: 'hello', stdin: 'hello', expected: 'olleh' },
      { name: 'Java', stdin: 'Java', expected: 'avaJ' },
    ],
    hints: ['StringBuilder の reverse() が使えます。', 'new StringBuilder(s).reverse().toString()'],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    System.out.println(new StringBuilder(s).reverse().toString());\n  }\n}',
  },
  {
    id: 'factorial',
    title: '階乗',
    level: '中級',
    category: 'ループ',
    description:
      '整数 N (0 ≤ N ≤ 12) が与えられます。N の階乗 N! を出力してください。\n\n0! = 1 です。',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // n! を出力\n  }\n}',
    tests: [
      { name: '5', stdin: '5', expected: '120' },
      { name: '0', stdin: '0', expected: '1' },
      { name: '10', stdin: '10', expected: '3628800' },
    ],
    hints: ['1 から n までを掛け合わせます。', 'long を使うと安全です。'],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    long f = 1;\n    for (int i = 2; i <= n; i++) f *= i;\n    System.out.println(f);\n  }\n}',
  },
  {
    id: 'count-vowels',
    title: '母音の数を数える',
    level: '中級',
    category: '文字列',
    description:
      '1行の英小文字の文字列が与えられます。母音 (a, e, i, o, u) の個数を出力してください。',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    // 母音を数える\n  }\n}',
    tests: [
      { name: 'hello', stdin: 'hello', expected: '2' },
      { name: 'programming', stdin: 'programming', expected: '3' },
      { name: 'xyz', stdin: 'xyz', expected: '0' },
    ],
    hints: [
      '1文字ずつ調べます（s.charAt(i) や s.toCharArray()）。',
      '"aeiou".indexOf(c) >= 0 なら母音です。',
    ],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    String s = sc.nextLine();\n    int count = 0;\n    for (char c : s.toCharArray()) {\n      if ("aeiou".indexOf(c) >= 0) count++;\n    }\n    System.out.println(count);\n  }\n}',
  },
  {
    id: 'prime',
    title: '素数判定',
    level: '中級',
    category: 'アルゴリズム',
    description:
      '整数 N (2 ≤ N) が与えられます。素数なら `prime`、そうでなければ `not prime` と出力してください。',
    starterCode:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    // 素数判定\n  }\n}',
    tests: [
      { name: '7', stdin: '7', expected: 'prime' },
      { name: '12', stdin: '12', expected: 'not prime' },
      { name: '2', stdin: '2', expected: 'prime' },
      { name: '97', stdin: '97', expected: 'prime' },
    ],
    hints: [
      '2 から √n まで割り切れるか調べます。',
      'i*i <= n の範囲で n % i == 0 があれば素数ではありません。',
    ],
    solution:
      'import java.util.Scanner;\n\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = sc.nextInt();\n    boolean prime = n >= 2;\n    for (int i = 2; (long) i * i <= n; i++) {\n      if (n % i == 0) { prime = false; break; }\n    }\n    System.out.println(prime ? "prime" : "not prime");\n  }\n}',
  },
]

export function getChallenge(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id)
}
