import { http } from "@/shared/api";
import type { WordLookupResponse } from "./types";

export const wordApi = {
	lookup: async (tokenId: string): Promise<WordLookupResponse> => {
		const { data } = await http.post<WordLookupResponse>("/words/lookup", {
			tokenId,
		});
		return data;
	},

};
