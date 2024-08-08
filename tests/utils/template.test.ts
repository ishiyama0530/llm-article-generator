import { addZennMeta, decorateTemplate } from "../../src/utils/template";

describe("Template Utils", () => {
	test("should decorate template with header and footer", () => {
		const article = "Generated article";
		const expected = `
※本記事は生成AIを使用して作成されました。
AI言語モデル: gpt-4o-mini

-----

${article}

-----

※本記事は生成AIを使用して作成されました。
AI言語モデル: gpt-4o-mini`;

		const result = decorateTemplate(article);

		expect(result).toBe(expected);
	});

	test("should add Zenn metadata to the article", () => {
		const title = "Test Title";
		const topics = ["topic1", "topic2"];
		const article = "Generated article";

		const result = addZennMeta(title, topics, article);

		// 期待される構造をチェック
		expect(result).toMatch(/^---\n/);
		expect(result).toMatch(/title: "Test Title"/);
		expect(result).toMatch(/emoji: ".+"/); // 任意の1文字以上の絵文字
		expect(result).toMatch(/type: "tech"/);
		expect(result).toMatch(/topics: \["topic1", "topic2"\]/);
		expect(result).toMatch(/published: true/);
		expect(result).toMatch(/---\n\nGenerated article$/);
	});
});
