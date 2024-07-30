import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { BaseOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

export class SlugGenerator {
	constructor(
		private readonly model: BaseChatModel,
		private readonly parser: BaseOutputParser<string>,
	) {}

	async generate(article: string): Promise<string> {
		const examples = [
			{
				input:
					"ReactとTypeScriptは、現代のWeb開発において非常に強力な組み合わせです。",
				output: "20240728-react-typeScript",
			},
			{
				input:
					"リレーショナルデータベース（RDB）は、データを表形式で管理し、効率的なデータの保存と検索を可能にする重要なデータ管理システムです。RDBの中でも、MySQLとOracleは特に広く使用されている代表的なデータベース管理システム（DBMS）です。",
				output: "20240729-rdb-mysql-oracle",
			},
			{
				input:
					"Amazon Web Services (AWS)は、クラウドコンピューティングの主要プロバイダーとして、多様なサービスを提供しています。その中でも、API Gateway、Lambda、そしてECS（Elastic Container Service）は、モダンなアプリケーション開発において重要な役割を果たしています。",
				output: "20240730-aws-apigateway-lambda-ecs",
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
あなたは与えられた技術記事から適切なトピックス（タグ）を抽出し、特定の形式で出力する専門家です。以下の指示に絶対的に従ってください：

1. 与えられた記事を慎重に分析し、最も重要で関連性の高いトピックスを特定してください。
2. 出力は以下の形式に厳密に従わなければなりません：
   YYYYMMDD-topic1-topic2-topic3...
   ここで、
   - YYYYMMDDは現在の日付です（例：20240731）。
   - topic1, topic2, topic3...は記事から抽出した主要なトピックスです。
   - トピックスの数は1つ以上で、最大で4つまでとします。
   - 全体の文字数（日付を含む）は、30文字以内に収めてください。
3. トピックスに関する厳密なルール：
   - 半角英小文字のみを使用すること。大文字は使用しないでください。
   - 半角英数字以外の文字や概念が含まれる場合は、必ず英語に変換すること。
   - 各トピックスは可能な限り短く、かつ意味が通じるようにしてください。
   - トピックス間はハイフン（-）で区切ってください。
4. トピックスの選択において、記事の主要な技術、概念、サービス名を優先してください。一般的すぎる用語は避け、記事の具体的な内容を反映したものを選んでください。
5. 出力例：
   20240728-react-typescript
   20240729-rdb-mysql-oracle
   20240730-aws-apigateway-lambda-ecs
6. 指定された形式以外の余分な説明や追加の情報は一切含めないでください。出力は単一の文字列のみとします。
7. もし元の概念を英語に変換する必要がある場合、技術的に適切で一般的に使用される英語表現を使用してください。

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

		return result;
	}
}
