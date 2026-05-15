"use client";

import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseOccurrence } from "@/entities/text-phrase";
import { PhraseOccurrenceItem } from "./phrase-occurrence-item";

interface PhraseCardOccurrencesProps {
	occurrences: TextPhraseOccurrence[];
	lang: string;
	onDeleteOccurrence: (occurrence: TextPhraseOccurrence) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhraseCardOccurrences = ({
	occurrences,
	lang,
	onDeleteOccurrence,
	t,
}: PhraseCardOccurrencesProps) => (
	<div className="p-4">
		<div className="mb-3 flex items-center gap-2">
			<Typography tag="h3" className="text-[13px] font-semibold text-t-1">
				{t("admin.textPhrases.occurrencesSection.title")}
			</Typography>
			<Badge variant="neu">{occurrences.length}</Badge>
		</div>

		{occurrences.length === 0 ? (
			<Typography tag="p" className="text-[12.5px] text-t-3">
				{t("admin.textPhrases.occurrencesSection.empty")}
			</Typography>
		) : (
			<div className="flex flex-col gap-2">
				{occurrences.map((occ) => (
					<PhraseOccurrenceItem
						key={occ.id}
						occurrence={occ}
						lang={lang}
						onDelete={onDeleteOccurrence}
						t={t}
					/>
				))}
			</div>
		)}
	</div>
);
