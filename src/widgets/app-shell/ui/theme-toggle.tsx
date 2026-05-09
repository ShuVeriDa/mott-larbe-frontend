"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";
import { Typography } from "@/shared/ui/typography";

export const ThemeToggle = () => {
	const { t } = useI18n();
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();

	const dark = mounted && resolvedTheme === "dark";

	const handleToggle = () => {
		setTheme(dark ? "light" : "dark");
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
			aria-label={dark ? t("nav.lightTheme") : t("nav.darkTheme")}
			className="flex w-full items-center gap-[9px] border-none bg-transparent px-3.5 py-1.5 text-left font-[inherit] text-[13px] text-t-2 transition-colors hover:bg-surf-2"
		>
			{dark ? (
				<Sun className="size-[15px] shrink-0 text-t-3" strokeWidth={1.5} />
			) : (
				<Moon className="size-[15px] shrink-0 text-t-3" strokeWidth={1.5} />
			)}
			<Typography tag="span">
				{dark ? t("nav.lightTheme") : t("nav.darkTheme")}
			</Typography>
		</button>
	);
};
