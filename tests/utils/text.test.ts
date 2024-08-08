import { escapeBraces, formatResult } from "../../src/utils/text";

describe("formatResult", () => {
	test("should format the text with escaped braces", () => {
		const input = "Hello {World}";
		const expected = "Hello {{World}}";
		const result = formatResult(input);
		expect(result).toBe(expected);
	});

	test("should not modify the text without braces", () => {
		const input = "Hello World";
		const result = formatResult(input);
		expect(result).toBe(input);
	});
});

describe("escapeBraces", () => {
	test("should escape all opening and closing braces", () => {
		const input = "{Hello} {World}";
		const expected = "{{Hello}} {{World}}";
		const result = escapeBraces(input);
		expect(result).toBe(expected);
	});

	test("should not modify the text without braces", () => {
		const input = "Hello World";
		const result = escapeBraces(input);
		expect(result).toBe(input);
	});
});
