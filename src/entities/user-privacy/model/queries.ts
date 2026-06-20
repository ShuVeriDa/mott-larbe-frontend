import { queryOptions } from "@tanstack/react-query";
import { userPrivacyApi } from "../api/user-privacy-api";
import { userPrivacyKeys } from "../api/user-privacy-keys";

export const myPrivacyQueryOptions = () =>
	queryOptions({
		queryKey: userPrivacyKeys.my(),
		queryFn: () => userPrivacyApi.getMyPrivacy(),
		staleTime: 1000 * 60 * 5, // 5 min — user-owned data
	});
