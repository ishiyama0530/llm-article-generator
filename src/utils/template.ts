const header =
	"※この記事は生成AIよって自動生成されました。正確な情報は公式サイトなどを参照してください。";

const footer =
	"※この記事は生成AIよって自動生成されました。正確な情報は公式サイトなどを参照してください。";

export function decorateTemplate(article: string): string {
	return `
${header}

-----

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
published: false
---

${article}`;
}
