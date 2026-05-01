import { http } from "@/shared/api";
import type { WordCorpusExample, WordLookupResponse } from "./types";

export const wordApi = {
	lookup: async (tokenId: string): Promise<WordLookupResponse> => {
		const { data } = await http.post<WordLookupResponse>("/words/lookup", {
			tokenId,
		});
		return data;
	},

	examples: async (lemmaId: string): Promise<WordCorpusExample[]> => {
		const { data } = await http.get<WordCorpusExample[]>(
			`/words/${lemmaId}/examples`,
		);
		return data;
	},
};
