"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api";
import { adminBillingApi } from "../api/admin-billing-api";
import { adminBillingKeys } from "../api/admin-billing-keys";
import type { CreateCouponDto, CreatePlanDto, UpdateCouponDto, UpdatePlanDto, UpdatePlanLimitsDto } from "../api/types";

export const useBillingMutations = () => {
	const qc = useQueryClient();

	const invalidatePlans = () =>
		qc.invalidateQueries({ queryKey: ["admin", "plans"] });

	const invalidateCoupons = () =>
		qc.invalidateQueries({ queryKey: ["admin", "coupons"] });

	const invalidateAll = () =>
		qc.invalidateQueries({ queryKey: adminBillingKeys.root });

	const createPlan = useMutation({
		mutationFn: (dto: CreatePlanDto) => adminBillingApi.createPlan(dto),
		onSuccess: invalidatePlans,
	});

	const updatePlan = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdatePlanDto }) =>
			adminBillingApi.updatePlan(id, dto),
		onSuccess: invalidatePlans,
	});

	const deactivatePlan = useMutation({
		mutationFn: (id: string) => adminBillingApi.deactivatePlan(id),
		onSuccess: invalidatePlans,
	});

	const deletePlan = useMutation({
		mutationFn: (id: string) => adminBillingApi.deletePlan(id),
		onSuccess: invalidatePlans,
	});

	const updatePlanLimits = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdatePlanLimitsDto }) =>
			adminBillingApi.updatePlanLimits(id, dto),
		onSuccess: invalidatePlans,
	});

	const createCoupon = useMutation({
		mutationFn: (dto: CreateCouponDto) => adminBillingApi.createCoupon(dto),
		onSuccess: invalidateCoupons,
	});

	const updateCoupon = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateCouponDto }) =>
			adminBillingApi.updateCoupon(id, dto),
		onSuccess: invalidateCoupons,
	});

	const deleteCoupon = useMutation({
		mutationFn: (id: string) => adminBillingApi.deleteCoupon(id),
		onSuccess: invalidateCoupons,
	});

	const deactivateCoupon = useMutation({
		mutationFn: (id: string) =>
			http.post(`/admin/coupons/${id}/deactivate`).then((r) => r.data),
		onSuccess: invalidateCoupons,
	});

	return {
		createPlan,
		updatePlan,
		deactivatePlan,
		deletePlan,
		updatePlanLimits,
		createCoupon,
		updateCoupon,
		deleteCoupon,
		deactivateCoupon,
		invalidateAll,
	};
};
