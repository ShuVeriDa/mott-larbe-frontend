import { cn } from "@/shared/lib/cn";
import type { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Moon } from "lucide-react";
import type { MouseEvent } from "react";
import { THEME_OPTIONS } from "../lib/theme-options";
import { UserMenuInlineRow } from "./user-menu-inline-row";

interface UserMenuThemeSectionProps {
	t: ReturnType<typeof useI18n>["t"];
	theme: string | undefined;
	onThemeItemSelect: (e: Event) => void;
	onSetTheme: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const UserMenuThemeSection = ({
	t,
	theme,
	onThemeItemSelect,
	onSetTheme,
}: UserMenuThemeSectionProps) => (
	<UserMenuInlineRow
		icon={<Moon className="size-[13px] shrink-0 text-t-3" strokeWidth={1.75} />}
		label={t("nav.theme")}
		onItemSelect={onThemeItemSelect}
	>
		{THEME_OPTIONS.map(({ value, labelKey, icon }) => {
			const active = theme === value;
			return (
				<Button
					key={value}
					data-theme={value}
					role="radio"
					aria-checked={active}
					aria-label={t(labelKey)}
					onClick={onSetTheme}
					className={cn(
						"px-2 py-[5px] w-7.5 h-7.5 rounded-full transition-colors",
						active ? "bg-acc text-white" : "text-t-3 hover:text-t-4",
					)}
				>
					{icon}
				</Button>
			);
		})}
	</UserMenuInlineRow>
);
