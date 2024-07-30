import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseOutputParser } from "@langchain/core/output_parsers";

export class TopicsGenerator {
	constructor(
		private readonly model: BaseChatModel,
		private readonly parser: BaseOutputParser<string>,
	) {}

	async generate(article: string): Promise<string[]> {
		return article.split(",");
	}
}
