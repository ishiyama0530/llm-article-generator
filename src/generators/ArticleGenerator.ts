import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { BaseMessagePromptTemplateLike } from "@langchain/core/prompts";
import { getGeneratePromptMessage } from "../prompts/getGeneratePromptMessage";
import { getSystemMessage } from "../prompts/getSystemMessage";

export class ArticleGenerator {
	constructor(
		private readonly model: BaseChatModel,
		private readonly parser: BaseOutputParser<string>,
	) {}

	async generate(title: string): Promise<{
		promptMessages: BaseMessagePromptTemplateLike[];
		article: string;
	}> {
		const messages: BaseMessagePromptTemplateLike[] = [
			["system", getSystemMessage()],
			["human", getGeneratePromptMessage()],
		] as const;

		const chatPrompt = ChatPromptTemplate.fromMessages(messages);
		const chainedPrompt = chatPrompt.pipe(this.model).pipe(this.parser);
		const result = await chainedPrompt.invoke({
			title,
		});

		return { promptMessages: messages, article: result };
	}
}
