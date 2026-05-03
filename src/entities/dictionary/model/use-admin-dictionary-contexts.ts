import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";

export const useAdminDictionaryContexts = (id: string, limit = 20) =>
	useQuery({
		queryKey: [...adminDictionaryKeys.contexts(id), limit],
		queryFn: () => adminDictionaryApi.contexts(id, limit),
		enabled: !!id,
	});
