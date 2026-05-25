"use client";

import { useMutation } from "@tanstack/react-query";
import {
	subscriptionApi,
	type RedeemPromoResult,
} from "@/entities/subscription";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useRedeemPromo = () => {
	const { toastApiError } = useApiErrorToast();
	return useMutation<RedeemPromoResult, Error, string>({
		mutationFn: (code: string) => subscriptionApi.redeemPromo(code),
		onError: toastApiError,
	});
};
