"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useReaderTheme } from "@/features/reader-theme";
import { THEME_SWATCHES } from "@/widgets/reader-settings-sheet/lib/reader-settings-form-config";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps } from "react";
import { useTheme } from "next-themes";

export interface ThemeRowProps {
	label: string;
	description?: string;
}

export const ThemeRow = ({ label, description }: ThemeRowProps) => {
	const { t } = useI18n();
	const { resolvedTheme } = useTheme();
	const theme = useReaderTheme(s => s.theme);
	const setTheme = useReaderTheme(s => s.setTheme);

	return (
		<div className="flex flex-col gap-2 border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
			<div>
				<Typography tag="p" className="text-[13px] font-medium text-t-1">
					{label}
				</Typography>
				{description ? (
					<Typography tag="p" className="mt-0.5 text-[11.5px] leading-normal text-t-3">
						{description}
					</Typography>
				) : null}
			</div>
			<div className="flex flex-wrap gap-2">
				{THEME_SWATCHES.map(swatch => {
					const isActive = theme === swatch.value;
					const color =
						swatch.value === "default" && resolvedTheme === "dark"
							? "#1a1a1e"
							: swatch.color;
					const handleClick: NonNullable<ComponentProps<"button">["onClick"]> =
						() => setTheme(swatch.value);
					return (
						<button
							key={swatch.value}
							onClick={handleClick}
							title={t(swatch.labelKey)}
							aria-label={t(swatch.labelKey)}
							aria-pressed={isActive}
							className={cn(
								"flex flex-col items-center gap-1 rounded-md p-1.5 transition-colors",
								isActive ? "bg-acc-bg ring-1 ring-acc/40" : "hover:bg-surf-2",
							)}
						>
							<span
								className={cn(
									"block size-7 rounded-full border-2",
									isActive ? "border-acc" : "border-bd-2",
								)}
								style={{ backgroundColor: color }}
							/>
							<Typography tag="span" className={cn(
								"text-[10.5px] font-medium",
								isActive ? "text-acc-t" : "text-t-3",
							)}>
								{t(swatch.labelKey)}
							</Typography>
						</button>
					);
				})}
			</div>
		</div>
	);
};
