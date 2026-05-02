"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";

export const useAdminUserSubscription = (userId: string) => {
	const qc = useQueryClient();
	const invalidate = () =>
		qc.invalidateQueries({ queryKey: adminUserKeys.subscription(userId) });

	const query = useQuery({
		queryKey: adminUserKeys.subscription(userId),
		queryFn: () => adminUserApi.getSubscription(userId),
		enabled: !!userId,
	});

	const cancel = useMutation({
		mutationFn: (subId: string) => adminUserApi.cancelSubscription(userId, subId),
		onSuccess: invalidate,
	});

	const extend = useMutation({
		mutationFn: ({ subId, days }: { subId: string; days: number }) =>
			adminUserApi.extendSubscription(userId, subId, days),
		onSuccess: invalidate,
	});

	return { query, cancel, extend };
};
