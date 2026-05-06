"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { adminUserApi } from "@/entities/admin-user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSubscriptionKeys } from "@/entities/admin-subscription";
import type {
	AdminSubscriptionDetail,
	PaymentProvider,
	PlanType,
	SubscriptionEventType,
	SubscriptionStatus,
} from "@/entities/admin-subscription";
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { SubscriptionPlanChip } from "./subscription-plan-chip";
import { SubscriptionProviderBadge } from "./subscription-provider-badge";

interface Props {
	sub: AdminSubscriptionDetail | null;
	isLoading: boolean;
	userId: string;
	onExtend: (id: string) => void;
	onCancel: (id: string) => void;
}

const PROVIDER_COLORS: Record<PaymentProvider, string> = {
	STRIPE: "#635bff",
	PAYPAL: "#0070ba",
	PADDLE: "#07a3b1",
	LEMONSQUEEZY: "#f6b60d",
	MANUAL: "#a5a39a",
};

const PLAN_ICON_STYLES: Record<NonNullable<PlanType>, { bg: string; text: string }> = {
	FREE: { bg: "bg-surf-3", text: "text-t-3" },
	BASIC: { bg: "bg-acc-bg", text: "text-acc-t" },
	PRO: { bg: "bg-grn-bg", text: "text-grn-t" },
	PREMIUM: { bg: "bg-pur-bg", text: "text-pur-t" },
	LIFETIME: { bg: "bg-amb-bg", text: "text-amb-t" },
};

const EVENT_STYLES: Record<SubscriptionEventType, { dot: string; icon: string }> = {
	SUBSCRIBED:    { dot: "bg-grn-t", icon: "✦" },
	RENEWED:       { dot: "bg-grn-t", icon: "↻" },
	UPGRADED:      { dot: "bg-pur-t", icon: "↑" },
	DOWNGRADED:    { dot: "bg-amb-t", icon: "↓" },
	CANCELED:      { dot: "bg-red-t", icon: "×" },
	REFUNDED:      { dot: "bg-amb-t", icon: "↩" },
	TRIAL_STARTED: { dot: "bg-acc-t", icon: "◎" },
	TRIAL_ENDED:   { dot: "bg-t-3",   icon: "○" },
	EXTENDED:      { dot: "bg-grn-t", icon: "+" },
	PLAN_CHANGED:  { dot: "bg-pur-t", icon: "⇄" },
};

const LEARNER_ROLE = "learner";

