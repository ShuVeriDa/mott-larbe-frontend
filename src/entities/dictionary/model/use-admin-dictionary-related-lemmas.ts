import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";

export const useAdminDictionaryRelatedLemmas = (id: string) =>
	useQuery({
		queryKey: adminDictionaryKeys.relatedLemmas(id),
		queryFn: () => adminDictionaryApi.relatedLemmas(id),
		enabled: !!id,
	});
