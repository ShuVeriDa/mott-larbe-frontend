import { queryOptions } from "@tanstack/react-query";
import { dashboardApi } from "./dashboard-api";
import { dashboardKeys } from "./dashboard-keys";

export const dashboardQueryOptions = () =>
	queryOptions({
		queryKey: dashboardKeys.me(),
		queryFn: () => dashboardApi.me(),
		staleTime: 60_000,
	});
