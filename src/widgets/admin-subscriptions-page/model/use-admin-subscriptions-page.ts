"use client";

import { useCallback, useState } from "react";
import {
	useAdminSubscriptionMutations,
	useAdminSubscriptions,
	useAdminSubscriptionStats,
} from "@/entities/admin-subscription";
import { adminSubscriptionApi } from "@/entities/admin-subscription";
import type {
	FetchSubscriptionsQuery,
	PaymentProvider,
	PlanType,
	SubscriptionsSort,
	SubscriptionsTab,
	SubscriptionStatus,
} from "@/entities/admin-subscription";

export type ModalType = "add" | "cancel" | "extend" | null;

export const useAdminSubscriptionsPage = () => {
	const [tab, setTab] = useState<SubscriptionsTab>("all");
	const [search, setSearch] = useState("");
	const [planType, setPlanType] = useState<PlanType | "">("");
	const [provider, setProvider] = useState<PaymentProvider | "">("");
	const [sort, setSort] = useState<SubscriptionsSort>("nextBilling_asc");
	const [page, setPage] = useState(1);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [modal, setModal] = useState<ModalType>(null);

	const statusFromTab: SubscriptionStatus | undefined =
		tab === "all" ? undefined : (tab.toUpperCase() as SubscriptionStatus);

	const query: FetchSubscriptionsQuery = {
		...(search ? { search } : {}),
		...(planType ? { planType: planType as PlanType } : {}),
		...(provider ? { provider: provider as PaymentProvider } : {}),
		...(statusFromTab ? { status: statusFromTab } : {}),
		sort,
		page,
		limit: 25,
	};

	const { data, isLoading, isFetching } = useAdminSubscriptions(query);
	const { data: stats, isLoading: statsLoading } = useAdminSubscriptionStats();
	const mutations = useAdminSubscriptionMutations();

	const selectedSub =
		data?.items.find((s) => s.id === selectedId) ?? null;

	const handleTabChange = useCallback((next: SubscriptionsTab) => {
		setTab(next);
		setPage(1);
		setSelectedId(null);
	}, []);

	const handleSearchChange = useCallback((value: string) => {
		setSearch(value);
		setPage(1);
	}, []);

	const handlePlanChange = useCallback((value: string) => {
		setPlanType(value as PlanType | "");
		setPage(1);
	}, []);

	const handleProviderChange = useCallback((value: string) => {
		setProvider(value as PaymentProvider | "");
		setPage(1);
	}, []);

	const handleSortChange = useCallback((value: SubscriptionsSort) => {
		setSort(value);
		setPage(1);
	}, []);

	const handleSelectRow = useCallback((id: string) => {
		setSelectedId((prev) => (prev === id ? null : id));
	}, []);

	const openModal = useCallback(
		(type: ModalType, id?: string) => {
			if (id) setSelectedId(id);
			setModal(type);
		},
		[],
	);

	const closeModal = useCallback(() => setModal(null), []);

	const handleExport = useCallback(async () => {
		try {
			const blob = await adminSubscriptionApi.exportCsv(query);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "subscriptions.csv";
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			// silently ignore
		}
	}, [query]);

	const tabCounts = {
		all: data?.total ?? 0,
		active: stats?.activeCount ?? 0,
		trialing: stats?.trialingCount ?? 0,
		canceled: stats?.canceledCount ?? 0,
		expired: stats?.expiredCount ?? 0,
	};

	return {
		tab,
		search,
		planType,
		provider,
		sort,
		page,
		selectedId,
		selectedSub,
		modal,
		data,
		stats,
		isLoading,
		isFetching,
		statsLoading,
		mutations,
		tabCounts,
		handleTabChange,
		handleSearchChange,
		handlePlanChange,
		handleProviderChange,
		handleSortChange,
		handleSelectRow,
		openModal,
		closeModal,
		setPage,
		handleExport,
	};
};
