"use client";

import { ComponentProps } from 'react';
import type {
	AdminPaymentDetail,
	AdminPaymentListItem,
	PaymentBackendStatus,
	PaymentProvider,
} from "@/entities/admin-payment";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";

const PROVIDER_COLORS: Record<PaymentProvider, string> = {
	STRIPE: "#635bff",
	PAYPAL: "#0070ba",
	PADDLE: "#07a3b1",
	LEMONSQUEEZY: "#f6b60d",
	MANUAL: "#a5a39a",
};

const STATUS_CFG: Record<
	PaymentBackendStatus,
	{ cls: string; dotCls: string; i18nKey: string }
> = {
	SUCCEEDED: {
		cls: "bg-grn-bg text-grn-t",
		dotCls: "bg-grn",
		i18nKey: "admin.payments.status.paid",
	},
	REFUNDED: {
		cls: "bg-amb-bg text-amb-t",
		dotCls: "bg-amb",
		i18nKey: "admin.payments.status.refunded",
	},
	FAILED: {
		cls: "bg-red-bg text-red-t",
		dotCls: "bg-red",
		i18nKey: "admin.payments.status.failed",
	},
	PENDING: {
		cls: "bg-acc-bg text-acc-t",
		dotCls: "bg-acc",
		i18nKey: "admin.payments.status.pending",
	},
};

