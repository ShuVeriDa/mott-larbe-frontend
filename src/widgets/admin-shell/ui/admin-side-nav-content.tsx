"use client";

import { usePathname } from "next/navigation";
import { NavDivider } from "./nav-divider";
import { NavItem } from "./nav-item";
import { NavSection } from "./nav-section";
import { buildAdminNavSections } from "../lib/admin-nav-config";
import { useI18n } from "@/shared/lib/i18n";

interface AdminSideNavContentProps {
	isCompactMode: boolean;
}

export const AdminSideNavContent = ({ isCompactMode }: AdminSideNavContentProps) => {
	const { t, lang } = useI18n();
	const pathname = usePathname();
	const sections = buildAdminNavSections(t, lang);

	const isActive = (path: string) => pathname.includes(path);

	return (
		<div className="flex-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-0">
			{sections.map((section) => (
				<div key={section.titleKey}>
					{section.dividerBefore ? (
						<NavDivider isCompactMode={isCompactMode} />
					) : null}
					<NavSection
						label={t(section.titleKey)}
						isCompactMode={isCompactMode}
					/>
					{section.items.map(item => {
						const href = item.href(lang);
						const Icon = item.icon;
						return (
							<NavItem
								key={href}
								href={href}
								label={item.label(t)}
								active={isActive(href)}
								icon={<Icon className="size-[15px]" />}
								badge={item.badge}
								isCompactMode={isCompactMode}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
};
