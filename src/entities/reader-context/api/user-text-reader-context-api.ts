import { http } from "@/shared/api";
import type { ReaderContextResponse } from "./types";

// Calls the UserText-specific endpoint — returns same ReaderContextResponse shape
// so the existing useReaderContext cache and ReaderPage widget work transparently.
export const userTextReaderContextApi = {
	getContext: async (
		userTextId: string,
		pageNumber: number,
	): Promise<ReaderContextResponse> => {
		const { data } = await http.get<ReaderContextResponse>("/user-text-reader-context", {
			params: { userTextId, pageNumber },
		});
		return data;
	},
};
