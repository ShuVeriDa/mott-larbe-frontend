"use client";

import { FilePlus, Replace, TextCursor, TriangleAlert } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import type { GenerationApplyMode } from "../model/types";

interface GenerationApplyModePickerProps {
	isActivePageEmpty: boolean;
	onApply: (mode: GenerationApplyMode) => void;
	onCancel: () => void;
}

export const GenerationApplyModePicker = ({
	isActivePageEmpty,
	onApply,
	onCancel,
}: GenerationApplyModePickerProps) => {
	const { t } = useI18n();

	const handleReplaceClick = () => onApply("replace");
	const handleAppendClick = () => onApply("append");
	const handleNewPageClick = () => onApply("new-page");

	return (
		<div className="space-y-3">
			<Typography tag="h3" size="sm" className="font-semibold text-t-1">
				{t("myTexts.generate.applyMode.title")}
			</Typography>

			<div className="grid gap-2 sm:grid-cols-3">
				<Button variant="outline" size="lg" onClick={handleReplaceClick} className="flex-col gap-1.5 py-3">
					<Replace className="size-4" />
					{t("myTexts.generate.applyMode.replace")}
				</Button>
				<Button variant="outline" size="lg" onClick={handleAppendClick} className="flex-col gap-1.5 py-3">
					<TextCursor className="size-4" />
					{t("myTexts.generate.applyMode.append")}
				</Button>
				<Button variant="outline" size="lg" onClick={handleNewPageClick} className="flex-col gap-1.5 py-3">
					<FilePlus className="size-4" />
					{t("myTexts.generate.applyMode.newPage")}
				</Button>
			</div>

			{!isActivePageEmpty && (
				<div className="flex items-start gap-1.5 rounded-base border-[0.5px] border-amb/30 bg-amb-bg px-2.5 py-2">
					<TriangleAlert className="mt-0.5 size-3.5 shrink-0 text-amb-t" />
					<Typography tag="p" size="xs" className="text-amb-t">
						{t("myTexts.generate.applyMode.replaceWarning")}
					</Typography>
				</div>
			)}

			<Button variant="ghost" size="default" onClick={onCancel} className="w-full">
				{t("myTexts.generate.applyMode.cancel")}
			</Button>
		</div>
	);
};
