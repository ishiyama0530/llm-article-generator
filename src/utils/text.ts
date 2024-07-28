export function formatResult(text: string): string {
	return escapeBraces(text);
}

export function escapeBraces(text: string): string {
	return text.replace(/{/g, "{{").replace(/}/g, "}}");
}
