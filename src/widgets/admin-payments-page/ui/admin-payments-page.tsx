"use client";

import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import { ComponentProps, useEffect } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useAdminPaymentsPage } from "../model/use-admin-payments-page";
import { PaymentsTopbar } from "./payments-topbar";
import { PaymentsKpiRow } from "./payments-kpi-row";
import { PaymentsRevenueChart } from "./payments-revenue-chart";
import { PaymentsProvidersChart } from "./payments-providers-chart";
import { PaymentsTabs } from "./payments-tabs";
import { PaymentsToolbar } from "./payments-toolbar";
import { PaymentsTable } from "./payments-table";
import { PaymentsPagination } from "./payments-pagination";
import { PaymentDetailPanel } from "./payment-detail-panel";
import { PaymentEmptyPanel } from "./payment-empty-panel";
import { PaymentReceiptModal } from "./payment-receipt-modal";
import { PaymentRefundModal } from "./payment-refund-modal";

export const AdminPaymentsPage = () => {
	const { t, lang } = useI18n();
	const { success } = useToast();
	const state = useAdminPaymentsPage();

	const {
		tab,
		handleTabChange,
		search,
		setSearch,
		planId,
		setPlanId,
		provider,
		setProvider,
		dateFrom,
		setDateFrom,
		dateTo,
		setDateTo,
		page,
		setPage,
		selectedId,
		handleSelectRow,
		mobileSheetOpen,
		closeMobileSheet,
		modal,
		modalPayment,
		openModal,
		closeModal,
		stats,
		statsLoading,
		chart,
		chartLoading,
		providers,
		providersLoading,
		payments,
		paymentsLoading,
		detail,
		detailLoading,
		plans,
		mutations,
		tabCounts,
		handleRefundSubmit,
		handleSendReceipt,
		handleExportCsv,
	} = state;

	// Close mobile sheet on Escape
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

	const handleSendReceiptWithToast = (id: string) => {
		handleSendReceipt(id);
		success(t("admin.payments.toast.receiptSent"));
	};

	const handleProviderChange: NonNullable<ComponentProps<typeof PaymentsToolbar>["onProviderChange"]> = v =>
		setProvider(v as Parameters<typeof setProvider>[0]);
	const handleTableReceipt: NonNullable<ComponentProps<typeof PaymentsTable>["onReceipt"]> = id =>
		openModal("receipt", id);
	const handleTableRefund: NonNullable<ComponentProps<typeof PaymentsTable>["onRefund"]> = id =>
		openModal("refund", id);
	const handleDetailReceipt: NonNullable<ComponentProps<typeof PaymentDetailPanel>["onReceipt"]> = id =>
		openModal("receipt", id);
	const handleDetailRefund: NonNullable<ComponentProps<typeof PaymentDetailPanel>["onRefund"]> = id =>
		openModal("refund", id);
	const handleMobileDetailReceipt: NonNullable<ComponentProps<typeof PaymentDetailPanel>["onReceipt"]> = id => {
		closeMobileSheet();
		openModal("receipt", id);
	};
	const handleMobileDetailSendReceipt: NonNullable<ComponentProps<typeof PaymentDetailPanel>["onSendReceipt"]> = id => {
		closeMobileSheet();
		handleSendReceiptWithToast(id);
	};
	const handleMobileDetailRefund: NonNullable<ComponentProps<typeof PaymentDetailPanel>["onRefund"]> = id => {
		closeMobileSheet();
		openModal("refund", id);
	};
	const handleModalOverlayClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
		if (/* intentional: backdrop-only click */ e.target === e.currentTarget) closeModal();
	};
	const handleModalContentClick: NonNullable<ComponentProps<"div">["onClick"]> = e =>
		e.stopPropagation();
