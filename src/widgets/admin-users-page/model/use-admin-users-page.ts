"use client";
import { useState } from 'react';
import { useAdminUserMutations, useAdminUsers } from "@/entities/admin-user";
import { useAdminUserStats } from "@/entities/admin-user/model/use-admin-user-stats";
import { adminUserApi } from "@/entities/admin-user/api/admin-user-api";
import type { FetchAdminUsersQuery, UsersSort, UsersTab } from "@/entities/admin-user";

export const useAdminUsersPage = () => {
	const [tab, setTab] = useState<UsersTab>("all");
	const [search, setSearch] = useState("");
	const [role, setRole] = useState<FetchAdminUsersQuery["role"]>("");
	const [plan, setPlan] = useState("");
	const [sort, setSort] = useState<UsersSort>("signup_desc");
	const [page, setPage] = useState(1);
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	const query: FetchAdminUsersQuery = {
		...(search ? { q: search } : {}),
		...(role ? { role } : {}),
		...(plan ? { plan } : {}),
		tab,
		sort,
		page,
		limit: 25,
	};

	const { data, isLoading, isFetching } = useAdminUsers(query);
	const { data: stats, isLoading: statsLoading } = useAdminUserStats();
	const mutations = useAdminUserMutations();

	const handleTabChange = (next: UsersTab) => {
		setTab(next);
		setPage(1);
		setSelectedIds(new Set());
	};

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
		setSelectedIds(new Set());
	};

	const handleRoleChange = (value: string) => {
		setRole(value as FetchAdminUsersQuery["role"]);
		setPage(1);
	};

	const handlePlanChange = (value: string) => {
		setPlan(value);
		setPage(1);
	};

	const handleSortChange = (value: UsersSort) => {
		setSort(value);
		setPage(1);
	};

	const toggleSelectId = (id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	};

	const toggleSelectAll = () => {
		if (!data?.users) return;
		setSelectedIds((prev) => {
			const allIds = data.users.map((u) => u.id);
			const allSelected = allIds.every((id) => prev.has(id));
			if (allSelected) return new Set();
			return new Set(allIds);
		});
	};

	const clearSelection = () => setSelectedIds(new Set());

	const handleExport = async () => {
		try {
			const blob = await adminUserApi.exportCsv(query);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "users.csv";
			a.click();
			URL.revokeObjectURL(url);
		} catch {
			// silently ignore
		}
	};

	const allSelected =
		!!data?.users?.length &&
		data.users.every((u) => selectedIds.has(u.id));
	const someSelected = selectedIds.size > 0;

	return {
		tab,
		search,
		role,
		plan,
		sort,
		page,
		selectedIds,
		allSelected,
		someSelected,
		data,
		stats,
		isLoading,
		isFetching,
		statsLoading,
		mutations,
		handleTabChange,
		handleSearchChange,
		handleRoleChange,
		handlePlanChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		setPage,
		handleExport,
	};
};
