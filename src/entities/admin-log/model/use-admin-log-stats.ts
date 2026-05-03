import { useQuery } from "@tanstack/react-query";
import { adminLogApi, adminLogKeys } from "../api";
import type { FetchAdminLogsQuery } from "../api";

export const useAdminLogStats = (
	query?: Pick<FetchAdminLogsQuery, "range" | "dateFrom" | "dateTo">,
) =>
	useQuery({
		queryKey: adminLogKeys.stats(query?.range),
		queryFn: () => adminLogApi.stats(query),
	});
