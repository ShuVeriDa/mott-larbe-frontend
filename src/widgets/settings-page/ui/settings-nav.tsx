"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { SECTIONS, type SettingsSectionId } from "../model/section-list";

export interface SettingsNavProps {
	active: SettingsSectionId;
	onChange: (id: SettingsSectionId) => void;
}

export const SettingsNav = ({ active, onChange }: SettingsNavProps) => {
	const { t } = useI18n();

	return (
		<nav
			aria-label={t("settings.pageTitle")}
			className={cn(
				"flex flex-col gap-0.5 overflow-y-auto border-hairline border-r border-bd-1 p-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				"w-[200px] shrink-0",
				"max-md:h-11 max-md:w-full max-md:flex-row max-md:gap-0 max-md:overflow-x-auto max-md:overflow-y-visible max-md:border-b max-md:border-r-0 max-md:bg-surf max-md:p-0",
				"max-sm:h-[42px]",
			)}
		>
			{SECTIONS.map(section => {
				const isActive = section.id === active;
								const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onChange(section.id);
return (
					<button
						key={section.id}
						type="button"
						onClick={handleClick}
						aria-current={isActive ? "page" : undefined}
						className={cn(
							"flex items-center gap-2.5 rounded-base px-2.5 py-1.5 text-left font-[inherit] transition-colors duration-100",
							"max-md:h-11 max-md:flex-shrink-0 max-md:rounded-none max-md:border-b-2 max-md:border-transparent max-md:px-4 max-md:font-normal",
							"max-sm:h-[42px] max-sm:px-[13px] max-sm:text-[12px]",
							isActive
								? "bg-acc-bg text-acc-t font-medium [&_.sn-icon]:text-acc-t max-md:bg-transparent max-md:border-b-acc"
								: "text-t-2 hover:bg-surf-2 hover:text-t-1 [&_.sn-icon]:text-t-3",
						)}
					>
						<span className="sn-icon shrink-0 max-md:hidden">
							{section.icon}
						</span>
						<span className="text-[12.5px] whitespace-nowrap max-md:text-[12.5px]">
							{t(section.labelKey)}
						</span>
					</button>
				);
			})}
		</nav>
	);
};
