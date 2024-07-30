import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { BaseMessagePromptTemplateLike } from "@langchain/core/prompts";
import { getFirstPromptMessage } from "../prompts/getFirstPromptMessage";
import { getImprovePromptMessage } from "../prompts/getImprovePromptMessage";
import { getSystemMessage } from "../prompts/getSystemMessage";
import { decorateTemplate } from "../utils/template";
import { formatResult } from "../utils/text";

export class ArticleGenerator {
	constructor(
		private readonly model: BaseChatModel,
		private readonly parser: BaseOutputParser<string>,
	) {}

	async generate(title: string): Promise<string> {
		const basePromptMessages: BaseMessagePromptTemplateLike[] = [
			["system", getSystemMessage()],
			["human", getFirstPromptMessage()],
		] as const;

		const chatPrompt = ChatPromptTemplate.fromMessages(basePromptMessages);
		const chainedPrompt = chatPrompt.pipe(this.model).pipe(this.parser);
		const result = await chainedPrompt.invoke({
			title,
		});

		let improved = await this.improveArticle(basePromptMessages, result, title);
		improved = await improveArticle(
			improved.promptMessages,
			improved.article,
			title,
		);
		improved = await improveArticle(
			improved.promptMessages,
			improved.article,
			title,
		);

		const article = decorateTemplate(improved.article);

		return article;
	}

	private async improveArticle(
		promptMessages: BaseMessagePromptTemplateLike[],
		article: string,
		title: string,
	): Promise<{
		promptMessages: BaseMessagePromptTemplateLike[];
		article: string;
	}> {
		const messages = [...promptMessages];
		messages.push(["ai", formatResult(article)]);
		messages.push(["human", getImprovePromptMessage()]);

		const chatPrompt = ChatPromptTemplate.fromMessages(messages);
		const chainedPrompt = chatPrompt.pipe(this.model).pipe(this.parser);

		const result = await chainedPrompt.invoke({
			title,
		});

		return { promptMessages: messages, article: result };
	}
}
