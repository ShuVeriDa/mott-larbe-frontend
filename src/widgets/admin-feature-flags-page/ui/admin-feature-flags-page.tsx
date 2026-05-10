"use client";

import { Button } from "@/shared/ui/button";
import { Upload, Plus } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps } from "react";
import { useAdminFeatureFlagsPage } from "../model/use-admin-feature-flags-page";
import { FeatureFlagDeleteModal } from "./feature-flag-delete-modal";
import { FeatureFlagDuplicateModal } from "./feature-flag-duplicate-modal";
import { FeatureFlagImportModal } from "./feature-flag-import-modal";
import { FeatureFlagModal } from "./feature-flag-modal";
import { FeatureFlagOverrideModal } from "./feature-flag-override-modal";
import { FeatureFlagsPagination } from "./feature-flags-pagination";
import { FeatureFlagsStatsRow } from "./feature-flags-stats-row";
import { FeatureFlagsTabs } from "./feature-flags-tabs";
import { FeatureFlagsToolbar } from "./feature-flags-toolbar";
import { FeatureFlagsTopbar } from "./feature-flags-topbar";
import { FlagsMobileList } from "./flags-mobile-list";
import { FlagsTable } from "./flags-table";
import { HistoryTable } from "./history-table";
import { HistoryToolbar } from "./history-toolbar";
import { OverridesTable } from "./overrides-table";
import { OverridesToolbar } from "./overrides-toolbar";

export const AdminFeatureFlagsPage = () => {
	const { t } = useI18n();
	const {
		tab,
		page,
		search,
		category,
		environment,
		status,
		overrideFlagId,
		overrideIsEnabled,
		historyEventType,
		historyActorId,
		modalOpen,
		editFlag,
		deleteFlag,
		duplicateFlag,
		overrideModalOpen,
		overridePreselectedFlagId,
		importModalOpen,
		flagsQuery,
		overridesQuery,
		historyQuery,
		statsQuery,
		keysQuery,
		historyActorsQuery,
		total,
		totalPages,
		LIMIT,
		isModalSubmitting,
		isDeleting,
		isDuplicating,
		isOverrideSubmitting,
		handleTabChange,
		handleSearchChange,
		handleCategoryChange,
		handleEnvironmentChange,
		handleStatusChange,
		handleOverrideFlagIdChange,
		handleOverrideIsEnabledChange,
		handleHistoryEventTypeChange,
		handleHistoryActorIdChange,
		handleToggle,
		openCreate,
		openEdit,
		handleModalSubmit,
		openDelete,
		handleDeleteConfirm,
		openDuplicate,
		handleDuplicateConfirm,
		openOverrideModal,
		handleOverrideSubmit,
		handleDeleteOverride,
		handleImportSubmit,
		setModalOpen,
		setDeleteFlag,
		setDuplicateFlag,
		setOverrideModalOpen,
		setImportModalOpen,
		setPage,
	} = useAdminFeatureFlagsPage();

	const flagItems = flagsQuery.data?.items ?? [];
	const overrideItems = overridesQuery.data?.items ?? [];
	const historyItems = historyQuery.data?.items ?? [];
	const flagKeys = keysQuery.data?.items ?? [];
	const historyActors = historyActorsQuery.data?.items ?? [];

	const isFlagsLoading = flagsQuery.isLoading;
	const isOverridesLoading = overridesQuery.isLoading;
	const isHistoryLoading = historyQuery.isLoading;

	const isEmpty =
		tab === "flags"
			? flagItems.length === 0 && !isFlagsLoading
			: tab === "overrides"
				? overrideItems.length === 0 && !isOverridesLoading
				: historyItems.length === 0 && !isHistoryLoading;

	const handleImportClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => setImportModalOpen(true);
	const handleAddOverride: NonNullable<
		ComponentProps<typeof OverridesToolbar>["onAddOverride"]
	> = () => openOverrideModal();
	const handleFlagModalClose: NonNullable<
		ComponentProps<typeof FeatureFlagModal>["onClose"]
	> = () => setModalOpen(false);
	const handleDeleteModalClose: NonNullable<
		ComponentProps<typeof FeatureFlagDeleteModal>["onClose"]
	> = () => setDeleteFlag(null);
	const handleDuplicateModalClose: NonNullable<
		ComponentProps<typeof FeatureFlagDuplicateModal>["onClose"]
	> = () => setDuplicateFlag(null);
	const handleOverrideModalClose: NonNullable<
		ComponentProps<typeof FeatureFlagOverrideModal>["onClose"]
	> = () => setOverrideModalOpen(false);
	const handleImportModalClose: NonNullable<
		ComponentProps<typeof FeatureFlagImportModal>["onClose"]
	> = () => setImportModalOpen(false);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<FeatureFlagsTopbar
				title={t("admin.featureFlags.title")}
				subtitle={t("admin.featureFlags.subtitle")}
				actions={
					<>
						<Button
							onClick={handleImportClick}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-surf px-3 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
						>
							<Upload className="size-[11px]" />
							{t("admin.featureFlags.importJson")}
						</Button>
						<Button
							onClick={openCreate}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88]"
						>
							<Plus className="size-[11px]" />
							{t("admin.featureFlags.newFlag")}
						</Button>
					</>
				}
			/>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3">
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
						flagId={overrideFlagId}
						isEnabled={overrideIsEnabled}
						flagKeys={flagKeys}
						onSearchChange={handleSearchChange}
						onFlagIdChange={handleOverrideFlagIdChange}
						onIsEnabledChange={handleOverrideIsEnabledChange}
						onAddOverride={handleAddOverride}
						t={t}
					/>
				)}

				{tab === "history" && (
					<HistoryToolbar
						search={search}
						eventType={historyEventType}
						actorId={historyActorId}
						actors={historyActors}
						onSearchChange={handleSearchChange}
						onEventTypeChange={handleHistoryEventTypeChange}
						onActorIdChange={handleHistoryActorIdChange}
						t={t}
					/>
				)}

				<div className="overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors">
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
										onDuplicate={openDuplicate}
										onDelete={openDelete}
										onAddOverride={openOverrideModal}
										t={t}
									/>
									<FlagsMobileList
										items={flagItems}
										isLoading={isFlagsLoading}
										onToggle={handleToggle}
										onEdit={openEdit}
										onDuplicate={openDuplicate}
										onDelete={openDelete}
										onAddOverride={openOverrideModal}
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
				onClose={handleFlagModalClose}
				t={t}
			/>

			<FeatureFlagDeleteModal
				flag={deleteFlag}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={handleDeleteModalClose}
				t={t}
			/>

			<FeatureFlagDuplicateModal
				flag={duplicateFlag}
				isDuplicating={isDuplicating}
				onConfirm={handleDuplicateConfirm}
				onClose={handleDuplicateModalClose}
				t={t}
			/>

			<FeatureFlagOverrideModal
				open={overrideModalOpen}
				preselectedFlagId={overridePreselectedFlagId}
				isSubmitting={isOverrideSubmitting}
				onSubmit={handleOverrideSubmit}
				onClose={handleOverrideModalClose}
				t={t}
			/>

			<FeatureFlagImportModal
				open={importModalOpen}
				onSubmit={handleImportSubmit}
				onClose={handleImportModalClose}
				t={t}
			/>
		</div>
	);
};
