"use client";
import { useState } from 'react';
import { useDebounce } from "@/shared/lib/debounce";
import {
	useAdminFeatureFlags,
	useAdminFeatureFlagStats,
	useAdminFeatureFlagOverrides,
	useAdminFeatureFlagHistory,
	useAdminFeatureFlagKeys,
	useAdminFeatureFlagHistoryActors,
	useToggleFeatureFlag,
	useCreateFeatureFlag,
	useUpdateFeatureFlag,
	useDeleteFeatureFlag,
	useDuplicateFeatureFlag,
	useDeleteFeatureFlagOverride,
	useCreateFeatureFlagOverride,
	useImportFeatureFlags,
} from "@/entities/feature-flag";
import type {
	FeatureFlagItem,
	FeatureFlagCategory,
	FeatureFlagEnvironment,
	FeatureFlagStatusFilter,
	FeatureFlagHistoryEventType,
	CreateFeatureFlagDto,
	UpdateFeatureFlagDto,
	CreateFeatureFlagOverrideDto,
	ImportFeatureFlagsDto,
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

	// overrides tab filters
	const [overrideFlagId, setOverrideFlagId] = useState("");
	const [overrideIsEnabled, setOverrideIsEnabled] = useState("");

	// history tab filters
	const [historyEventType, setHistoryEventType] = useState("");
	const [historyActorId, setHistoryActorId] = useState("");

	// modals
	const [modalOpen, setModalOpen] = useState(false);
	const [editFlag, setEditFlag] = useState<FeatureFlagItem | null>(null);
	const [deleteFlag, setDeleteFlag] = useState<FeatureFlagItem | null>(null);
	const [duplicateFlag, setDuplicateFlag] = useState<FeatureFlagItem | null>(null);
	const [overrideModalOpen, setOverrideModalOpen] = useState(false);
	const [overridePreselectedFlagId, setOverridePreselectedFlagId] = useState<string | undefined>();
	const [importModalOpen, setImportModalOpen] = useState(false);

	const debouncedSearch = useDebounce(search, 300);

	const flagsQuery = useAdminFeatureFlags({
		search: debouncedSearch || undefined,
		category: (category as FeatureFlagCategory) || undefined,
		environment: (environment as FeatureFlagEnvironment) || undefined,
		status: (status as FeatureFlagStatusFilter) || undefined,
		page,
		limit: LIMIT,
	});

	const overridesQuery = useAdminFeatureFlagOverrides({
		search: debouncedSearch || undefined,
		flagId: overrideFlagId || undefined,
		isEnabled: overrideIsEnabled ? overrideIsEnabled === "true" : undefined,
		page,
		limit: LIMIT,
	});

	const historyQuery = useAdminFeatureFlagHistory({
		search: debouncedSearch || undefined,
		eventType: (historyEventType as FeatureFlagHistoryEventType) || undefined,
		actorId: historyActorId || undefined,
		page,
		limit: LIMIT,
	});

	const statsQuery = useAdminFeatureFlagStats();
	const keysQuery = useAdminFeatureFlagKeys({ limit: 100 });
	const historyActorsQuery = useAdminFeatureFlagHistoryActors();

	const toggleMutation = useToggleFeatureFlag();
	const createMutation = useCreateFeatureFlag();
	const updateMutation = useUpdateFeatureFlag();
	const deleteMutation = useDeleteFeatureFlag();
	const duplicateMutation = useDuplicateFeatureFlag();
	const deleteOverrideMutation = useDeleteFeatureFlagOverride();
	const createOverrideMutation = useCreateFeatureFlagOverride();
	const importMutation = useImportFeatureFlags();

	const handleTabChange = (next: FeatureFlagsTab) => {
		setTab(next);
		setPage(1);
		setSearch("");
	};

	const handleSearchChange = (v: string) => {
		setSearch(v);
		setPage(1);
	};

	const handleCategoryChange = (v: string) => {
		setCategory(v);
		setPage(1);
	};

	const handleEnvironmentChange = (v: string) => {
		setEnvironment(v);
		setPage(1);
	};

	const handleStatusChange = (v: string) => {
		setStatus(v);
		setPage(1);
	};

	const handleOverrideFlagIdChange = (v: string) => {
		setOverrideFlagId(v);
		setPage(1);
	};

	const handleOverrideIsEnabledChange = (v: string) => {
		setOverrideIsEnabled(v);
		setPage(1);
	};

	const handleHistoryEventTypeChange = (v: string) => {
		setHistoryEventType(v);
		setPage(1);
	};

	const handleHistoryActorIdChange = (v: string) => {
		setHistoryActorId(v);
		setPage(1);
	};

	const handleToggle = (id: string, isEnabled: boolean) => {
		toggleMutation.mutate({ id, isEnabled });
	};

	const openCreate = () => {
		setEditFlag(null);
		setModalOpen(true);
	};

	const openEdit = (flag: FeatureFlagItem) => {
		setEditFlag(flag);
		setModalOpen(true);
	};

	const handleModalSubmit = (dto: CreateFeatureFlagDto | UpdateFeatureFlagDto) => {
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
	};

	const openDelete = (flag: FeatureFlagItem) => {
		setDeleteFlag(flag);
	};

	const handleDeleteConfirm = () => {
		if (!deleteFlag) return;
		deleteMutation.mutate(deleteFlag.id, {
			onSuccess: () => setDeleteFlag(null),
		});
	};

	const openDuplicate = (flag: FeatureFlagItem) => {
		setDuplicateFlag(flag);
	};

	const handleDuplicateConfirm = (newKey: string) => {
		if (!duplicateFlag) return;
		duplicateMutation.mutate(
			{ id: duplicateFlag.id, key: newKey },
			{ onSuccess: () => setDuplicateFlag(null) },
		);
	};

	const openOverrideModal = (flagId?: string) => {
		setOverridePreselectedFlagId(flagId);
		setOverrideModalOpen(true);
	};

	const handleOverrideSubmit = (dto: CreateFeatureFlagOverrideDto) => {
		createOverrideMutation.mutate(dto, {
			onSuccess: () => setOverrideModalOpen(false),
		});
	};

	const handleDeleteOverride = (overrideId: string) => {
		deleteOverrideMutation.mutate(overrideId);
	};

	const handleImportSubmit = (dto: ImportFeatureFlagsDto) => importMutation.mutateAsync(dto);

	const activeQuery =
		tab === "flags" ? flagsQuery : tab === "overrides" ? overridesQuery : historyQuery;
	const total = activeQuery.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / LIMIT));

	return {
		tab,
		page,
		search,
		category,
		environment,
		status,
		overrideFlagId,
		overrideIsEnabled,
		historyEventType,
		historyActorId,
		modalOpen,
		editFlag,
		deleteFlag,
		duplicateFlag,
		overrideModalOpen,
		overridePreselectedFlagId,
		importModalOpen,
		flagsQuery,
		overridesQuery,
		historyQuery,
		statsQuery,
		keysQuery,
		historyActorsQuery,
		total,
		totalPages,
		LIMIT,
		isModalSubmitting: createMutation.isPending || updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		isDuplicating: duplicateMutation.isPending,
		isOverrideSubmitting: createOverrideMutation.isPending,
		isImporting: importMutation.isPending,
		handleTabChange,
		handleSearchChange,
		handleCategoryChange,
		handleEnvironmentChange,
		handleStatusChange,
		handleOverrideFlagIdChange,
		handleOverrideIsEnabledChange,
		handleHistoryEventTypeChange,
		handleHistoryActorIdChange,
		handleToggle,
		openCreate,
		openEdit,
		handleModalSubmit,
		openDelete,
		handleDeleteConfirm,
		openDuplicate,
		handleDuplicateConfirm,
		openOverrideModal,
		handleOverrideSubmit,
		handleDeleteOverride,
		handleImportSubmit,
		setModalOpen,
		setDeleteFlag,
		setDuplicateFlag,
		setOverrideModalOpen,
		setImportModalOpen,
		setPage,
	};
};
