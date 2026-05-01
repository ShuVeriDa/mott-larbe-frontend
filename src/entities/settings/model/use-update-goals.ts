"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	settingsApi,
	settingsKeys,
	type AllSettings,
	type UpdateGoalsDto,
	type UserGoals,
} from "../api";

export const useUpdateGoals = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: UpdateGoalsDto) => settingsApi.updateGoals(dto),
		onSuccess: (goals: UserGoals) => {
			qc.setQueryData<AllSettings | undefined>(settingsKeys.all(), (prev) =>
				prev ? { ...prev, goals } : prev,
			);
		},
	});
};
