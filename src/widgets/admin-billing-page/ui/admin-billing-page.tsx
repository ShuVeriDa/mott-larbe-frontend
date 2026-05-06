"use client";

import { useAdminBillingPage } from "../model/use-admin-billing-page";
import { BillingTopbar } from "./billing-topbar";
import { BillingKpiRow } from "./billing-kpi-row";
import { BillingPlansGrid } from "./billing-plans-grid";
import { BillingLimitsMatrix } from "./billing-limits-matrix";
import { BillingCouponsList } from "./billing-coupons-list";
import { BillingRevenueChart } from "./billing-revenue-chart";
import { BillingSubscriptionsTable } from "./billing-subscriptions-table";
import { BillingPlanModal } from "./billing-plan-modal";
import { BillingCouponModal } from "./billing-coupon-modal";
import { BillingLimitsModal } from "./billing-limits-modal";

export const AdminBillingPage = () => {
	const {
		stats,
		statsLoading,
		plans,
		plansLoading,
		revenue,
		revenueLoading,
		subscriptions,
		subsLoading,
		subscriptionActiveCount,
		coupons,
		couponsLoading,
		activeModal,
		planModalMode,
		editingPlan,
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
	} = useAdminBillingPage();

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
			<BillingTopbar onNewPlan={openCreatePlanModal} onNewCoupon={openCreateCouponModal} />

			<div className="px-[22px] py-5 pb-10 max-sm:px-3 max-sm:pb-8">
				{/* KPI */}
				<BillingKpiRow stats={stats} isLoading={statsLoading} />

				{/* Plans */}
				<BillingPlansGrid
					plans={plans}
					isLoading={plansLoading}
					onEdit={openEditPlanModal}
					onEditLimits={openLimitsModal}
					onDeactivate={handleDeactivatePlan}
				/>

				{/* Two-column: limits + (coupons + revenue) */}
				<div className="mb-4 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
					<BillingLimitsMatrix plans={plans} isLoading={plansLoading} />

					<div className="flex flex-col gap-4">
						<BillingCouponsList
							coupons={coupons}
							isLoading={couponsLoading}
							onAdd={openCreateCouponModal}
							onDelete={handleDeleteCoupon}
						/>
						<BillingRevenueChart items={revenue} isLoading={revenueLoading} />
					</div>
				</div>

				{/* Subscriptions */}
				<BillingSubscriptionsTable
					items={subscriptions?.items ?? []}
					total={subscriptions?.total ?? 0}
					activeCount={subscriptionActiveCount}
					isLoading={subsLoading}
				/>
			</div>

			{/* Modals */}
			<BillingPlanModal
				open={activeModal === "plan"}
				mode={planModalMode}
				plan={editingPlan}
				isPending={
					mutations.createPlan.isPending || mutations.updatePlan.isPending
				}
				onClose={closeModal}
				onSubmit={handlePlanSubmit}
			/>

			<BillingCouponModal
				open={activeModal === "coupon"}
				isPending={mutations.createCoupon.isPending}
				onClose={closeModal}
				onSubmit={handleCouponSubmit}
			/>

			<BillingLimitsModal
				open={activeModal === "limits"}
				plan={editingPlan}
				isPending={mutations.updatePlanLimits.isPending}
				onClose={closeModal}
				onSubmit={handleLimitsSubmit}
			/>
		</div>
	);
};
