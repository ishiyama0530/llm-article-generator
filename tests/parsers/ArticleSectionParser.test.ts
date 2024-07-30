import { ArticleSectionParser } from "../../src/parsers/ArticleSectionParser";

describe("parsers/ArticleSectionParser", () => {
	test("==articleStart==/==articleEnd==で囲われた記事部分の抽出が可能", async () => {
		const parser = new ArticleSectionParser();
		const text = "==articleStart== 記事部分 ==articleEnd==";
		const expected = "記事部分";

		const result = await parser.parse(text);

		expect(result).toBe(expected);
	});

	test("==articleStart==/==articleEnd==で囲われた部分が無い場合エラー", async () => {
		const parser = new ArticleSectionParser();
		const text = "記事部分";

		await expect(parser.parse(text)).rejects.toThrow();
	});
});
