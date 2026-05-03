"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminFeatureFlagsPage } from "../model/use-admin-feature-flags-page";
import { FeatureFlagsTopbar } from "./feature-flags-topbar";
import { FeatureFlagsStatsRow } from "./feature-flags-stats-row";
import { FeatureFlagsTabs } from "./feature-flags-tabs";
import { FeatureFlagsToolbar } from "./feature-flags-toolbar";
import { OverridesToolbar } from "./overrides-toolbar";
import { FlagsTable } from "./flags-table";
import { FlagsMobileList } from "./flags-mobile-list";
import { OverridesTable } from "./overrides-table";
import { HistoryTable } from "./history-table";
import { FeatureFlagsPagination } from "./feature-flags-pagination";
import { FeatureFlagModal } from "./feature-flag-modal";
import { FeatureFlagDeleteModal } from "./feature-flag-delete-modal";

export const AdminFeatureFlagsPage = () => {
	const { t } = useI18n();
	const {
		tab,
		page,
		search,
		category,
		environment,
		status,
		modalOpen,
		editFlag,
		deleteFlag,
		flagsQuery,
		overridesQuery,
		historyQuery,
		statsQuery,
		total,
		totalPages,
		LIMIT,
		isModalSubmitting,
		isDeleting,
		handleTabChange,
		handleSearchChange,
		handleCategoryChange,
		handleEnvironmentChange,
		handleStatusChange,
		handleToggle,
		openCreate,
		openEdit,
		handleModalSubmit,
		openDelete,
		handleDeleteConfirm,
		handleDuplicate,
		handleDeleteOverride,
		setModalOpen,
		setDeleteFlag,
		setPage,
	} = useAdminFeatureFlagsPage();

	const flagItems = flagsQuery.data?.items ?? [];
	const overrideItems = overridesQuery.data?.items ?? [];
	const historyItems = historyQuery.data?.items ?? [];

	const isFlagsLoading = flagsQuery.isLoading;
	const isOverridesLoading = overridesQuery.isLoading;
	const isHistoryLoading = historyQuery.isLoading;

	const isEmpty =
		tab === "flags"
			? flagItems.length === 0 && !isFlagsLoading
			: tab === "overrides"
				? overrideItems.length === 0 && !isOverridesLoading
				: historyItems.length === 0 && !isHistoryLoading;

	return (
		<div className="flex min-h-screen flex-col bg-bg">
			<FeatureFlagsTopbar
				title={t("admin.featureFlags.title")}
				subtitle={t("admin.featureFlags.subtitle")}
				actions={
					<>
						<button
							type="button"
							onClick={openCreate}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88]"
						>
							<svg className="size-[11px]" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
								<path d="M7.5 2v11M2 7.5h11" />
							</svg>
							{t("admin.featureFlags.newFlag")}
						</button>
					</>
				}
			/>

			<div className="px-5 py-5 pb-10 max-sm:px-3">
				<FeatureFlagsStatsRow
					stats={statsQuery.data}
					isLoading={statsQuery.isLoading}
					t={t}
				/>

				<FeatureFlagsTabs active={tab} onChange={handleTabChange} t={t} />

				{tab === "flags" && (
					<FeatureFlagsToolbar
						search={search}
						category={category}
						environment={environment}
						status={status}
						onSearchChange={handleSearchChange}
						onCategoryChange={handleCategoryChange}
						onEnvironmentChange={handleEnvironmentChange}
						onStatusChange={handleStatusChange}
						t={t}
					/>
				)}

				{tab === "overrides" && (
					<OverridesToolbar
						search={search}
						onSearchChange={handleSearchChange}
						t={t}
					/>
				)}

				{tab === "history" && (
					<OverridesToolbar
						search={search}
						onSearchChange={handleSearchChange}
						t={t}
					/>
				)}

				<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf transition-colors">
					{isEmpty ? (
						<div className="py-16 text-center text-[13px] text-t-3">
							{t("admin.featureFlags.empty")}
						</div>
					) : (
						<>
							{tab === "flags" && (
								<>
									<FlagsTable
										items={flagItems}
										isLoading={isFlagsLoading}
										onToggle={handleToggle}
										onEdit={openEdit}
										onDuplicate={handleDuplicate}
										onDelete={openDelete}
										t={t}
									/>
									<FlagsMobileList
										items={flagItems}
										isLoading={isFlagsLoading}
										onToggle={handleToggle}
										onEdit={openEdit}
										onDuplicate={handleDuplicate}
										onDelete={openDelete}
										t={t}
									/>
								</>
							)}

							{tab === "overrides" && (
								<OverridesTable
									items={overrideItems}
									isLoading={isOverridesLoading}
									onDelete={handleDeleteOverride}
									t={t}
								/>
							)}

							{tab === "history" && (
								<HistoryTable
									items={historyItems}
									isLoading={isHistoryLoading}
									t={t}
								/>
							)}
						</>
					)}

					{total > 0 && (
						<FeatureFlagsPagination
							page={page}
							totalPages={totalPages}
							total={total}
							limit={LIMIT}
							onChange={setPage}
							t={t}
						/>
					)}
				</div>
			</div>

			<FeatureFlagModal
				open={modalOpen}
				editFlag={editFlag}
				isSubmitting={isModalSubmitting}
				onSubmit={handleModalSubmit}
				onClose={() => setModalOpen(false)}
				t={t}
			/>

			<FeatureFlagDeleteModal
				flag={deleteFlag}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={() => setDeleteFlag(null)}
				t={t}
			/>
		</div>
	);
};
