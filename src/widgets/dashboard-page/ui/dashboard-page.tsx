"use client";

import { useDashboardPage } from "../model";
import { DashboardContent } from "./dashboard-content";
import { DashboardError } from "./dashboard-error";
import { DashboardSkeleton } from "./dashboard-skeleton";

export const DashboardPage = () => {
	const { lang, data, isLoading, isError, user, handleRetry } = useDashboardPage();

	if (isLoading) return <DashboardSkeleton />;
	if (isError || !data) return <DashboardError onRetry={handleRetry} />;

	return <DashboardContent data={data} user={user} lang={lang} />;
};
