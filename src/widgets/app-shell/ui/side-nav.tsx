"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Avatar } from "@/shared/ui/avatar";
import {
	ChechenIcon,
	GrammarIcon,
	HomeIcon,
	LogoIcon,
	ProgressIcon,
	ReviewIcon,
	TextsIcon,
	VocabularyIcon,
} from "./nav-icons";
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
				href: `/${lang}`,
				icon: <HomeIcon className="size-[15px] shrink-0" />,
				labelKey: "nav.home",
			},
			{
				href: `/${lang}/texts`,
				icon: <TextsIcon className="size-[15px] shrink-0" />,
				labelKey: "nav.texts",
			},
			{
				href: `/${lang}/vocabulary`,
				icon: <VocabularyIcon className="size-[15px] shrink-0" />,
				labelKey: "nav.vocabulary",
			},
			{
				href: `/${lang}/review`,
				icon: <ReviewIcon className="size-[15px] shrink-0" />,
				labelKey: "nav.review",
			},
			{
				href: `/${lang}/progress`,
				icon: <ProgressIcon className="size-[15px] shrink-0" />,
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

export interface SideNavProps {
	activeHref: string;
}

export const SideNav = ({ activeHref }: SideNavProps) => {
	const { t, lang } = useI18n();
	const sections = buildSections(lang);

	return (
		<nav
			className="flex w-[230px] shrink-0 flex-col overflow-hidden border-hairline border-r border-bd-1 bg-surf transition-colors duration-200 max-lg:w-[190px] max-md:hidden"
			aria-label={t("nav.vocabulary")}
		>
			<div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
				<div className="flex items-center gap-2.5 border-hairline border-b border-bd-1 px-3.5 py-[16px_14px] pt-4 pb-3.5">
					<div className="flex size-[30px] items-center justify-center rounded-[8px] bg-acc text-white shadow-[0_2px_6px_rgba(34,84,211,0.35)]">
						<LogoIcon />
					</div>
					<span className="font-display text-sm font-medium tracking-[-0.1px] text-t-1">
						Мотт Ларбе
					</span>
				</div>

				{sections.map((section, secIdx) => (
					<div key={section.titleKey}>
						{secIdx > 0 ? (
							<div className="mx-3.5 my-1.5 h-px bg-bd-1" />
						) : null}
						<div className="px-3.5 pb-0.5 pt-3 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
							{t(section.titleKey)}
						</div>
						{section.items.map((item) => {
							const active = activeHref === item.href;
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
			</div>

			<div className="px-3.5 pb-3.5 pt-2">
				<div className="rounded-[9px] border-hairline border-bd-1 bg-surf-2 p-3">
					<div className="mb-1 text-xs font-semibold text-t-1">
						{t("nav.freePlan")}
					</div>
					<p className="mb-2.5 text-[11px] leading-[1.55] text-t-3">
						{t("nav.freePlanDesc")}
					</p>
					<Link
						href={`/${lang}/subscription`}
						className="block h-7 w-full rounded-md bg-acc text-center text-[11.5px] font-semibold leading-7 text-white transition-opacity hover:opacity-[0.88]"
					>
						{t("nav.upgrade")}
					</Link>
				</div>
			</div>

			<div className="border-hairline border-t border-bd-1">
				<ThemeToggle />
				<div className="flex items-center gap-2.5 px-3.5 py-1.5 pb-3 hover:bg-surf-2">
					<Avatar size="default">АМ</Avatar>
					<div className="min-w-0">
						<div className="truncate text-[12.5px] font-medium text-t-1">
							Амир М.
						</div>
						<div className="text-[11px] text-t-3">Free</div>
					</div>
				</div>
			</div>
		</nav>
	);
};
