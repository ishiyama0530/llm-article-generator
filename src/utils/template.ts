import { getRandomEmoji } from "./emoji";
const header =
	"※本記事は生成AIを使用して作成されました。\nAI言語モデル: gpt-4o-mini";

const footer =
	"※本記事は生成AIを使用して作成されました。\nAI言語モデル: gpt-4o-mini";

export function decorateTemplate(article: string): string {
	return `
${article}

-----

${footer}`;
}

export function addZennMeta(title: string, topics: string[], article: string) {
	const topicsString = topics.map((topic) => `"${topic}"`).join(", ");
	return `---
title: "${title}"
emoji: "${getRandomEmoji()}"
type: "tech"
topics: [${topicsString}]
published: true
---

${article}`;
}
