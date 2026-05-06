"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCouponApi } from "../api/admin-coupon-api";
import { adminCouponKeys } from "../api/admin-coupon-keys";
import type { CreateCouponDto, UpdateCouponDto } from "../api/types";

export const useCouponMutations = () => {
	const qc = useQueryClient();

	const invalidate = () =>
		qc.invalidateQueries({ queryKey: adminCouponKeys.root });

	const create = useMutation({
		mutationFn: (dto: CreateCouponDto) => adminCouponApi.create(dto),
		onSuccess: invalidate,
	});

	const update = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateCouponDto }) =>
			adminCouponApi.update(id, dto),
		onSuccess: invalidate,
	});

	const deactivate = useMutation({
		mutationFn: (id: string) => adminCouponApi.deactivate(id),
		onSuccess: invalidate,
	});

	const activate = useMutation({
		mutationFn: (id: string) => adminCouponApi.activate(id),
		onSuccess: invalidate,
	});

	const remove = useMutation({
		mutationFn: (id: string) => adminCouponApi.remove(id),
		onSuccess: invalidate,
	});

	return { create, update, deactivate, activate, remove };
};
