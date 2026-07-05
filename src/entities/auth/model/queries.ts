import { queryOptions } from "@tanstack/react-query";
import { authApi } from "../api";
import { authKeys } from "../api/auth-keys";

export const linkedAccountsQueryOptions = () =>
	queryOptions({
		queryKey: authKeys.linkedAccounts(),
		queryFn: authApi.getLinkedAccounts,
		staleTime: 30_000,
	});
