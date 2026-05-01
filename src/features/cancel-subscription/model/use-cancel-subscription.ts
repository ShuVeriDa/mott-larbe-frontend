"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi, subscriptionKeys } from "@/entities/subscription";

export const useCancelSubscription = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => subscriptionApi.cancel(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: subscriptionKeys.root });
		},
	});
};
