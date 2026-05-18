import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type {
	AdminSubscriptionListItem,
	PlanType,
	SubscriptionStatus,
} from "@/entities/admin-subscription";
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { SubscriptionPlanChip } from "./subscription-plan-chip";
import { SubscriptionProviderBadge } from "./subscription-provider-badge";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/shared/ui/table";
interface Props {
	items: AdminSubscriptionListItem[];
	selectedId: string | null;
	isLoading: boolean;
	onSelectRow: (id: string) => void;
	onExtend: (id: string) => void;
	onCancel: (id: string) => void;
}

const formatDate = (date: string | null, fallback = "∞") => {
	if (!date) return fallback;
	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

const formatAmount = (
	payments: AdminSubscriptionListItem["payments"],
): string => {
	const last = payments[0];
	if (!last) return "—";
	const amount = (last.amountCents / 100).toLocaleString("ru-RU");
	return `${amount} ${last.currency}`;
};

export const SubscriptionsTable = ({
	items,
	selectedId,
	isLoading,
	onSelectRow,
	onExtend,
	onCancel,
}: Props) => {
	const { t } = useI18n();

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

	if (isLoading) {
		return (
			<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
				<Table className="border-collapse text-[13px]" aria-busy="true" aria-label="Loading subscriptions">
					<TableBody>
						{Array.from({ length: 10 }).map((_, i) => (
							<TableRow key={i} className="border-b border-bd-1">
								<TableCell className="px-3.5 py-[9px]">
									<div className="flex items-center gap-2">
										<div className="size-7 animate-pulse rounded-full bg-surf-3" />
										<div className="space-y-1">
											<div className="h-3 w-28 animate-pulse rounded bg-surf-3" />
											<div className="h-2 w-36 animate-pulse rounded bg-surf-3" />
										</div>
									</div>
								</TableCell>
								{Array.from({ length: 5 }).map((_, j) => (
									<TableCell key={j} className="px-3.5 py-[9px]">
										<div className="h-4 w-16 animate-pulse rounded bg-surf-3" />
									</TableCell>
								))}
								<TableCell className="px-3.5 py-[9px]" />
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
			<Table className="border-collapse text-[12.5px]" aria-label={t("admin.subscriptions.table.user")}>
				<TableHeader>
					<TableRow className="border-b border-bd-1">
						<TableHead
							className="px-3.5 py-[9px] text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 200 }}
						>
							{t("admin.subscriptions.table.user")}
						</TableHead>
						<TableHead className="px-3.5 py-[9px] text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.subscriptions.table.plan")}
						</TableHead>
						<TableHead className="px-3.5 py-[9px] text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.subscriptions.table.status")}
						</TableHead>
						<TableHead className="px-3.5 py-[9px] text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap max-md:hidden">
							{t("admin.subscriptions.table.provider")}
						</TableHead>
						<TableHead className="px-3.5 py-[9px] text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap max-sm:hidden">
							{t("admin.subscriptions.table.nextBilling")}
						</TableHead>
						<TableHead className="px-3.5 py-[9px] text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.subscriptions.table.amount")}
						</TableHead>
						<TableHead
							className="px-3.5 py-[9px] pr-3.5 text-right"
							style={{ width: 120 }}
						/>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={7}
								className="px-3.5 py-7 text-center text-[12.5px] text-t-3"
							>
								{t("admin.subscriptions.table.empty")}
							</TableCell>
						</TableRow>
					) : (
						items.map((sub) => {
							const isSelected = sub.id === selectedId;
							const isExpired = sub.status === "EXPIRED";
							const isCanceled = sub.status === "CANCELED";
							const canExtend = !sub.isLifetime && (sub.status === "ACTIVE" || sub.status === "TRIALING" || sub.status === "EXPIRED");
							const canCancel = sub.status === "ACTIVE" || sub.status === "TRIALING";

								const handleRowClick: NonNullable<ComponentProps<"tr">["onClick"]> = () => onSelectRow(sub.id);
							const handleActionsClick: NonNullable<ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
							const handleExtendClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onExtend(sub.id);
							const handleCancelClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onCancel(sub.id);
							return (
								<TableRow
									key={sub.id}
									onClick={handleRowClick}
									className={cn(
										"cursor-pointer border-b border-bd-1 transition-colors last:border-b-0",
										isSelected ? "bg-acc-bg" : "hover:bg-surf-2",
									)}
								>
									{/* User */}
									<TableCell className="px-3.5 py-[9px]">
										<div className="flex items-center gap-2">
											<div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-surf-3 text-[9.5px] font-bold text-t-2">
												{(sub.user.name[0] ?? "") + (sub.user.surname[0] ?? "")}
											</div>
											<div>
												<div
													className={cn(
														"text-[12.5px] font-medium text-t-1 whitespace-nowrap",
														(isExpired || isCanceled) && "opacity-60",
													)}
												>
													{sub.user.name} {sub.user.surname}
												</div>
												<div className="mt-px text-[11px] text-t-3 whitespace-nowrap">
													{sub.user.email}
												</div>
											</div>
										</div>
									</TableCell>

									{/* Plan */}
									<TableCell className="px-3.5 py-[9px]">
										<SubscriptionPlanChip
											plan={sub.plan.type}
											label={sub.plan.type ? (planLabels[sub.plan.type] ?? sub.plan.name) : sub.plan.name}
										/>
									</TableCell>

									{/* Status */}
									<TableCell className="px-3.5 py-[9px]">
										<SubscriptionStatusBadge
											status={sub.status}
											label={statusLabels[sub.status]}
										/>
									</TableCell>

									{/* Provider */}
									<TableCell className="px-3.5 py-[9px] max-md:hidden">
										<SubscriptionProviderBadge provider={sub.provider} />
									</TableCell>

									{/* Next billing */}
									<TableCell className="px-3.5 py-[9px] max-sm:hidden">
										<Typography tag="span"
											className={cn(
												"text-[12.5px]",
												isExpired ? "text-red-t" : "text-t-1",
											)}
										>
											{sub.isLifetime
												? "∞"
												: isExpired || isCanceled
												? formatDate(sub.endDate)
												: formatDate(sub.endDate)}
										</Typography>
									</TableCell>

									{/* Amount */}
									<TableCell className="px-3.5 py-[9px] text-[12.5px] font-medium text-t-1">
										{formatAmount(sub.payments)}
									</TableCell>

									{/* Actions */}
									<TableCell
										className="px-3.5 py-[9px] pr-3.5 text-right"
										onClick={handleActionsClick}
									>
										<div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 [tr:hover_&]:opacity-100">
											{canExtend && (
												<Button
													onClick={handleExtendClick}
													className="h-6 rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 whitespace-nowrap"
												>
													{t("admin.subscriptions.actions.extend")}
												</Button>
											)}
											{canCancel && (
												<Button
													onClick={handleCancelClick}
													className="h-6 rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg whitespace-nowrap"
												>
													{t("admin.subscriptions.actions.cancel")}
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							);
						})
					)}
				</TableBody>
			</Table>
		</div>
	);
};
