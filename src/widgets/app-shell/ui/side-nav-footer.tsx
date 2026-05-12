"use client";

import type { DashboardPlan } from "@/entities/dashboard";
import { UserMenu } from "@/features/user-menu";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

interface SideNavFooterProps {
	isCompactMode: boolean;
	plan: DashboardPlan | undefined;
}

export const SideNavFooter = ({ isCompactMode, plan }: SideNavFooterProps) => {
	const { t, lang } = useI18n();

	return (
		<>
			<div className={cn("px-3.5 pb-3.5 pt-2", isCompactMode && "max-[899px]:hidden")}>
				{plan ? (
					<div className="rounded-[9px] border-hairline border-bd-1 bg-surf-2 p-3">
						<div className="mb-1 text-xs font-semibold text-t-1">{plan.name}</div>
						{plan.isPremium ? (
							<Typography className="text-[11px] leading-[1.55] text-t-3">
								{t("nav.premiumPlan")}
							</Typography>
						) : (
							<>
								<Typography className="mb-[5px] text-[11px] leading-[1.55] text-t-3">
									{plan.translationsLimit != null
										? t("nav.planTranslations", {
												used: plan.translationsToday,
												limit: plan.translationsLimit,
											})
										: plan.translationsToday}
								</Typography>
								{plan.translationsLimit != null ? (
									<div className="mb-2.5 h-[3px] overflow-hidden rounded-full bg-surf-3">
										<div
											className="h-full rounded-full bg-acc transition-[width]"
											style={{
												width: `${Math.min(100, Math.round((plan.translationsToday / plan.translationsLimit) * 100))}%`,
											}}
										/>
									</div>
								) : (
									<div className="mb-2.5" />
								)}
								<Link
									href={`/${lang}/subscription`}
									className="block h-7 w-full rounded-md bg-acc text-center text-[11.5px] font-semibold leading-7 text-white transition-opacity hover:opacity-[0.88]"
								>
									{t("nav.upgrade")}
								</Link>
							</>
						)}
					</div>
				) : (
					<div className="h-[88px] animate-pulse rounded-[9px] bg-surf-2" />
				)}
			</div>

			<div className="border-t border-bd-1">
				<UserMenu isCompactMode={isCompactMode} />
			</div>
		</>
	);
};
