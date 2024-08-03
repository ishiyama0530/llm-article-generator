import path from "node:path";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import { ArticleGenerator } from "./generators/ArticleGenerator";
import { SlugGenerator } from "./generators/SlugGenerator";
import { TopicsGenerator } from "./generators/TopicsGenerator";
import { ArticleSectionParser } from "./parsers/ArticleSectionParser";
import { getTodayTitle, saveArticle } from "./utils/file";
import { logger } from "./utils/logger";
import { addZennMeta, decorateTemplate } from "./utils/template";

export async function execute() {
	const articleSectionParser = new ArticleSectionParser();
	const stringOutputParser = new StringOutputParser();

	const model = new ChatOpenAI({
		model: "gpt-4o-mini",
		temperature: 0,
		maxTokens: 16384,
		apiKey: process.env.OPENAI_API_KEY,
	});

	const articleGenerator = new ArticleGenerator(model, articleSectionParser);
	const topicsGenerator = new TopicsGenerator(model, stringOutputParser);
	const slugGenerator = new SlugGenerator(model, stringOutputParser);

	logger.info("記事生成を開始します");

	const filePath = path.join(__dirname, "../data/titles.json");
	const title = await getTodayTitle(filePath);

	logger.info(`タイトル: ${title}`);

	let article = await articleGenerator.generate(title);
	article = decorateTemplate(article);

	const topics = await topicsGenerator.generate(article);
	const slug = await slugGenerator.generate(article);

	const result = addZennMeta(title, topics, article);

	await saveArticle(slug, result, "./articles");

	logger.info(`記事生成が完了しました。\n\n文字数: ${article.length}`);
}
