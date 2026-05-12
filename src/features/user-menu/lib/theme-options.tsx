import { Moon, Sun } from "lucide-react";
import type { ReactNode } from "react";

interface ThemeOption {
	value: "dark" | "light";
	labelKey: "nav.darkTheme" | "nav.lightTheme";
	icon: ReactNode;
}

export const THEME_OPTIONS: ThemeOption[] = [
	{ value: "dark", labelKey: "nav.darkTheme", icon: <Moon className="size-[11px]" strokeWidth={1.75} /> },
	{ value: "light", labelKey: "nav.lightTheme", icon: <Sun className="size-[11px]" strokeWidth={1.75} /> },
];
