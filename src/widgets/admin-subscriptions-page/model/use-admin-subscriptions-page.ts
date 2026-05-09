"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	useAdminSubscriptionDetail,
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

const DEFAULT_TAB: SubscriptionsTab = "all";
const DEFAULT_SORT: SubscriptionsSort = "nextBilling_asc";

export const useAdminSubscriptionsPage = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlTab = (searchParams.get("tab") as SubscriptionsTab) ?? DEFAULT_TAB;
	const urlSearch = searchParams.get("q") ?? "";
	const urlPlanType = (searchParams.get("plan") as PlanType | "") ?? "";
	const urlProvider = (searchParams.get("provider") as PaymentProvider) ?? "";
	const urlSort = (searchParams.get("sort") as SubscriptionsSort) ?? DEFAULT_SORT;
	const urlPage = Math.max(1, Number(searchParams.get("page") ?? "1"));
	const urlSelectedId = searchParams.get("selected") ?? null;

	const [searchInput, setSearchInput] = useState(urlSearch);
	const [modal, setModal] = useState<ModalType>(null);
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	useEffect(() => {
		setSearchInput(urlSearch);
	}, [urlSearch]);

	const updateParams = (updates: Record<string, string | undefined>) => {
		const params = new URLSearchParams(searchParams.toString());
		for (const [key, value] of Object.entries(updates)) {
			if (!value) {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		}
		router.replace(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const statusFromTab: SubscriptionStatus | undefined =
		urlTab === "all" ? undefined : (urlTab.toUpperCase() as SubscriptionStatus);

	const activeSearch = urlSearch.length >= 2 ? urlSearch : "";

	const query: FetchSubscriptionsQuery = {
		...(activeSearch ? { search: activeSearch } : {}),
		...(urlPlanType ? { planType: urlPlanType as PlanType } : {}),
		...(urlProvider ? { provider: urlProvider as PaymentProvider } : {}),
		...(statusFromTab ? { status: statusFromTab } : {}),
		sort: urlSort,
		page: urlPage,
		limit: 25,
	};

	const { data, isLoading, isFetching } = useAdminSubscriptions(query);
	const { data: stats, isLoading: statsLoading } = useAdminSubscriptionStats();
	const { data: selectedSub, isLoading: detailLoading } = useAdminSubscriptionDetail(urlSelectedId);
	const mutations = useAdminSubscriptionMutations();

	const tabCounts = {
		all: data?.total ?? 0,
		active: stats?.activeCount ?? 0,
		trialing: stats?.trialingCount ?? 0,
		canceled: stats?.canceledCount ?? 0,
		expired: stats?.expiredCount ?? 0,
	};

	const handleTabChange = (next: SubscriptionsTab) => {
		updateParams({ tab: next === DEFAULT_TAB ? undefined : next, page: undefined, selected: undefined });
		setMobileSheetOpen(false);
	};

	const handleSearchChange = (value: string) => {
		setSearchInput(value);
		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			const params = new URLSearchParams(window.location.search);
			if (value.length >= 2) {
				params.set("q", value);
			} else {
				params.delete("q");
			}
			params.delete("page");
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		}, 300);
	};

	const handlePlanChange = (value: string) => {
		updateParams({ plan: value || undefined, page: undefined });
	};

	const handleProviderChange = (value: string) => {
		updateParams({ provider: value || undefined, page: undefined });
	};

	const handleSortChange = (value: SubscriptionsSort) => {
		updateParams({ sort: value === DEFAULT_SORT ? undefined : value, page: undefined });
	};

	const handleSelectRow = (id: string) => {
		const next = urlSelectedId === id ? undefined : id;
		updateParams({ selected: next });
		setMobileSheetOpen(!!next);
	};

	const closeMobileSheet = () => {
		setMobileSheetOpen(false);
	};

	const openModal = (type: ModalType, id?: string) => {
		if (id) updateParams({ selected: id });
		setModal(type);
	};

	const closeModal = () => setModal(null);

	const handlePageChange = (next: number) => {
		updateParams({ page: next === 1 ? undefined : String(next) });
	};

	const handleExport = async () => {
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
	};

	return {
		tab: urlTab,
		search: searchInput,
		planType: urlPlanType,
		provider: urlProvider,
		sort: urlSort,
		page: urlPage,
		selectedId: urlSelectedId,
		selectedSub: selectedSub ?? null,
		modal,
		mobileSheetOpen,
		data,
		stats,
		isLoading,
		isFetching,
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
		setPage: handlePageChange,
		handleExport,
	};
};
