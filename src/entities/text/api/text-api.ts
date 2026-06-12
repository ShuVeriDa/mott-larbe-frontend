import { http } from "@/shared/api";
import type {
	BookmarkResponse,
	ScriptPageResponse,
	TextPageResponse,
	TextProgressResponse,
} from "./types";
import type { PagePhraseOccurrence } from "@/entities/admin-text-phrase";

export const textApi = {
	getPage: async (
		textId: string,
		pageNumber: number,
	): Promise<TextPageResponse> => {
		const { data } = await http.get<TextPageResponse>(
			`/texts/${textId}/pages/${pageNumber}`,
		);
		return data;
	},

	getScriptPage: async (
		textId: string,
		pageNumber: number,
		script: string,
	): Promise<ScriptPageResponse> => {
		const { data } = await http.get<TextPageResponse>(
			`/texts/${textId}/pages/${pageNumber}`,
			{ params: { script } },
		);
		return { contentRich: data.page.contentRich, tokens: data.tokens };
	},

	getProgress: async (textId: string): Promise<TextProgressResponse> => {
		const { data } = await http.get<TextProgressResponse>(
			`/progress/text/${textId}`,
		);
		return data;
	},

	markComplete: async (textId: string): Promise<void> => {
		await http.post(`/progress/text/${textId}/complete`);
	},

	toggleBookmark: async (textId: string): Promise<BookmarkResponse> => {
		const { data } = await http.post<BookmarkResponse>(
			`/texts/${textId}/bookmark`,
		);
		return data;
	},

	getPagePhrases: async (
		textId: string,
		pageNumber: number,
	): Promise<PagePhraseOccurrence[]> => {
		const { data } = await http.get<PagePhraseOccurrence[]>(
			`/texts/${textId}/pages/${pageNumber}/phrases`,
		);
		return data;
	},
};
