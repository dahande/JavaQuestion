import type { Course } from '../../types'

// Java SE 11 Programmer I (1Z0-815 / Java Silver SE 11) 対策の問題集。
// 試験範囲をトピック別レッスンに分け、各レッスンは「導入スライド + 選択式問題」で構成。
// 問題は本試験に近い「出力を答える」「コンパイルできるか」「正しい記述を選ぶ」形式。

export const javaSilver: Course = {
  id: 'java-silver',
  title: 'Java Silver SE 11 対策',
  subtitle:
    'Java SE 11 Programmer I (1Z0-815) 合格を目指す問題集。試験頻出テーマを選択式で総ざらい。',
  level: '中級',
  color: '#0891b2',
  icon: '🏅',
  status: 'ready',
  lessons: [
    {
      id: 'basics',
      title: '1. Java基礎とクラス構造',
      summary: 'mainメソッド、package/import、ソースファイルの構造、実行コマンド。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: 'クラス構造の基本',
          body:
            'Javaのソースファイルは `package宣言 → import宣言 → 型宣言` の順で記述します。\n\n1つの `.java` ファイルに **public なトップレベルクラスは最大1つ**まで。ファイル名は public クラス名と一致させます。\n\nエントリポイントの `main` メソッドは `public static void main(String[] args)` の形が必須です（`String...` も可、修飾子の順序は自由）。',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'mainメソッドの形',
          question:
            'プログラムのエントリポイントとして有効な `main` メソッドの宣言を **2つ** 選んでください。',
          choices: [
            'public void main(String[] args)',
            'public static void main(String[] args)',
            'static public void main(String... args)',
            'public static int main(String[] args)',
          ],
          answer: [1, 2],
          explanation:
            '`main` は `public` `static` `void` で、引数は `String[]` または可変長 `String...` である必要があります。修飾子の順序は自由なので `static public` も有効。`void` でなければならず `int` は不可。`static` が無いものも不可です。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: 'ソースファイルの要素の順序',
          question:
            'Javaソースファイル内での要素の正しい記述順序はどれですか？',
          choices: [
            'import → package → class',
            'package → import → class',
            'class → package → import',
            'package → class → import',
          ],
          answer: [1],
          explanation:
            '順序は `package`（任意・先頭に1つ）→ `import`（任意・複数可）→ 型宣言（class/interface等）です。この順序を誤るとコンパイルエラーになります。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'public クラスの数',
          question:
            '1つの `.java` ファイルに記述できる public なトップレベルクラスの最大数はいくつですか？',
          choices: ['0個', '1個', '2個', '制限なし'],
          answer: [1],
          explanation:
            'public なトップレベルクラスは1ファイルにつき最大1個です。public でないトップレベルクラスは複数記述できます。public クラスがある場合、ファイル名はそのクラス名と一致する必要があります。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: 'ソースファイルの直接実行（Java 11）',
          question:
            'Java 11 でコマンド `java Hello.java` を実行したときの動作として正しいものはどれですか？',
          choices: [
            '事前に javac でコンパイルしないとエラーになる',
            '.class ファイルを生成してから実行する',
            'コンパイルせずにソースを直接実行する（単一ファイルソースコード）',
            'java コマンドでは .java を指定できない',
          ],
          answer: [2],
          explanation:
            'Java 11 で導入された「単一ファイルソースコードプログラム」機能により、`java Hello.java` とすると .class ファイルを生成せずメモリ上でコンパイル・実行されます。学習や小さなスクリプトに便利です。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'コマンドライン引数',
          question:
            '`public static void main(String[] args)` を持つクラス Test を `java Test x y z` で実行したとき、`args[1]` の値は何ですか？',
          choices: ['"Test"', '"x"', '"y"', 'NullPointerException が発生する'],
          answer: [2],
          explanation:
            'コマンドライン引数はクラス名の後ろから順に `args[0]="x"`, `args[1]="y"`, `args[2]="z"` と格納されます。クラス名 `Test` は args に含まれません。',
        },
      ],
    },
    {
      id: 'datatypes',
      title: '2. データ型と変数',
      summary: 'プリミティブ型、リテラル、var、ラッパークラス、キャストとオーバーフロー。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: '型と変数のポイント',
          body:
            '基本データ型は `byte short int long float double char boolean` の8種類。\n\n- 整数リテラルの既定は `int`、浮動小数点リテラルの既定は `double`\n- `long` は `L`、`float` は `f` の接尾辞が必要\n- ローカル変数の型推論 `var` は **初期化が必須**で `null` 単体では使えない\n- ラッパーの `Integer` は `-128〜127` をキャッシュする',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'var の使用',
          question:
            '次のうち **コンパイルエラー** になるものはどれですか？',
          code: 'var a = 10;\nvar b = null;\nvar c = "hello";\nvar d = new java.util.ArrayList<String>();',
          choices: ['var a = 10;', 'var b = null;', 'var c = "hello";', 'var d = ...ArrayList'],
          answer: [1],
          explanation:
            '`var` はコンパイラが初期化子から型を推論します。`null` だけでは型を推論できないため `var b = null;` はコンパイルエラーです。他は型を推論できるため有効です。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: '数値リテラルのアンダースコア',
          question:
            'アンダースコア区切りの数値リテラルとして **不正な（コンパイルエラー）** ものはどれですか？',
          choices: ['1_000_000', '0x1_F', '1__0', '100_'],
          answer: [3],
          explanation:
            'アンダースコアは数字と数字の間にのみ置けます（連続も可）。先頭・末尾、小数点の隣、接頭辞/接尾辞の隣には置けません。`100_` は末尾にあるためエラーです。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'char への数値代入',
          question: '次のコードの出力はどれですか？',
          code: 'char c = 65;\nSystem.out.println(c);',
          choices: ['65', 'A', "'A'", 'コンパイルエラー'],
          answer: [1],
          explanation:
            '`char` は16ビットの整数型でもあり、範囲内の整数リテラルを代入できます。65 は文字コード `A` に対応するため、`println(char)` は `A` を出力します。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: 'キャストとオーバーフロー',
          question: '次のコードの出力はどれですか？',
          code: 'byte b = (byte) 130;\nSystem.out.println(b);',
          choices: ['130', '-126', '127', 'コンパイルエラー'],
          answer: [1],
          explanation:
            '`byte` は -128〜127。130 を byte にキャストすると 130 - 256 = -126 になります（オーバーフロー時の2の補数表現）。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'Integer のキャッシュと ==',
          question: '次のコードの出力はどれですか？',
          code: 'Integer a = 127, b = 127;\nInteger c = 128, d = 128;\nSystem.out.println((a == b) + " " + (c == d));',
          choices: ['true true', 'true false', 'false false', 'false true'],
          answer: [1],
          explanation:
            'オートボクシングで生成される `Integer` は -128〜127 がキャッシュされ同一インスタンスになるため `a == b` は true。128 は範囲外で別インスタンスになり `c == d` は false。値比較には `equals` を使います。',
        },
        {
          type: 'quiz',
          id: 'q6',
          title: 'float リテラル',
          question: '次のコードの結果はどれですか？',
          code: 'float f = 3.14;\nSystem.out.println(f);',
          choices: ['3.14', '3.0', 'コンパイルエラー', '実行時例外'],
          answer: [2],
          explanation:
            '小数点リテラルの既定の型は `double` です。`double` を `float` に暗黙変換はできない（精度が落ちる）ため、`float f = 3.14;` はコンパイルエラー。`3.14f` とする必要があります。',
        },
      ],
    },
    {
      id: 'operators',
      title: '3. 演算子と分岐',
      summary: '演算子の優先順位、文字列連結、switchのフォールスルー、複合代入。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: '演算子と制御のポイント',
          body:
            '- `+` は左から評価され、片方が `String` だと連結になる\n- `switch` は `break` が無いと次の `case` へ落ちる（フォールスルー）\n- 複合代入演算子 `+=` などは **暗黙のキャストを含む**\n- `&&` `||` は短絡評価、`&` `|` は短絡しない',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: '文字列連結の評価順',
          question: '次のコードの出力はどれですか？',
          code: 'System.out.println(1 + 2 + "3" + 4 + 5);',
          choices: ['12345', '3345', '15', '3345 ではなく 33345'],
          answer: [1],
          explanation:
            '左から評価されます。`1 + 2` は数値加算で 3、`3 + "3"` で文字列 `"33"`、以降は連結され `"3345"` となります。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: 'switch のフォールスルー',
          question: '次のコードの出力はどれですか？',
          code: 'int x = 2;\nswitch (x) {\n  case 1: System.out.print("1");\n  case 2: System.out.print("2");\n  case 3: System.out.print("3"); break;\n  default: System.out.print("D");\n}',
          choices: ['2', '23', '23D', '123'],
          answer: [1],
          explanation:
            '`x` は 2 なので `case 2` から実行。`case 2` に break が無いので `case 3` へフォールスルーし `2` と `3` を出力、`case 3` の break で抜けます。出力は `23`。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: '複合代入と暗黙キャスト',
          question:
            '`short s = 10;` のあと、次のうち **コンパイルエラー** になるものはどれですか？',
          code: 'short s = 10;\n// A: s += 5;\n// B: s *= 2;\n// C: s = s + 5;\n// D: s++;',
          choices: ['s += 5;', 's *= 2;', 's = s + 5;', 's++;'],
          answer: [2],
          explanation:
            '`s + 5` は int に昇格するため `s = s + 5;` は int→short の明示キャストが必要でエラー。`+=` `*=` `++` は暗黙のキャストを含むためエラーになりません。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: '短絡評価',
          question: '次のコードの出力はどれですか？',
          code: 'int i = 0;\nif (false && (i++ > 0)) { }\nSystem.out.println(i);',
          choices: ['0', '1', '-1', 'コンパイルエラー'],
          answer: [0],
          explanation:
            '`&&` は左辺が false の場合、右辺を評価しません（短絡評価）。よって `i++` は実行されず `i` は 0 のまま。もし `&` を使うと右辺も評価され 1 になります。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'オブジェクトの == と equals',
          question: '次のコードの出力はどれですか？',
          code: 'String a = new String("hi");\nString b = new String("hi");\nSystem.out.println((a == b) + " " + a.equals(b));',
          choices: ['true true', 'false true', 'true false', 'false false'],
          answer: [1],
          explanation:
            '`new` で生成した別インスタンスなので参照比較 `==` は false。`String.equals` は内容を比較するため true。`==` は参照（同一性）、`equals` は同値性の比較です。',
        },
      ],
    },
    {
      id: 'strings',
      title: '4. 文字列と StringBuilder',
      summary: 'Stringの不変性、主要メソッド、StringBuilder、Java 11の新メソッド。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: '文字列のポイント',
          body:
            '`String` は **不変（immutable）**。`concat` や `substring` は新しい文字列を返し、元は変わりません。\n\n`StringBuilder` は可変で、`append`/`insert`/`reverse` などは自身を変更して返します。\n\nJava 11 では `String.strip()`、`String.repeat(n)`、`String.isBlank()`、`String.lines()` などが追加されました。',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'String の不変性',
          question: '次のコードの出力はどれですか？',
          code: 'String s = "Hello";\ns.concat(" World");\nSystem.out.println(s);',
          choices: ['Hello World', 'Hello', 'World', 'コンパイルエラー'],
          answer: [1],
          explanation:
            '`String` は不変です。`concat` は新しい文字列を返すだけで `s` 自身は変わりません。戻り値を代入していないため出力は `Hello`。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: 'StringBuilder の連鎖',
          question: '次のコードの出力はどれですか？',
          code: 'StringBuilder sb = new StringBuilder("abc");\nsb.reverse().append("d");\nSystem.out.println(sb);',
          choices: ['abcd', 'cbad', 'dcba', 'abc'],
          answer: [1],
          explanation:
            '`reverse()` で `cba` になり、`append("d")` で `cbad`。`StringBuilder` は可変で、メソッドは自身を変更して返すためメソッドチェーンが可能です。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'substring',
          question: '`"Java".substring(1, 3)` が返す文字列はどれですか？',
          code: 'System.out.println("Java".substring(1, 3));',
          choices: ['"Jav"', '"av"', '"ava"', '"va"'],
          answer: [1],
          explanation:
            '`substring(begin, end)` は begin 以上 end 未満の範囲を返します。インデックス1と2の文字、つまり `av` を返します。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: 'Java 11 の新メソッド',
          question:
            'Java 11 で追加された、Unicode空白も含めて先頭・末尾の空白を除去するメソッドはどれですか？',
          choices: ['trim()', 'strip()', 'truncate()', 'clean()'],
          answer: [1],
          explanation:
            '`strip()` は Java 11 で追加され、Unicodeの空白も考慮して除去します。従来の `trim()` はコードポイント U+0020 以下のみを対象とします。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'String.repeat（Java 11）',
          question: '次のコードの出力はどれですか？',
          code: 'System.out.println("ab".repeat(3));',
          choices: ['ababab', 'ab3', 'abababab', 'コンパイルエラー'],
          answer: [0],
          explanation:
            'Java 11 で追加された `repeat(int)` は文字列を指定回数繰り返した新しい文字列を返します。`"ab".repeat(3)` は `ababab`。',
        },
      ],
    },
    {
      id: 'arrays',
      title: '5. 配列と ArrayList',
      summary: '配列の宣言・既定値・多次元、ArrayListの操作とremoveの落とし穴。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: '配列とコレクションのポイント',
          body:
            '- 配列のサイズは `length`（フィールド）、`ArrayList` は `size()`（メソッド）\n- 配列の要素は既定値で初期化される（int→0、boolean→false、参照→null）\n- 多次元配列は「配列の配列」。内側を省略すると要素は `null`\n- `List.remove(int)` はインデックス指定、`remove(Object)` は値指定',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: '配列の宣言',
          question: '次のうち **コンパイルエラー** になる配列宣言はどれですか？',
          choices: [
            'int[] a = {1, 2, 3};',
            'int b[] = new int[]{1, 2};',
            'int[] c = new int[3];',
            'int[] d = new int[];',
          ],
          answer: [3],
          explanation:
            '`new int[]` はサイズも初期化子も無いため不正でコンパイルエラー。サイズを指定する（`new int[3]`）か初期化子を与える（`new int[]{...}`）必要があります。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: '配列の既定値',
          question: '次のコードの出力はどれですか？',
          code: 'int[] a = new int[3];\nboolean[] b = new boolean[2];\nSystem.out.println(a[0] + " " + b[0]);',
          choices: ['0 false', '0 true', 'null false', '実行時例外'],
          answer: [0],
          explanation:
            '配列を `new` で生成すると要素は既定値で初期化されます。int は 0、boolean は false。よって `0 false`。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'List.remove の落とし穴',
          question: '次のコードの出力はどれですか？',
          code: 'List<Integer> list = new ArrayList<>();\nlist.add(10);\nlist.add(20);\nlist.add(30);\nlist.remove(1);\nSystem.out.println(list);',
          choices: ['[10, 30]', '[20, 30]', '[10, 20]', '[10, 20, 30]'],
          answer: [0],
          explanation:
            '引数が `int` の場合 `remove(int index)` が呼ばれ、インデックス1（値20）が削除されます。値20を削除したい場合は `remove(Integer.valueOf(20))` とします。結果は `[10, 30]`。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: '配列のサイズ取得',
          question: '配列 `arr` の要素数を取得する正しい記述はどれですか？',
          choices: ['arr.size()', 'arr.length()', 'arr.length', 'arr.count'],
          answer: [2],
          explanation:
            '配列の要素数はメソッドではなくフィールド `length` で取得します（括弧なし）。`String` の長さは `length()` メソッド、`ArrayList` は `size()` メソッドである点と混同しないように。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: '多次元配列の初期化',
          question: '次のコードの出力はどれですか？',
          code: 'int[][] a = new int[2][];\nSystem.out.println(a[0]);',
          choices: ['0', '[]', 'null', '実行時例外'],
          answer: [2],
          explanation:
            '`new int[2][]` は外側の長さ2のみ確保し、内側の配列は未割り当て（`null`）です。よって `a[0]` は `null`。`a[0][0]` にアクセスすると NullPointerException になります。',
        },
      ],
    },
    {
      id: 'loops',
      title: '6. ループ',
      summary: 'for/while/do-while、for-each、break/continue、ラベル付き文。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: 'ループのポイント',
          body:
            '- `do-while` は条件に関わらず **最低1回** 実行される\n- `while` / `for` の条件式は `boolean` でなければならない（Cと違い整数は不可）\n- 拡張for文（for-each）のループ変数への代入は元の配列/コレクションに影響しない\n- ラベル付き `break`/`continue` で外側のループを制御できる',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'do-while の最低1回実行',
          question: '次のコードの出力はどれですか？',
          code: 'int i = 5;\ndo {\n  System.out.print(i);\n  i++;\n} while (i < 3);',
          choices: ['（何も出力されない）', '5', '53', '無限ループ'],
          answer: [1],
          explanation:
            '`do-while` は本体を先に実行してから条件を評価します。`i=5` で本体を1回実行し `5` を出力、`i=6` で条件 `6 < 3` が false となり終了。出力は `5`。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: 'while の条件式',
          question: '次のコードの結果はどれですか？',
          code: 'int i = 1;\nwhile (i) {\n  System.out.print(i);\n  i++;\n}',
          choices: ['1 が無限に出力', '1', 'コンパイルエラー', '何も出力されない'],
          answer: [2],
          explanation:
            'Java では `while` の条件式は `boolean` でなければなりません。`int` の `i` は条件式に使えずコンパイルエラーになります（C/C++ とは異なる点）。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'ラベル付き continue',
          question: '次のコードの出力はどれですか？',
          code: 'outer:\nfor (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 3; j++) {\n    if (j == 1) continue outer;\n    System.out.print(i + "" + j + " ");\n  }\n}',
          choices: ['00 10 20 ', '00 01 02 ', '00 11 22 ', '00 10 20 30 '],
          answer: [0],
          explanation:
            '`j == 1` で `continue outer` により外側ループの次の反復へ進みます。各 i で j=0 のときだけ出力されるため `00 10 20 ` となります。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: '拡張for文と要素の変更',
          question: '次のコードの出力はどれですか？',
          code: 'int[] a = {1, 2, 3};\nfor (int x : a) {\n  x = x * 10;\n}\nSystem.out.println(a[0]);',
          choices: ['10', '1', '0', '30'],
          answer: [1],
          explanation:
            '拡張for文のループ変数 `x` は要素のコピーです。`x` に代入しても元の配列は変わりません。配列を変更するにはインデックス付きforで `a[i]` に代入します。出力は `1`。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: '空のfor文',
          question: '次のうち、構文として **正しい** for文はどれですか？',
          choices: ['for ( ) { }', 'for (;;) { }', 'for (true) { }', 'for (int i=0) { }'],
          answer: [1],
          explanation:
            'for文は `for(初期化; 条件; 更新)` の3つの区画をセミコロンで区切ります。すべて省略した `for(;;)` は無限ループとして有効です。区画の数が合わない他の選択肢はコンパイルエラー。',
        },
      ],
    },
    {
      id: 'methods',
      title: '7. メソッドとカプセル化',
      summary: 'オーバーロード、static、アクセス修飾子、可変長引数、値渡し。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: 'メソッドのポイント',
          body:
            '- オーバーロードは「引数の型・数・順序」で区別（戻り値の型だけでは不可）\n- 可変長引数 `型... 名前` は **引数リストの最後** に1つだけ\n- Javaは **値渡し**。参照型では参照のコピーが渡るので、参照先の変更は呼び出し元に反映される\n- アクセス修飾子は `private < (なし=package) < protected < public`',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'オーバーロードの解決',
          question: '次のコードの出力はどれですか？',
          code: 'static void m(int x) { System.out.print("int"); }\nstatic void m(long x) { System.out.print("long"); }\n// 呼び出し\nm(5);',
          choices: ['int', 'long', 'どちらも呼ばれる', 'コンパイルエラー（曖昧）'],
          answer: [0],
          explanation:
            'リテラル `5` は `int` 型なので、最も適合する `m(int)` が選ばれます。`int` 版が無ければ拡大変換で `m(long)` が選ばれます。出力は `int`。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: '可変長引数の制約',
          question: '次のうち **コンパイルエラー** になるメソッド宣言はどれですか？',
          choices: [
            'void m(int... a)',
            'void m(String s, int... a)',
            'void m(int... a, String s)',
            'void m(int[] a, String s)',
          ],
          answer: [2],
          explanation:
            '可変長引数は引数リストの最後に1つだけ置けます。`m(int... a, String s)` は varargs の後ろに引数があるためコンパイルエラーです。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: '値渡し（参照型）',
          question: '次のコードの出力はどれですか？',
          code: 'static void change(int[] arr) { arr[0] = 99; }\n// 呼び出し\nint[] a = {1, 2};\nchange(a);\nSystem.out.println(a[0]);',
          choices: ['1', '99', '0', 'コンパイルエラー'],
          answer: [1],
          explanation:
            'Javaは値渡しですが、参照型では「参照（アドレス）の値」がコピーされます。同じ配列を指すため `arr[0]=99` は呼び出し元の配列にも反映され、出力は `99`。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: 'アクセス修飾子',
          question:
            '修飾子を付けない（デフォルト/package-private）メンバーにアクセスできる範囲はどれですか？',
          choices: [
            'どこからでも',
            '同じパッケージ内のみ',
            '同じクラス内のみ',
            '同じパッケージとサブクラス',
          ],
          answer: [1],
          explanation:
            '修飾子なし（パッケージプライベート）は同一パッケージ内からのみアクセス可能です。`protected` は「同一パッケージ＋別パッケージのサブクラス」、`private` は同一クラスのみ。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'static メソッドとインスタンス変数',
          question: '次のコードの結果はどれですか？',
          code: 'class C {\n  int x = 10;\n  static void show() {\n    System.out.println(x);\n  }\n}',
          choices: ['10 と出力される', '0 と出力される', 'コンパイルエラー', '実行時例外'],
          answer: [2],
          explanation:
            'static メソッドはインスタンスに属さないため、インスタンス変数 `x` を直接参照できずコンパイルエラーになります。アクセスするにはインスタンス経由（`new C().x`）が必要です。',
        },
      ],
    },
    {
      id: 'inheritance',
      title: '8. 継承とポリモーフィズム',
      summary: 'super、オーバーライド規則、抽象クラス、インタフェース、キャスト。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: '継承のポイント',
          body:
            '- サブクラスのコンストラクタは先頭で `super(...)` を呼ぶ（書かなければ暗黙に `super()`）\n- オーバーライドはアクセスを **狭められない**、戻り値は共変可\n- 抽象クラスはインスタンス化不可、抽象メソッドを持てる\n- インタフェースの `default` メソッドは本体を持てる\n- 実行時の型に応じてメソッドが選ばれる（動的束縛）',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'コンストラクタと super',
          question: '次のコードの結果はどれですか？',
          code: 'class A {\n  A(int x) { }\n}\nclass B extends A {\n  B() { }\n}',
          choices: [
            '正常にコンパイルできる',
            'B() で暗黙の super() が見つからずコンパイルエラー',
            '実行時に例外',
            'A をインスタンス化できない',
          ],
          answer: [1],
          explanation:
            '`B()` は暗黙に引数なしの `super()` を呼ぼうとしますが、A には `A(int)` しかなく引数なしコンストラクタが存在しないためコンパイルエラー。`B()` 内で明示的に `super(0)` を呼ぶ必要があります。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: 'オーバーライドのアクセス修飾子',
          question:
            'スーパークラスの `public void m()` をサブクラスでオーバーライドするとき、使用 **できない** アクセス修飾子はどれですか？',
          code: '// super: public void m() { }\n// sub:   ??? void m() { }',
          choices: ['public', 'protected', 'private', 'いずれも可能'],
          answer: [2],
          explanation:
            'オーバーライドではアクセスを元より狭くできません。`public` を `protected` や `private` にするとコンパイルエラー。`public` のままにする必要があります。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'ポリモーフィズム',
          question: '次のコードの出力はどれですか？',
          code: 'class A { String name() { return "A"; } }\nclass B extends A { String name() { return "B"; } }\n// 呼び出し\nA obj = new B();\nSystem.out.println(obj.name());',
          choices: ['A', 'B', 'AB', 'コンパイルエラー'],
          answer: [1],
          explanation:
            '変数の型は A でも、実際のインスタンスは B です。インスタンスメソッドは実行時の型で解決される（動的束縛）ため、`B.name()` が呼ばれ `B` を出力します。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: 'instanceof とキャスト',
          question: '次のコードの出力はどれですか？',
          code: 'Object o = "hello";\nif (o instanceof String) {\n  String s = (String) o;\n  System.out.println(s.length());\n}',
          choices: ['hello', '5', 'コンパイルエラー', 'ClassCastException'],
          answer: [1],
          explanation:
            '`o` は実際には `String`。`instanceof` が true なのでダウンキャストは安全に行え、`"hello".length()` は 5 を出力します。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'インタフェースの default メソッド',
          question: 'インタフェースの `default` メソッドに関する記述として正しいものはどれですか？',
          choices: [
            'メソッド本体（実装）を持てる',
            '抽象メソッドなので本体を持てない',
            'static でなければならない',
            'private にしなければならない',
          ],
          answer: [0],
          explanation:
            '`default` メソッドはインタフェース内で本体（実装）を持てるメソッドです。実装クラスはそのまま利用するか、オーバーライドできます。Java 8 で導入されました。',
        },
      ],
    },
    {
      id: 'exceptions',
      title: '9. 例外処理',
      summary: 'try/catch/finally、チェック例外、マルチキャッチ、try-with-resources。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: '例外処理のポイント',
          body:
            '- `finally` は原則必ず実行される（`finally` 内の `return` は他の `return` を上書きする）\n- チェック例外（`Exception` 系、`IOException` など）は処理または宣言が必須\n- 非チェック例外（`RuntimeException` 系）は宣言不要\n- `catch` はサブクラスを先に書く（順序が逆だと到達不能でエラー）\n- try-with-resources の対象は `AutoCloseable` を実装している必要がある',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'finally と return',
          question: '次のメソッドの戻り値はどれですか？',
          code: 'static int m() {\n  try {\n    return 1;\n  } finally {\n    return 2;\n  }\n}',
          choices: ['1', '2', 'コンパイルエラー', '例外がスローされる'],
          answer: [1],
          explanation:
            '`finally` ブロックは try の `return` の後に実行され、`finally` 内に `return 2` があるとそれが最終的な戻り値になります（tryの戻り値を上書き）。結果は 2。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: 'チェック例外と非チェック例外',
          question: '次のうち **非チェック例外（unchecked）** であるものを **2つ** 選んでください。',
          choices: [
            'IOException',
            'NullPointerException',
            'ArrayIndexOutOfBoundsException',
            'SQLException',
          ],
          answer: [1, 2],
          explanation:
            '`RuntimeException` を継承する `NullPointerException` と `ArrayIndexOutOfBoundsException` は非チェック例外。`IOException` と `SQLException` はチェック例外で、処理または `throws` 宣言が必要です。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'catch の順序',
          question: '次のコードの結果はどれですか？',
          code: 'try {\n  // 何らかの処理\n} catch (Exception e) {\n  System.out.println("Ex");\n} catch (RuntimeException e) {\n  System.out.println("RE");\n}',
          choices: [
            '正常にコンパイルできる',
            '2つ目の catch が到達不能でコンパイルエラー',
            'RE と出力される',
            '実行時例外',
          ],
          answer: [1],
          explanation:
            '`RuntimeException` は `Exception` のサブクラス。先に `catch(Exception)` を書くと後続の `catch(RuntimeException)` は到達不能となりコンパイルエラー。サブクラスを先に書く必要があります。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: 'マルチキャッチ',
          question: '次のうち **コンパイルエラー** になる catch はどれですか？',
          choices: [
            'catch (IOException | SQLException e)',
            'catch (NullPointerException | ArithmeticException e)',
            'catch (IOException | Exception e)',
            'catch (RuntimeException e)',
          ],
          answer: [2],
          explanation:
            'マルチキャッチでは継承関係にある型を並べられません。`IOException` は `Exception` のサブクラスなので `IOException | Exception` はコンパイルエラー（Exception だけで足りるため冗長）。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'try-with-resources',
          question: 'try-with-resources で自動クローズの対象にできるのは、どのインタフェースを実装した型ですか？',
          choices: ['Serializable', 'AutoCloseable', 'Comparable', 'Runnable'],
          answer: [1],
          explanation:
            'try-with-resources の資源は `AutoCloseable`（または `Closeable`）を実装している必要があります。複数資源は宣言と逆順にクローズされます。',
        },
      ],
    },
    {
      id: 'modules',
      title: '10. モジュールシステム',
      summary: 'module-info.java、exports/requires、モジュールの実行コマンド。',
      steps: [
        {
          type: 'slide',
          id: 'intro',
          title: 'モジュールのポイント',
          body:
            'Java 9 で導入された **モジュールシステム（JPMS）**。\n\n- モジュール定義はモジュールのルートに置く `module-info.java`\n- `exports パッケージ` … 他モジュールへ公開\n- `requires モジュール` … 依存を宣言\n- `requires transitive` … 推移的依存（利用側にも伝播）\n- `opens` … リフレクションでのアクセスを許可',
        },
        {
          type: 'quiz',
          id: 'q1',
          title: 'モジュール定義ファイル',
          question: 'モジュールを定義するファイルの名前と配置として正しいものはどれですか？',
          choices: [
            'モジュールのルートに module-info.java',
            'src 直下に module.java',
            'META-INF/module.xml',
            'package-info.java に記述',
          ],
          answer: [0],
          explanation:
            'モジュール定義はモジュールのルートディレクトリに置く `module-info.java` に記述します。`module 名 { ... }` の形でディレクティブを書きます。',
        },
        {
          type: 'quiz',
          id: 'q2',
          title: 'exports と requires',
          question:
            '自モジュールのパッケージを他モジュールから利用可能にするディレクティブはどれですか？',
          choices: ['requires', 'exports', 'opens', 'uses'],
          answer: [1],
          explanation:
            '`exports パッケージ名` で、そのパッケージのpublic型を他モジュールへ公開します。`requires` は逆に他モジュールへの依存を宣言するディレクティブです。',
        },
        {
          type: 'quiz',
          id: 'q3',
          title: 'リフレクション用のディレクティブ',
          question:
            '実行時のリフレクションによるアクセスを許可するディレクティブはどれですか？',
          choices: ['exports', 'opens', 'provides', 'requires static'],
          answer: [1],
          explanation:
            '`opens パッケージ名` は、実行時のリフレクション（深いアクセスを含む）を許可します。`exports` はコンパイル時・実行時のpublic型アクセスのみを許可し、リフレクションでの非公開メンバアクセスは許可しません。',
        },
        {
          type: 'quiz',
          id: 'q4',
          title: 'モジュールの実行コマンド',
          question:
            'モジュールパス上のモジュールのメインクラスを実行する正しいコマンド形式はどれですか？',
          choices: [
            'java -cp mods com.example.Main',
            'java -p mods -m mymod/com.example.Main',
            'java --module mymod com.example.Main',
            'java -jar mymod',
          ],
          answer: [1],
          explanation:
            '`java -p（--module-path） mods -m（--module） モジュール名/メインクラス完全修飾名` でモジュールを実行します。`-cp` はクラスパス（非モジュール）用です。',
        },
        {
          type: 'quiz',
          id: 'q5',
          title: 'requires transitive',
          question: '`requires transitive A` の意味として正しいものはどれですか？',
          choices: [
            'モジュールAを実行時のみ必要とする',
            'モジュールAへの依存が、このモジュールを使う側にも伝わる',
            'モジュールAをリフレクションに公開する',
            'モジュールAのテストだけに依存する',
          ],
          answer: [1],
          explanation:
            '`requires transitive A` は推移的依存を表し、このモジュールを `requires` する別モジュールも自動的にAを読み取れるようになります（依存が伝播）。',
        },
      ],
    },
  ],
}
