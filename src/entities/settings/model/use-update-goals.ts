"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	settingsApi,
	settingsKeys,
	type AllSettings,
	type UpdateGoalsDto,
	type UserGoals,
} from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useUpdateGoals = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (dto: UpdateGoalsDto) => settingsApi.updateGoals(dto),
		onSuccess: (goals: UserGoals) => {
			qc.setQueryData<AllSettings | undefined>(settingsKeys.all(), (prev) =>
				prev ? { ...prev, goals } : prev,
			);
		},
		onError: toastApiError,
	});
};
