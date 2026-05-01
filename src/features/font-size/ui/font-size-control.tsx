"use client";

import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useFontSize } from "../model";

export interface FontSizeControlProps {
	initialValue: number;
}

export const FontSizeControl = ({ initialValue }: FontSizeControlProps) => {
	const { t } = useI18n();
	const { value, change, reset, save, fillPercent, isSaving } =
		useFontSize(initialValue);

	return (
		<>
			<div className="border-hairline border-b border-bd-1 px-4 py-3.5">
				<Typography
					tag="span"
					className="block text-[11.5px] font-medium text-t-2"
				>
					{t("settings.reader.preview")}
				</Typography>
				<Typography
					tag="p"
					className="mt-2.5 rounded-base border-hairline border-bd-1 bg-surf-2 p-3 text-t-1 transition-[font-size] duration-150"
					style={{ fontSize: `${value}px`, lineHeight: 1.7 }}
				>
					{t("settings.reader.previewText")}
				</Typography>
				<div className="mt-2.5 flex items-center gap-2">
					<button
						type="button"
						onClick={() => change(-1)}
						aria-label="-"
						className="flex size-7 cursor-pointer items-center justify-center rounded-md border-hairline border-bd-2 bg-surf-2 text-sm font-semibold text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-3"
					>
						−
					</button>
					<Typography
						tag="span"
						className="min-w-10 text-center text-[13px] font-semibold text-t-1 tabular-nums"
					>
						{value}px
					</Typography>
					<div className="h-[3px] flex-1 overflow-hidden rounded-[2px] bg-surf-3">
						<div
							className="h-full rounded-[2px] bg-acc transition-[width] duration-150"
							style={{ width: `${fillPercent}%` }}
						/>
					</div>
					<button
						type="button"
						onClick={() => change(1)}
						aria-label="+"
						className="flex size-7 cursor-pointer items-center justify-center rounded-md border-hairline border-bd-2 bg-surf-2 text-sm font-semibold text-t-1 transition-colors hover:border-bd-3 hover:bg-surf-3"
					>
						+
					</button>
				</div>
			</div>
			<div className="flex justify-end gap-2 px-4 py-3.5">
				<Button variant="outline" onClick={reset}>
					{t("settings.common.reset")}
				</Button>
				<Button variant="action" onClick={save} disabled={isSaving}>
					{isSaving
						? t("settings.common.saving")
						: t("settings.common.save")}
				</Button>
			</div>
		</>
	);
};
