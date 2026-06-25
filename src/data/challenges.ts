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
  level: '入門' | '初級' | '中級' | '上級'
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
  {
    id: 'array-sum',
    title: '配列の合計',
    level: '初級',
    category: '配列',
    description:
      '1行目に個数 N、2行目に N 個の整数（空白区切り）が与えられます。合計を出力してください。\n\n入力例:\n`3`\n`1 2 3`\n→ 出力: `6`',
    starterCode: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = sc.nextInt();
    // 合計を出力
  }
}`,
    tests: [
      { name: '例1', stdin: '3\n1 2 3', expected: '6' },
      { name: '例2', stdin: '5\n10 20 30 40 50', expected: '150' },
      { name: '1個', stdin: '1\n7', expected: '7' },
    ],
    hints: ['配列をループして合計します。', '拡張for文 for(int x : a) sum += x; が便利です。'],
    solution: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = sc.nextInt();
    int sum = 0;
    for (int x : a) sum += x;
    System.out.println(sum);
  }
}`,
  },
  {
    id: 'array-max',
    title: '配列の最大値',
    level: '初級',
    category: '配列',
    description:
      '1行目に個数 N、2行目に N 個の整数が与えられます。最大値を出力してください。',
    starterCode: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = sc.nextInt();
    // 最大値を出力
  }
}`,
    tests: [
      { name: '例1', stdin: '5\n3 9 1 9 2', expected: '9' },
      { name: '負の数', stdin: '3\n-5 -2 -9', expected: '-2' },
      { name: '1個', stdin: '1\n42', expected: '42' },
    ],
    hints: ['最初の要素を仮の最大値にして、残りと比較します。', 'Math.max(max, a[i]) を使えます。'],
    solution: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int max = Integer.MIN_VALUE;
    for (int i = 0; i < n; i++) max = Math.max(max, sc.nextInt());
    System.out.println(max);
  }
}`,
  },
  {
    id: 'array-reverse',
    title: '配列を逆順に出力',
    level: '中級',
    category: '配列',
    description:
      '1行目に個数 N、2行目に N 個の整数が与えられます。逆順にして空白区切りで1行に出力してください。\n\n入力例:\n`3`\n`1 2 3`\n→ 出力: `3 2 1`',
    starterCode: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = sc.nextInt();
    // 逆順に出力
  }
}`,
    tests: [
      { name: '例1', stdin: '3\n1 2 3', expected: '3 2 1' },
      { name: '例2', stdin: '5\n1 2 3 4 5', expected: '5 4 3 2 1' },
    ],
    hints: [
      '末尾のインデックスから先頭へループします。',
      'StringBuilder に追加して最後に出力すると簡単です。',
    ],
    solution: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = sc.nextInt();
    StringBuilder sb = new StringBuilder();
    for (int i = n - 1; i >= 0; i--) {
      sb.append(a[i]);
      if (i > 0) sb.append(" ");
    }
    System.out.println(sb.toString());
  }
}`,
  },
  {
    id: 'unique',
    title: '重複の除去',
    level: '中級',
    category: 'コレクション',
    description:
      '1行目に個数 N、2行目に N 個の整数が与えられます。重複を取り除き、最初に現れた順番で空白区切りで出力してください。\n\n入力例:\n`6`\n`1 2 2 3 1 4`\n→ 出力: `1 2 3 4`',
    starterCode: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    // 重複を除去して順番を保って出力
  }
}`,
    tests: [
      { name: '例1', stdin: '6\n1 2 2 3 1 4', expected: '1 2 3 4' },
      { name: '全部同じ', stdin: '3\n5 5 5', expected: '5' },
    ],
    hints: [
      '挿入順を保つ Set は LinkedHashSet です。',
      'add した順に iterate されるので、そのまま出力できます。',
    ],
    solution: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    Set<Integer> set = new LinkedHashSet<>();
    for (int i = 0; i < n; i++) set.add(sc.nextInt());
    StringBuilder sb = new StringBuilder();
    for (int x : set) {
      if (sb.length() > 0) sb.append(" ");
      sb.append(x);
    }
    System.out.println(sb.toString());
  }
}`,
  },
  {
    id: 'sort-asc',
    title: '昇順ソート',
    level: '中級',
    category: 'コレクション',
    description:
      '1行目に個数 N、2行目に N 個の整数が与えられます。昇順に並べ替えて空白区切りで出力してください。',
    starterCode: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = sc.nextInt();
    // 昇順に並べ替えて出力
  }
}`,
    tests: [
      { name: '例1', stdin: '5\n3 1 4 1 5', expected: '1 1 3 4 5' },
      { name: '例2', stdin: '3\n9 8 7', expected: '7 8 9' },
    ],
    hints: ['Arrays.sort(a) で昇順に並びます。', '空白区切りで連結して出力します。'],
    solution: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    int[] a = new int[n];
    for (int i = 0; i < n; i++) a[i] = sc.nextInt();
    Arrays.sort(a);
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < n; i++) {
      if (i > 0) sb.append(" ");
      sb.append(a[i]);
    }
    System.out.println(sb.toString());
  }
}`,
  },
  {
    id: 'word-count',
    title: '単語の出現回数',
    level: '上級',
    category: 'コレクション(Map)',
    description:
      '1行に空白区切りの単語が与えられます。各単語の出現回数を、**単語の辞書順**で `単語:回数` の形式で1行ずつ出力してください。\n\n入力例: `apple banana apple`\n→\n`apple:2`\n`banana:1`',
    starterCode: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String line = sc.nextLine();
    String[] words = line.split(" ");
    // 出現回数を数えて辞書順に出力
  }
}`,
    tests: [
      {
        name: '例1',
        stdin: 'apple banana apple',
        expected: 'apple:2\nbanana:1',
      },
      { name: '例2', stdin: 'a b a c b a', expected: 'a:3\nb:2\nc:1' },
    ],
    hints: [
      '辞書順に並ぶ Map は TreeMap です。',
      'map.merge(word, 1, Integer::sum) で集計できます。',
      'entrySet() をループして key:value を出力します。',
    ],
    solution: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String[] words = sc.nextLine().split(" ");
    Map<String, Integer> map = new TreeMap<>();
    for (String w : words) map.merge(w, 1, Integer::sum);
    StringBuilder sb = new StringBuilder();
    for (Map.Entry<String, Integer> e : map.entrySet()) {
      sb.append(e.getKey()).append(":").append(e.getValue()).append("\\n");
    }
    System.out.print(sb.toString().trim());
  }
}`,
  },
  {
    id: 'safe-divide',
    title: '安全な割り算（例外処理）',
    level: '中級',
    category: '例外処理',
    description:
      '空白区切りで2つの整数 a b が与えられます。a を b で割った整数の商を出力してください。ただし b が 0 の場合は **例外を捕捉**して `error` と出力してください。',
    starterCode: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();
    int b = sc.nextInt();
    // try-catch で ArithmeticException を捕捉
  }
}`,
    tests: [
      { name: '通常', stdin: '10 2', expected: '5' },
      { name: 'ゼロ除算', stdin: '7 0', expected: 'error' },
      { name: '切り捨て', stdin: '9 4', expected: '2' },
    ],
    hints: [
      '整数の 0 除算は ArithmeticException を投げます。',
      'try { System.out.println(a / b); } catch (ArithmeticException e) { System.out.println("error"); }',
    ],
    solution: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int a = sc.nextInt();
    int b = sc.nextInt();
    try {
      System.out.println(a / b);
    } catch (ArithmeticException e) {
      System.out.println("error");
    }
  }
}`,
  },
  {
    id: 'parse-int',
    title: '数値パース（例外処理）',
    level: '中級',
    category: '例外処理',
    description:
      '1行の文字列が与えられます。整数として解釈できればその **2倍** を出力し、解釈できなければ `invalid` と出力してください（`NumberFormatException` を利用）。',
    starterCode: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.nextLine().trim();
    // Integer.parseInt と try-catch
  }
}`,
    tests: [
      { name: '整数', stdin: '21', expected: '42' },
      { name: '不正', stdin: 'abc', expected: 'invalid' },
      { name: '負の数', stdin: '-5', expected: '-10' },
    ],
    hints: [
      'Integer.parseInt は数値でない文字列で NumberFormatException を投げます。',
      'catch (NumberFormatException e) で "invalid" を出力します。',
    ],
    solution: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.nextLine().trim();
    try {
      int n = Integer.parseInt(s);
      System.out.println(n * 2);
    } catch (NumberFormatException e) {
      System.out.println("invalid");
    }
  }
}`,
  },
  {
    id: 'balanced-parens',
    title: '括弧の対応チェック',
    level: '上級',
    category: 'アルゴリズム(スタック)',
    description:
      '丸括弧 `()`・角括弧 `[]`・波括弧 `{}` からなる文字列が与えられます。すべての括弧の対応が正しく取れていれば `valid`、そうでなければ `invalid` と出力してください。',
    starterCode: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.nextLine();
    // Deque をスタックとして使って判定
  }
}`,
    tests: [
      { name: '対応OK', stdin: '([])', expected: 'valid' },
      { name: '交差', stdin: '([)]', expected: 'invalid' },
      { name: '閉じ不足', stdin: '(((', expected: 'invalid' },
      { name: '複合', stdin: '{[()]}', expected: 'valid' },
    ],
    hints: [
      '開き括弧はスタックに push します。',
      '閉じ括弧では、スタックの先頭が対応する開き括弧か確認しながら pop します。',
      '最後にスタックが空なら valid です。',
    ],
    solution: `import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String s = sc.nextLine();
    Deque<Character> stack = new ArrayDeque<>();
    boolean ok = true;
    for (char c : s.toCharArray()) {
      if (c == '(' || c == '[' || c == '{') {
        stack.push(c);
      } else if (c == ')' || c == ']' || c == '}') {
        if (stack.isEmpty()) { ok = false; break; }
        char open = stack.pop();
        if ((c == ')' && open != '(') ||
            (c == ']' && open != '[') ||
            (c == '}' && open != '{')) { ok = false; break; }
      }
    }
    if (!stack.isEmpty()) ok = false;
    System.out.println(ok ? "valid" : "invalid");
  }
}`,
  },
]

export function getChallenge(id: string): Challenge | undefined {
  return challenges.find((c) => c.id === id)
}
