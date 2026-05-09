"use client";
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
	adminCouponApi,
	useCouponDetail,
	useCouponMutations,
	useCouponStats,
	useCoupons,
} from "@/entities/admin-coupon";
import type { CouponStatus, CouponType, FetchCouponsQuery } from "@/entities/admin-coupon";

export type CouponsTab = "all" | "active" | "expired" | "exhausted";
export type ModalType = "create" | "edit" | "delete" | null;
export type CouponSortBy = "createdAt" | "redeemedCount" | "validUntil" | "code";

const DEFAULT_TAB: CouponsTab = "all";
const DEFAULT_SORT_BY: CouponSortBy = "createdAt";
const DEFAULT_SORT_ORDER = "desc";

export const useAdminCouponsPage = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlTab = (searchParams.get("tab") as CouponsTab) ?? DEFAULT_TAB;
	const urlType = (searchParams.get("type") as CouponType) ?? "";
	const urlPlan = searchParams.get("plan") ?? "";
	const urlSearch = searchParams.get("q") ?? "";
	const urlPage = Math.max(1, Number(searchParams.get("page") ?? "1"));
	const urlSortBy = (searchParams.get("sortBy") as CouponSortBy) ?? DEFAULT_SORT_BY;
	const urlSortOrder = (searchParams.get("sortOrder") as "asc" | "desc") ?? DEFAULT_SORT_ORDER;

	const [searchInput, setSearchInput] = useState(urlSearch);
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

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [modal, setModal] = useState<ModalType>(null);
	const [deleteError, setDeleteError] = useState(false);
	const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

	const statusFromTab: CouponStatus | undefined = urlTab === "all" ? undefined : urlTab;

	const query: FetchCouponsQuery = {
		...(urlSearch ? { search: urlSearch } : {}),
		...(urlType ? { type: urlType } : {}),
		...(urlPlan && urlPlan !== "all" ? { plan: urlPlan } : {}),
		...(statusFromTab ? { status: statusFromTab } : {}),
		sortBy: urlSortBy,
		sortOrder: urlSortOrder,
		page: urlPage,
		limit: 25,
	};

	const { data, isLoading } = useCoupons(query);
	const { data: stats, isLoading: statsLoading } = useCouponStats();
	const { data: detail, isLoading: detailLoading } = useCouponDetail(selectedId);
	const mutations = useCouponMutations();

	const tabCounts = {
		all: stats?.totalCreated ?? 0,
		active: stats?.activeCount ?? 0,
		expired: stats?.expiredCount ?? 0,
		exhausted: stats?.exhaustedCount ?? 0,
	};

	const handleTabChange = (next: CouponsTab) => {
		updateParams({
			tab: next === DEFAULT_TAB ? undefined : next,
			page: undefined,
		});
		setSelectedId(null);
		setMobileSheetOpen(false);
	};

	const handleSearchChange = (value: string) => {
		setSearchInput(value);
		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			const params = new URLSearchParams(window.location.search);
			if (value) {
				params.set("q", value);
			} else {
				params.delete("q");
			}
			params.delete("page");
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		}, 300);
	};

	const handleTypeChange = (value: string) => {
		updateParams({ type: value || undefined, page: undefined });
	};

	const handlePlanChange = (value: string) => {
		updateParams({ plan: value || undefined, page: undefined });
	};

	const handleSortChange = (sortBy: CouponSortBy) => {
		if (sortBy === urlSortBy) {
			const next = urlSortOrder === "desc" ? "asc" : "desc";
			updateParams({
				sortBy: sortBy === DEFAULT_SORT_BY ? undefined : sortBy,
				sortOrder: next === DEFAULT_SORT_ORDER ? undefined : next,
				page: undefined,
			});
		} else {
			updateParams({
				sortBy: sortBy === DEFAULT_SORT_BY ? undefined : sortBy,
				sortOrder: undefined,
				page: undefined,
			});
		}
	};

	const handlePageChange = (next: number) => {
		updateParams({ page: next === 1 ? undefined : String(next) });
	};

	const handleSelectRow = (id: string) => {
		setSelectedId((prev) => (prev === id ? null : id));
		setMobileSheetOpen(true);
	};

	const closeMobileSheet = () => {
		setMobileSheetOpen(false);
	};

	const openModal = (type: ModalType, id?: string) => {
		if (id) setSelectedId(id);
		setDeleteError(false);
		setModal(type);
	};

	const closeModal = () => {
		setModal(null);
		setDeleteError(false);
	};

	const handleExport = async () => {
		try {
			const blob = await adminCouponApi.exportCsv({
				...(urlSearch ? { search: urlSearch } : {}),
				...(urlType ? { type: urlType } : {}),
				...(urlPlan && urlPlan !== "all" ? { plan: urlPlan } : {}),
				...(statusFromTab ? { status: statusFromTab } : {}),
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "coupons.csv";
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			// silently ignore
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await mutations.remove.mutateAsync(id);
			closeModal();
			setSelectedId(null);
			setMobileSheetOpen(false);
		} catch {
			setDeleteError(true);
		}
	};

	const handleDeactivate = async (id: string) => {
		await mutations.deactivate.mutateAsync(id);
		closeModal();
	};

	const handleActivate = async (id: string) => {
		await mutations.activate.mutateAsync(id);
	};

	return {
		tab: urlTab,
		search: searchInput,
		type: urlType,
		plan: urlPlan,
		page: urlPage,
		sortBy: urlSortBy,
		sortOrder: urlSortOrder,
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
	};
};
