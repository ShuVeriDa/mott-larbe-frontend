"use client";

import type { DashboardStats } from "@/entities/dashboard";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { usePathname } from "next/navigation";
import { buildNavSections } from "../lib/nav-config";
import { NavItem } from "./nav-item";
import { NavSection } from "./nav-section";
import { NavStreak } from "./nav-streak";
import { NavVocab } from "./nav-vocab";

interface SideNavContentProps {
	isCompactMode: boolean;
	stats: DashboardStats | undefined;
}

export const SideNavContent = ({ isCompactMode, stats }: SideNavContentProps) => {
	const { lang } = useI18n();
	const pathname = usePathname();
	const sections = buildNavSections(lang);

	return (
		<div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{sections.map((section, secIdx) => (
				<div key={section.titleKey}>
					{secIdx > 0 ? (
						<div
							className={cn(
								"mx-3.5 my-1.5 h-px bg-bd-1 transition-[margin] duration-200",
								isCompactMode && "max-[899px]:mx-2",
							)}
						/>
					) : null}
					<NavSection labelKey={section.titleKey} isCompactMode={isCompactMode} />
					{section.items.map(item => {
						const href = item.href(lang);
						const active = pathname === href;
						const Icon = item.icon;
						return (
							<NavItem
								key={href}
								href={href}
								icon={<Icon className="size-[15px] shrink-0" />}
								labelKey={item.labelKey}
								active={active}
								isCompactMode={isCompactMode}
							/>
						);
					})}
				</div>
			))}

			{stats?.streakDays?.length ? (
				<div className={cn(isCompactMode && "max-[899px]:hidden")}>
					<div className="mx-3.5 my-1.5 h-px bg-bd-1" />
					<NavStreak stats={stats} />
				</div>
			) : null}

			<div className={cn(isCompactMode && "max-[899px]:hidden")}>
				<NavVocab />
			</div>
		</div>
	);
};
