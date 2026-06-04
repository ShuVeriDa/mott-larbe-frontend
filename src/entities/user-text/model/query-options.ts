// No "use client" — these pure queryOptions can be called from Server Components
// (e.g. getQueryClient().prefetchQuery(userTextDetailQueryOptions(id)))
import { queryOptions } from "@tanstack/react-query";
import { userTextApi } from "../api/user-text-api";
import type { GetUserTextsParams } from "../api/types";

export const userTextKeys = {
  all: ["user-texts"] as const,
  lists: (params?: GetUserTextsParams) =>
    [...userTextKeys.all, "list", params] as const,
  detail: (id: string) => [...userTextKeys.all, "detail", id] as const,
};

export const userTextListQueryOptions = (params?: GetUserTextsParams) =>
  queryOptions({
    queryKey: userTextKeys.lists(params),
    queryFn: () => userTextApi.list(params),
    staleTime: 60_000,
  });

export const userTextDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: userTextKeys.detail(id),
    queryFn: () => userTextApi.getById(id),
    staleTime: 120_000,
  });
