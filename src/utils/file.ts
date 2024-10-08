import * as fs from "node:fs/promises";
import path from "node:path";
import dayjs from "dayjs";
import { logger } from "./logger";

export async function saveArticle(
	title: string,
	article: string,
	outputDir: string,
): Promise<void> {
	const fileName = `${title}.md`;
	const filePath = path.join(outputDir, fileName);

	try {
		await fs.mkdir(outputDir, { recursive: true });
		await fs.writeFile(filePath, article, "utf8");
		logger.info(`記事を保存しました: ${filePath}`);
	} catch (error) {
		logger.error("記事の保存中にエラーが発生しました:", error);
		throw error;
	}
}

export async function getTodayTitle(filePath: string): Promise<string> {
	const today = dayjs().tz().format("YYYY-MM-DD");
	const rawData = await fs.readFile(filePath, "utf8");

	const titleData: {
		[date: string]: string;
	} = JSON.parse(rawData);

	const title = titleData[today];

	if (!title) {
		throw new Error("タイトルが取得できませんでした");
	}

	return title;
}
