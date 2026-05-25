"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi, subscriptionKeys } from "@/entities/subscription";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useCancelSubscription = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: () => subscriptionApi.cancel(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: subscriptionKeys.root });
		},
		onError: toastApiError,
	});
};
