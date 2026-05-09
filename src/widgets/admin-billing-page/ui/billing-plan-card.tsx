"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminPlan, PlanType } from "@/entities/admin-billing";

const PLAN_COLORS: Record<PlanType, string> = {
	FREE: "bg-surf-4 text-t-2",
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

const PLAN_BAR_COLORS: Record<PlanType, string> = {
	FREE: "bg-surf-4",
	BASIC: "bg-acc",
	PRO: "bg-grn",
	PREMIUM: "bg-pur",
	LIFETIME: "bg-amb",
};

const fmtPrice = (cents: number) =>
	cents === 0 ? "0 ₽" : `${(cents / 100).toLocaleString("ru-RU")} ₽`;

interface BillingPlanCardProps {
	plan: AdminPlan;
	maxSubscribers: number;
	onEdit: (plan: AdminPlan) => void;
	onEditLimits: (plan: AdminPlan) => void;
	onDeactivate: (id: string) => void;
}

export const BillingPlanCard = ({
	plan,
	maxSubscribers,
	onEdit,
	onEditLimits,
	onDeactivate,
}: BillingPlanCardProps) => {
	const { t } = useI18n();
	const pct = maxSubscribers > 0
		? Math.max(Math.round((plan.subscriberCount / maxSubscribers) * 100), plan.subscriberCount > 0 ? 4 : 0)
		: 0;
	const colorClass = PLAN_COLORS[plan.type] ?? "bg-surf-3 text-t-2";
	const barColor = PLAN_BAR_COLORS[plan.type] ?? "bg-surf-3";

		const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onEdit(plan);
	const handleClick2: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onEditLimits(plan);
	const handleClick3: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onDeactivate(plan.id);
return (
		<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf transition-[box-shadow,border-color] hover:border-bd-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
			{/* Top */}
			<div className="border-b border-bd-1 p-3.5">
				<div
					className={`mb-2.5 inline-flex h-8 w-8 items-center justify-center rounded-[9px] text-[11px] font-bold ${colorClass}`}
				>
					{plan.code[0]}
				</div>
				<div className="text-[13px] font-semibold text-t-1">{plan.name}</div>
				<div className="mt-0.5 font-mono text-[10.5px] text-t-3">{plan.code}</div>
			</div>

			{/* Mid */}
			<div className="border-b border-bd-1 px-3.5 py-3">
				<div className="mb-2 flex items-baseline gap-1">
					<span className="text-[18px] font-semibold text-t-1">
						{fmtPrice(plan.priceCents)}
					</span>
					<span className="text-[11px] text-t-3">/мес</span>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="text-[13px] font-semibold text-t-1">
						{plan.subscriberCount.toLocaleString("ru-RU")}
					</span>
					<span className="text-[11px] text-t-3">
						{t("admin.plans.plansSection.subscribers")}
					</span>
				</div>
				<div className="mt-2 h-1 overflow-hidden rounded-full bg-surf-3">
					<div
						className={`h-full rounded-full transition-all duration-500 ${barColor}`}
						style={{ width: `${pct}%` }}
					/>
				</div>
			</div>

			{/* Features */}
			{plan.highlightFeatures && plan.highlightFeatures.length > 0 && (
				<div className="px-3.5 py-2.5">
					{plan.highlightFeatures.slice(0, 3).map((feat) => (
						<div key={feat} className="mb-1 flex items-center gap-1.5 last:mb-0">
							<svg
								width="11"
								height="11"
								viewBox="0 0 12 12"
								fill="none"
								className="shrink-0 text-grn-t"
							>
								<path
									d="M2 6l3 3 5-5"
									stroke="currentColor"
									strokeWidth="1.4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<span className="text-[11px] text-t-2">{feat}</span>
						</div>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="flex gap-1.5 border-t border-bd-1 px-3.5 py-2.5">
				<button
					onClick={handleClick}
					className="flex h-[26px] flex-1 items-center justify-center rounded-base bg-surf-2 text-[11.5px] font-medium text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
				>
					{t("admin.plans.plansSection.edit")}
				</button>
				<button
					onClick={handleClick2}
					className="flex h-[26px] flex-1 items-center justify-center rounded-base bg-surf-2 text-[11.5px] font-medium text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
				>
					{t("admin.plans.plansSection.limits")}
				</button>
				{plan.isActive && (
					<button
						onClick={handleClick3}
						className="flex h-[26px] items-center justify-center rounded-base border border-bd-2 px-2 text-[11.5px] font-medium text-red-t transition-colors hover:bg-red-bg"
					>
						{t("admin.plans.plansSection.deactivate")}
					</button>
				)}
			</div>
		</div>
	);
};

export const BillingPlanCardSkeleton = () => (
	<div className="overflow-hidden rounded-[12px] border border-bd-1 bg-surf">
		<div className="border-b border-bd-1 p-3.5">
			<div className="mb-2.5 h-8 w-8 animate-pulse rounded-[9px] bg-surf-3" />
			<div className="h-3.5 w-20 animate-pulse rounded bg-surf-3" />
			<div className="mt-1 h-2.5 w-12 animate-pulse rounded bg-surf-3" />
		</div>
		<div className="border-b border-bd-1 px-3.5 py-3">
			<div className="mb-2 h-5 w-16 animate-pulse rounded bg-surf-3" />
			<div className="h-3 w-12 animate-pulse rounded bg-surf-3" />
			<div className="mt-2 h-1 w-full animate-pulse rounded-full bg-surf-3" />
		</div>
	</div>
);
