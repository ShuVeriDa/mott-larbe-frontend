"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	settingsApi,
	settingsKeys,
	type AllSettings,
	type UpdateNotificationsDto,
	type UserNotifications,
} from "../api";

export const useUpdateNotifications = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: UpdateNotificationsDto) =>
			settingsApi.updateNotifications(dto),
		onSuccess: (notifications: UserNotifications) => {
			qc.setQueryData<AllSettings | undefined>(
				settingsKeys.all(),
				(prev) => (prev ? { ...prev, notifications } : prev),
			);
		},
	});
};
