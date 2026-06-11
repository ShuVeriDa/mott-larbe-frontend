"use client";

import type { DashboardPlan } from "@/entities/dashboard";
import { UserMenu } from "@/features/user-menu";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";

const TG_HREF = "https://t.me/shuverida";

interface SideNavFooterProps {
	isCompactMode: boolean;
	plan: DashboardPlan | undefined;
}

export const SideNavFooter = ({ isCompactMode, plan }: SideNavFooterProps) => {
	const { t, lang } = useI18n();

	return (
		<>
			<div
				className={cn(
					"px-3.5 pb-3.5 pt-2",
					isCompactMode && "max-[899px]:hidden",
				)}
			>
				{plan ? (
					<div className="rounded-[9px] border-[0.5px] border-bd-1 bg-surf-2 p-3">
						<div className="mb-1 text-xs font-semibold text-t-1">
							{plan.name}
						</div>
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

			<div className={cn("border-t", isCompactMode && "max-[899px]:hidden")}>
				<a
					href={TG_HREF}
					target="_blank"
					rel="noopener noreferrer"
					className="group flex items-center gap-2.5 rounded-[8px] px-3.5 py-2 transition-colors hover:bg-[#229ED9]/8"
				>
					<span className="flex size-[28px] shrink-0 items-center justify-center rounded-full bg-[#229ED9]/12 transition-colors group-hover:bg-[#229ED9]/22">
						<svg
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-[15px] text-[#229ED9]"
							aria-hidden="true"
						>
							<path d="M21.94 4.4l-3.04 14.36c-.23 1.02-.83 1.27-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.34-4.74L18.4 6.2c.38-.34-.08-.53-.59-.19L7.07 12.7l-4.69-1.47c-1.02-.32-1.04-1.02.21-1.51L20.65 3.13c.85-.32 1.6.2 1.29 1.27z" />
						</svg>
					</span>
					<div className="min-w-0 flex-1">
						<Typography className="truncate text-[11.5px] font-semibold leading-[1.3] text-t-1">
							ShuVeriDa
						</Typography>
						<Typography className="truncate text-[10.5px] leading-[1.4] text-t-3">
							Этот проект — моя работа
						</Typography>
						<Typography className="truncate text-[10.5px] leading-normal text-[#229ED9]/80 transition-colors group-hover:text-[#229ED9]">
							Хотите такой же? Напишите →
						</Typography>
					</div>
				</a>
			</div>

			<div className="border-t border-bd-1">
				<UserMenu isCompactMode={isCompactMode} />
			</div>
		</>
	);
};
