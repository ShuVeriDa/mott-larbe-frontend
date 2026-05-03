"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSubscriptionApi } from "../api/admin-subscription-api";
import { adminSubscriptionKeys } from "../api/admin-subscription-keys";
import type {
	CancelSubscriptionDto,
	CreateManualSubscriptionDto,
	ExtendSubscriptionDto,
} from "../api/types";

export const useAdminSubscriptionMutations = () => {
	const qc = useQueryClient();
	const invalidate = () =>
		qc.invalidateQueries({ queryKey: adminSubscriptionKeys.root });

	const create = useMutation({
		mutationFn: (dto: CreateManualSubscriptionDto) =>
			adminSubscriptionApi.create(dto),
		onSuccess: invalidate,
	});

	const cancel = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto?: CancelSubscriptionDto }) =>
			adminSubscriptionApi.cancel(id, dto),
		onSuccess: invalidate,
	});

	const extend = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: ExtendSubscriptionDto }) =>
			adminSubscriptionApi.extend(id, dto),
		onSuccess: invalidate,
	});

	return { create, cancel, extend };
};
