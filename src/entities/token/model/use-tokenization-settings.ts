"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tokenizationApi } from "../api/token-api";
import { tokenizationKeys } from "../api/token-keys";
import type { UpdateTokenizationSettingsDto } from "../api/types";

export const useTokenizationSettings = () =>
	useQuery({
		queryKey: tokenizationKeys.settings(),
		queryFn: tokenizationApi.settings,
	});

export const useUpdateTokenizationSettings = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: UpdateTokenizationSettingsDto) => tokenizationApi.updateSettings(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: tokenizationKeys.settings() });
		},
	});
};
