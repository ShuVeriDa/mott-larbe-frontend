"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	settingsApi,
	settingsKeys,
	type AllSettings,
	type UpdatePreferencesDto,
	type UserPreferences,
} from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useUpdatePreferences = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (dto: UpdatePreferencesDto) =>
			settingsApi.updatePreferences(dto),
		onSuccess: (preferences: UserPreferences) => {
			qc.setQueryData<AllSettings | undefined>(
				settingsKeys.all(),
				(prev) => (prev ? { ...prev, preferences } : prev),
			);
		},
		onError: toastApiError,
	});
};
