import path from "node:path";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { BaseMessagePromptTemplateLike } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { ArticleSectionParser } from "./parsers/ArticleSectionParser";
import { getFirstPromptMessage } from "./prompts/getFirstPromptMessage";
import { getImprovePromptMessage } from "./prompts/getImprovePromptMessage";
import { getSystemMessage } from "./prompts/getSystemMessage";
import { getTodayTitle, saveArticle } from "./utils/file";
import logger from "./utils/logger";
import { decorateTemplate } from "./utils/template";
import { formatResult } from "./utils/text";

require("dotenv").config();

const parser = new ArticleSectionParser();

const model = new ChatOpenAI({
	model: "gpt-4o-mini",
	temperature: 0,
	maxTokens: 16384,
	apiKey: process.env.OPENAI_API_KEY,
});

async function improveArticle(
	promptMessages: BaseMessagePromptTemplateLike[],
	article: string,
	topic: string,
): Promise<{
	promptMessages: BaseMessagePromptTemplateLike[];
	article: string;
}> {
	const messages = [...promptMessages];
	messages.push(["ai", formatResult(article)]);
	messages.push(["human", getImprovePromptMessage()]);

	const chatPrompt = ChatPromptTemplate.fromMessages(messages);
	const chainedPrompt = chatPrompt.pipe(model).pipe(parser);

	const result = await chainedPrompt.invoke({
		topic,
	});

	return { promptMessages: messages, article: result };
}

export async function generateArticle(topic: string): Promise<string> {
	const basePromptMessages: BaseMessagePromptTemplateLike[] = [
		["system", getSystemMessage()],
		["human", getFirstPromptMessage()],
	] as const;

	const chatPrompt = ChatPromptTemplate.fromMessages(basePromptMessages);
	const chainedPrompt = chatPrompt.pipe(model).pipe(parser);
	const result = await chainedPrompt.invoke({
		topic,
	});

	let improved = await improveArticle(basePromptMessages, result, topic);
	improved = await improveArticle(
		improved.promptMessages,
		improved.article,
		topic,
	);
	improved = await improveArticle(
		improved.promptMessages,
		improved.article,
		topic,
	);

	const article = decorateTemplate(improved.article);

	await saveArticle(topic, article, "./generated_articles");

	return article;
}

async function main() {
	logger.info("記事生成を開始します");

	const filePath = path.join(__dirname, "../data/titles.json");
	const topic = await getTodayTitle(filePath);

	logger.info(`タイトル: ${topic}`);

	const article = await generateArticle(topic);

	logger.info(`記事生成が完了しました。\n\n文字数: ${article.length}`);
}

main().catch(logger.error);
