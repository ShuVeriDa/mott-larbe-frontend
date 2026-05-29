import { queryOptions } from "@tanstack/react-query";
import { readerContextApi } from "./reader-context-api";
import { readerContextKeys } from "./reader-context-keys";

export const readerContextQueryOptions = (textId: string, pageNumber: number) =>
	queryOptions({
		queryKey: readerContextKeys.context(textId, pageNumber),
		queryFn: () => readerContextApi.getContext(textId, pageNumber),
		staleTime: 60_000,
	});
