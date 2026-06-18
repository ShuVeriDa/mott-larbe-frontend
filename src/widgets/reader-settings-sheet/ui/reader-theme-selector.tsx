"use client";

import { useReaderTheme } from "@/features/reader-theme";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { useTheme } from "next-themes";
import { THEME_SWATCHES } from "../lib/reader-settings-form-config";
import { ReaderCustomColorSwatch } from "./reader-custom-color-swatch";

export interface ReaderThemeSelectorProps {
	compact: boolean;
}

export const ReaderThemeSelector = ({ compact }: ReaderThemeSelectorProps) => {
	const { t } = useI18n();
	const { resolvedTheme } = useTheme();
	const theme = useReaderTheme(s => s.theme);
	const setTheme = useReaderTheme(s => s.setTheme);

	const size = compact ? "size-7" : "size-9";

	return (
		<div
			className={cn(
				"flex items-center justify-between",
				compact ? "mb-3" : "mb-5",
			)}
		>
			{THEME_SWATCHES.map(swatch => {
				const isActive = theme === swatch.value;
				const handleClick = () => setTheme(swatch.value);
				const color =
					swatch.value === "default" && resolvedTheme === "dark"
						? "#1a1a1e"
						: swatch.color;
				return (
					<Button
						key={swatch.value}
						onClick={handleClick}
						title={t(swatch.labelKey)}
						aria-label={t(swatch.labelKey)}
						aria-pressed={isActive}
						className={cn(
							"shrink-0 rounded-full border-2 transition-colors",
							size,
							isActive ? "border-acc" : "border-bd-2 hover:border-bd-3",
						)}
						style={{ backgroundColor: color }}
					/>
				);
			})}
			<ReaderCustomColorSwatch compact={compact} />
		</div>
	);
};
