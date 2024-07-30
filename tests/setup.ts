jest.mock("@langchain/openai", () => ({
	ChatOpenAI: jest.fn().mockImplementation(() => ({
		call: jest.fn().mockResolvedValue({ text: "WIP" }),
	})),
}));
