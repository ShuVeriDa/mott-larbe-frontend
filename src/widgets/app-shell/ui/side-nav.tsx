"use client";

import { useDashboard } from "@/entities/dashboard";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useState } from "react";
import { SideNavContent } from "./side-nav-content";
import { SideNavFooter } from "./side-nav-footer";
import { SideNavHeader } from "./side-nav-header";
import { SideNavToggle } from "@/shared/ui/side-nav-toggle";

export const SideNav = () => {
	const { t } = useI18n();
	const [isExpandedOnSmall, setIsExpandedOnSmall] = useState(false);

	const { data: dashData } = useDashboard();
	const plan = dashData?.plan;
	const stats = dashData?.stats;

	const isCompactMode = !isExpandedOnSmall;
	const handleToggleExpanded = () => setIsExpandedOnSmall(prev => !prev);

	return (
		<nav
			aria-label={t("nav.vocabulary")}
			className={cn(
				"relative flex h-screen shrink-0 flex-col border-r border-bd-1 bg-surf transition-[width,background-color,border-color] duration-200 min-[900px]:w-[230px] max-md:hidden",
				isExpandedOnSmall ? "md:max-[899px]:w-[230px]" : "md:max-[899px]:w-[60px]",
			)}
		>
			<SideNavHeader isCompactMode={isCompactMode} />
			<SideNavContent isCompactMode={isCompactMode} stats={stats} />
			<SideNavFooter isCompactMode={isCompactMode} plan={plan} />
			<SideNavToggle
				isExpandedOnSmall={isExpandedOnSmall}
				onToggle={handleToggleExpanded}
			/>
		</nav>
	);
};
