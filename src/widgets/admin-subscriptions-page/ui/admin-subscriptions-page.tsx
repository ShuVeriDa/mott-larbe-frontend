"use client";

import { useAdminSubscriptionsPage } from "../model/use-admin-subscriptions-page";
import { AdminSubscriptionsTopbar } from "./admin-subscriptions-topbar";
import { SubscriptionsKpiRow } from "./subscriptions-kpi-row";
import { SubscriptionsTabs } from "./subscriptions-tabs";
import { SubscriptionsToolbar } from "./subscriptions-toolbar";
import { SubscriptionsTable } from "./subscriptions-table";
import { SubscriptionsPagination } from "./subscriptions-pagination";
import { SubscriptionDetailPanel } from "./subscription-detail-panel";
import { SubscriptionEmptyPanel } from "./subscription-empty-panel";
import { AddSubscriptionModal } from "./add-subscription-modal";
import { CancelSubscriptionModal } from "./cancel-subscription-modal";
import { ExtendSubscriptionModal } from "./extend-subscription-modal";

export const AdminSubscriptionsPage = () => {
	const state = useAdminSubscriptionsPage();

	const {
		tab,
		search,
		planType,
		provider,
		sort,
		page,
		selectedId,
		selectedSub,
		modal,
		mobileSheetOpen,
		data,
		stats,
		isLoading,
		detailLoading,
		statsLoading,
		mutations,
		tabCounts,
		handleTabChange,
		handleSearchChange,
		handlePlanChange,
		handleProviderChange,
		handleSortChange,
		handleSelectRow,
		closeMobileSheet,
		openModal,
		closeModal,
		setPage,
		handleExport,
	} = state;

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
			<AdminSubscriptionsTopbar
				onAdd={() => openModal("add")}
				onExport={handleExport}
			/>

			<div className="px-[22px] py-4 pb-10 max-sm:px-3 max-sm:pb-20">
				<SubscriptionsKpiRow stats={stats} isLoading={statsLoading} />

				{/* Split layout: table + detail panel */}
				<div className="grid grid-cols-[1fr_320px] items-start gap-3.5 max-md:grid-cols-1">

					{/* Left: Table card */}
					<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
						<SubscriptionsTabs
							active={tab}
							counts={tabCounts}
							onChange={handleTabChange}
						/>
						<SubscriptionsToolbar
							search={search}
							planType={planType}
							provider={provider}
							sort={sort}
							total={data?.total ?? 0}
							fetched={data?.items.length ?? 0}
							onSearchChange={handleSearchChange}
							onPlanChange={handlePlanChange}
							onProviderChange={handleProviderChange}
							onSortChange={handleSortChange}
						/>
						<SubscriptionsTable
							items={data?.items ?? []}
							selectedId={selectedId}
							isLoading={isLoading}
							onSelectRow={handleSelectRow}
							onExtend={(id) => openModal("extend", id)}
							onCancel={(id) => openModal("cancel", id)}
						/>
						{!isLoading && data && data.total > data.limit && (
							<SubscriptionsPagination
								page={page}
								limit={data.limit}
								total={data.total}
								onPageChange={setPage}
							/>
						)}
					</div>

					{/* Right: Detail panel (desktop only) */}
					<div className="sticky top-3.5 max-md:hidden">
						{selectedId && (detailLoading || selectedSub) ? (
							<SubscriptionDetailPanel
								sub={selectedSub ?? null}
								isLoading={detailLoading}
								userId={selectedSub?.userId ?? selectedId}
								onExtend={(id) => openModal("extend", id)}
								onCancel={(id) => openModal("cancel", id)}
							/>
						) : (
							<SubscriptionEmptyPanel />
						)}
					</div>
				</div>
			</div>

			{/* Mobile bottom-sheet: detail panel on small screens */}
			{mobileSheetOpen && selectedId && (
				<div
					className="fixed inset-0 z-400 hidden bg-black/35 max-md:block"
					onClick={closeMobileSheet}
				>
					<div
						className="absolute bottom-0 left-0 right-0 max-h-[85dvh] overflow-y-auto rounded-t-[14px] bg-surf pb-safe"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex justify-center pb-2 pt-3">
							<div className="h-1 w-9 rounded-full bg-bd-2" />
						</div>
						<div className="px-3 pb-6">
							<SubscriptionDetailPanel
								sub={selectedSub ?? null}
								isLoading={detailLoading}
								userId={selectedSub?.userId ?? selectedId}
								onExtend={(id) => openModal("extend", id)}
								onCancel={(id) => openModal("cancel", id)}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Modals */}
			{modal && (
				<div
					className="fixed inset-0 z-400 flex items-end justify-center bg-black/35 sm:items-center sm:p-4"
					onClick={(e) => {
						if (e.target === e.currentTarget) closeModal();
					}}
				>
					<div
						className="w-full max-h-[90vh] overflow-y-auto rounded-t-[14px] bg-surf shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:w-[420px] sm:rounded-[14px]"
						onClick={(e) => e.stopPropagation()}
					>
						{modal === "add" && (
							<AddSubscriptionModal mutations={mutations} onClose={closeModal} />
						)}
						{modal === "cancel" && (
							<CancelSubscriptionModal
								subscriptionId={selectedId}
								mutations={mutations}
								onClose={closeModal}
							/>
						)}
						{modal === "extend" && (
							<ExtendSubscriptionModal
								subscriptionId={selectedId}
								mutations={mutations}
								onClose={closeModal}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
