import { getFactCheckPromptMessage } from "../../src/prompts/getFactCheckPromptMessage";

describe("prompts/getFactCheckPromptMessage", () => {
	test("事実確認のプロンプトメッセージが取得できる", () => {
		const result = getFactCheckPromptMessage();

		expect(result.length >= 1).toBeTruthy();
	});
});
