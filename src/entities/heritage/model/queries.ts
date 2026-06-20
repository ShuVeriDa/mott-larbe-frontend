import { queryOptions } from "@tanstack/react-query";
import { heritageApi } from "../api/heritage-api";
import { heritageKeys } from "../api/heritage-keys";
import type { PendingHeritageQuery } from "../api/types";

const STALE_TIME = 1000 * 60 * 60; // 1 hour — reference data changes rarely

export const nationsQueryOptions = () =>
	queryOptions({
		queryKey: heritageKeys.nationsList(),
		queryFn: () => heritageApi.getNations({ limit: 50 }),
		staleTime: STALE_TIME,
	});

export const tukhumQueryOptions = (nationId: string) =>
	queryOptions({
		queryKey: heritageKeys.tukhum(nationId),
		queryFn: () => heritageApi.getTukhum(nationId, { limit: 50 }),
		staleTime: STALE_TIME,
		enabled: !!nationId,
	});

export const taipsByNationQueryOptions = (nationId: string) =>
	queryOptions({
		queryKey: heritageKeys.taipsByNation(nationId),
		queryFn: () => heritageApi.getTaipsByNation(nationId, { limit: 200 }),
		staleTime: STALE_TIME,
		enabled: !!nationId,
	});

export const taipsByTukhumQueryOptions = (tukhumId: string) =>
	queryOptions({
		queryKey: heritageKeys.taipsByTukhum(tukhumId),
		queryFn: () => heritageApi.getTaipsByTukhum(tukhumId, { limit: 200 }),
		staleTime: STALE_TIME,
		enabled: !!tukhumId,
	});

export const garasByTaipQueryOptions = (taipId: string) =>
	queryOptions({
		queryKey: heritageKeys.garasByTaip(taipId),
		queryFn: () => heritageApi.getGarasByTaip(taipId, { limit: 100 }),
		staleTime: STALE_TIME,
		enabled: !!taipId,
	});

export const myHeritageQueryOptions = () =>
	queryOptions({
		queryKey: heritageKeys.myHeritage(),
		queryFn: () => heritageApi.getMyHeritage(),
		staleTime: 1000 * 60 * 5, // 5 min — user data
	});

export const publicHeritageQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: heritageKeys.publicHeritage(userId),
		queryFn: () => heritageApi.getPublicHeritage(userId),
		staleTime: 1000 * 60 * 5,
		enabled: !!userId,
	});

export const pendingHeritageQueryOptions = (query: PendingHeritageQuery = {}) =>
	queryOptions({
		queryKey: heritageKeys.pending({ page: query.page, limit: query.limit, type: query.type }),
		queryFn: () => heritageApi.getPendingHeritage(query),
		staleTime: 1000 * 60 * 2, // 2 min — moderation data changes frequently
	});

export const heritageModerationStatsQueryOptions = () =>
	queryOptions({
		queryKey: heritageKeys.stats(),
		queryFn: () => heritageApi.getModerationStats(),
		staleTime: 1000 * 60 * 2,
	});
