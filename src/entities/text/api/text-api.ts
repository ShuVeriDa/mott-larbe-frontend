import { http } from "@/shared/api";
import type {
	BookmarkResponse,
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

	getProgress: async (textId: string): Promise<TextProgressResponse> => {
		const { data } = await http.get<TextProgressResponse>(
			`/progress/text/${textId}`,
		);
		return data;
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
