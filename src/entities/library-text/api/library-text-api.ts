import { http } from "@/shared/api";
import type {
	GetLibraryTextsQuery,
	GetLibraryTextsResponse,
	TextTagDto,
} from "./types";

export const libraryTextApi = {
	list: async (
		query: GetLibraryTextsQuery = {},
	): Promise<GetLibraryTextsResponse> => {
		const { data } = await http.get<GetLibraryTextsResponse>("/texts", {
			params: {
				...(query.language?.length ? { language: query.language } : {}),
				...(query.level?.length ? { level: query.level } : {}),
				...(query.status ? { status: query.status } : {}),
				...(query.orderBy ? { orderBy: query.orderBy } : {}),
				...(query.search ? { search: query.search } : {}),
				page: query.page ?? 1,
				limit: query.limit ?? 50,
			},
			paramsSerializer: (p) => {
				const sp = new URLSearchParams();
				for (const [k, v] of Object.entries(p)) {
					if (Array.isArray(v)) {
						(v as string[]).forEach((item) => sp.append(k, item));
					} else {
						sp.set(k, String(v));
					}
				}
				return sp.toString();
			},
		});
		return data;
	},

	getTags: async (): Promise<TextTagDto[]> => {
		const { data } = await http.get<TextTagDto[]>("/texts/tags");
		return data;
	},
};
