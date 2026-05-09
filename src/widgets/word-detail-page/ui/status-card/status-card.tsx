"use client";

import { Typography } from "@/shared/ui/typography";

import { FolderSelect, StatusButtons } from "@/features/update-word";
import { useI18n } from "@/shared/lib/i18n";
import type { LearningLevel } from "@/shared/types";

export interface StatusCardProps {
	wordId: string;
	learningLevel: LearningLevel;
	folderId: string | null;
}

export const StatusCard = ({
	wordId,
	learningLevel,
	folderId,
}: StatusCardProps) => {
	const { t } = useI18n();

	return (
		<section
			aria-labelledby={`status-card-${wordId}`}
			className="mb-3.5 rounded-card border-hairline border-bd-1 bg-surf p-4"
		>
			<Typography tag="h3"
				id={`status-card-${wordId}`}
				className="mb-3 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("vocabulary.wordDetail.sections.status")}
			</Typography>
			<StatusButtons wordId={wordId} current={learningLevel} />

			<div className="my-3 h-px bg-bd-1" />

			<Typography tag="p" className="mb-1.5 text-[11px] text-t-3">
				{t("vocabulary.wordDetail.sections.folder")}
			</Typography>
			<FolderSelect wordId={wordId} currentFolderId={folderId} />
		</section>
	);
};
