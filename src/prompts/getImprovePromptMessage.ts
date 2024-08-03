const message = `
前回出力した記事の完成度を6割としたとき、以下の指示に従って10割の完成度してください。
各セクションの内容をより詳細にし、多くの情報を提供することで読者に価値ある情報を提供できるようにしてください。

以下の点は必ず考慮してください：
    - 記事の本文は必ず ==articleStart== タグで始め、==articleEnd== タグで終えてください。これらのタグの間に記事の主要な内容をすべて含めてください。
    - 記事全体が ==articleStart== と ==articleEnd== タグで正しく囲まれていることを再度確認してください。これらのタグの外には、タイトルや追加の注記以外の内容を含めないでください。`;

export function getImprovePromptMessage() {
	return message;
}
