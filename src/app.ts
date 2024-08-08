import path from "node:path";
// import { ChatAnthropic } from "@langchain/anthropic";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { AddDiagramGenerator } from "./generators/AddDiagramGenerator";
import { ArticleGenerator } from "./generators/ArticleGenerator";
import { ImproveGenerator } from "./generators/ImproveGenerator";
import { SlugGenerator } from "./generators/SlugGenerator";
import { TopicsGenerator } from "./generators/TopicsGenerator";
import { ArticleSectionParser } from "./parsers/ArticleSectionParser";
import { Chain } from "./utils/chain";
import { getTodayTitle, saveArticle } from "./utils/file";
import { logger } from "./utils/logger";
import { addZennMeta } from "./utils/template";

export async function execute() {
	const articleSectionParser = new ArticleSectionParser();
	const stringOutputParser = new StringOutputParser();

	const openai = new ChatOpenAI({
		model: "gpt-4o-mini",
		temperature: 0,
		maxTokens: 8192,
		apiKey: process.env.OPENAI_API_KEY,
	});

	// const anthropic = new ChatAnthropic({
	// 	model: "claude-3-5-sonnet-20240620",
	// 	temperature: 0,
	// 	maxTokens: 8192,
	// 	apiKey: process.env.ANTHROPIC_API_KEY,
	// 	clientOptions: {
	// 		defaultHeaders: {
	// 			"anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15",
	// 		},
	// 	},
	// });

	const articleGenerator = new ArticleGenerator(openai, articleSectionParser);
	const improveGenerator = new ImproveGenerator(openai, articleSectionParser);
	const addDiagramGenerator = new AddDiagramGenerator(
		openai,
		articleSectionParser,
	);
	const topicsGenerator = new TopicsGenerator(openai, stringOutputParser);
	const slugGenerator = new SlugGenerator(openai, stringOutputParser);

	logger.info("記事生成を開始します");

	const filePath = path.join(__dirname, "../data/titles.json");
	const title = await getTodayTitle(filePath);

	logger.info(`タイトル: ${title}`);

	const chain = Chain.start(() => articleGenerator.generate(title))
		.chain(improveGenerator)
		.chain(improveGenerator)
		.chain(addDiagramGenerator);

	const { article } = await chain.execute(title);

	const topics = await topicsGenerator.generate(article);
	const slug = await slugGenerator.generate(article);

	const result = addZennMeta(title, topics, article);

	await saveArticle(slug, result, "./articles");

	logger.info(`記事生成が完了しました。\n\n文字数: ${article.length}`);
}
