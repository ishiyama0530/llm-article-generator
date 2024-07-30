import { getSystemMessage } from "../../src/prompts/getSystemMessage";

describe("prompts/getSystemMessage", () => {
	test("システムのプロンプトメッセージが取得できる", () => {
		console.dir(process.env.OPENAI_API_KEY);
		const result = getSystemMessage();

		expect(result.length >= 1).toBeTruthy();
	});
});
