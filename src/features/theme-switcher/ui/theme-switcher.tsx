"use client";

import { type ThemePreference } from "@/entities/settings";
import { useThemeSwitcher } from "../model";
import { ThemeCard } from "./theme-card";

export interface ThemeSwitcherProps {
	value?: ThemePreference;
}

export const ThemeSwitcher = ({ value }: ThemeSwitcherProps) => {
	const { t, current, handleSelect } = useThemeSwitcher({ value });

	return (
		<div className="flex flex-wrap gap-2.5 px-4 py-3.5">
			<ThemeCard
				id="light"
				name={t("settings.appearance.themeLight")}
				selected={current === "light"}
				onSelect={handleSelect}
			/>
			<ThemeCard
				id="dark"
				name={t("settings.appearance.themeDark")}
				selected={current === "dark"}
				onSelect={handleSelect}
			/>
			<ThemeCard
				id="system"
				name={t("settings.appearance.themeSystem")}
				selected={current === "system"}
				onSelect={handleSelect}
			/>
		</div>
	);
};
