"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";

export const useAdminUserFeatureFlags = (userId: string) => {
	const qc = useQueryClient();
	const invalidate = () =>
		qc.invalidateQueries({ queryKey: adminUserKeys.featureFlags(userId) });

	const query = useQuery({
		queryKey: adminUserKeys.featureFlags(userId),
		queryFn: () => adminUserApi.getFeatureFlags(userId),
		enabled: !!userId,
	});

	const setOverride = useMutation({
		mutationFn: ({ flagId, value }: { flagId: string; value: boolean }) =>
			adminUserApi.setFeatureFlag(userId, flagId, value),
		onSuccess: invalidate,
	});

	const deleteOverride = useMutation({
		mutationFn: (flagId: string) => adminUserApi.deleteFeatureFlag(userId, flagId),
		onSuccess: invalidate,
	});

	return { query, setOverride, deleteOverride };
};
