"use client";

import { Button } from "@/shared/ui/button";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";

export const LandingThemeToggle = () => {
	const { t } = useI18n();
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();

	const dark = mounted && resolvedTheme === "dark";

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setTheme(dark ? "light" : "dark");
return (
		<Button
			onClick={handleClick}
			aria-label={t("landing.nav.theme")}
			className="flex h-[34px] w-[34px] items-center justify-center rounded-base border-hairline border-bd-2 bg-surf text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
		>
			{mounted && dark ? (
				<Sun size={15} strokeWidth={1.8} />
			) : (
				<Moon size={15} strokeWidth={1.8} />
			)}
		</Button>
	);
};
