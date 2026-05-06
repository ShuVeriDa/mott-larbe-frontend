"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminPaymentApi } from "../api/admin-payment-api";
import { adminPaymentKeys } from "../api/admin-payment-keys";
import type { RefundPaymentDto } from "../api/types";

export const usePaymentMutations = () => {
	const qc = useQueryClient();

	const invalidatePayments = () => {
		void qc.invalidateQueries({ queryKey: adminPaymentKeys.root });
	};

	const refund = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: RefundPaymentDto }) =>
			adminPaymentApi.refund(id, dto),
		onSuccess: invalidatePayments,
	});

	const sendReceipt = useMutation({
		mutationFn: ({ id, email }: { id: string; email?: string }) =>
			adminPaymentApi.sendReceipt(id, email),
	});

	return { refund, sendReceipt };
};
