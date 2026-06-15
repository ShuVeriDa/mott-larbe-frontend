"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/shared/lib/toast";
import {
  userTextListQueryOptions,
  userTextKeys,
  useDeleteUserText,
} from "@/entities/user-text";
import { UserTextList } from "./user-text-list";
import { UserTextListSkeleton } from "./user-text-list-skeleton";
import { UserTextDeleteDialog } from "./user-text-delete-dialog";
import type { MyTextsTab } from "./my-texts-tabs";

interface MyTextsTabsContentProps {
  activeTab: MyTextsTab;
  lang: string;
  t: (key: string) => string;
}

const TAB_TO_TYPE = {
  all: undefined,
  original: "ORIGINAL" as const,
  external: "EXTERNAL" as const,
};

export const MyTextsTabsContent = ({ activeTab, lang, t }: MyTextsTabsContentProps) => {
  const qc = useQueryClient();
  const { error: toastError } = useToast();
  const deleteMutation = useDeleteUserText();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const typeFilter = TAB_TO_TYPE[activeTab];
  const { data, isPending } = useQuery(
    userTextListQueryOptions({ type: typeFilter, limit: 20 }),
  );

  if (isPending) return <UserTextListSkeleton />;

  const items = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  const handleDeleteRequest = (id: string) => setDeleteConfirmId(id);
  const handleDeleteCancel = () => setDeleteConfirmId(null);

  const handleDeleteConfirm = () => {
    if (!deleteConfirmId) return;
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: userTextKeys.all });
      },
      onError: () => {
        toastError(t("myTexts.deleteError"));
      },
    });
  };

  return (
    <>
      <UserTextList
        items={items}
        tab={activeTab}
        lang={lang}
        total={total}
        isDeleting={deleteMutation.isPending}
        onDelete={handleDeleteRequest}
        t={t}
      />

      <UserTextDeleteDialog
        open={!!deleteConfirmId}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        t={t}
      />
    </>
  );
};
