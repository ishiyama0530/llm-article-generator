import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import type { BaseMessagePromptTemplateLike } from "../node_modules/@langchain/core/dist/prompts/chat.d.ts";
import { ArticleSectionParser } from "./parsers/ArticleSectionParser";
import { getFirstPromptMessage } from "./prompts/getFirstPromptMessage";
import { getImprovePromptMessage } from "./prompts/getImprovePromptMessage";
import { getSystemMessage } from "./prompts/getSystemMessage";
import { saveArticle } from "./utils/file";
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

export async function generateArticle(topic: string): Promise<void> {
	const basePromptMessages: BaseMessagePromptTemplateLike[] = [
		["system", getSystemMessage()],
		["human", getFirstPromptMessage()],
	] as const;

	const chatPrompt = ChatPromptTemplate.fromMessages(basePromptMessages);
	const chainedPrompt = chatPrompt.pipe(model).pipe(parser);
	const result = await chainedPrompt.invoke({
		topic,
	});

	const improved1 = await improveArticle(basePromptMessages, result, topic);
	const improved2 = await improveArticle(
		improved1.promptMessages,
		improved1.article,
		topic,
	);
	const improve3 = await improveArticle(
		improved2.promptMessages,
		improved2.article,
		topic,
	);

	await saveArticle(topic, improve3.article, "./generated_articles");
}

async function main() {
	const topic = "ブラウザにおけるCookieの仕組みとプライバシーへの影響";
	await generateArticle(topic);
}

main().catch(console.error);
