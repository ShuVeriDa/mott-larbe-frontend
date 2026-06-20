"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminHeritageModeration } from "../model/use-admin-heritage-moderation";
import { ModerationDetailPanel } from "./moderation-detail-panel";
import { ModerationListColumn } from "./moderation-list-column";
import { ModerationTopbar } from "./moderation-topbar";

export const AdminHeritageModerationPage = () => {
	const { t } = useI18n();

	const {
		page,
		typeFilter,
		selectedItem,
		reviewForm,
		items,
		total,
		totalPages,
		stats,
		nations,
		tukhumy,
		LIMIT,
		isPending,
		pendingQuery,
		handleSelectItem,
		handleClearSelected,
		handleTypeFilterChange,
		handlePageChange,
		handleRejectReasonChange,
		handleAddToDirectoryChange,
		handleNationIdChange,
		handleTukhumIdChange,
		handleTaipIdChange,
		handleApprove,
		handleReject,
	} = useAdminHeritageModeration();

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<ModerationTopbar
				pendingCount={stats.pending}
				verifiedCount={stats.verified}
				rejectedCount={stats.rejected}
				typeFilter={typeFilter}
				onTypeFilterChange={handleTypeFilterChange}
				t={t}
			/>

			<div className="relative flex flex-1 overflow-hidden max-sm:flex-col">
				<div className="flex w-[320px] shrink-0 flex-col overflow-hidden border-r border-bd-1 bg-surf max-sm:h-[50vh] max-sm:w-full max-sm:border-b max-sm:border-r-0">
					<ModerationListColumn
						items={items}
						isLoading={pendingQuery.isPending}
						selectedId={selectedItem?.heritageId ?? null}
						page={page}
						totalPages={totalPages}
						total={total}
						limit={LIMIT}
						onSelect={handleSelectItem}
						onPageChange={handlePageChange}
						t={t}
					/>
				</div>

				<div className="relative min-w-0 flex-1 overflow-hidden bg-surf max-sm:flex-1">
					<ModerationDetailPanel
						selectedItem={selectedItem}
						reviewForm={reviewForm}
						nations={nations}
						tukhumy={tukhumy}
						isPending={isPending}
						showDetail={!!selectedItem}
						onBack={handleClearSelected}
						onRejectReasonChange={handleRejectReasonChange}
						onAddToDirectoryChange={handleAddToDirectoryChange}
						onNationIdChange={handleNationIdChange}
						onTukhumIdChange={handleTukhumIdChange}
						onTaipIdChange={handleTaipIdChange}
						onApprove={handleApprove}
						onReject={handleReject}
						t={t}
					/>
				</div>
			</div>
		</div>
	);
};
