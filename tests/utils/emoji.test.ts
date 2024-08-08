import { getRandomEmoji } from "../../src/utils/emoji";

describe("getRandomEmoji", () => {
	it("should return a random emoji", () => {
		const emoji = getRandomEmoji();
		expect(typeof emoji).toBe("string");
		expect(emoji.length).toBeGreaterThan(0);
	});
});
