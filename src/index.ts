import path from "node:path";
import { ChatOpenAI } from "@langchain/openai";
import { ArticleGenerator } from "./generators/ArticleGenerator";
import { SlugGenerator } from "./generators/SlugGenerator";
import { TopicsGenerator } from "./generators/TopicsGenerator";
import { ArticleSectionParser } from "./parsers/ArticleSectionParser";
import { getTodayTitle, saveArticle } from "./utils/file";
import logger from "./utils/logger";
import { addZennMeta } from "./utils/template";

require("dotenv").config();

const parser = new ArticleSectionParser();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
	maxTokens: 16384,
	apiKey: process.env.OPENAI_API_KEY,
});

const articleGenerator = new ArticleGenerator(model, parser);
const topicsGenerator = new TopicsGenerator(model, parser);
const slugGenerator = new SlugGenerator(model, parser);

async function main() {
	logger.info("記事生成を開始します");

	const filePath = path.join(__dirname, "../data/titles.json");
	const title = await getTodayTitle(filePath);

	logger.info(`タイトル: ${title}`);

	const article = await articleGenerator.generate(title);
	const topics = await topicsGenerator.generate("network,dns,http");
	const slug = await slugGenerator.generate("network-basic");

	const result = addZennMeta(title, topics, article);

	await saveArticle(slug, result, "./articles");

	logger.info(`記事生成が完了しました。\n\n文字数: ${article.length}`);
}

main().catch(logger.error);
