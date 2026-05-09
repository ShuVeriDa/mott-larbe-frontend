"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";
import { Button } from "@/shared/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps } from "react";

export const AuthThemeToggle = () => {
	const { t } = useI18n();
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();

	const dark = mounted && resolvedTheme === "dark";

	const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		setTheme(dark ? "light" : "dark");

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={handleClick}
			aria-label={t("landing.nav.theme")}
			className="size-8 rounded-[8px] border-[0.5px]"
		>
			{mounted && dark ? (
				<Sun size={14} strokeWidth={1.8} />
			) : (
				<Moon size={14} strokeWidth={1.8} />
			)}
		</Button>
	);
};
