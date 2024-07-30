import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

jest.mock("@langchain/openai", () => ({
	ChatOpenAI: jest.fn().mockImplementation(() => ({
		call: jest.fn().mockResolvedValue({ text: "WIP" }),
	})),
}));