const PLAN_CHIP_CFG: Record<string, string> = {
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

const SUB_STATUS_CFG: Record<string, { cls: string; i18nKey: string }> = {
	ACTIVE: {
		cls: "bg-grn-bg text-grn-t",
		i18nKey: "admin.payments.subStatus.active",
	},
	TRIALING: {
		cls: "bg-acc-bg text-acc-t",
		i18nKey: "admin.payments.subStatus.trialing",
	},
	CANCELED: {
		cls: "bg-amb-bg text-amb-t",
		i18nKey: "admin.payments.subStatus.canceled",
	},
	EXPIRED: {
		cls: "bg-surf-3 text-t-2",
		i18nKey: "admin.payments.subStatus.expired",
	},
};

const ROLE_CHIP_CFG: Record<string, string> = {
	Learner: "bg-surf-3 text-t-2",
	Support: "bg-acc-bg text-acc-t",
	Content: "bg-pur-bg text-pur-t",
	Linguist: "bg-amb-bg text-amb-t",
};

const fmtDate = (iso: string | null, fallback = "—") => {
	if (!iso) return fallback;
	return new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const fmtAmount = (item: AdminPaymentListItem): string => {
	if (item.status === "FAILED") return "—";
	try {
		return new Intl.NumberFormat("ru-RU", {
			style: "currency",
			currency: item.currency || "RUB",
			maximumFractionDigits: 0,
		}).format(item.amountCents / 100);
	} catch {
		return `${Math.round(item.amountCents / 100).toLocaleString("ru-RU")} ₽`;
	}
};

const initials = (name: string, surname: string) =>
	`${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase();

interface Props {
	payment: AdminPaymentDetail;
	lang: string;
	isLoading?: boolean;
	onReceipt: (id: string) => void;
	onSendReceipt: (id: string) => void;
	onRefund: (id: string) => void;
}

export const PaymentDetailPanel = ({
	payment,
	lang,
	isLoading,
	onReceipt,
	onSendReceipt,
	onRefund,
}: Props) => {
	const { t } = useI18n();

	const sc = STATUS_CFG[payment.status] ?? STATUS_CFG.PENDING;
	const planName = payment.subscription?.plan?.name ?? "—";
	const provColor = PROVIDER_COLORS[payment.provider] ?? "#a5a39a";
	const amtStr = fmtAmount(payment);
	const amtColor =
		payment.status === "SUCCEEDED"
			? "text-grn-t"
			: payment.status === "REFUNDED"
				? "text-red-t"
				: "text-t-3";

	const userSub = payment.user.subscriptions[0];
	const subStatusCfg = userSub
		? (SUB_STATUS_CFG[userSub.status] ?? SUB_STATUS_CFG.EXPIRED)
		: null;
	const userSubPlanCode = userSub?.plan.type ?? "";
	const userSubPlanChipCls =
		PLAN_CHIP_CFG[userSubPlanCode] ?? "bg-surf-3 text-t-2";
	const userInitials = initials(payment.user.name, payment.user.surname);

	const otherPayments = (payment.user.payments ?? []).slice(0, 3);

	const txIconBg =
		payment.status === "REFUNDED"
			? "bg-amb-bg"
			: payment.status === "FAILED"
				? "bg-red-bg"
				: "bg-grn-bg";
	const txIconColor =
		payment.status === "REFUNDED"
			? "text-amb-t"
			: payment.status === "FAILED"
				? "text-red-t"
				: "text-grn-t";

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
				<div className="space-y-3 p-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-5 animate-pulse rounded bg-surf-3" />
					))}
				</div>
			</div>
		);
	}

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onReceipt(payment.id);
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onSendReceipt(payment.id);
	const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => onRefund(payment.id);
return (
		<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
			{/* Hero */}
			<div className="border-b border-bd-1 px-[15px] py-4">
				<div className="mb-2 flex size-[42px] items-center justify-center rounded-full bg-surf-3 text-[13px] font-bold text-t-2">
					{userInitials}
				</div>
				<div className="mb-0.5 text-[14px] font-semibold text-t-1">
					{payment.user.name} {payment.user.surname}
				</div>
				<div className="mb-2 text-[11.5px] text-t-3">{payment.user.email}</div>
				<div className="flex flex-wrap gap-1">
					{subStatusCfg && (
						<span
							className={cn(
								"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[10.5px] font-semibold",
								subStatusCfg.cls,
							)}
						>
							<span className="size-[5px] rounded-full bg-current" />
							{t(subStatusCfg.i18nKey)}
						</span>
					)}
					{userSubPlanCode && (
						<span
							className={cn(
								"inline-block rounded px-1.5 py-px text-[10px] font-semibold",
								userSubPlanChipCls,
							)}
						>
							{userSub?.plan.code}
						</span>
					)}
				</div>
			</div>

			{/* Account */}
			<div className="border-b border-bd-1 px-[15px] py-2.5">
				<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{t("admin.payments.detail.account")}
				</div>
				<div className="space-y-1.5">
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-[11.5px] text-t-3">
							{t("admin.payments.detail.userId")}
						</span>
						<span className="font-mono text-[11px] text-t-3">
							{payment.user.id.slice(0, 16)}…
						</span>
					</div>
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-[11.5px] text-t-3">
							{t("admin.payments.detail.registered")}
						</span>
						<span className="text-[12px] font-medium text-t-1">
							{fmtDate(payment.user.signupAt)}
						</span>
					</div>
					<div className="flex items-baseline justify-between gap-2">
						<span className="text-[11.5px] text-t-3">
							{t("admin.payments.detail.lastSeen")}
						</span>
						<span className="text-[12px] font-medium text-t-1">
							{fmtDate(payment.user.lastActiveAt)}
						</span>
					</div>
				</div>
			</div>

			{/* Roles */}
			{payment.user.roles.length > 0 && (
				<div className="border-b border-bd-1 px-[15px] py-2.5">
					<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("admin.payments.detail.roles")}
					</div>
					<div className="flex flex-wrap gap-1">
						{payment.user.roles.map(r => (
							<span
								key={r.role.name}
								className={cn(
									"inline-block rounded px-1.5 py-px text-[10px] font-semibold",
									ROLE_CHIP_CFG[r.role.name] ?? "bg-surf-3 text-t-2",
								)}
							>
								{r.role.name}
							</span>
						))}
					</div>
				</div>
			)}

			{/* Transaction */}
			<div className="border-b border-bd-1 px-[15px] py-2.5">
				<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{t("admin.payments.detail.transaction")}
				</div>

				<div className="mb-2.5 rounded-lg border border-bd-1 bg-surf-2 p-3">
					<div className="mb-2 flex items-center gap-2">
						<div
							className={cn(
								"flex size-[30px] shrink-0 items-center justify-center rounded-lg",
								txIconBg,
							)}
						>
							<svg
								className={cn("size-[14px]", txIconColor)}
								viewBox="0 0 14 14"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.4"
							>
								{payment.status === "REFUNDED" ? (
									<path
										d="M2 8l3-3 2 2 3-3 2 2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								) : payment.status === "FAILED" ? (
									<>
										<circle cx="7" cy="7" r="5.5" />
										<path d="M5 5l4 4M9 5l-4 4" strokeLinecap="round" />
									</>
								) : (
									<path
										d="M2.5 7l3 3 6-6"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								)}
							</svg>
						</div>
						<div className="flex-1 text-[13px] font-semibold text-t-1">
							{planName}
						</div>
						<div className={cn("text-[14px] font-bold", amtColor)}>
							{payment.status === "REFUNDED" ? "−" : ""}
							{amtStr}
						</div>
					</div>

					<div className="space-y-[3px]">
						<div className="flex items-center justify-between text-[11.5px]">
							<span className="text-t-3">ID</span>
							<span className="font-mono text-[11px] text-t-2">
								{payment.providerPaymentId}
							</span>
						</div>
						<div className="flex items-center justify-between text-[11.5px]">
							<span className="text-t-3">
								{t("admin.payments.detail.provider")}
							</span>
							<span className="inline-flex items-center gap-1 rounded border border-bd-2 bg-surf px-1.5 py-px text-[10.5px] font-medium text-t-2">
								<span
									className="size-1.5 rounded-full"
									style={{ background: provColor }}
								/>
								{payment.provider}
							</span>
						</div>
						<div className="flex items-center justify-between text-[11.5px]">
							<span className="text-t-3">
								{t("admin.payments.detail.date")}
							</span>
							<span className="font-medium text-t-2">
								{fmtDate(payment.createdAt)}
							</span>
						</div>
						<div className="flex items-center justify-between text-[11.5px]">
							<span className="text-t-3">
								{t("admin.payments.table.status")}
							</span>
							<span
								className={cn(
									"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[10px] font-semibold",
									sc.cls,
								)}
							>
								<span className={cn("size-[5px] rounded-full", sc.dotCls)} />
								{t(sc.i18nKey)}
							</span>
						</div>
					</div>
				</div>

				{/* Other payments */}
				{otherPayments.length > 0 && (
					<div>
						<div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
							{t("admin.payments.detail.otherPayments")}
						</div>
						<div className="space-y-0">
							{otherPayments.map(p => {
								const pSc = STATUS_CFG[p.status] ?? STATUS_CFG.PENDING;
								const pAmtColor =
									p.status === "SUCCEEDED"
										? "text-grn-t"
										: p.status === "REFUNDED"
											? "text-red-t"
											: "text-t-3";
								return (
									<div
										key={p.id}
										className="flex items-center gap-1.5 border-b border-bd-1 py-[5px] text-[11.5px] last:border-b-0 last:pb-0"
									>
										<span
											className={cn(
												"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[9.5px] font-semibold",
												pSc.cls,
											)}
										>
											{t(pSc.i18nKey).slice(0, 3).toUpperCase()}
										</span>
										<span className="flex-1 text-t-2">
											{p.subscription?.plan?.name ?? "—"}
										</span>
										<span className={cn("font-semibold", pAmtColor)}>
											{p.status === "REFUNDED" ? "−" : ""}
											{fmtAmount(p)}
										</span>
										<span className="text-[10.5px] text-t-3">
											{new Date(p.createdAt).toLocaleDateString("ru-RU", {
												day: "numeric",
												month: "short",
											})}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</div>

			{/* Actions */}
			<div className="flex flex-col gap-1.5 px-[15px] py-2.5">
				<div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{t("admin.payments.detail.actions")}
				</div>
				<button
					type="button"
					onClick={handleClick}
					className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					<svg
						className="size-3 shrink-0 text-t-3"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<rect x="1.5" y="1.5" width="9" height="9" rx="1.5" />
						<path d="M4 5h4M4 7h2" strokeLinecap="round" />
					</svg>
					{t("admin.payments.detail.viewReceipt")}
				</button>
				<button
					type="button"
					onClick={handleClick2}
					className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					<svg
						className="size-3 shrink-0 text-t-3"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<path d="M1 3l5 3.5L11 3M1.5 2.5h9a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" />
					</svg>
					{t("admin.payments.detail.sendReceipt")}
				</button>
				<Link
					href={`/${lang}/admin/users/${payment.user.id}`}
					className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-2.5 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
				>
					<svg
						className="size-3 shrink-0 text-t-3"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.3"
					>
						<circle cx="6" cy="4" r="2" />
						<path
							d="M2 10c0-2.21 1.79-4 4-4s4 1.79 4 4"
							strokeLinecap="round"
						/>
					</svg>
					{t("admin.payments.detail.userProfile")}
				</Link>
				{payment.status === "SUCCEEDED" && (
					<button
						type="button"
						onClick={handleClick3}
						className="flex h-[30px] w-full items-center gap-1.5 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[12px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
					>
						<svg
							className="size-3 shrink-0 text-red-t"
							viewBox="0 0 12 12"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.3"
						>
							<path
								d="M1.5 6.5H9a2 2 0 000-4H5.5M1.5 6.5l2-2M1.5 6.5l2 2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{t("admin.payments.detail.issueRefund")}
					</button>
				)}
			</div>
		</div>
	);
};
