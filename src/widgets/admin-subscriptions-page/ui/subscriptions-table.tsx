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
				<table className="w-full border-collapse text-[13px]">
					<tbody>
						{Array.from({ length: 10 }).map((_, i) => (
							<tr key={i} className="border-b border-bd-1">
								<td className="px-3.5 py-[9px]">
									<div className="flex items-center gap-2">
										<div className="size-7 animate-pulse rounded-full bg-surf-3" />
										<div className="space-y-1">
											<div className="h-3 w-28 animate-pulse rounded bg-surf-3" />
											<div className="h-2 w-36 animate-pulse rounded bg-surf-3" />
										</div>
									</div>
								</td>
								{Array.from({ length: 5 }).map((_, j) => (
									<td key={j} className="px-3.5 py-[9px]">
										<div className="h-4 w-16 animate-pulse rounded bg-surf-3" />
									</td>
								))}
								<td className="px-3.5 py-[9px]" />
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto [&::-webkit-scrollbar]:h-0 max-sm:hidden">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<tr className="border-b border-bd-1">
						<th
							className="px-3.5 py-[9px] text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap"
							style={{ width: 200 }}
						>
							{t("admin.subscriptions.table.user")}
						</th>
						<th className="px-3.5 py-[9px] text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.subscriptions.table.plan")}
						</th>
						<th className="px-3.5 py-[9px] text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.subscriptions.table.status")}
						</th>
						<th className="px-3.5 py-[9px] text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap max-md:hidden">
							{t("admin.subscriptions.table.provider")}
						</th>
						<th className="px-3.5 py-[9px] text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap max-sm:hidden">
							{t("admin.subscriptions.table.nextBilling")}
						</th>
						<th className="px-3.5 py-[9px] text-left text-[10.5px] font-semibold uppercase tracking-[0.3px] text-t-3 whitespace-nowrap">
							{t("admin.subscriptions.table.amount")}
						</th>
						<th
							className="px-3.5 py-[9px] pr-3.5 text-right"
							style={{ width: 120 }}
						/>
					</tr>
				</thead>
				<tbody>
					{items.length === 0 ? (
						<tr>
							<td
								colSpan={7}
								className="px-3.5 py-7 text-center text-[12.5px] text-t-3"
							>
								{t("admin.subscriptions.table.empty")}
							</td>
						</tr>
					) : (
						items.map((sub) => {
							const isSelected = sub.id === selectedId;
							const isExpired = sub.status === "EXPIRED";
							const isCanceled = sub.status === "CANCELED";
							const canExtend = !sub.isLifetime && (sub.status === "ACTIVE" || sub.status === "TRIALING" || sub.status === "EXPIRED");
							const canCancel = sub.status === "ACTIVE" || sub.status === "TRIALING";

														const handleClick: NonNullable<React.ComponentProps<"tr">["onClick"]> = () => onSelectRow(sub.id);
							const handleClick2: NonNullable<React.ComponentProps<"td">["onClick"]> = (e) => e.stopPropagation();
							const handleClick3: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onExtend(sub.id);
							const handleClick4: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onCancel(sub.id);
return (
								<tr
									key={sub.id}
									onClick={handleClick}
									className={cn(
										"cursor-pointer border-b border-bd-1 transition-colors last:border-b-0",
										isSelected ? "bg-acc-bg" : "hover:bg-surf-2",
									)}
								>
									{/* User */}
									<td className="px-3.5 py-[9px]">
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
									</td>

									{/* Plan */}
									<td className="px-3.5 py-[9px]">
										<SubscriptionPlanChip
											plan={sub.plan.type}
											label={sub.plan.type ? (planLabels[sub.plan.type] ?? sub.plan.name) : sub.plan.name}
										/>
									</td>

									{/* Status */}
									<td className="px-3.5 py-[9px]">
										<SubscriptionStatusBadge
											status={sub.status}
											label={statusLabels[sub.status]}
										/>
									</td>

									{/* Provider */}
									<td className="px-3.5 py-[9px] max-md:hidden">
										<SubscriptionProviderBadge provider={sub.provider} />
									</td>

									{/* Next billing */}
									<td className="px-3.5 py-[9px] max-sm:hidden">
										<span
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
										</span>
									</td>

									{/* Amount */}
									<td className="px-3.5 py-[9px] text-[12.5px] font-medium text-t-1">
										{formatAmount(sub.payments)}
									</td>

									{/* Actions */}
									<td
										className="px-3.5 py-[9px] pr-3.5 text-right"
										onClick={handleClick2}
									>
										<div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 [tr:hover_&]:opacity-100">
											{canExtend && (
												<button
													type="button"
													onClick={handleClick3}
													className="h-6 rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1 whitespace-nowrap"
												>
													{t("admin.subscriptions.actions.extend")}
												</button>
											)}
											{canCancel && (
												<button
													type="button"
													onClick={handleClick4}
													className="h-6 rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg whitespace-nowrap"
												>
													{t("admin.subscriptions.actions.cancel")}
												</button>
											)}
										</div>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
};
