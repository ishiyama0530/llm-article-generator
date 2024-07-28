import * as fs from "node:fs/promises";
import path from "node:path";
import logger from "./logger";

export async function saveArticle(
	topic: string,
	article: string,
	outputDir: string,
): Promise<void> {
	const fileName = `${topic}_${new Date().toISOString()}.md`;
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
