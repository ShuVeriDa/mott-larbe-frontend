"use client";

import { aiTranslationApi, aiTranslationKeys, type AiCacheStatus } from "@/entities/ai-translation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const EXPORT_RUNS_LIMIT = 10;

const AI_CACHE_STATUSES: AiCacheStatus[] = ["PENDING", "APPROVED", "REJECTED"];

export const useAdminAiCacheTab = () => {
  const { t } = useI18n();
  const { success, error } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlStatus = (searchParams.get("aiStatus") as AiCacheStatus) ?? "PENDING";
  const urlQ = searchParams.get("aiQ") ?? "";
  const urlPage = Math.max(1, Number(searchParams.get("aiPage") ?? "1"));

  const [qInput, setQInput] = useState(urlQ);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

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

  const { data, isLoading } = useQuery({
    queryKey: aiTranslationKeys.adminCacheList(urlStatus, urlQ, urlPage),
    queryFn: () =>
      aiTranslationApi.adminList({ status: urlStatus, q: urlQ || undefined, page: urlPage, limit: 20 }),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: aiTranslationKeys.adminCacheStats(),
    queryFn: aiTranslationApi.adminGetStats,
  });

  const { data: exportRuns, isLoading: exportRunsLoading } = useQuery({
    queryKey: aiTranslationKeys.adminExportRuns(),
    queryFn: () => aiTranslationApi.adminGetExportRuns(EXPORT_RUNS_LIMIT),
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: aiTranslationKeys.adminCache() });
  };

  const approve = useMutation({
    mutationFn: aiTranslationApi.adminApprove,
    onSuccess: () => {
      success(t("aiTranslation.admin.approveSuccess"));
      invalidate();
    },
    onError: () => error(t("reader.toasts.dictFailed")),
  });

  const reject = useMutation({
    mutationFn: aiTranslationApi.adminReject,
    onSuccess: () => {
      success(t("aiTranslation.admin.rejectSuccess"));
      invalidate();
    },
    onError: () => error(t("reader.toasts.dictFailed")),
  });

  const remove = useMutation({
    mutationFn: aiTranslationApi.adminDelete,
    onSuccess: invalidate,
    onError: () => error(t("reader.toasts.dictFailed")),
  });

  const exportToDictionary = useMutation({
    mutationFn: aiTranslationApi.adminExportToDictionary,
    onSuccess: (result) => {
      success(t("aiTranslation.admin.exportSuccess", { created: result.created, skipped: result.skipped }));
      setConfirmDialogOpen(false);
      invalidate();
    },
    onError: () => error(t("aiTranslation.admin.exportError")),
  });

  const handleOpenConfirmDialog = async () => {
    await queryClient.invalidateQueries({ queryKey: aiTranslationKeys.adminCacheStats() });
    setConfirmDialogOpen(true);
  };
  const handleCloseConfirmDialog = () => setConfirmDialogOpen(false);
  const handleConfirmExport = () => exportToDictionary.mutate();

  const handleStatusChange = (status: AiCacheStatus) => {
    updateParams({ aiStatus: status, aiPage: undefined });
  };

  const handleQChange = (value: string) => {
    setQInput(value);
    updateParams({ aiQ: value || undefined, aiPage: undefined });
  };

  const handlePageChange = (next: number) => {
    updateParams({ aiPage: next === 1 ? undefined : String(next) });
  };

  return {
    status: urlStatus,
    q: qInput,
    page: urlPage,
    data,
    stats,
    isLoading,
    statsLoading,
    exportRuns: exportRuns ?? [],
    exportRunsLoading,
    approve,
    reject,
    remove,
    exportToDictionary,
    confirmDialogOpen,
    handleOpenConfirmDialog,
    handleCloseConfirmDialog,
    handleConfirmExport,
    handleStatusChange,
    handleQChange,
    handlePageChange,
  };
};
