import {
	BaseOutputParser,
	StringOutputParser,
} from "@langchain/core/output_parsers";

export class ArticleSectionParser extends BaseOutputParser<string> {
	static lc_name() {
		return "ArticleSectionParser";
	}

	lc_namespace = ["langchain", "output_parsers"];

	async parse(text: string): Promise<string> {
		const regex = /==articleStart==([\s\S]*?)==articleEnd==/;
		const match = text.match(regex);
		if (match?.[1]) {
			return match[1].trim();
		}
		// throw new Error(
		// 	"Article content not found between ==articleStart== and ==articleEnd== tags.",
		// );
		const parser = new StringOutputParser();
		const response = await parser.parse(text);
		throw new Error(response);
	}

	getFormatInstructions(): string {
		return "Wrap the main content of the article between ==articleStart== and ==articleEnd== tags.";
	}
}
