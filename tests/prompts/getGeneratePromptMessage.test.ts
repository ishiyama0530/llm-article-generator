import { getGeneratePromptMessage } from "../../src/prompts/getGeneratePromptMessage";

describe("prompts/getGeneratePromptMessage", () => {
	test("記事生成のプロンプトメッセージが取得できる", () => {
		const result = getGeneratePromptMessage();

		expect(result.length >= 1).toBeTruthy();
	});
});
