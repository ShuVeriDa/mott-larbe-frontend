"use client";

import { useAdminAnalyticsPage } from "../model/use-admin-analytics-page";
import { AnalyticsTopbar } from "./analytics-topbar";
import { AnalyticsMobileTopbar } from "./analytics-mobile-topbar";
import { AnalyticsInsightStrip } from "./analytics-insight-strip";
import { AnalyticsKpiGrid } from "./analytics-kpi-grid";
import { AnalyticsLevelDist } from "./analytics-level-dist";
import { AnalyticsHeatmap } from "./analytics-heatmap";
import { AnalyticsEventsChart } from "./analytics-events-chart";
import { AnalyticsTopUsers } from "./analytics-top-users";
import { AnalyticsDifficultTexts } from "./analytics-difficult-texts";
import { AnalyticsPopularTexts } from "./analytics-popular-texts";
import { AnalyticsTopWords } from "./analytics-top-words";
import { AnalyticsReadingFunnel } from "./analytics-reading-funnel";
import { AnalyticsSm2Stats } from "./analytics-sm2-stats";

export const AdminAnalyticsPage = () => {
	const {
		range,
		difficultBy,
		popularBy,
		data,
		isLoading,
		difficultQuery,
		popularQuery,
		handleRangeChange,
		handleDifficultByChange,
		handlePopularByChange,
		handleExport,
	} = useAdminAnalyticsPage();

	const heatmap = data?.activityHeatmap;
	const eventsChart = data?.eventsChart;

	return (
		<div className="flex min-h-screen flex-col bg-bg">
			<AnalyticsTopbar
				range={range}
				onRangeChange={handleRangeChange}
				onExport={handleExport}
			/>
			<AnalyticsMobileTopbar range={range} onRangeChange={handleRangeChange} />

			<div className="px-5 py-5 pb-12 max-sm:px-3 max-sm:py-3">
				<AnalyticsInsightStrip
					insight={data?.insight}
					isLoading={isLoading}
				/>

				<AnalyticsKpiGrid
					items={data?.kpis.items}
					isLoading={isLoading}
				/>

				{/* Level dist + Heatmap */}
				<div className="mb-3.5 grid grid-cols-[1fr_2fr] gap-3.5 max-lg:grid-cols-1">
					<AnalyticsLevelDist
						items={data?.levelDistribution.items}
						isLoading={isLoading}
					/>
					<AnalyticsHeatmap
						days={heatmap?.days}
						hours={heatmap?.hours}
						isLoading={isLoading}
					/>
				</div>

				{/* Events chart + Top users */}
				<div className="mb-3.5 grid grid-cols-[2fr_1fr] gap-3.5 max-lg:grid-cols-1">
					<AnalyticsEventsChart
						labels={eventsChart?.labels}
						series={eventsChart?.series}
						isLoading={isLoading}
					/>
					<AnalyticsTopUsers
						users={data?.topActiveUsers}
						isLoading={isLoading}
					/>
				</div>

				{/* Difficult + Popular texts */}
				<div className="mb-3.5 grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
					<AnalyticsDifficultTexts
						tab={difficultBy}
						items={difficultQuery.data?.items ?? data?.difficultTexts.items}
						isLoading={difficultQuery.isLoading || isLoading}
						onTabChange={handleDifficultByChange}
					/>
					<AnalyticsPopularTexts
						tab={popularBy}
						items={popularQuery.data?.items ?? data?.popularTexts.items}
						isLoading={popularQuery.isLoading || isLoading}
						onTabChange={handlePopularByChange}
					/>
				</div>

				{/* Top words + Funnel + SM-2 */}
				<div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
					<AnalyticsTopWords
						words={data?.topUnknownWords}
						isLoading={isLoading}
					/>
					<div className="flex flex-col gap-3.5">
						<AnalyticsReadingFunnel
							funnel={data?.readingFunnel}
							isLoading={isLoading}
						/>
						<AnalyticsSm2Stats
							stats={data?.sm2Stats}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
