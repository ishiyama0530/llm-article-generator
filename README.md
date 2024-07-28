# LangChain 技術記事生成モジュール

このプロジェクトは、LangChain と OpenAI GPT-4 を使用して、高品質な技術記事を自動生成する TypeScript モジュールです。

## 主な機能

- 指定されたトピックに基づいて技術記事を生成
- 生成された記事の複数回の改善と事実確認
- 記事の要約生成
- キャッシング機能（オプション）
- API リクエストのレート制限
- 生成された記事のファイル出力

## インストール

```bash
npm install langchain-article-generator
```

## 使用方法

```typescript
import {
  ArticleGenerator,
  ArticleGeneratorConfig,
} from "langchain-article-generator";

const config: Partial<ArticleGeneratorConfig> = {
  openAIApiKey: "your-api-key",
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 2000,
  improvementIterations: 3,
  rateLimitRPM: 10,
  outputDir: "./generated_articles",
};

const articleGenerator = new ArticleGenerator(config);

async function generateArticle() {
  const topic = "WebAssemblyの最新動向と将来展望";
  const { article, summary, metadata } = await articleGenerator.generateArticle(
    topic
  );
  console.log("Article generated:", { summary, metadata });
}

generateArticle().catch(console.error);
```

## 設定オプション

- `openAIApiKey`: OpenAI API キー（必須）
- `model`: 使用する GPT モデル（デフォルト: 'gpt-4'）
- `temperature`: 生成の多様性（0-1、デフォルト: 0.7）
- `maxTokens`: 最大トークン数（デフォルト: 2000）
- `improvementIterations`: 記事改善の繰り返し回数（デフォルト: 3）
- `redisUrl`: Redis サーバーのアドレス（キャッシュ使用時）
- `rateLimitRPM`: 1 分あたりの最大リクエスト数（デフォルト: 10）
- `outputDir`: 生成された記事の出力ディレクトリ（デフォルト: './generated_articles'）

## 開発

```bash
# 依存関係のインストール
npm install

# テストの実行
npm test

# ビルド
npm run build
```

## ライセンス

MIT

```

これで、プロジェクトの全ファイルの内容を提示しました。この構造と内容により、LangChainを使用した技術記事生成モジュールの完全な実装が提供されています。

```
