"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from 'react';
import {
	useUpdatePreferences,
	type ThemePreference,
} from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { ThemeCard } from "./theme-card";

const toApi: Record<"light" | "dark" | "system", ThemePreference> = {
	light: "LIGHT",
	dark: "DARK",
	system: "SYSTEM",
};

export interface ThemeSwitcherProps {
	value?: ThemePreference;
}

export const ThemeSwitcher = ({ value }: ThemeSwitcherProps) => {
	const { t } = useI18n();
	const { theme, setTheme } = useTheme();
	const { mutateAsync } = useUpdatePreferences();
	const { success, error } = useToast();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const current: "light" | "dark" | "system" = mounted
		? value === "LIGHT"
			? "light"
			: value === "DARK"
				? "dark"
				: value === "SYSTEM"
					? "system"
					: theme === "system"
						? "system"
						: theme === "dark"
							? "dark"
							: "light"
		: "light";

	const handleSelect = async (id: "light" | "dark" | "system") => {
		setTheme(id);
		try {
			await mutateAsync({ theme: toApi[id] });
			success(t("settings.toasts.themeSaved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

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
