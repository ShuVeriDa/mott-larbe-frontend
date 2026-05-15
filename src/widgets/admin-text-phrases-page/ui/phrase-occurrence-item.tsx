"use client";

import { ComponentProps } from "react";
import { FileText, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseOccurrence } from "@/entities/text-phrase";

interface PhraseOccurrenceItemProps {
	occurrence: TextPhraseOccurrence;
	lang: string;
	onDelete: (occurrence: TextPhraseOccurrence) => void;
	t: (key: string) => string;
}

export const PhraseOccurrenceItem = ({
	occurrence,
	lang,
	onDelete,
	t,
}: PhraseOccurrenceItemProps) => {
	const handleDelete: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onDelete(occurrence);

	return (
		<div className="group flex items-center gap-3 rounded-[8px] border border-bd-1 bg-surf-2 px-3 py-2.5 transition-colors hover:border-bd-2 hover:bg-surf-3">
			<FileText className="size-[15px] shrink-0 text-t-3" />
			<div className="min-w-0 flex-1">
				<Link
					href={`/${lang}/admin/texts/${occurrence.textId}`}
					className="text-[12.5px] font-medium text-t-1 transition-colors hover:text-acc line-clamp-1"
				>
					{occurrence.text.title}
				</Link>
				<Typography tag="p" className="mt-0.5 text-[11px] text-t-3">
					{t("admin.textPhrases.occurrencesSection.page")} {occurrence.pageNumber}
					{" · "}
					{t("admin.textPhrases.occurrencesSection.pos")} {occurrence.startTokenPosition}–{occurrence.endTokenPosition}
				</Typography>
			</div>
			<div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
				<Link
					href={`/${lang}/admin/texts/${occurrence.textId}`}
					className="flex size-[26px] items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					title={t("admin.textPhrases.occurrencesSection.openInEditor")}
				>
					<ExternalLink className="size-[12px]" />
				</Link>
				<Button
					variant="bare"
					size="bare"
					onClick={handleDelete}
					className="flex size-[26px] items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
					title={t("admin.textPhrases.occurrencesSection.deleteOccurrence")}
				>
					<Trash2 className="size-[12px]" />
				</Button>
			</div>
		</div>
	);
};
