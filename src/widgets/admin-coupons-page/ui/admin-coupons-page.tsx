"use client";
import { ComponentProps, useEffect } from 'react';
import { useAdminCouponsPage } from "../model/use-admin-coupons-page";
import { CouponsTopbar } from "./coupons-topbar";
import { CouponsKpiRow } from "./coupons-kpi-row";
import { CouponsTabs } from "./coupons-tabs";
import { CouponsToolbar } from "./coupons-toolbar";
import { CouponsTable } from "./coupons-table";
import { CouponsPagination } from "./coupons-pagination";
import { CouponDetailPanel } from "./coupon-detail-panel";
import { CouponEmptyPanel } from "./coupon-empty-panel";
import { CreateCouponModal } from "./create-coupon-modal";
import { DeleteCouponModal } from "./delete-coupon-modal";

export const AdminCouponsPage = () => {
	const state = useAdminCouponsPage();

	const {
		tab,
		search,
		type,
		plan,
		page,
		sortBy,
		sortOrder,
		selectedId,
		detail,
		detailLoading,
		modal,
		deleteError,
		mobileSheetOpen,
		data,
		stats,
		isLoading,
		statsLoading,
		mutations,
		tabCounts,
		handleTabChange,
		handleSearchChange,
		handleTypeChange,
		handlePlanChange,
		handleSortChange,
		handlePageChange,
		handleSelectRow,
		closeMobileSheet,
		openModal,
		closeModal,
		handleExport,
		handleDelete,
		handleDeactivate,
		handleActivate,
	} = state;

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				closeModal();
				closeMobileSheet();
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [closeModal, closeMobileSheet]);

	const handleCreate: NonNullable<ComponentProps<typeof CouponsTopbar>["onCreate"]> = () =>
		openModal("create");
	const handleTableEdit: NonNullable<ComponentProps<typeof CouponsTable>["onEdit"]> = id =>
		openModal("edit", id);
	const handleTableDelete: NonNullable<ComponentProps<typeof CouponsTable>["onDelete"]> = id =>
		openModal("delete", id);
	const handleDetailEdit: NonNullable<ComponentProps<typeof CouponDetailPanel>["onEdit"]> = id =>
		openModal("edit", id);
	const handleDetailDelete: NonNullable<ComponentProps<typeof CouponDetailPanel>["onDelete"]> = id =>
		openModal("delete", id);
	const handleMobileDetailEdit: NonNullable<ComponentProps<typeof CouponDetailPanel>["onEdit"]> = id => {
		closeMobileSheet();
		openModal("edit", id);
	};
	const handleMobileDetailDelete: NonNullable<ComponentProps<typeof CouponDetailPanel>["onDelete"]> = id => {
		closeMobileSheet();
		openModal("delete", id);
	};
	const handleMobileDetailDeactivate: NonNullable<ComponentProps<typeof CouponDetailPanel>["onDeactivate"]> = async id => {
		closeMobileSheet();
		await handleDeactivate(id);
	};
	const handleMobileDetailActivate: NonNullable<ComponentProps<typeof CouponDetailPanel>["onActivate"]> = async id => {
		closeMobileSheet();
		await handleActivate(id);
	};
	const handleModalOverlayClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
		if (/* intentional: backdrop-only click */ e.target === e.currentTarget) closeModal();
	};
	const handleModalContentClick: NonNullable<ComponentProps<"div">["onClick"]> = e =>
		e.stopPropagation();
