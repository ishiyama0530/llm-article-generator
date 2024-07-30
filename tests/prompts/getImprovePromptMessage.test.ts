import { getImprovePromptMessage } from "../../src/prompts/getImprovePromptMessage";

describe("prompts/getImprovePromptMessage", () => {
	test("記事改善のプロンプトメッセージが取得できる", () => {
		const result = getImprovePromptMessage();

		expect(result.length >= 1).toBeTruthy();
	});
});
