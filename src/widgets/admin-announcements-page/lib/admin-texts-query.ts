import { http } from "@/shared/api";
import { queryOptions } from "@tanstack/react-query";

export interface TextOption {
	id: string;
	title: string;
}

export const adminTextsQueryOptions = (search: string) =>
	queryOptions({
		queryKey: ["entities", "admin-text", "list", { search, limit: 20 }],
		queryFn: () =>
			http
				.get<{ data: TextOption[] }>("/admin/texts", {
					params: { search: search || undefined, limit: 20, status: "published" },
				})
				.then((r) => r.data.data ?? []),
		staleTime: 1000 * 30,
	});
