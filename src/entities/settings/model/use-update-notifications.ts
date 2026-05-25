"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	settingsApi,
	settingsKeys,
	type AllSettings,
	type UpdateNotificationsDto,
	type UserNotifications,
} from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useUpdateNotifications = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (dto: UpdateNotificationsDto) =>
			settingsApi.updateNotifications(dto),
		onSuccess: (notifications: UserNotifications) => {
			qc.setQueryData<AllSettings | undefined>(
				settingsKeys.all(),
				(prev) => (prev ? { ...prev, notifications } : prev),
			);
		},
		onError: toastApiError,
	});
};