const formatDate = (date: string | null, fallback = "—") => {
	if (!date) return fallback;
	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const formatDateShort = (date: string) =>
	new Date(date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

const formatAmount = (cents: number, currency: string) =>
	`${(cents / 100).toLocaleString("ru-RU")} ${currency}`;

const SectionTitle = ({ label }: { label: string }) => (
	<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
		{label}
	</div>
);

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

	const planStyle = sub.plan.type ? PLAN_ICON_STYLES[sub.plan.type] : { bg: "bg-surf-3", text: "text-t-3" };
	const canExtend = !sub.isLifetime && (sub.status === "ACTIVE" || sub.status === "TRIALING" || sub.status === "EXPIRED");
	const canCancel = sub.status === "ACTIVE" || sub.status === "TRIALING";
	const initials = (sub.user.name[0] ?? "") + (sub.user.surname[0] ?? "");

	return (
		<div className="flex flex-col gap-2.5">
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">

				{/* Hero */}
				<div className="border-b border-bd-1 px-[15px] py-4">
					<div className="mb-2.5 flex size-11 items-center justify-center rounded-full bg-surf-3 text-[14px] font-bold text-t-2">
						{initials}
					</div>
					<div className="mb-0.5 text-[14.5px] font-semibold text-t-1">
						{sub.user.name} {sub.user.surname}
					</div>
					<div className="mb-2.5 text-[11.5px] text-t-3">{sub.user.email}</div>
					<div className="flex flex-wrap gap-1">
						<SubscriptionStatusBadge status={sub.status} label={statusLabels[sub.status]} />
						{sub.plan.type && (
							<SubscriptionPlanChip plan={sub.plan.type} label={planLabels[sub.plan.type]} />
						)}
					</div>
				</div>

				{/* Account */}
				<div className="border-b border-bd-1 px-[15px] py-2.5">
					<SectionTitle label={t("admin.subscriptions.detail.account")} />
					<div className="space-y-1.5">
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.userId")}</span>
							<span className="font-mono text-[11px] text-t-3">{sub.userId.slice(0, 16)}…</span>
						</div>
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.registered")}</span>
							<span className="text-[12px] font-medium text-t-1">{formatDate(sub.user.signupAt)}</span>
						</div>
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.lastSeen")}</span>
							<span className="text-[12px] font-medium text-t-1">{formatDate(sub.user.lastActiveAt)}</span>
						</div>
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.provider")}</span>
							<SubscriptionProviderBadge provider={sub.provider} />
						</div>
					</div>
				</div>

				{/* Roles */}
				{sub.user.roles.length > 0 && (
					<div className="border-b border-bd-1 px-[15px] py-2.5">
						<SectionTitle label={t("admin.subscriptions.detail.roles")} />
						<div className="flex flex-wrap gap-1">
							{sub.user.roles.map((r) => {
								const isLearner = r.role.name === LEARNER_ROLE;
								return (
									<span
										key={r.id}
										className="flex items-center gap-1 rounded-[5px] border border-bd-2 bg-surf-2 px-1.5 py-0.5 text-[11px] text-t-2"
									>
										{r.role.name}
										{!isLearner && (
											<button
												type="button"
												onClick={() => revokeRole.mutate({ roleId: r.id })}
												disabled={revokeRole.isPending}
												className="ml-0.5 text-[10px] text-t-3 transition-colors hover:text-red-t disabled:opacity-40"
												aria-label={`Remove ${r.role.name}`}
											>
												×
											</button>
										)}
									</span>
								);
							})}
						</div>
					</div>
				)}

				{/* Subscription */}
				<div className="border-b border-bd-1 px-[15px] py-2.5">
					<SectionTitle label={t("admin.subscriptions.detail.subscription")} />
					<div className="mb-2.5 flex items-start gap-2.5">
						<div className={`flex size-[30px] shrink-0 items-center justify-center rounded-lg ${planStyle.bg}`}>
							<svg className={`size-[14px] ${planStyle.text}`} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
								<rect x="1" y="2.5" width="12" height="9" rx="1.5" />
								<path d="M1 5.5h12" strokeLinecap="round" />
								<path d="M3.5 8.5h4" strokeLinecap="round" />
							</svg>
						</div>
						<div>
							<div className="text-[13px] font-semibold text-t-1">{sub.plan.name}</div>
							<div className="text-[11px] leading-relaxed text-t-3">
								{sub.isLifetime ? t("admin.subscriptions.detail.lifetime") : sub.plan.interval ?? t("admin.subscriptions.detail.oneTime")}
							</div>
						</div>
					</div>
					<div className="space-y-1.5">
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.nextBilling")}</span>
							<span className="text-[12px] font-medium text-t-1">
								{sub.isLifetime ? "∞" : formatDate(sub.endDate)}
							</span>
						</div>
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.amount")}</span>
							<span className="text-[12px] font-medium text-t-1">
								{formatAmount(sub.plan.priceCents, sub.plan.currency)}
							</span>
						</div>
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.startDate")}</span>
							<span className="text-[12px] font-medium text-t-1">{formatDate(sub.startDate)}</span>
						</div>
						<div className="flex items-baseline justify-between gap-2">
							<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.endDate")}</span>
							<span className="text-[12px] font-medium text-t-1">
								{sub.isLifetime ? "∞" : formatDate(sub.endDate)}
							</span>
						</div>
						{sub.canceledAt && (
							<div className="flex items-baseline justify-between gap-2">
								<span className="text-[11.5px] text-t-3">{t("admin.subscriptions.detail.canceledAt")}</span>
								<span className="text-[12px] font-medium text-red-t">{formatDate(sub.canceledAt)}</span>
							</div>
						)}
					</div>
					{/* Subscription actions */}
					<div className="mt-2.5 flex flex-wrap gap-1.5">
						{canExtend && (
							<button
								type="button"
								onClick={() => onExtend(sub.id)}
								className="flex h-[28px] items-center gap-1 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							>
								{t("admin.subscriptions.actions.extend")}
							</button>
						)}
						<button
							type="button"
							onClick={() => {
								const code = window.prompt(t("admin.subscriptions.detail.coupon"));
								if (code?.trim()) applyCoupon.mutate(code.trim());
							}}
							disabled={applyCoupon.isPending}
							className="flex h-[28px] items-center gap-1 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-60"
						>
							{t("admin.subscriptions.detail.coupon")}
						</button>
						{canCancel && (
							<button
								type="button"
								onClick={() => onCancel(sub.id)}
								className="flex h-[28px] items-center gap-1 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[11.5px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
							>
								{t("admin.subscriptions.actions.cancel")}
							</button>
						)}
					</div>
				</div>

				{/* Payment history */}
				{sub.payments.length > 0 && (
					<div className="border-b border-bd-1 px-[15px] py-2.5">
						<SectionTitle label={t("admin.subscriptions.detail.payments")} />
						<div className="space-y-0">
							{sub.payments.map((p) => (
								<div
									key={p.id}
									className="flex items-center gap-1.5 border-b border-bd-1 py-[5px] text-[12px] last:border-b-0 last:pb-0"
								>
									<div
										className="size-1.5 shrink-0 rounded-full"
										style={{ background: PROVIDER_COLORS[p.provider] ?? "#a5a39a" }}
									/>
									<span className="flex-1 font-medium text-t-1">
										{formatAmount(p.amountCents, p.currency)}
									</span>
									{p.refundedCents > 0 && (
										<span className="text-[10.5px] text-red-t">
											−{formatAmount(p.refundedCents, p.currency)}
										</span>
									)}
									<span className="text-[10.5px] text-t-3">
										{formatDateShort(p.createdAt)}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Billing events */}
				{sub.events.length > 0 && (
					<div className="border-b border-bd-1 px-[15px] py-2.5">
						<SectionTitle label={t("admin.subscriptions.detail.events")} />
						<div className="space-y-0">
							{sub.events.map((ev) => {
								const style = EVENT_STYLES[ev.type] ?? { dot: "bg-t-3", icon: "·" };
								return (
									<div key={ev.id} className="flex items-center gap-2 border-b border-bd-1 py-[5px] last:border-b-0 last:pb-0">
										<div className={`size-1.5 shrink-0 rounded-full ${style.dot}`} />
										<span className="flex-1 text-[11.5px] text-t-2">{ev.type}</span>
										<span className="text-[10.5px] text-t-3">{formatDateShort(ev.createdAt)}</span>
									</div>
								);
							})}
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="flex flex-col gap-1.5 px-[15px] py-2.5">
					<button
						type="button"
						onClick={() => router.push(`/admin/users/${userId}`)}
						className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<svg className="size-3 shrink-0 text-t-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
							<circle cx="6" cy="4.5" r="2.5" />
							<path d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" strokeLinecap="round" />
						</svg>
						{t("admin.subscriptions.detail.goToProfile")}
					</button>
					<button
						type="button"
						onClick={() => logoutAll.mutate()}
						disabled={logoutAll.isPending}
						className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-60"
					>
						<svg className="size-3 shrink-0 text-t-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
							<path d="M8 2h2a1 1 0 011 1v6a1 1 0 01-1 1H8" strokeLinecap="round" />
							<path d="M5 8.5L2 6l3-2.5M2 6h6" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{t("admin.subscriptions.detail.resetSessions")}
					</button>
					<button
						type="button"
						onClick={() => freeze.mutate()}
						disabled={freeze.isPending}
						className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[12px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg disabled:opacity-60"
					>
						<svg className="size-3 shrink-0 text-red-t" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
							<path d="M6 1v10M1 6h10M2.5 2.5l7 7M9.5 2.5l-7 7" strokeLinecap="round" />
						</svg>
						{t("admin.subscriptions.detail.freezeAccount")}
					</button>
				</div>
			</div>
		</div>
	);
};
