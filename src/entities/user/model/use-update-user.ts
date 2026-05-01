"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, userKeys } from "../api";
import type { UpdateUserDto } from "../api";

export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: UpdateUserDto) => userApi.update(dto),
		onSuccess: (updated) => {
			queryClient.setQueryData(userKeys.me(), updated);
		},
	});
};
