import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

export class TopicsGenerator {
	constructor(
		private readonly model: BaseChatModel,
		private readonly parser: BaseOutputParser<string>,
	) {}

	async generate(article: string): Promise<string[]> {
		const examples = [
			{
				input:
					"ReactとTypeScriptは、現代のWeb開発において非常に強力な組み合わせです。",
				output: "React,TypeScript",
			},
			{
				input:
					"リレーショナルデータベース（RDB）は、データを表形式で管理し、効率的なデータの保存と検索を可能にする重要なデータ管理システムです。RDBの中でも、MySQLとOracleは特に広く使用されている代表的なデータベース管理システム（DBMS）です。",
				output: "RDB,MySQL,Oracle",
			},
			{
				input:
					"Amazon Web Services (AWS)は、クラウドコンピューティングの主要プロバイダーとして、多様なサービスを提供しています。その中でも、API Gateway、Lambda、そしてECS（Elastic Container Service）は、モダンなアプリケーション開発において重要な役割を果たしています。",
				output: "AWS,APIGateway,Lambda,ECS",
			},
		];

		const fewShotPrompt = new FewShotChatMessagePromptTemplate({
			examplePrompt: ChatPromptTemplate.fromMessages([
				["human", "{input}"],
				["ai", "{output}"],
			]),
			examples,
			inputVariables: ["input"],
		});

		const fullPrompt = ChatPromptTemplate.fromMessages(
			[
				[
					"system",
					`
あなたは与えられた技術記事から適切なトピックス（タグ）を抽出する専門家です。以下の指示に絶対的に従って、トピックスを抽出してください。これらの指示は例外なく遵守しなければなりません：

1. 与えられた記事を慎重に分析し、最も重要で関連性の高いトピックスを特定してください。
2. 抽出したトピックスは以下のルールに絶対的に従わなければなりません。これらのルールは必ず遵守してください：
   - 半角英数字のみを使用すること。半角英数字以外の文字や概念が含まれる場合は、必ず英語に変換すること。
   - 記号は使用しないこと。React.jsはReactとして、C#はCsharpとして抽出すること。
   - 各トピックスは必ず18文字以内であること。
   - 正確に5つのトピックスを選択すること。5つより多くても少なくても絶対にいけません。
3. 選択した5つのトピックスをカンマ区切りで出力してください。例：AWS,APIGateway,Lambda,ECS,Serverless
4. 出力形式は絶対に「Topic1,Topic2,Topic3,Topic4,Topic5」の形式を守ってください。余分な説明や追加の情報は一切含めないでください。
5. トピックスの選択において、記事の主要な技術、概念、サービス名を優先してください。一般的すぎる用語は避け、記事の具体的な内容を反映したものを選んでください。
6. もし半角英数字以外のトピックが抽出された場合、それを英語に変換する際は、原意を最大限保持しつつ、技術的に適切な英語表現を使用してください。

これらの指示に従って、与えられた記事から適切なトピックスを抽出し、指定された形式で出力してください。いかなる状況でも、これらのルールから逸脱しないでください。`,
				],
				["human", "{input}"],
			],
			fewShotPrompt,
		);

		const chainedPrompt = fullPrompt.pipe(this.model).pipe(this.parser);

		const result = await chainedPrompt.invoke({
			input: article,
		});

		const topics = result.split(",").map((topic) => topic.trim());

		return topics;
	}
}
