"use client";

import { useMutation } from "@tanstack/react-query";
import {
	subscriptionApi,
	type RedeemPromoResult,
} from "@/entities/subscription";

export const useRedeemPromo = () =>
	useMutation<RedeemPromoResult, Error, string>({
		mutationFn: (code: string) => subscriptionApi.redeemPromo(code),
	});
