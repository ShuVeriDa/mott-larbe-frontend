"use client";

import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { userTextApi } from "../api/user-text-api";
import type {
  CreateUserTextDto,
  GetUserTextsParams,
  UpdateUserTextDto,
} from "../api/types";

// ─── Query keys ────────────────────────────────────────────────────────────

export const userTextKeys = {
  all: ["user-texts"] as const,
  // All params included in the key — undefined values kept for determinism
  lists: (params?: GetUserTextsParams) =>
    [...userTextKeys.all, "list", params] as const,
  detail: (id: string) => [...userTextKeys.all, "detail", id] as const,
};

// ─── Query options — single source of truth (reused in prefetchQuery) ──────

export const userTextListQueryOptions = (params?: GetUserTextsParams) =>
  queryOptions({
    queryKey: userTextKeys.lists(params),
    queryFn: () => userTextApi.list(params),
    // List: 1 min — items change only on explicit user action
    staleTime: 60_000,
  });

export const userTextDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: userTextKeys.detail(id),
    queryFn: () => userTextApi.getById(id),
    // Detail with full TipTap content: 2 min
    staleTime: 120_000,
  });

// ─── Mutations ─────────────────────────────────────────────────────────────

export const useCreateUserText = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserTextDto) => userTextApi.create(dto),
    // retry: 0 — write ops must not be silently retried (may partially succeed)
    retry: 0,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userTextKeys.all });
    },
  });
};

export const useUpdateUserText = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserTextDto }) =>
      userTextApi.update(id, dto),
    retry: 0,
    onSuccess: (data) => {
      // Update detail cache immediately, invalidate list for sort order refresh
      qc.setQueryData(userTextKeys.detail(data.id), data);
      qc.invalidateQueries({ queryKey: userTextKeys.all });
    },
  });
};

export const useDeleteUserText = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userTextApi.remove(id),
    retry: 0,
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: userTextKeys.detail(id) });
      qc.invalidateQueries({ queryKey: userTextKeys.all });
    },
  });
};
