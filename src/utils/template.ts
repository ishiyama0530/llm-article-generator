const header =
	"※本記事は生成AIを使用して作成されました。正確かつ最新の情報については、信頼できる専門的な情報源や公式ドキュメントをご確認ください。\nAI言語モデル: gpt-4o-mini";

const footer =
	"※本記事は生成AIを使用して作成されました。正確かつ最新の情報については、信頼できる専門的な情報源や公式ドキュメントをご確認ください。\nAI言語モデル: gpt-4o-mini";

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
emoji: "🤖"
type: "tech"
topics: [${topicsString}]
published: true
---

${article}`;
}
