import { queryOptions } from "@tanstack/react-query";
import { announcementApi } from "../api/announcement-api";
import { announcementKeys } from "../api/announcement-keys";

export const announcementListQueryOptions = () =>
	queryOptions({
		queryKey: announcementKeys.list(),
		queryFn: () => announcementApi.getList(),
		staleTime: 1000 * 60,
	});
