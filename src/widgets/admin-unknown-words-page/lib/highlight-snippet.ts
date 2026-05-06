export interface SnippetPart {
	text: string;
	highlight: boolean;
}

export const highlightSnippet = (
	snippet: string,
	word: string,
): SnippetPart[] => {
	const idx = snippet.toLowerCase().indexOf(word.toLowerCase());
	if (idx === -1) return [{ text: snippet, highlight: false }];
	return [
		{ text: snippet.slice(0, idx), highlight: false },
		{ text: snippet.slice(idx, idx + word.length), highlight: true },
		{ text: snippet.slice(idx + word.length), highlight: false },
	];
};
