"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	subscriptionApi,
	subscriptionKeys,
	type SubscribeRequest,
	type SubscribeResult,
} from "@/entities/subscription";

export const useSubscribePlan = () => {
	const qc = useQueryClient();
	return useMutation<SubscribeResult, Error, SubscribeRequest>({
		mutationFn: (body) => subscriptionApi.subscribe(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: subscriptionKeys.root });
		},
	});
};
