"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pageBookmarkApi } from "../api/page-bookmark-api";
import { pageBookmarkKeys } from "../api/page-bookmark-keys";
import type { TogglePageBookmarkDto } from "../api/types";

export const usePageBookmarks = (textId: string) => {
  return useQuery({
    queryKey: pageBookmarkKeys.all(textId),
    queryFn: () => pageBookmarkApi.getAll(textId),
  });
};

export const useTogglePageBookmark = (textId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: TogglePageBookmarkDto) => pageBookmarkApi.toggle(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageBookmarkKeys.all(textId) });
    },
  });
};

export const useRemovePageBookmark = (textId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pageBookmarkApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageBookmarkKeys.all(textId) });
    },
  });
};
