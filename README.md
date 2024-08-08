# LLM-ARTICLE-GENERATOR

LangChain を使用した技術記事生成モジュール

## 概要

LLM-ARTICLE-GENERATOR は、LangChain を使用して技術記事を自動生成するためのモジュールです。
`data/title.json`で定義されているタイトルから記事を生成することができます。
生成された記事は`articles`配下に出力され、この場所に出力された記事は zenn に自動で投稿されるようになっています。

## 特徴

- LangChain と LangSmith を使用した記事生成
- TypeScript で実装
- Zenn CLI を使用したプレビュー機能
- Jest を使用したテスト

## インストール

以下のコマンドを実行して依存関係をインストールします。

```sh
npm install
```

使用方法
開発モードで起動
以下のコマンドを実行して開発モードでアプリケーションを起動します。

```sh
npm run dev
```

## ビルド

以下のコマンドを実行してプロジェクトをビルドします。

```sh
npm run build
```

## テスト

以下のコマンドを実行してテストを実行します。

```sh
npm run test
```

## プレビュー

以下のコマンドを実行して Zenn CLI を使用して記事のプレビューを行います。

```sh
npm run preview
```

## 記事の生成

記事の生成は、`src/app.ts`ファイルの`execute`関数で行われます。この関数は、以下の手順で記事を生成します。

1. OpenAI と Anthropic の API クライアントを初期化
2. 記事生成、改善、図追加の各ジェネレーターを初期化
3. タイトルを取得し、記事を生成
4. 記事のトピックとスラッグを生成
5. Zenn 用のメタデータを追加し、記事を保存

## 設定

プロジェクトの設定は、以下のファイルで行います。

- TypeScript の設定: `tsconfig.json`
- Jest の設定: `jest.config.js`
- 環境変数の設定: `.env`

## スクリプト

以下のスクリプトが`package.json`に定義されています。

- `build`: TypeScript プロジェクトをビルドします。
- `dev`: 開発モードでアプリケーションを起動します。
- `start`: アプリケーションを起動します。
- `preview`: Zenn CLI を使用して記事のプレビューを行います。
- `test`: Jest を使用してテストを実行します。
- `test:watch`: Jest をウォッチモードで実行します。
- `type`: TypeScript の型チェックを行います。
- `check`: Biome を使用してコードの静的解析を行います。
- `verify-all`: 型チェックと静的解析を行います。

## ライセンス

このプロジェクトは MIT ライセンスの下で提供されています。詳細は`LICENSE`ファイルを参照してください。
