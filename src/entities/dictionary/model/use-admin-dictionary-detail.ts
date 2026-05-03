import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";

export const useAdminDictionaryDetail = (id: string) =>
	useQuery({
		queryKey: adminDictionaryKeys.detail(id),
		queryFn: () => adminDictionaryApi.detail(id),
		enabled: !!id,
	});
