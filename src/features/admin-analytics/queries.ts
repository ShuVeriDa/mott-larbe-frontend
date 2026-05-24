"use client";

import {
	keepPreviousData,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { adminAnalyticsApi } from "./api";
import type {
	AnalyticsGeographyExportQuery,
	AnalyticsGeographyStatsQuery,
	AnalyticsMultiTimeseriesQuery,
	AnalyticsOverviewExportQuery,
	AnalyticsPagesQuery,
	AnalyticsReferrersBreakdownQuery,
	AnalyticsTimeseriesCompareResponse,
	AnalyticsTimeseriesPoint,
	AnalyticsTimeseriesQuery,
	AnalyticsTopCitiesQuery,
	AnalyticsTopCountriesQuery,
	AnalyticsTopQuery,
	AnalyticsTopReferrersQuery,
	AnalyticsUaKind,
	AnalyticsUaQuery,
	AnalyticsWordClicksQuery,
} from "./types";

export const adminAnalyticsKeys = {
	all: ["admin", "tracking"] as const,
	realtime: () => [...adminAnalyticsKeys.all, "realtime"] as const,
	pages: (query: AnalyticsPagesQuery) => [...adminAnalyticsKeys.all, "pages", query] as const,
	timeseries: (query: AnalyticsTimeseriesQuery, compare: boolean) =>
		[...adminAnalyticsKeys.all, "timeseries", query, compare] as const,
	timeseriesSummary: (query: AnalyticsTimeseriesQuery) =>
		[...adminAnalyticsKeys.all, "timeseries-summary", query] as const,
	overview: (from?: string, to?: string) =>
		[...adminAnalyticsKeys.all, "overview", from ?? null, to ?? null] as const,
	multiTimeseries: (query: AnalyticsMultiTimeseriesQuery) =>
		[...adminAnalyticsKeys.all, "multi-timeseries", query] as const,
	topPages: (query: AnalyticsTopQuery) => [...adminAnalyticsKeys.all, "top-pages", query] as const,
	topReferrers: (query: AnalyticsTopQuery) =>
		[...adminAnalyticsKeys.all, "top-referrers", query] as const,
	topReferrersInfinite: (query: AnalyticsTopReferrersQuery) =>
		[...adminAnalyticsKeys.all, "top-referrers-infinite", query] as const,
	referrersBreakdown: (query: AnalyticsReferrersBreakdownQuery) =>
		[...adminAnalyticsKeys.all, "referrers-breakdown", query] as const,
	uaBreakdown: (kind: AnalyticsUaKind, query: AnalyticsUaQuery) =>
		[...adminAnalyticsKeys.all, "ua-breakdown", kind, query] as const,
	geoIpStatus: () => [...adminAnalyticsKeys.all, "geoip-status"] as const,
	topCountries: (query: AnalyticsTopCountriesQuery) =>
		[...adminAnalyticsKeys.all, "top-countries", query] as const,
	topCities: (query: AnalyticsTopCitiesQuery) =>
		[...adminAnalyticsKeys.all, "top-cities", query] as const,
	geographyStats: (query: AnalyticsGeographyStatsQuery) =>
		[...adminAnalyticsKeys.all, "geography-stats", query] as const,
	wordClicks: (query: AnalyticsWordClicksQuery) =>
		[...adminAnalyticsKeys.all, "word-clicks", query] as const,
};

interface Options {
	enabled?: boolean;
}

export const useAdminAnalyticsRealtime = (options: Options = {}) =>
	useQuery({
		queryKey: adminAnalyticsKeys.realtime(),
		queryFn: adminAnalyticsApi.getRealtime,
		enabled: options.enabled ?? true,
		refetchInterval: () =>
			typeof document !== "undefined" && document.visibilityState === "visible" ? 30_000 : false,
		refetchOnWindowFocus: true,
		staleTime: 30_000,
	});

export const useAdminAnalyticsPages = (query: AnalyticsPagesQuery, options: Options = {}) =>
	useInfiniteQuery({
		queryKey: adminAnalyticsKeys.pages(query),
		queryFn: ({ pageParam }) => adminAnalyticsApi.listPages({ ...query, offset: pageParam }),
		initialPageParam: 0,
		getNextPageParam: (last, pages) => {
			const loaded = pages.reduce((n, p) => n + p.items.length, 0);
			return loaded < last.total ? loaded : undefined;
		},
		enabled: options.enabled ?? true,
		staleTime: 60_000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsTimeseries = (
	query: AnalyticsTimeseriesQuery,
	compare: boolean,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.timeseries(query, compare),
		queryFn: async (): Promise<AnalyticsTimeseriesPoint[] | AnalyticsTimeseriesCompareResponse> =>
			compare
				? adminAnalyticsApi.getTimeseriesWithCompare(query)
				: adminAnalyticsApi.getTimeseries(query),
		enabled: options.enabled ?? true,
		staleTime: 60_000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsTimeseriesSummary = (
	query: AnalyticsTimeseriesQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.timeseriesSummary(query),
		queryFn: () => adminAnalyticsApi.getTimeseriesSummary(query),
		enabled: options.enabled ?? true,
		staleTime: 60_000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsOverview = (from?: string, to?: string, options: Options = {}) =>
	useQuery({
		queryKey: adminAnalyticsKeys.overview(from, to),
		queryFn: () => adminAnalyticsApi.getOverview(from, to),
		enabled: options.enabled ?? true,
		staleTime: 60_000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsReferrersBreakdown = (
	query: AnalyticsReferrersBreakdownQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.referrersBreakdown(query),
		queryFn: () => adminAnalyticsApi.getReferrersBreakdown(query),
		enabled: options.enabled ?? true,
		staleTime: 60_000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsTopReferrersInfinite = (
	query: AnalyticsTopReferrersQuery,
	options: Options = {},
) => {
	const limit = query.limit ?? 20;
	const stableQuery = { ...query, limit };
	return useInfiniteQuery({
		queryKey: adminAnalyticsKeys.topReferrersInfinite(stableQuery),
		queryFn: ({ pageParam }) =>
			adminAnalyticsApi.listTopReferrers({ ...stableQuery, offset: pageParam }),
		initialPageParam: 0,
		getNextPageParam: (last, pages) => {
			if (last.length < limit) return undefined;
			return pages.reduce((n, p) => n + p.length, 0);
		},
		enabled: options.enabled ?? true,
		staleTime: 60_000,
		placeholderData: keepPreviousData,
	});
};

export const useAdminAnalyticsMultiTimeseries = (
	query: AnalyticsMultiTimeseriesQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.multiTimeseries(query),
		queryFn: () => adminAnalyticsApi.getMultiTimeseries(query),
		enabled: options.enabled ?? true,
		staleTime: 5 * 60 * 1000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsTopPages = (query: AnalyticsTopQuery, options: Options = {}) =>
	useQuery({
		queryKey: adminAnalyticsKeys.topPages(query),
		queryFn: () => adminAnalyticsApi.getTopPages(query),
		enabled: options.enabled ?? true,
		staleTime: 5 * 60 * 1000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsUaBreakdown = (
	kind: AnalyticsUaKind,
	query: AnalyticsUaQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.uaBreakdown(kind, query),
		queryFn: () => adminAnalyticsApi.getUaBreakdown(kind, query),
		enabled: options.enabled ?? true,
		staleTime: 60_000,
		placeholderData: keepPreviousData,
	});

export const useAggregateAnalytics = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (day?: string) => adminAnalyticsApi.aggregate(day),
		onSuccess: () => qc.invalidateQueries({ queryKey: adminAnalyticsKeys.all }),
	});
};

export const useExportAnalyticsOverviewCsv = () =>
	useMutation({
		mutationFn: (query: AnalyticsOverviewExportQuery) =>
			adminAnalyticsApi.getOverviewExport(query),
	});

export const useInvalidateAdminAnalytics = () => {
	const qc = useQueryClient();
	return () => qc.invalidateQueries({ queryKey: adminAnalyticsKeys.all });
};

export const useAdminAnalyticsGeoIpStatus = (options: Options = {}) =>
	useQuery({
		queryKey: adminAnalyticsKeys.geoIpStatus(),
		queryFn: adminAnalyticsApi.getGeoIpStatus,
		enabled: options.enabled ?? true,
		staleTime: 10 * 60 * 1000,
	});

export const useAdminAnalyticsTopCountries = (
	query: AnalyticsTopCountriesQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.topCountries(query),
		queryFn: () => adminAnalyticsApi.getTopCountries(query),
		enabled: options.enabled ?? true,
		staleTime: 5 * 60 * 1000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsTopCities = (
	query: AnalyticsTopCitiesQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.topCities(query),
		queryFn: () => adminAnalyticsApi.getTopCities(query),
		enabled: options.enabled ?? true,
		staleTime: 5 * 60 * 1000,
		placeholderData: keepPreviousData,
	});

export const useAdminAnalyticsGeographyStats = (
	query: AnalyticsGeographyStatsQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.geographyStats(query),
		queryFn: () => adminAnalyticsApi.getGeographyStats(query),
		enabled: options.enabled ?? true,
		staleTime: 5 * 60 * 1000,
		placeholderData: keepPreviousData,
	});

export const useExportAnalyticsGeographyCsv = () =>
	useMutation({
		mutationFn: (query: AnalyticsGeographyExportQuery) =>
			adminAnalyticsApi.exportGeographyCsv(query),
	});

export const useAdminAnalyticsTopWordClicks = (
	query: AnalyticsWordClicksQuery,
	options: Options = {},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.wordClicks(query),
		queryFn: () => adminAnalyticsApi.getTopWordClicks(query),
		enabled: options.enabled ?? true,
		staleTime: 5 * 60 * 1000,
		placeholderData: keepPreviousData,
	});
