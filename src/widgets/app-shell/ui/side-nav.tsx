"use client";

import { useDashboard } from "@/entities/dashboard";
import { UserMenu } from "@/features/user-menu";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	ChartNoAxesCombined,
	House,
	LibraryBig,
	RefreshCw,
	WholeWord,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from 'react';
import { ChechenIcon, GrammarIcon, LogoIcon } from "./nav-icons";
import { NavStreak } from "./nav-streak";
import { NavVocab } from "./nav-vocab";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
	href: string;
	icon: ReactNode;
	labelKey: string;
}

interface NavSection {
	titleKey: string;
	items: NavItem[];
}

const buildSections = (lang: string): NavSection[] => [
	{
		titleKey: "nav.learning",
		items: [
			{
				href: `/${lang}/dashboard`,
				icon: <House className="size-[15px] shrink-0" />,
				labelKey: "nav.home",
			},
			{
				href: `/${lang}/texts`,
				icon: <LibraryBig className="size-[15px] shrink-0" />,
				labelKey: "nav.texts",
			},
			{
				href: `/${lang}/vocabulary`,
				icon: <WholeWord className="size-[15px] shrink-0" />,
				labelKey: "nav.vocabulary",
			},
			{
				href: `/${lang}/review`,
				icon: <RefreshCw className="size-[15px] shrink-0" />,
				labelKey: "nav.review",
			},
			{
				href: `/${lang}/progress`,
				icon: <ChartNoAxesCombined className="size-[15px] shrink-0" />,
				labelKey: "nav.progress",
			},
		],
	},
	{
		titleKey: "nav.language",
		items: [
			{
				href: `/${lang}/language/chechen`,
				icon: <ChechenIcon className="size-[15px] shrink-0" />,
				labelKey: "nav.chechen",
			},
			{
				href: `/${lang}/language/grammar`,
				icon: <GrammarIcon className="size-[15px] shrink-0" />,
				labelKey: "nav.grammar",
			},
		],
	},
];

export const SideNav = () => {
	const { t, lang } = useI18n();
	const pathname = usePathname();
	const sections = buildSections(lang);

	const { data: dashData } = useDashboard();

	const plan = dashData?.plan;
	const stats = dashData?.stats;

	return (
		<nav
			className="flex w-[230px] shrink-0 flex-col overflow-hidden border-hairline border-r border-bd-1 bg-surf transition-colors duration-200 max-lg:w-[190px] max-md:hidden"
			aria-label={t("nav.vocabulary")}
		>
			<div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<div className="flex items-center gap-2.5 border-hairline border-b border-bd-1 px-3.5 py-[16px_14px] pt-4 pb-3.5">
					<LogoIcon />
					<Typography
						tag="span"
						className="font-display text-sm font-medium tracking-[-0.1px] text-t-1"
					>
						Мотт Ларбе
					</Typography>
				</div>

				{sections.map((section, secIdx) => (
					<div key={section.titleKey}>
						{secIdx > 0 ? <div className="mx-3.5 my-1.5 h-px bg-bd-1" /> : null}
						<div className="px-3.5 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
							{t(section.titleKey)}
						</div>
						{section.items.map(item => {
							const active = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"relative flex w-full items-center gap-[9px] px-3.5 py-1.5 text-[13px] transition-colors duration-100",
										active
											? "bg-acc-bg text-acc-t"
											: "text-t-2 hover:bg-surf-2 hover:text-t-1",
									)}
								>
									<span
										className={cn(
											"shrink-0",
											active ? "text-acc-t" : "text-t-3",
										)}
									>
										{item.icon}
									</span>
									{t(item.labelKey)}
									{active ? (
										<span
											aria-hidden="true"
											className="absolute left-0 top-[5px] bottom-[5px] w-[2px] rounded-r-[2px] bg-acc"
										/>
									) : null}
								</Link>
							);
						})}
					</div>
				))}

				{stats?.streakDays?.length ? (
					<>
						<div className="mx-3.5 my-1.5 h-px bg-bd-1" />
						<NavStreak stats={stats} />
					</>
				) : null}

				<NavVocab />
			</div>

			<div className="px-3.5 pb-3.5 pt-2">
				{plan ? (
					<div className="rounded-[9px] border-hairline border-bd-1 bg-surf-2 p-3">
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

			<div className="border-hairline border-t border-bd-1">
				<ThemeToggle />
				<UserMenu />
			</div>
		</nav>
	);
};
