import { http } from "@/shared/api";
import type { WordLookupRequest, WordLookupResponse } from "./types";

export const landingApi = {
	lookupByWord: async (
		body: WordLookupRequest,
	): Promise<WordLookupResponse> => {
		const { data } = await http.post<WordLookupResponse>(
			"/words/lookup-by-word",
			body,
		);
		return data;
	},
};
