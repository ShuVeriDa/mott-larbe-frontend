import { http } from "@/shared/api";
import type { ReaderContextResponse } from "./types";

export const readerContextApi = {
	getContext: async (
		textId: string,
		pageNumber: number,
	): Promise<ReaderContextResponse> => {
		const { data } = await http.get<ReaderContextResponse>("/reader-context", {
			params: { textId, pageNumber },
		});
		return data;
	},
};
