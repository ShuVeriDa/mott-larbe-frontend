import { queryOptions } from "@tanstack/react-query";
import { textScriptVersionApi } from "../api/text-script-version-api";
import { textScriptVersionKeys } from "../api/text-script-version-keys";
import type { ChScript } from "../api/types";

const STALE_5MIN = 1000 * 60 * 5;
const STALE_30MIN = 1000 * 60 * 30;

export const scriptVersionsQueryOptions = (textId: string) =>
	queryOptions({
		queryKey: textScriptVersionKeys.versions(textId),
		queryFn: () => textScriptVersionApi.getVersions(textId),
		staleTime: STALE_5MIN,
	});

export const userScriptVersionsQueryOptions = (userTextId: string) =>
	queryOptions({
		queryKey: textScriptVersionKeys.userVersions(userTextId),
		queryFn: () => textScriptVersionApi.getUserVersions(userTextId),
		staleTime: STALE_5MIN,
	});

export const scriptPageQueryOptions = (
	textId: string,
	pageNumber: number,
	script: ChScript,
) =>
	queryOptions({
		queryKey: textScriptVersionKeys.page(textId, pageNumber, script),
		queryFn: () =>
			textScriptVersionApi.getVersions(textId).then((versions) => {
				const v = versions.find((v) => v.script === script);
				return v?.status === "COMPLETED" ? v : null;
			}),
		staleTime: STALE_30MIN,
		gcTime: STALE_30MIN,
	});

export const userScriptPageQueryOptions = (
	userTextId: string,
	pageNumber: number,
	script: ChScript,
) =>
	queryOptions({
		queryKey: textScriptVersionKeys.userPage(userTextId, pageNumber, script),
		queryFn: () =>
			textScriptVersionApi.getUserVersions(userTextId).then((versions) => {
				const v = versions.find((v) => v.script === script);
				return v?.status === "COMPLETED" ? v : null;
			}),
		staleTime: STALE_30MIN,
		gcTime: STALE_30MIN,
	});
