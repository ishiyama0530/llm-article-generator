import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { BaseMessagePromptTemplateLike } from "@langchain/core/prompts";
import { getImprovePromptMessage } from "../prompts/getImprovePromptMessage";
import type { IChainableGenerator } from "../types/IChainableGenerator";
import { formatResult } from "../utils/text";

export class ImproveGenerator implements IChainableGenerator {
	constructor(
		private readonly model: BaseChatModel,
		private readonly parser: BaseOutputParser<string>,
	) {}

	async generate(
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
