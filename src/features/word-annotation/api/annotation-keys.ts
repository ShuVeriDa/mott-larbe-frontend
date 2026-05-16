export const annotationKeys = {
	lemmaSearch: (q: string, language: string) =>
		["annotation", "lemmas", language, q] as const,
	tokenOccurrences: (normalized: string, textId: string) =>
		["annotation", "occurrences", textId, normalized] as const,
	annotatedFormsByPage: (textId: string, pageNumber: number) =>
		["annotation", "annotated-forms", textId, pageNumber] as const,
	morphForms: {
		all: ["annotation", "morph-forms"] as const,
		list: (params: { q?: string; page?: number; limit?: number }) =>
			["annotation", "morph-forms", "list", params] as const,
		detail: (id: string) => ["annotation", "morph-forms", "detail", id] as const,
		occurrences: (id: string) => ["annotation", "morph-forms", "occurrences", id] as const,
	},
};
