export const annotationKeys = {
	lemmaSearch: (q: string, language: string) =>
		["annotation", "lemmas", language, q] as const,
	annotatedForms: (textId?: string) =>
		textId
			? (["annotation", "annotated-forms", textId] as const)
			: (["annotation", "annotated-forms"] as const),
	annotatedFormsByPage: (textId: string, pageNumber: number) =>
		["annotation", "annotated-forms", textId, pageNumber] as const,
	occurrences: (textId?: string) =>
		textId
			? (["annotation", "occurrences", textId] as const)
			: (["annotation", "occurrences"] as const),
	tokenOccurrences: (normalized: string, textId: string) =>
		["annotation", "occurrences", textId, normalized] as const,
	morphForms: {
		all: ["annotation", "morph-forms"] as const,
		list: (params: { q?: string; page?: number; limit?: number }) =>
			["annotation", "morph-forms", "list", params] as const,
		detail: (id: string) => ["annotation", "morph-forms", "detail", id] as const,
		occurrences: (id: string) => ["annotation", "morph-forms", "occurrences", id] as const,
	},
};
