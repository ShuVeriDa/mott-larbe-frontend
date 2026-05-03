import { useQuery } from "@tanstack/react-query";
import { adminLogApi, adminLogKeys } from "../api";

export const useAdminLogDetail = (id: string | null) =>
	useQuery({
		queryKey: adminLogKeys.detail(id ?? ""),
		queryFn: () => adminLogApi.getById(id!),
		enabled: !!id,
	});
