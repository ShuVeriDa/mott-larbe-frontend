"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { X } from "lucide-react";

export interface ReaderSettingsChromeHeaderProps {
	onClose: () => void;
}

export const ReaderSettingsChromeHeader = ({
	onClose,
}: ReaderSettingsChromeHeaderProps) => {
	const { t } = useI18n();
	const handleCloseClick = () => onClose();

	return (
		<div className="flex shrink-0 items-center justify-between border-b border-hairline border-bd-1 px-3.5 py-2.5">
			<Typography
				tag="span"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("reader.settings.title")}
			</Typography>
			<Button
				onClick={handleCloseClick}
				aria-label={t("reader.panel.close")}
				className="inline-flex size-6 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-3" strokeWidth={1.6} />
			</Button>
		</div>
	);
};