return (
		<div className="flex min-h-0 flex-1 flex-col">
			<CouponsTopbar onExport={handleExport} onCreate={handleCreate} />

			<div className="overflow-y-auto px-[22px] py-4 pb-10 max-sm:px-3 max-sm:pb-20">
				<CouponsKpiRow stats={stats} isLoading={statsLoading} />

				{/* Split layout: table + detail panel */}
				<div className="grid grid-cols-[1fr_308px] items-start gap-3 max-md:grid-cols-1">

					{/* Left: Table card */}
					<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
						<CouponsTabs active={tab} counts={tabCounts} onChange={handleTabChange} />
						<CouponsToolbar
							search={search}
							type={type}
							plan={plan}
							total={data?.total ?? 0}
							onSearchChange={handleSearchChange}
							onTypeChange={handleTypeChange}
							onPlanChange={handlePlanChange}
						/>
						<CouponsTable
							items={data?.items ?? []}
							selectedId={selectedId}
							isLoading={isLoading}
							sortBy={sortBy}
							sortOrder={sortOrder}
							onSelectRow={handleSelectRow}
							onEdit={handleTableEdit}
							onDelete={handleTableDelete}
							onSortChange={handleSortChange}
						/>
						{!isLoading && data && data.total > data.limit && (
							<CouponsPagination
								page={page}
								limit={data.limit}
								total={data.total}
								onPageChange={handlePageChange}
							/>
						)}
					</div>

					{/* Right: Detail panel (desktop) */}
					<div className="sticky top-3.5 max-md:hidden">
						{selectedId ? (
							<CouponDetailPanel
								coupon={detail!}
								isLoading={detailLoading || !detail}
								onEdit={handleDetailEdit}
								onDelete={handleDetailDelete}
								onDeactivate={handleDeactivate}
								onActivate={handleActivate}
							/>
						) : (
							<CouponEmptyPanel />
						)}
					</div>
				</div>
			</div>

			{/* Mobile bottom sheet */}
			{mobileSheetOpen && (
				<>
					<div
						className="fixed inset-0 z-300 bg-black/40 md:hidden"
						onClick={closeMobileSheet}
					/>
					<div className="fixed bottom-0 left-0 right-0 z-310 max-h-[85vh] overflow-y-auto rounded-t-[18px] bg-surf shadow-[0_-4px_24px_rgba(0,0,0,0.14)] md:hidden [&::-webkit-scrollbar]:w-0">
						<div className="mx-auto mt-3 h-1 w-9 rounded-full bg-bd-3" />
						<div className="flex justify-end px-3.5 pt-2">
							<button
								type="button"
								onClick={closeMobileSheet}
								className="flex size-7 items-center justify-center rounded-lg bg-surf-2 text-t-2"
							>
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
									<path d="M2 2l10 10M12 2L2 12" />
								</svg>
							</button>
						</div>
						<div className="px-3.5 pb-6 pt-1">
							{detail ? (
								<CouponDetailPanel
									coupon={detail}
									isLoading={false}
									onEdit={handleMobileDetailEdit}
									onDelete={handleMobileDetailDelete}
									onDeactivate={handleMobileDetailDeactivate}
									onActivate={handleMobileDetailActivate}
								/>
							) : (
								<div className="space-y-3 py-4">
									{Array.from({ length: 5 }).map((_, i) => (
										<div key={i} className="h-4 animate-pulse rounded bg-surf-3" style={{ width: `${[90, 60, 75, 50, 80][i]}%` }} />
									))}
								</div>
							)}
						</div>
					</div>
				</>
			)}

			{/* Modals */}
			{modal && (
				<div
					className="fixed inset-0 z-400 flex items-end justify-center bg-black/35 sm:items-center sm:p-4"
					onClick={handleModalOverlayClick}
				>
					<div
						className="w-full max-h-[90vh] overflow-y-auto rounded-t-[14px] bg-surf shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:w-[460px] sm:rounded-[14px]"
						onClick={handleModalContentClick}
					>
						{(modal === "create" || modal === "edit") && (
							<CreateCouponModal
								editing={modal === "edit" ? detail ?? null : null}
								mutations={mutations}
								onClose={closeModal}
							/>
						)}
						{modal === "delete" && (
							<DeleteCouponModal
								couponId={selectedId}
								hasError={deleteError}
								mutations={mutations}
								onDelete={handleDelete}
								onDeactivate={handleDeactivate}
								onClose={closeModal}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
