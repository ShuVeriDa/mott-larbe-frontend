"use client";

import { useI18n } from "@/shared/lib/i18n";
import { SectionLabel } from "@/shared/ui/section-label";
import { Button } from "@/shared/ui/button";
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
		<div className="flex shrink-0 items-center justify-between border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
			<SectionLabel className="mb-0">
				{t("reader.settings.title")}
			</SectionLabel>
			<Button
				onClick={handleCloseClick}
				aria-label={t("reader.panel.close")}
				title={t("reader.panel.close")}
				className="inline-flex size-6 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-3" strokeWidth={1.6} />
			</Button>
		</div>
	);
};
