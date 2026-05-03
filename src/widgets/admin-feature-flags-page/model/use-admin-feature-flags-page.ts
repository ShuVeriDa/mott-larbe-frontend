"use client";

import { useCallback, useState } from "react";
import {
	useAdminFeatureFlags,
	useAdminFeatureFlagStats,
	useAdminFeatureFlagOverrides,
	useAdminFeatureFlagHistory,
	useToggleFeatureFlag,
	useCreateFeatureFlag,
	useUpdateFeatureFlag,
	useDeleteFeatureFlag,
	useDuplicateFeatureFlag,
	useDeleteFeatureFlagOverride,
} from "@/entities/feature-flag";
import type {
	FeatureFlagItem,
	FeatureFlagCategory,
	FeatureFlagEnvironment,
	FeatureFlagStatusFilter,
	CreateFeatureFlagDto,
	UpdateFeatureFlagDto,
} from "@/entities/feature-flag";

export type FeatureFlagsTab = "flags" | "overrides" | "history";

const LIMIT = 25;

export const useAdminFeatureFlagsPage = () => {
	const [tab, setTab] = useState<FeatureFlagsTab>("flags");
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState("");
	const [environment, setEnvironment] = useState("");
	const [status, setStatus] = useState("");

	const [modalOpen, setModalOpen] = useState(false);
	const [editFlag, setEditFlag] = useState<FeatureFlagItem | null>(null);
	const [deleteFlag, setDeleteFlag] = useState<FeatureFlagItem | null>(null);

	const flagsQuery = useAdminFeatureFlags({
		search: search || undefined,
		category: (category as FeatureFlagCategory) || undefined,
		environment: (environment as FeatureFlagEnvironment) || undefined,
		status: (status as FeatureFlagStatusFilter) || undefined,
		page,
		limit: LIMIT,
	});

	const overridesQuery = useAdminFeatureFlagOverrides({
		search: search || undefined,
		page,
		limit: LIMIT,
	});

	const historyQuery = useAdminFeatureFlagHistory({
		search: search || undefined,
		page,
		limit: LIMIT,
	});

	const statsQuery = useAdminFeatureFlagStats();

	const toggleMutation = useToggleFeatureFlag();
	const createMutation = useCreateFeatureFlag();
	const updateMutation = useUpdateFeatureFlag();
	const deleteMutation = useDeleteFeatureFlag();
	const duplicateMutation = useDuplicateFeatureFlag();
	const deleteOverrideMutation = useDeleteFeatureFlagOverride();

	const handleTabChange = useCallback((next: FeatureFlagsTab) => {
		setTab(next);
		setPage(1);
		setSearch("");
	}, []);

	const handleSearchChange = useCallback((v: string) => {
		setSearch(v);
		setPage(1);
	}, []);

	const handleCategoryChange = useCallback((v: string) => {
		setCategory(v);
		setPage(1);
	}, []);

	const handleEnvironmentChange = useCallback((v: string) => {
		setEnvironment(v);
		setPage(1);
	}, []);

	const handleStatusChange = useCallback((v: string) => {
		setStatus(v);
		setPage(1);
	}, []);

	const handleToggle = useCallback((id: string, isEnabled: boolean) => {
		toggleMutation.mutate({ id, isEnabled });
	}, [toggleMutation]);

	const openCreate = useCallback(() => {
		setEditFlag(null);
		setModalOpen(true);
	}, []);

	const openEdit = useCallback((flag: FeatureFlagItem) => {
		setEditFlag(flag);
		setModalOpen(true);
	}, []);

	const handleModalSubmit = useCallback(
		(dto: CreateFeatureFlagDto | UpdateFeatureFlagDto) => {
			if (editFlag) {
				updateMutation.mutate(
					{ id: editFlag.id, dto: dto as UpdateFeatureFlagDto },
					{ onSuccess: () => setModalOpen(false) },
				);
			} else {
				createMutation.mutate(dto as CreateFeatureFlagDto, {
					onSuccess: () => setModalOpen(false),
				});
			}
		},
		[editFlag, updateMutation, createMutation],
	);

	const openDelete = useCallback((flag: FeatureFlagItem) => {
		setDeleteFlag(flag);
	}, []);

	const handleDeleteConfirm = useCallback(() => {
		if (!deleteFlag) return;
		deleteMutation.mutate(deleteFlag.id, {
			onSuccess: () => setDeleteFlag(null),
		});
	}, [deleteFlag, deleteMutation]);

	const handleDuplicate = useCallback((flag: FeatureFlagItem) => {
		const newKey = `${flag.key}_copy`;
		duplicateMutation.mutate({ id: flag.id, key: newKey });
	}, [duplicateMutation]);

	const handleDeleteOverride = useCallback((overrideId: string) => {
		deleteOverrideMutation.mutate(overrideId);
	}, [deleteOverrideMutation]);

	const activeQuery = tab === "flags" ? flagsQuery : tab === "overrides" ? overridesQuery : historyQuery;
	const total = activeQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));

	return {
		tab,
		page,
		search,
		category,
		environment,
		status,
		modalOpen,
		editFlag,
		deleteFlag,
		flagsQuery,
		overridesQuery,
		historyQuery,
		statsQuery,
		total,
		totalPages,
		LIMIT,
		isModalSubmitting: createMutation.isPending || updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		handleTabChange,
		handleSearchChange,
		handleCategoryChange,
		handleEnvironmentChange,
		handleStatusChange,
		handleToggle,
		openCreate,
		openEdit,
		handleModalSubmit,
		openDelete,
		handleDeleteConfirm,
		handleDuplicate,
		handleDeleteOverride,
		setModalOpen,
		setDeleteFlag,
		setPage,
	};
};
