import { useQuery } from "@tanstack/react-query";
import { adminLogApi, adminLogKeys } from "../api";
import type { FetchAdminLogsQuery } from "../api";

export const useAdminLogs = (query?: FetchAdminLogsQuery) =>
	useQuery({
		queryKey: adminLogKeys.list(query),
		queryFn: () => adminLogApi.list(query),
	});
