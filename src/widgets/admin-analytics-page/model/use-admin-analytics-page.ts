"use client";

import { useCallback, useState } from "react";
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

export const useAdminAnalyticsPage = () => {
	const [range, setRange] = useState<AnalyticsRange>("30d");
	const [difficultBy, setDifficultBy] = useState<DifficultBy>("fail");
	const [popularBy, setPopularBy] = useState<PopularBy>("opens");

	const overviewQuery = useAdminAnalytics({ range });

	const difficultQuery = useAdminDifficultTexts({
		range,
		difficultBy,
		difficultLimit: 6,
	});

	const popularQuery = useAdminPopularTexts({
		range,
		popularBy,
		popularLimit: 7,
	});

	const handleRangeChange = useCallback((next: AnalyticsRange) => {
		setRange(next);
	}, []);

	const handleDifficultByChange = useCallback((next: DifficultBy) => {
		setDifficultBy(next);
	}, []);

	const handlePopularByChange = useCallback((next: PopularBy) => {
		setPopularBy(next);
	}, []);

	const handleExport = useCallback(() => {
		adminAnalyticsApi.export({ range, format: "csv" });
	}, [range]);

	const data = overviewQuery.data;
	const isLoading = overviewQuery.isLoading;

	return {
		range,
		difficultBy,
		popularBy,
		data,
		isLoading,
		overviewQuery,
		difficultQuery,
		popularQuery,
		handleRangeChange,
		handleDifficultByChange,
		handlePopularByChange,
		handleExport,
	};
};
