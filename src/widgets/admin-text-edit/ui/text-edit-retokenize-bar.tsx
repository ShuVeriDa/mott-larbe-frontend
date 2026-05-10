"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { AlertTriangle } from "lucide-react";

interface TextEditRetokenizeBarProps {
	onDismiss: () => void;
	t: ReturnType<typeof useI18n>["t"];
}

export const TextEditRetokenizeBar = ({
	onDismiss,
	t,
}: TextEditRetokenizeBarProps) => {
	return (
		<div className="flex items-center gap-2 border-b border-amb/15 bg-amb-muted px-6 py-2 transition-colors">
			<AlertTriangle className="size-[15px] shrink-0 text-amb" />
			<Typography tag="span" className="flex-1 text-[11.5px] text-amb-strong">
				{t("admin.texts.editPage.retokenizeBar.text")}
			</Typography>
			<Button
				onClick={onDismiss}
				className="shrink-0 rounded-[4px] px-1.5 py-0.5 text-[11px] text-t-3 transition-colors hover:bg-surf-3"
			>
				✕
			</Button>
		</div>
	);
};
