"use client";
import { useState } from 'react';
import {
	adminAnalyticsApi,
	useAdminAnalytics,
	useAdminDifficultTexts,
	useAdminPopularTexts,
} from "@/entities/admin-analytics";
import type {
	AnalyticsRange,
	DifficultBy,
	PopularBy,
} from "@/entities/admin-analytics";

const getBrowserTz = () =>
	Intl.DateTimeFormat().resolvedOptions().timeZone;

export const useAdminAnalyticsPage = () => {
	const [range, setRange] = useState<AnalyticsRange>("30d");
	const [dateFrom, setDateFrom] = useState<string | undefined>(undefined);
	const [dateTo, setDateTo] = useState<string | undefined>(undefined);
	const [difficultBy, setDifficultBy] = useState<DifficultBy>("fail");
	const [popularBy, setPopularBy] = useState<PopularBy>("opens");

	const tz = getBrowserTz();

	// dateFrom+dateTo override range on the backend per API contract
	const query = dateFrom && dateTo ? { dateFrom, dateTo, tz } : { range, tz };

	const overviewQuery = useAdminAnalytics(query);

	const difficultQuery = useAdminDifficultTexts({
		...query,
		difficultBy,
		difficultLimit: 6,
	});

	const popularQuery = useAdminPopularTexts({
		...query,
		popularBy,
		popularLimit: 7,
	});

	const handleRangeChange = (next: AnalyticsRange) => {
		setRange(next);
		setDateFrom(undefined);
		setDateTo(undefined);
	};

	const handleDateRangeChange = (from: string, to: string) => {
		setDateFrom(from);
		setDateTo(to);
	};

	const handleDateRangeClear = () => {
		setDateFrom(undefined);
		setDateTo(undefined);
	};

	const handleDifficultByChange = (next: DifficultBy) => {
		setDifficultBy(next);
	};

	const handlePopularByChange = (next: PopularBy) => {
		setPopularBy(next);
	};

	const handleExport = (format: "json" | "csv" = "csv") => {
		adminAnalyticsApi.export({ ...query, format });
	};

	const data = overviewQuery.data;
	const isLoading = overviewQuery.isLoading;
	const isCustomRange = Boolean(dateFrom && dateTo);

	return {
		range,
		dateFrom,
		dateTo,
		isCustomRange,
		difficultBy,
		popularBy,
		data,
		isLoading,
		overviewQuery,
		difficultQuery,
		popularQuery,
		handleRangeChange,
		handleDateRangeChange,
		handleDateRangeClear,
		handleDifficultByChange,
		handlePopularByChange,
		handleExport,
	};
};
