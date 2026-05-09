"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps, useEffect, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";

export const AuthThemeToggle = () => {
	const { t } = useI18n();
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const dark = mounted && resolvedTheme === "dark";

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setTheme(dark ? "light" : "dark");
return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={t("landing.nav.theme")}
			className="inline-flex size-8 items-center justify-center rounded-[8px] border-[0.5px] border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
		>
			{mounted && dark ? (
				<Sun size={14} strokeWidth={1.8} />
			) : (
				<Moon size={14} strokeWidth={1.8} />
			)}
		</button>
	);
};
