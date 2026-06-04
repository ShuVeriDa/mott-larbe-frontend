"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userTextApi } from "../api/user-text-api";
import type { CreateUserTextDto, UpdateUserTextDto } from "../api/types";
import { userTextKeys } from "./query-options";

// queryOptions and keys live in query-options.ts (no "use client") so Server
// Components can call prefetchQuery(userTextDetailQueryOptions(id)) directly.
export {
  userTextKeys,
  userTextListQueryOptions,
  userTextDetailQueryOptions,
} from "./query-options";

export const useCreateUserText = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserTextDto) => userTextApi.create(dto),
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
