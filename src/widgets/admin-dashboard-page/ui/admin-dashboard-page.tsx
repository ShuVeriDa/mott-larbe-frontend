"use client";

import { useAdminDashboard } from "../model/use-admin-dashboard";
import { DashboardTopbar } from "./dashboard-topbar";
import { DashboardAlertStrip } from "./dashboard-alert-strip";
import {
	DashboardKpiGrid,
	DashboardKpiGridSkeleton,
} from "./dashboard-kpi-grid";
import {
	DashboardRegistrationsCard,
	DashboardRegistrationsCardSkeleton,
} from "./dashboard-registrations-card";
import {
	DashboardContentCard,
	DashboardContentCardSkeleton,
} from "./dashboard-content-card";
import {
	DashboardRecentUsersCard,
	DashboardRecentUsersCardSkeleton,
} from "./dashboard-recent-users-card";
import {
	DashboardActivityCard,
	DashboardActivityCardSkeleton,
} from "./dashboard-activity-card";
import {
	DashboardFeatureFlagsCard,
	DashboardFeatureFlagsCardSkeleton,
} from "./dashboard-feature-flags-card";
import {
	DashboardBillingCard,
	DashboardBillingCardSkeleton,
} from "./dashboard-billing-card";
import {
	DashboardSupportTable,
	DashboardSupportTableSkeleton,
} from "./dashboard-support-table";

export const AdminDashboardPage = () => {
	const { period, setPeriod, dashboardQuery, handleToggleFlag, handleExport } =
		useAdminDashboard();

	const data = dashboardQuery.data;
	const isLoading = dashboardQuery.isLoading;

	return (
		<div className="flex min-h-screen flex-col bg-bg">
			<DashboardTopbar
				period={period}
				onPeriodChange={setPeriod}
				onExport={handleExport}
			/>

			<div className="px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				{data && data.unknownWords.total > 0 && (
					<DashboardAlertStrip unknownWordsCount={data.unknownWords.total} />
				)}

				{isLoading || !data ? (
					<>
						<DashboardKpiGridSkeleton />
						<div className="mb-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-[2fr_1fr]">
							<DashboardRegistrationsCardSkeleton />
							<DashboardContentCardSkeleton />
						</div>
						<div className="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
							<DashboardRecentUsersCardSkeleton />
							<DashboardActivityCardSkeleton />
						</div>
						<div className="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
							<DashboardFeatureFlagsCardSkeleton />
							<DashboardBillingCardSkeleton />
						</div>
						<DashboardSupportTableSkeleton />
					</>
				) : (
					<>
						<DashboardKpiGrid kpi={data.kpi} />

						<div className="mb-3.5 grid grid-cols-1 gap-3.5 lg:grid-cols-[2fr_1fr]">
							<DashboardRegistrationsCard chart={data.chart} />
							<DashboardContentCard content={data.content} />
						</div>

						<div className="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
							<DashboardRecentUsersCard users={data.recentUsers.slice(0, 5)} />
							<DashboardActivityCard events={data.activityFeed.slice(0, 6)} />
						</div>

						<div className="mb-3.5 grid grid-cols-1 gap-3.5 md:grid-cols-2">
							<DashboardFeatureFlagsCard
								flags={data.featureFlags}
								onToggle={handleToggleFlag}
							/>
							<DashboardBillingCard billing={data.billing} />
						</div>

						<DashboardSupportTable support={data.support} />
					</>
				)}
			</div>
		</div>
	);
};
