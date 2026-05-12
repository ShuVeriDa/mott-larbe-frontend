"use client";

import { UserMenu } from "@/features/user-menu";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
	HomeIcon,
	ProgressIcon,
	ReviewIcon,
	TextsIcon,
	VocabularyIcon,
} from "./nav-icons";

interface BottomNavItem {
	href: string;
	icon: ReactNode;
	labelKey: string;
}

const buildItems = (lang: string): BottomNavItem[] => [
	{
		href: `/${lang}/dashboard`,
		icon: <HomeIcon className="size-5" />,
		labelKey: "nav.home",
	},
	{
		href: `/${lang}/texts`,
		icon: <TextsIcon className="size-5" />,
		labelKey: "nav.texts",
	},
	{
		href: `/${lang}/vocabulary`,
		icon: <VocabularyIcon className="size-5" />,
		labelKey: "nav.vocabulary",
	},
	{
		href: `/${lang}/review`,
		icon: <ReviewIcon className="size-5" />,
		labelKey: "nav.review",
	},
	{
		href: `/${lang}/progress`,
		icon: <ProgressIcon className="size-5" />,
		labelKey: "nav.progress",
	},
];

export const BottomNav = () => {
	const { t, lang } = useI18n();
	const pathname = usePathname();
	const items = buildItems(lang);

	return (
		<nav
			aria-label={t("nav.vocabulary")}
			className="fixed inset-x-0 bottom-0 z-90 hidden h-[56px] border-hairline border-t border-bd-1 bg-surf pb-[env(safe-area-inset-bottom)] max-md:block"
		>
			<div className="mx-auto flex h-full max-w-[1120px] items-stretch">
				{items.map((item, i) => {
					const active =
						pathname === item.href || (pathname.includes("reader") && i === 1);
					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex flex-1 flex-col items-center justify-center gap-[3px] text-[10px] transition-colors",
								active ? "text-acc" : "text-t-3",
							)}
						>
							{item.icon}
							{t(item.labelKey)}
						</Link>
					);
				})}
				<UserMenu bottomNav />
			</div>
		</nav>
	);
};
