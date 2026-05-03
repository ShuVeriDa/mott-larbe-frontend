import { useQuery } from "@tanstack/react-query";
import { adminLogApi, adminLogKeys } from "../api";

export const useAdminLogServices = () =>
	useQuery({
		queryKey: adminLogKeys.services(),
		queryFn: () => adminLogApi.services(),
		staleTime: Infinity,
	});
