"use client";

import { UserMenu } from "@/features/user-menu";
import { cn } from "@/shared/lib/cn";
import { SideNavToggle } from "@/shared/ui/side-nav-toggle";
import { useState } from "react";
import { AdminSideNavContent } from "./admin-side-nav-content";
import { AdminSideNavHeader } from "./admin-side-nav-header";

export const AdminSideNav = () => {
	const [isExpandedOnSmall, setIsExpandedOnSmall] = useState(false);

	const isCompactMode = !isExpandedOnSmall;
	const handleToggleExpanded = () => setIsExpandedOnSmall(prev => !prev);

	return (
		<nav
			className={cn(
				"relative flex h-screen shrink-0 flex-col border-r border-bd-1 bg-surf transition-[width,background-color,border-color] duration-200 min-[900px]:w-[210px]",
				isExpandedOnSmall ? "max-[899px]:w-[210px]" : "max-[899px]:w-[60px]",
			)}
		>
			<AdminSideNavHeader isCompactMode={isCompactMode} />
			<AdminSideNavContent isCompactMode={isCompactMode} />
			<div className="border-t border-bd-1">
				<UserMenu isCompactMode={isCompactMode} />
			</div>
			<SideNavToggle
				isExpandedOnSmall={isExpandedOnSmall}
				onToggle={handleToggleExpanded}
			/>
		</nav>
	);
};
