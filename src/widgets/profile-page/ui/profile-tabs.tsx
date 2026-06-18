"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { spring } from "@/shared/lib/animation";
import { Button } from "@/shared/ui/button";
import { motion } from "framer-motion";
import { type ComponentProps } from "react";

// "subscription" tab hidden — all features are free. To restore: add "subscription" back to this array.
export const PROFILE_TAB_IDS = ["main", "security", "ai"] as const;
export type ProfileTabId = (typeof PROFILE_TAB_IDS)[number];

export interface ProfileTabsProps {
	active: ProfileTabId;
	onChange: (tab: ProfileTabId) => void;
}

export const ProfileTabs = ({ active, onChange }: ProfileTabsProps) => {
	const { t } = useI18n();

	const tabs: { id: ProfileTabId; label: string }[] = [
		{ id: "main", label: t("profile.tabs.main") },
		{ id: "security", label: t("profile.tabs.security") },
		// { id: "subscription", label: t("profile.tabs.subscription") }, // hidden — all features are free
		{ id: "ai", label: t("profile.tabs.ai") },
	];

	return (
		<div className="flex gap-px rounded-[9px] bg-surf-3 p-[3px] w-fit max-sm:w-full">
			{tabs.map(({ id, label }) => {
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(id);
				const isActive = active === id;
				return (
					<Button
						key={id}
						onClick={handleClick}
						className={cn(
							"relative h-7 px-3.5 rounded-base text-[12.5px] font-medium font-[inherit] cursor-pointer whitespace-nowrap",
							"max-sm:flex-1 max-sm:h-[34px] max-sm:text-[12px] max-sm:px-1.5",
							isActive
								? "text-t-1"
								: "bg-transparent text-t-2 hover:text-t-1",
						)}
					>
						{isActive && (
							<motion.span
								layoutId="profile-tab-bg"
								className="absolute inset-0 rounded-base bg-surf shadow-sm"
								transition={spring.snappy}
							/>
						)}
						<span className="relative z-10">{label}</span>
					</Button>
				);
			})}
		</div>
	);
};
