import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";

export const useAdminDictionaryNavigation = (id: string) => {
	const next = useQuery({
		queryKey: [...adminDictionaryKeys.nav(id), "next"],
		queryFn: () => adminDictionaryApi.next(id),
		enabled: !!id,
	});

	const prev = useQuery({
		queryKey: [...adminDictionaryKeys.nav(id), "prev"],
		queryFn: () => adminDictionaryApi.prev(id),
		enabled: !!id,
	});

	return { next, prev };
};
