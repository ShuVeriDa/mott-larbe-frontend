"use client";

import { useReaderTheme } from "@/features/reader-theme";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Palette } from "lucide-react";
import type { ChangeEvent } from "react";
import { startTransition, useEffect, useRef, useState } from "react";

const COMMIT_MS = 160;

export interface ReaderCustomColorSwatchProps {
	compact: boolean;
}

export const ReaderCustomColorSwatch = ({ compact }: ReaderCustomColorSwatchProps) => {
	const { t } = useI18n();
	const theme = useReaderTheme(s => s.theme);
	const bgColor = useReaderTheme(s => s.bgColor);
	const setTheme = useReaderTheme(s => s.setTheme);
	const setBgColor = useReaderTheme(s => s.setBgColor);

	const [preview, setPreview] = useState(bgColor);
	const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		setPreview(bgColor);
	}, [bgColor]);

	const scheduleCommit = (next: string) => {
		if (commitTimerRef.current != null) clearTimeout(commitTimerRef.current);
		commitTimerRef.current = setTimeout(() => {
			startTransition(() => {
				setBgColor(next);
			});
			commitTimerRef.current = null;
		}, COMMIT_MS);
	};

	const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
		const next = e.currentTarget.value;
		setPreview(next);
		if (theme !== "custom") setTheme("custom");
		scheduleCommit(next);
	};

	const handleBlur = () => {
		if (commitTimerRef.current != null) {
			clearTimeout(commitTimerRef.current);
			commitTimerRef.current = null;
		}
		startTransition(() => {
			setBgColor(preview);
		});
	};

	const size = compact ? "size-7" : "size-9";
	const isCustom = theme === "custom";

	return (
		<label
			aria-label={t("reader.settings.themeCustom")}
			className={cn(
				"relative flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 bg-surf-2 transition-colors",
				size,
				isCustom ? "border-acc" : "border-bd-2 hover:border-bd-3",
			)}
		>
			{isCustom ? (
				<span
					aria-hidden="true"
					className="absolute inset-[18%] rounded-full border border-bd-2 shadow-inner"
					style={{ backgroundColor: preview }}
				/>
			) : (
				<Palette
					className="relative z-0 size-[55%] text-acc opacity-90"
					strokeWidth={1.5}
					aria-hidden="true"
				/>
			)}
			<input
				type="color"
				value={preview}
				onChange={handleColorChange}
				onBlur={handleBlur}
				className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
				aria-hidden="true"
			/>
		</label>
	);
};
