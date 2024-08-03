import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { BaseMessagePromptTemplateLike } from "@langchain/core/prompts";
import { getAddDiagramPromptMessage } from "../prompts/getAddDiagramPromptMessage";
import { getGeneratePromptMessage } from "../prompts/getGeneratePromptMessage";
import { getImprovePromptMessage } from "../prompts/getImprovePromptMessage";
import { getSystemMessage } from "../prompts/getSystemMessage";
import { logger } from "../utils/logger";
import { formatResult } from "../utils/text";

export class ArticleGenerator {
	constructor(
		private readonly model: BaseChatModel,
		private readonly parser: BaseOutputParser<string>,
	) {}

	async generate(title: string): Promise<string> {
		const basePromptMessages: BaseMessagePromptTemplateLike[] = [
			["system", getSystemMessage()],
			["human", getGeneratePromptMessage()],
		] as const;

		const chatPrompt = ChatPromptTemplate.fromMessages(basePromptMessages);
		const chainedPrompt = chatPrompt.pipe(this.model).pipe(this.parser);
		const result = await chainedPrompt.invoke({
			title,
		});

		logger.info("improving article 1th");
		let improved = await this.improveArticle(basePromptMessages, result, title);

		logger.info("improving article 2th");
		improved = await this.improveArticle(
			improved.promptMessages,
			improved.article,
			title,
		);

		logger.info("adding diagram");
		improved = await this.addDiagram(
			improved.promptMessages,
			improved.article,
			title,
		);

		return improved.article;
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

	private async addDiagram(
		promptMessages: BaseMessagePromptTemplateLike[],
		article: string,
		title: string,
	): Promise<{
		promptMessages: BaseMessagePromptTemplateLike[];
		article: string;
	}> {
		const messages = [...promptMessages];
		messages.push(["ai", formatResult(article)]);
		messages.push(["human", getAddDiagramPromptMessage()]);

		const chatPrompt = ChatPromptTemplate.fromMessages(messages);
		const chainedPrompt = chatPrompt.pipe(this.model).pipe(this.parser);

		const result = await chainedPrompt.invoke({
			title,
		});

		return { promptMessages: messages, article: result };
	}
}
