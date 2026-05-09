"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";

export const AuthThemeToggle = () => {
	const { t } = useI18n();
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();

	const dark = mounted && resolvedTheme === "dark";

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setTheme(dark ? "light" : "dark");
return (
		<button
			type="button"
			onClick={handleClick}
			aria-label={t("auth.resetPassword.theme")}
			className="inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
		>
			{mounted && dark ? (
				<Sun size={14} strokeWidth={1.8} />
			) : (
				<Moon size={14} strokeWidth={1.8} />
			)}
		</button>
	);
};
