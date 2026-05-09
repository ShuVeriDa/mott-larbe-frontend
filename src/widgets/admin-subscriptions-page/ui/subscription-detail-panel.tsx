"use client";

import { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { adminUserApi } from "@/entities/admin-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSubscriptionKeys } from "@/entities/admin-subscription";
import type {
	AdminSubscriptionDetail,
	PlanType,
	SubscriptionStatus,
} from "@/entities/admin-subscription";
import { SubscriptionHeroSection } from "./subscription-hero-section";
import { SubscriptionAccountSection } from "./subscription-account-section";
import { SubscriptionRolesSection } from "./subscription-roles-section";
import { SubscriptionPlanSection } from "./subscription-plan-section";
import { SubscriptionPaymentsSection } from "./subscription-payments-section";
import { SubscriptionEventsSection } from "./subscription-events-section";
import { SubscriptionActionsSection } from "./subscription-actions-section";

interface Props {
	sub: AdminSubscriptionDetail | null;
	isLoading: boolean;
	userId: string;
	onExtend: (id: string) => void;
	onCancel: (id: string) => void;
}

const Skeleton = ({ className }: { className: string }) => (
	<div className={`animate-pulse rounded bg-surf-3 ${className}`} />
);

export const SubscriptionDetailPanel = ({ sub, isLoading, userId, onExtend, onCancel }: Props) => {
	const { t } = useI18n();
	const router = useRouter();
	const qc = useQueryClient();

	const revokeRole = useMutation({
		mutationFn: ({ roleId }: { roleId: string }) =>
			adminUserApi.revokeRole(userId, roleId),
		onSuccess: () => qc.invalidateQueries({ queryKey: adminSubscriptionKeys.detail(sub?.id ?? "") }),
	});

	const logoutAll = useMutation({
		mutationFn: () => adminUserApi.logoutAll(userId),
	});

	const freeze = useMutation({
		mutationFn: () => adminUserApi.freeze(userId),
		onSuccess: () => qc.invalidateQueries({ queryKey: adminSubscriptionKeys.detail(sub?.id ?? "") }),
	});

	const applyCoupon = useMutation({
		mutationFn: (code: string) => adminUserApi.applyCoupon(userId, code),
	});

	const planLabels: Record<NonNullable<PlanType>, string> = {
		FREE: t("admin.users.plans.free"),
		BASIC: t("admin.users.plans.basic"),
		PRO: t("admin.users.plans.pro"),
		PREMIUM: t("admin.users.plans.premium"),
		LIFETIME: t("admin.users.plans.lifetime"),
	};

	const statusLabels: Record<SubscriptionStatus, string> = {
		ACTIVE: t("admin.subscriptions.status.active"),
		TRIALING: t("admin.subscriptions.status.trialing"),
		CANCELED: t("admin.subscriptions.status.canceled"),
		EXPIRED: t("admin.subscriptions.status.expired"),
	};

	if (isLoading || !sub) {
		return (
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
				<div className="border-b border-bd-1 px-[15px] py-4">
					<Skeleton className="mb-2.5 size-11 rounded-full" />
					<Skeleton className="mb-1.5 h-3.5 w-32" />
					<Skeleton className="h-3 w-44" />
				</div>
				<div className="px-[15px] py-3 space-y-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-3 w-full" />
					))}
				</div>
			</div>
		);
	}

	const handleRevokeRole = (roleId: string) => revokeRole.mutate({ roleId });
	const handleApplyCoupon = (code: string) => applyCoupon.mutate(code);
	const handleGoToProfile: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		router.push(`/admin/users/${userId}`);

	return (
		<div className="flex flex-col gap-2.5">
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
				<SubscriptionHeroSection
					sub={sub}
					statusLabels={statusLabels}
					planLabels={planLabels}
				/>
				<SubscriptionAccountSection
					sub={sub}
					labels={{
						sectionTitle: t("admin.subscriptions.detail.account"),
						userId: t("admin.subscriptions.detail.userId"),
						registered: t("admin.subscriptions.detail.registered"),
						lastSeen: t("admin.subscriptions.detail.lastSeen"),
						provider: t("admin.subscriptions.detail.provider"),
					}}
				/>
				<SubscriptionRolesSection
					sub={sub}
					sectionTitle={t("admin.subscriptions.detail.roles")}
					isRevokePending={revokeRole.isPending}
					onRevokeRole={handleRevokeRole}
				/>
				<SubscriptionPlanSection
					sub={sub}
					labels={{
						sectionTitle: t("admin.subscriptions.detail.subscription"),
						lifetime: t("admin.subscriptions.detail.lifetime"),
						oneTime: t("admin.subscriptions.detail.oneTime"),
						nextBilling: t("admin.subscriptions.detail.nextBilling"),
						amount: t("admin.subscriptions.detail.amount"),
						startDate: t("admin.subscriptions.detail.startDate"),
						endDate: t("admin.subscriptions.detail.endDate"),
						canceledAt: t("admin.subscriptions.detail.canceledAt"),
						extendAction: t("admin.subscriptions.actions.extend"),
						couponAction: t("admin.subscriptions.detail.coupon"),
						cancelAction: t("admin.subscriptions.actions.cancel"),
						couponPrompt: t("admin.subscriptions.detail.coupon"),
					}}
					isApplyCouponPending={applyCoupon.isPending}
					onExtend={onExtend}
					onCancel={onCancel}
					onApplyCoupon={handleApplyCoupon}
				/>
				<SubscriptionPaymentsSection
					sub={sub}
					sectionTitle={t("admin.subscriptions.detail.payments")}
				/>
				<SubscriptionEventsSection
					sub={sub}
					sectionTitle={t("admin.subscriptions.detail.events")}
				/>
				<SubscriptionActionsSection
					labels={{
						goToProfile: t("admin.subscriptions.detail.goToProfile"),
						resetSessions: t("admin.subscriptions.detail.resetSessions"),
						freezeAccount: t("admin.subscriptions.detail.freezeAccount"),
					}}
					isLogoutPending={logoutAll.isPending}
					isFreezePending={freeze.isPending}
					onGoToProfile={handleGoToProfile}
					onLogoutAll={() => logoutAll.mutate()}
					onFreeze={() => freeze.mutate()}
				/>
			</div>
		</div>
	);
};
