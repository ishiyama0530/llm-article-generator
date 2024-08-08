import type { BaseMessagePromptTemplateLike } from "@langchain/core/prompts";

export type IChainableGenerator = {
	generate(
		promptMessages: BaseMessagePromptTemplateLike[],
		article: string,
		title: string,
	): Promise<{
		promptMessages: BaseMessagePromptTemplateLike[];
		article: string;
	}>;
};
