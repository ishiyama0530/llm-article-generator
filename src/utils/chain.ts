import type { BaseMessagePromptTemplateLike } from "@langchain/core/prompts";
import type { IChainableGenerator } from "../types/IChainableGenerator";
import { logger } from "./logger";

type GeneratorFunction = () => Promise<{
	promptMessages: BaseMessagePromptTemplateLike[];
	article: string;
}>;

type ChainableGenerator = GeneratorFunction | IChainableGenerator;

export class Chain {
	private constructor(private readonly generators: ChainableGenerator[]) {}

	static start(generator: ChainableGenerator): Chain {
		return new Chain([generator]);
	}

	chain(generator: ChainableGenerator): Chain {
		return new Chain([...this.generators, generator]);
	}

	async execute(title: string): Promise<{
		promptMessages: BaseMessagePromptTemplateLike[];
		article: string;
	}> {
		let promptMessages: BaseMessagePromptTemplateLike[] = [];
		let article = "";

		for (const generator of this.generators) {
			logger.info(`Executing generator: ${generator.constructor.name}`);

			let result: {
				promptMessages: BaseMessagePromptTemplateLike[];
				article: string;
			};

			if (typeof generator === "function") {
				result = await generator();
			} else {
				result = await generator.generate(promptMessages, article, title);
			}

			promptMessages = result.promptMessages;
			article = result.article;
		}

		return { promptMessages, article };
	}
}
