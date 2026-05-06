"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
	adminPaymentApi,
	usePaymentChart,
	usePaymentDetail,
	usePaymentMutations,
	usePaymentProviders,
	usePaymentStats,
	usePaymentsList,
	type FetchPaymentsQuery,
	type FetchPaymentChartQuery,
	type PaymentBackendStatus,
	type PaymentProvider,
	type PaymentUiTab,
	type RefundReason,
} from "@/entities/admin-payment";
import { useBillingPlans } from "@/entities/admin-billing";
import { useDebounce } from "@/shared/lib/debounce";

export type PaymentModal = "receipt" | "refund" | null;

const TAB_TO_STATUS: Record<
	Exclude<PaymentUiTab, "all">,
	PaymentBackendStatus
> = {
	paid: "SUCCEEDED",
	refunded: "REFUNDED",
	failed: "FAILED",
};

const getCurrentMonthRange = () => {
	const now = new Date();
	const from = new Date(now.getFullYear(), now.getMonth(), 1);
	const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	return {
		dateFrom: from.toISOString().slice(0, 10),
		dateTo: to.toISOString().slice(0, 10),
	};
};

export const useAdminPaymentsPage = () => {
	const defaultRange = getCurrentMonthRange();

	const [tab, setTab] = useState<PaymentUiTab>("all");
	const [search, setSearch] = useState("");
	const [planId, setPlanId] = useState("");
	const [provider, setProvider] = useState<PaymentProvider | "">("");
	const [dateFrom, setDateFrom] = useState(defaultRange.dateFrom);
	const [dateTo, setDateTo] = useState(defaultRange.dateTo);
	const [page, setPage] = useState(1);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [modal, setModal] = useState<PaymentModal>(null);
	const [modalPaymentId, setModalPaymentId] = useState<string | null>(null);
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

	const debouncedSearch = useDebounce(search, 300);

	const prevFiltersRef = useRef({
		tab,
		debouncedSearch,
		planId,
		provider,
		dateFrom,
		dateTo,
	});

	useEffect(() => {
		const prev = prevFiltersRef.current;
		if (
			prev.tab !== tab ||
			prev.debouncedSearch !== debouncedSearch ||
			prev.planId !== planId ||
			prev.provider !== provider ||
			prev.dateFrom !== dateFrom ||
			prev.dateTo !== dateTo
		) {
			setPage(1);
			prevFiltersRef.current = {
				tab,
				debouncedSearch,
				planId,
				provider,
				dateFrom,
				dateTo,
			};
		}
	}, [tab, debouncedSearch, planId, provider, dateFrom, dateTo]);

	const status = tab !== "all" ? TAB_TO_STATUS[tab] : undefined;

	const listQuery: FetchPaymentsQuery = {
		status,
		provider: provider || undefined,
		planId: planId || undefined,
		search: debouncedSearch || undefined,
		dateFrom,
		dateTo,
		page,
		limit: 25,
	};

	const chartQuery: FetchPaymentChartQuery = { dateFrom, dateTo };

	const { data: stats, isLoading: statsLoading } = usePaymentStats();
	const { data: chart, isLoading: chartLoading } = usePaymentChart(chartQuery);
	const { data: providers, isLoading: providersLoading } =
		usePaymentProviders();
	const { data: payments, isLoading: paymentsLoading } =
		usePaymentsList(listQuery);
	const { data: detail, isLoading: detailLoading } =
		usePaymentDetail(selectedId);
	const { data: plans } = useBillingPlans();
	const mutations = usePaymentMutations();

	const handleTabChange = useCallback((t: PaymentUiTab) => setTab(t), []);

	const handleSelectRow = useCallback((id: string) => {
		setSelectedId((prev) => (prev === id ? null : id));
		setMobileSheetOpen(true);
	}, []);

	const closeMobileSheet = useCallback(() => {
		setMobileSheetOpen(false);
	}, []);

	const openModal = useCallback((type: "receipt" | "refund", id: string) => {
		setModalPaymentId(id);
		setModal(type);
	}, []);

	const closeModal = useCallback(() => {
		setModal(null);
		setModalPaymentId(null);
	}, []);

	const handleRefundSubmit = useCallback(
		(amountCents: number, reason: RefundReason) => {
			if (!modalPaymentId) return;
			mutations.refund.mutate(
				{ id: modalPaymentId, dto: { amountCents, reason } },
				{ onSuccess: closeModal },
			);
		},
		[modalPaymentId, mutations, closeModal],
	);

	const handleSendReceipt = useCallback(
		(id: string) => mutations.sendReceipt.mutate({ id }),
		[mutations],
	);

	const handleExportCsv = useCallback(() => {
		void adminPaymentApi.exportCsv(listQuery).then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `payments-${dateFrom}-${dateTo}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		});
	}, [listQuery, dateFrom, dateTo]);

	const tabCounts = {
		all: stats?.transactionCount ?? 0,
		paid: stats?.succeededCount ?? 0,
		refunded: stats?.refundCount ?? 0,
		failed: stats?.failedCount ?? 0,
	};

	const modalPayment =
		modal && modalPaymentId
			? (payments?.items.find((p) => p.id === modalPaymentId) ?? detail)
			: null;

	return {
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
		plans: plans ?? [],
		mutations,
		tabCounts,
		handleRefundSubmit,
		handleSendReceipt,
		handleExportCsv,
	};
};
