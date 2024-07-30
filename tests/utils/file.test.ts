import * as fs from "node:fs/promises";
import { getTodayTitle, saveArticle } from "../../src/utils/file";

jest.mock("node:fs/promises");
const fsMock = fs as jest.Mocked<typeof fs>;

describe("utils/saveArticle", () => {
	const outputDir = "/path/to/output";
	const title = "SampleArticle";
	const article = "This is a sample article.";

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("保存処理が成功する", async () => {
		fsMock.mkdir.mockImplementation(() => {
			return Promise.resolve(undefined);
		});

		fsMock.writeFile.mockImplementation(() => {
			return Promise.resolve();
		});

		await saveArticle(title, article, outputDir);
	});
});

describe("utils/saveArticle::getTodayTitle", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("当日のタイトルを取得する", async () => {
		const filePath = "/path/to/titles.json";
		const today = new Date().toISOString().split("T")[0];
		const titleData = {
			[today]: "MySQLで始めるSQL入門",
		};
		const rawData = JSON.stringify(titleData);

		fsMock.readFile.mockResolvedValue(rawData);

		const result = await getTodayTitle(filePath);

		expect(result).toBe("MySQLで始めるSQL入門");
	});
});
