import { Chain } from "../../src/utils/chain";

describe("Chain", () => {
	test("should execute a single generator", async () => {
		const generator = jest.fn().mockResolvedValue({
			promptMessages: [],
			article: "Generated article",
		});

		const chain = Chain.start(generator);
		const result = await chain.execute("Test Title");

		expect(generator).toHaveBeenCalled();
		expect(result.promptMessages).toEqual([]);
		expect(result.article).toBe("Generated article");
	});

	test("should execute multiple generators in chain", async () => {
		const generator1 = jest.fn().mockResolvedValue({
			promptMessages: [{ message: "Prompt 1" }],
			article: "Article 1",
		});

		const generator2 = jest.fn().mockResolvedValue({
			promptMessages: [{ message: "Prompt 2" }],
			article: "Article 2",
		});

		const chain = Chain.start(generator1).chain(generator2);
		const result = await chain.execute("Test Title");

		expect(generator1).toHaveBeenCalled();
		expect(generator2).toHaveBeenCalled();
		expect(result.promptMessages).toEqual([{ message: "Prompt 2" }]);
		expect(result.article).toBe("Article 2");
	});
});
