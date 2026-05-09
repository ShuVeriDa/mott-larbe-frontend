"use client";

import { useTheme } from "next-themes";
import {
	useUpdatePreferences,
	type ThemePreference,
} from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";
import { useToast } from "@/shared/lib/toast";

const toApi: Record<"light" | "dark" | "system", ThemePreference> = {
	light: "LIGHT",
	dark: "DARK",
	system: "SYSTEM",
};

interface UseThemeSwitcherParams {
	value?: ThemePreference;
}

export const useThemeSwitcher = ({ value }: UseThemeSwitcherParams) => {
	const { t } = useI18n();
	const { theme, setTheme } = useTheme();
	const { mutateAsync } = useUpdatePreferences();
	const { success, error } = useToast();
	const mounted = useMounted();

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

	return {
		t,
		current,
		handleSelect,
	};
};
