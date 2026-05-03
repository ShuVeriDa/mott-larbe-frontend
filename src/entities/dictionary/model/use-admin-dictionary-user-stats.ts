import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";

export const useAdminDictionaryUserStats = (id: string) =>
	useQuery({
		queryKey: adminDictionaryKeys.userStats(id),
		queryFn: () => adminDictionaryApi.userStats(id),
		enabled: !!id,
	});
