"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	subscriptionApi,
	subscriptionKeys,
	type SubscribeRequest,
	type SubscribeResult,
} from "@/entities/subscription";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useSubscribePlan = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation<SubscribeResult, Error, SubscribeRequest>({
		mutationFn: (body) => subscriptionApi.subscribe(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: subscriptionKeys.root });
		},
		onError: toastApiError,
	});
};
