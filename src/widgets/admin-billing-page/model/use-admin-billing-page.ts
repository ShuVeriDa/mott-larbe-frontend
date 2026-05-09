"use client";
import { useState } from 'react';
import {
	useBillingStats,
	useBillingPlans,
	useBillingRevenue,
	useBillingSubscriptions,
	useBillingSubscriptionStats,
	useBillingCoupons,
	useBillingMutations,
} from "@/entities/admin-billing";
import type {
	AdminPlan,
	AdminCoupon,
	CreatePlanDto,
	UpdatePlanDto,
	CreateCouponDto,
	PlanLimits,
} from "@/entities/admin-billing";

export type PlanModalMode = "create" | "edit";
export type ActiveModal = "plan" | "coupon" | "limits" | null;

export const useAdminBillingPage = () => {
	// ── Modal state ──────────────────────────────────────────────────────────
	const [activeModal, setActiveModal] = useState<ActiveModal>(null);
	const [planModalMode, setPlanModalMode] = useState<PlanModalMode>("create");
	const [editingPlan, setEditingPlan] = useState<AdminPlan | null>(null);
	const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);

	// ── Data ─────────────────────────────────────────────────────────────────
	const { data: stats, isLoading: statsLoading } = useBillingStats();
	const { data: plans, isLoading: plansLoading } = useBillingPlans();
	const { data: revenue, isLoading: revenueLoading } = useBillingRevenue();
	const { data: subscriptions, isLoading: subsLoading } =
		useBillingSubscriptions({ limit: 8 });
	const { data: subscriptionStats } = useBillingSubscriptionStats();
	const { data: coupons, isLoading: couponsLoading } = useBillingCoupons({
		status: "active",
	});

	const mutations = useBillingMutations();

	// ── Modal handlers ───────────────────────────────────────────────────────
	const openCreatePlanModal = () => {
		setEditingPlan(null);
		setPlanModalMode("create");
		setActiveModal("plan");
	};

	const openEditPlanModal = (plan: AdminPlan) => {
		setEditingPlan(plan);
		setPlanModalMode("edit");
		setActiveModal("plan");
	};

	const openCreateCouponModal = () => {
		setEditingCoupon(null);
		setActiveModal("coupon");
	};

	const openLimitsModal = (plan: AdminPlan) => {
		setEditingPlan(plan);
		setActiveModal("limits");
	};

	const closeModal = () => {
		setActiveModal(null);
		setEditingPlan(null);
		setEditingCoupon(null);
	};

	// ── Submit handlers ──────────────────────────────────────────────────────
	const handlePlanSubmit = (dto: CreatePlanDto | UpdatePlanDto) => {
		if (planModalMode === "edit" && editingPlan) {
			mutations.updatePlan.mutate(
				{ id: editingPlan.id, dto: dto as UpdatePlanDto },
				{ onSuccess: closeModal },
			);
		} else {
			mutations.createPlan.mutate(dto as CreatePlanDto, {
				onSuccess: closeModal,
			});
		}
	};

	const handleCouponSubmit = (dto: CreateCouponDto) => {
		mutations.createCoupon.mutate(dto, { onSuccess: closeModal });
	};

	const handleDeactivatePlan = (id: string) => {
		mutations.deactivatePlan.mutate(id);
	};

	const handleDeleteCoupon = (id: string) => {
		mutations.deleteCoupon.mutate(id);
	};

	const handleLimitsSubmit = (id: string, limits: Partial<PlanLimits>) => {
		mutations.updatePlanLimits.mutate(
			{ id, dto: { limits } },
			{ onSuccess: closeModal },
		);
	};

	return {
		// data
		stats,
		statsLoading,
		plans: plans ?? [],
		plansLoading,
		revenue: revenue ?? [],
		revenueLoading,
		subscriptions,
		subsLoading,
		subscriptionActiveCount: subscriptionStats?.activeCount ?? 0,
		coupons: coupons?.items ?? [],
		couponsLoading,
		// modal state
		activeModal,
		planModalMode,
		editingPlan,
		editingCoupon,
		// handlers
		openCreatePlanModal,
		openEditPlanModal,
		openCreateCouponModal,
		openLimitsModal,
		closeModal,
		handlePlanSubmit,
		handleCouponSubmit,
		handleLimitsSubmit,
		handleDeactivatePlan,
		handleDeleteCoupon,
		mutations,
	};
};
