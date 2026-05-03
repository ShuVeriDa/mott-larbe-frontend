import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";

export const useAdminDictionaryFrequencyStats = (id: string) =>
	useQuery({
		queryKey: adminDictionaryKeys.frequencyStats(id),
		queryFn: () => adminDictionaryApi.frequencyStats(id),
		enabled: !!id,
	});
