"use client";

import { useDashboardPage } from "../model";
import { DashboardContent } from "./dashboard-content";
import { DashboardError } from "./dashboard-error";
import { DashboardSkeleton } from "./dashboard-skeleton";
import { DashboardHeader } from "./dashboard-header";

export const DashboardPage = () => {
	const {
		lang,
		searchQuery,
		data,
		isLoading,
		isError,
		user,
		handleSearchSubmit,
		handleSearchChange,
		handleRetry,
	} = useDashboardPage();

	return (
		<>
			<DashboardHeader
				searchQuery={searchQuery}
				onSearchChange={handleSearchChange}
				onSearchSubmit={handleSearchSubmit}
			/>

			{isLoading ? (
				<DashboardSkeleton />
			) : isError || !data ? (
				<DashboardError onRetry={handleRetry} />
			) : (
				<DashboardContent data={data} user={user} lang={lang} />
			)}
		</>
	);
};
