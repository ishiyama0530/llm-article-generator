// unused
const message = `
以下のチェックリストを順守し、記事の完成度を高めてください。

■チェックリスト（必須確認事項）:

文字数と構造:
- [ ] 記事の総文字数が12800字から16000字の間であることを確認
- [ ] ==articleStart== タグで記事が始まり、==articleEnd== タグで終わっていることを確認
- [ ] 主要セクションに ## レベルの見出し、サブセクションに ### または #### レベルの見出しを使用していることを確認

内容の質と完全性:
- [ ] 「はじめに」と「まとめ」のセクションが含まれていることを確認
- [ ] 各セクションが論理的に流れ、自然につながっていることを確認
- [ ] 技術的な用語や概念に適切な説明が加えられていることを確認
- [ ] 実践的で具体的な例が十分に含まれていることを確認
- [ ] 最新の情報が反映されていることを確認
- [ ] 不確かな情報には、その旨が明記されていることを確認

コードと図表:
- [ ] コードサンプルが \`\`\`で囲まれ、適切な言語指定がされていることを確認
- [ ] 図表に明確で分かりやすい説明文が付けられていることを確認

ダイアグラム:
- [ ] 少なくとも1つのmermaid.jsダイアグラムが含まれていることを確認
- [ ] 各ダイアグラムが記事の内容と適切に関連していることを確認
- [ ] ダイアグラムの前後に適切な説明が加えられていることを確認
- [ ] ダイアグラムが記事の流れに自然に組み込まれていることを確認

深堀りと拡張:
- [ ] 各トピックが十分に深く掘り下げられていることを確認
- [ ] 技術の歴史的背景や将来の展望が議論されていることを確認
- [ ] 読者が直面する可能性のある課題や疑問点への回答が含まれていることを確認

追加リソース:
- [ ] 必要に応じて、さらなる学習のためのリソースや参考文献が提案されていることを確認

全体的な品質:
- [ ] 記事全体が専門的で詳細な内容を含んでいることを確認
- [ ] 冗長な記述を避け、各文が価値ある情報を提供していることを確認
- [ ] 記事全体を通して一貫性のある専門的な文体が使用されていることを確認

最終確認:
- [ ] すべてのセクションとサブセクションが適切に発展され、バランスが取れていることを確認
- [ ] 記事全体が高品質で包括的な技術記事としての基準を満たしていることを確認`;

export function getChecklistPromptMessage() {
	return message;
}
