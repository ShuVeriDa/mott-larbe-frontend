"use client";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  morphRuleApi,
  morphRuleKeys,
  useMorphRuleStats,
  useMorphRules,
} from "@/entities/morph-rule";
import type {
  CreateMorphRuleDto,
  MorphRule,
  MorphRuleStatus,
  MorphRuleType,
  UpdateMorphRuleDto,
} from "@/entities/morph-rule";

const LIMIT = 50;

export const useAdminMorphologyPage = () => {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<MorphRuleStatus>("all");
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState("");
  const [type, setType] = useState<MorphRuleType | "">("");
  const [page, setPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editRule, setEditRule] = useState<MorphRule | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const query = {
    q: search || undefined,
    pos: pos || undefined,
    type: (type as MorphRuleType) || undefined,
    status: status === "all" ? undefined : status,
    page,
    limit: LIMIT,
  };

  const statsQuery = useMorphRuleStats();
  const rulesQuery = useMorphRules(query);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: morphRuleKeys.root });

  const createMutation = useMutation({
    mutationFn: (dto: CreateMorphRuleDto) => morphRuleApi.create(dto),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMorphRuleDto }) =>
      morphRuleApi.update(id, dto),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => morphRuleApi.remove(id),
    onSuccess: invalidate,
  });

  const bulkActivateMutation = useMutation({
    mutationFn: () => morphRuleApi.bulkActivate({ ids: Array.from(selectedIds) }),
    onSuccess: () => {
      invalidate();
      setSelectedIds(new Set());
    },
  });

  const bulkDeactivateMutation = useMutation({
    mutationFn: () =>
      morphRuleApi.bulkDeactivate({ ids: Array.from(selectedIds) }),
    onSuccess: () => {
      invalidate();
      setSelectedIds(new Set());
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: () => morphRuleApi.bulkDelete({ ids: Array.from(selectedIds) }),
    onSuccess: () => {
      invalidate();
      setSelectedIds(new Set());
    },
  });

  const importMutation = useMutation({
    mutationFn: ({ file, overwrite }: { file: File; overwrite: boolean }) =>
      morphRuleApi.importRules(file, overwrite),
    onSuccess: invalidate,
  });

  const items = rulesQuery.data?.items ?? [];
  const total = rulesQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const allSelected =
    items.length > 0 && items.every((r) => selectedIds.has(r.id));
  const someSelected = items.some((r) => selectedIds.has(r.id)) && !allSelected;

  const handleStatusChange = useCallback(
    (s: MorphRuleStatus) => {
      setStatus(s);
      setPage(1);
      setSelectedIds(new Set());
    },
    [],
  );

  const handleSearchChange = useCallback((v: string) => {
    setSearch(v);
    setPage(1);
  }, []);

  const handlePosChange = useCallback((v: string) => {
    setPos(v);
    setPage(1);
  }, []);

  const handleTypeChange = useCallback((v: MorphRuleType | "") => {
    setType(v);
    setPage(1);
  }, []);

  const toggleSelectId = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const allIds = items.map((r) => r.id);
      const allSel = allIds.every((id) => prev.has(id));
      if (allSel) return new Set();
      return new Set(allIds);
    });
  }, [items]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const openAddModal = useCallback(() => {
    setEditRule(null);
    setRuleModalOpen(true);
  }, []);

  const openEditModal = useCallback((rule: MorphRule) => {
    setEditRule(rule);
    setRuleModalOpen(true);
  }, []);

  const closeRuleModal = useCallback(() => {
    setRuleModalOpen(false);
    setEditRule(null);
  }, []);

  const handleRuleSubmit = useCallback(
    (dto: CreateMorphRuleDto) => {
      if (editRule) {
        updateMutation.mutate(
          { id: editRule.id, dto },
          { onSuccess: closeRuleModal },
        );
      } else {
        createMutation.mutate(dto, { onSuccess: closeRuleModal });
      }
    },
    [editRule, updateMutation, createMutation, closeRuleModal],
  );

  const handleToggleActive = useCallback(
    (rule: MorphRule) => {
      updateMutation.mutate({ id: rule.id, dto: { isActive: !rule.isActive } });
    },
    [updateMutation],
  );

  const handleDelete = useCallback(
    (id: string) => deleteMutation.mutate(id),
    [deleteMutation],
  );

  return {
    status,
    search,
    pos,
    type,
    page,
    totalPages,
    total,
    items,
    selectedIds,
    allSelected,
    someSelected,
    statsQuery,
    rulesQuery,
    ruleModalOpen,
    editRule,
    importModalOpen,
    createMutation,
    updateMutation,
    deleteMutation,
    bulkActivateMutation,
    bulkDeactivateMutation,
    bulkDeleteMutation,
    importMutation,
    handleStatusChange,
    handleSearchChange,
    handlePosChange,
    handleTypeChange,
    setPage,
    toggleSelectId,
    toggleSelectAll,
    clearSelection,
    openAddModal,
    openEditModal,
    closeRuleModal,
    handleRuleSubmit,
    handleToggleActive,
    handleDelete,
    setImportModalOpen,
  };
};
