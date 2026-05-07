"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminLogsPage } from "../model/use-admin-logs-page";
import { LogsDetailPanel } from "./logs-detail-panel";
import { LogsMobileList } from "./logs-mobile-list";
import { LogsPagination } from "./logs-pagination";
import { LogsStatsRow } from "./logs-stats-row";
import { LogsTable } from "./logs-table";
import { LogsTabs } from "./logs-tabs";
import { LogsToolbar } from "./logs-toolbar";
import { LogsTopbar } from "./logs-topbar";

export const AdminLogsPage = () => {
	const { t } = useI18n();
	const {
		tab,
		search,
		service,
		range,
		page,
		isLive,
		items,
		total,
		tabs,
		totalPages,
		logsQuery,
		statsQuery,
		servicesQuery,
		detailQuery,
		handleTabChange,
		handleSearchChange,
		handleServiceChange,
		handleRangeChange,
		setPage,
		toggleLive,
		openDetail,
		closeDetail,
		handleExport,
		LIMIT,
		selectedId,
	} = useAdminLogsPage();

	const services = servicesQuery.data?.services ?? [];
	const isLoading = logsQuery.isLoading;

	return (
		<div className="flex min-h-screen flex-col">
			<LogsTopbar
				isLive={isLive}
				onToggleLive={toggleLive}
				onExport={handleExport}
			/>

			<div className="px-5 py-5 pb-10 max-sm:px-3">
				<LogsStatsRow
					stats={statsQuery.data}
					isLoading={statsQuery.isLoading}
				/>

				<LogsTabs active={tab} counts={tabs} onChange={handleTabChange} />

				<LogsToolbar
					search={search}
					service={service}
					range={range}
					services={services}
					onSearchChange={handleSearchChange}
					onServiceChange={handleServiceChange}
					onRangeChange={handleRangeChange}
				/>

				<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf transition-colors">
					{items.length === 0 && !isLoading ? (
						<div className="py-16 text-center text-[13px] text-t-3">
							{t("admin.logs.empty")}
						</div>
					) : (
						<>
							<LogsTable
								items={items}
								isLoading={isLoading}
								onRowClick={openDetail}
							/>
							<LogsMobileList
								items={items}
								isLoading={isLoading}
								onItemClick={openDetail}
							/>
						</>
					)}

					{total > 0 && (
						<LogsPagination
							page={page}
							totalPages={totalPages}
							total={total}
							limit={LIMIT}
							onChange={setPage}
						/>
					)}
				</div>
			</div>

			<LogsDetailPanel
				open={!!selectedId}
				detail={detailQuery.data}
				isLoading={detailQuery.isLoading}
				onClose={closeDetail}
			/>
		</div>
	);
};
