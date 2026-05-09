"use client";

import { Button } from "@/shared/ui/button";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps } from "react";
import type { AuthMode } from "../../model";

interface AuthTabsProps {
	mode: AuthMode;
	onChange: (mode: AuthMode) => void;
}

export const AuthTabs = ({ mode, onChange }: AuthTabsProps) => {
	const { t } = useI18n();

	const tabs: Array<{ key: AuthMode; labelKey: string }> = [
		{ key: "login", labelKey: "auth.tabs.login" },
		{ key: "register", labelKey: "auth.tabs.register" },
	];

	return (
		<div
			role="tablist"
			aria-label={t("auth.tabs.aria")}
			className="mb-6 flex gap-0 rounded-[9px] border-[0.5px] border-bd-1 bg-surf-2 p-[3px]"
		>
			{tabs.map(tab => {
				const isActive = tab.key === mode;
				const handleClick: NonNullable<
					ComponentProps<"button">["onClick"]
				> = () => onChange(tab.key);
				return (
					<Button
						key={tab.key}
						role="tab"
						variant="bare"
						aria-selected={isActive}
						onClick={handleClick}
						className={cn(
							"flex h-[34px] flex-1 items-center justify-center rounded-base text-[12.5px] font-semibold transition-colors",
							isActive
								? "bg-surf text-t-1 shadow-sm"
								: "text-t-3 hover:text-t-2",
						)}
					>
						{t(tab.labelKey)}
					</Button>
				);
			})}
		</div>
	);
};
