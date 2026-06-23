# JavaLearn — ブラウザで学ぶJava入門

[Progate (prog-8.com)](https://prog-8.com/) を参考にした、Java 学習用の Web アプリです。
スライドで概念を学び、その場でコードを書く演習で手を動かしながら基礎を身につけられます。

公開サイト: https://dahande.github.io/JavaQuestion/

## 特徴

- **スライド学習**: 各レッスンは図解的な解説スライドで構成
- **演習（擬似実行）**: 穴埋め型・記述型の2方式。入力を正解パターンと照合し、想定される実行結果を擬似コンソールに表示します（実際の Java コンパイルは行いません）
- **進捗・レベル管理**: 完了状況・XP・レベルを `localStorage` に保存
- **ライト / ダークテーマ**対応

## コース

| コース | 内容 | 状態 |
| --- | --- | --- |
| Java I 入門 | 出力 / 変数 / 演算 / 条件分岐 / ループ / 配列 / メソッド | 作り込み |
| Java II オブジェクト指向 | クラス / コンストラクタ / 継承 / インタフェース | 一部 + 骨組み |
| Java Silver 対策 | 資格試験の頻出テーマ | 準備中 |

## 技術スタック

- React + Vite + TypeScript
- react-router-dom（HashRouter）
- CodeMirror（記述型エディタ）/ highlight.js（スライド内コードのハイライト）

## 開発

```bash
npm install
npm run dev      # 開発サーバー
npm run build    # 本番ビルド (dist/)
npm run preview  # ビルド結果のプレビュー
```

## デプロイ

`.github/workflows/deploy.yml` により、対象ブランチへの push で自動的に
GitHub Pages へビルド・デプロイされます。