return (
		<div className="flex min-h-0 flex-1 flex-col">
			<PaymentsTopbar onExportCsv={handleExportCsv} />

			<div className="overflow-y-auto px-[22px] py-4 pb-10 max-sm:px-3 max-sm:pb-20">
				{/* KPI */}
				<PaymentsKpiRow stats={stats} isLoading={statsLoading} />

				{/* Charts */}
				<div className="mb-4 grid grid-cols-[1fr_260px] gap-3 max-md:grid-cols-1">
					<PaymentsRevenueChart items={chart} isLoading={chartLoading} />
					<PaymentsProvidersChart
						items={providers}
						isLoading={providersLoading}
					/>
				</div>

				{/* Split layout: table + detail panel */}
				<div className="grid grid-cols-[1fr_306px] items-start gap-3 max-md:grid-cols-1">
					{/* Table card */}
					<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
						<PaymentsTabs
							active={tab}
							counts={tabCounts}
							onChange={handleTabChange}
						/>
						<PaymentsToolbar
							search={search}
							planId={planId}
							provider={provider}
							dateFrom={dateFrom}
							dateTo={dateTo}
							total={payments?.total ?? 0}
							fetched={payments?.items.length ?? 0}
							plans={plans}
							onSearchChange={setSearch}
							onPlanChange={setPlanId}
							onProviderChange={handleProviderChange}
							onDateFromChange={setDateFrom}
							onDateToChange={setDateTo}
						/>
						<PaymentsTable
							items={payments?.items ?? []}
							selectedId={selectedId}
							isLoading={paymentsLoading}
							onSelectRow={handleSelectRow}
							onReceipt={handleTableReceipt}
							onRefund={handleTableRefund}
						/>
						{!paymentsLoading &&
							payments &&
							payments.total > payments.limit && (
								<PaymentsPagination
									page={page}
									limit={payments.limit}
									total={payments.total}
									onPageChange={setPage}
								/>
							)}
					</div>

					{/* Detail panel (desktop) */}
					<div className="sticky top-3.5 max-md:hidden">
						{detail ? (
							<PaymentDetailPanel
								payment={detail}
								lang={lang}
								isLoading={detailLoading}
								onReceipt={handleDetailReceipt}
								onSendReceipt={handleSendReceiptWithToast}
								onRefund={handleDetailRefund}
							/>
						) : selectedId && detailLoading ? (
							<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
								<div className="space-y-3 p-4">
									{Array.from({ length: 8 }).map((_, i) => (
										<div
											key={i}
											className="h-5 animate-pulse rounded bg-surf-3"
										/>
									))}
								</div>
							</div>
						) : (
							<PaymentEmptyPanel />
						)}
					</div>
				</div>
			</div>

			{/* Mobile bottom sheet */}
			{mobileSheetOpen && detail && (
				<>
					<div
						className="fixed inset-0 z-[300] bg-black/40 md:hidden"
						onClick={closeMobileSheet}
					/>
					<div className="fixed bottom-0 left-0 right-0 z-[310] max-h-[85vh] overflow-y-auto rounded-t-[18px] bg-surf shadow-[0_-4px_24px_rgba(0,0,0,0.14)] md:hidden [&::-webkit-scrollbar]:w-0">
						<div className="mx-auto mt-3 h-1 w-9 rounded-full bg-bd-3" />
						<div className="flex justify-end px-3.5 pt-2">
							<Button
								onClick={closeMobileSheet}
								className="flex size-7 items-center justify-center rounded-lg bg-surf-2 text-t-2"
							>
								<X className="size-[14px]" />
							</Button>
						</div>
						<div className="px-3.5 pb-6 pt-1">
							<PaymentDetailPanel
								payment={detail}
								lang={lang}
								onReceipt={handleMobileDetailReceipt}
								onSendReceipt={handleMobileDetailSendReceipt}
								onRefund={handleMobileDetailRefund}
							/>
						</div>
					</div>
				</>
			)}

			{/* Modals */}
			{modal && modalPayment && (
				<div
					className="fixed inset-0 z-[400] flex items-end justify-center bg-black/35 p-0 sm:items-center sm:p-4"
					onClick={handleModalOverlayClick}
				>
					<div
						className="w-full max-h-[90vh] overflow-y-auto sm:w-[420px]"
						onClick={handleModalContentClick}
					>
						{modal === "receipt" && (
							<PaymentReceiptModal
								payment={modalPayment}
								onClose={closeModal}
							/>
						)}
						{modal === "refund" && (
							<PaymentRefundModal
								payment={modalPayment}
								isPending={mutations.refund.isPending}
								onClose={closeModal}
								onSubmit={handleRefundSubmit}
							/>
						)}
					</div>
				</div>
			)}
		</div>
	);
};
