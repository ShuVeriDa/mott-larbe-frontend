"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useMounted } from "@/shared/lib/mounted";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface ThemeToggleProps {
	isCompactMode?: boolean;
}

export const ThemeToggle = ({ isCompactMode = false }: ThemeToggleProps) => {
	const { t } = useI18n();
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useMounted();

	const dark = mounted && resolvedTheme === "dark";

	const handleToggle = () => {
		setTheme(dark ? "light" : "dark");
	};

	return (
		<Button
			onClick={handleToggle}
			aria-label={dark ? t("nav.lightTheme") : t("nav.darkTheme")}
			className={cn(
				"flex w-full items-center justify-start gap-[9px] border-none rounded-none bg-transparent px-3.5 py-1.5 text-left font-[inherit] text-[13px] text-t-2 transition-[colors,padding,gap] hover:bg-surf-2",
				isCompactMode &&
					"max-[899px]:justify-center max-[899px]:gap-0 max-[899px]:px-0",
			)}
		>
			{dark ? (
				<Sun className="size-[20px] shrink-0 text-t-3" strokeWidth={1.5} />
			) : (
				<Moon className="size-[20px] shrink-0 text-t-3" strokeWidth={1.5} />
			)}
			<Typography
				tag="span"
				className={cn(
					"transition-[width,opacity] duration-200",
					isCompactMode &&
						"max-[899px]:w-0 max-[899px]:overflow-hidden max-[899px]:opacity-0",
				)}
			>
				{dark ? t("nav.lightTheme") : t("nav.darkTheme")}
			</Typography>
		</Button>
	);
};
