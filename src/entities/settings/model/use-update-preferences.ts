"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	settingsApi,
	settingsKeys,
	type AllSettings,
	type UpdatePreferencesDto,
	type UserPreferences,
} from "../api";

export const useUpdatePreferences = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: UpdatePreferencesDto) =>
			settingsApi.updatePreferences(dto),
		onSuccess: (preferences: UserPreferences) => {
			qc.setQueryData<AllSettings | undefined>(
				settingsKeys.all(),
				(prev) => (prev ? { ...prev, preferences } : prev),
			);
		},
	});
};
