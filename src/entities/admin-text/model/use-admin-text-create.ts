"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";
import type { CreateTextDto, UpdateTextDto } from "../api/types";

export const useAdminTextCreate = () => {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: adminTextKeys.root });

	const create = useMutation({
		mutationFn: (dto: CreateTextDto) => adminTextApi.create(dto),
		onSuccess: invalidate,
	});

	const update = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateTextDto }) =>
			adminTextApi.update(id, dto),
		onSuccess: invalidate,
	});

	const uploadCover = useMutation({
		mutationFn: ({ id, file }: { id: string; file: File }) =>
			adminTextApi.uploadCover(id, file),
	});

	return { create, update, uploadCover };
};
