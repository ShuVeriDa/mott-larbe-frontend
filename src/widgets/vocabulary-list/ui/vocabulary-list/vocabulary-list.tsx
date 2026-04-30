"use client";

import { useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { LearningLevel } from "@/shared/types";
import { Typography } from "@/shared/ui/typography";
import { WordCard } from "@/widgets/word-card";
import { useGroupedList } from "../../model";

const STATUS_LABEL: Record<LearningLevel, string> = {
	NEW: "vocabulary.status.new",
	LEARNING: "vocabulary.status.learning",
	KNOWN: "vocabulary.status.known",
};

export const VocabularyList = () => {
	const { t } = useI18n();
	const { sections, isLoading, isEmpty, isError } = useGroupedList();
	const [expandedId, setExpandedId] = useState<string | null>(null);

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-8 text-sm text-t-3">
				{t("vocabulary.loading")}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-1 items-center justify-center p-8 text-sm text-red">
				{t("vocabulary.errorLoading")}
			</div>
		);
	}

	if (isEmpty) {
		return (
			<div className="flex flex-1 items-center justify-center p-8 text-sm text-t-3">
				{t("vocabulary.empty")}
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-[18px] pb-6 pt-3.5 max-md:px-[14px] max-md:pb-5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-surf-4">
			{sections.map((sec) =>
				sec.items.length === 0 && sec.total === 0 ? null : (
					<section
						key={sec.status}
						aria-labelledby={`section-${sec.status}`}
						className="flex flex-col gap-1.5"
					>
						<header className="mt-2 mb-2 flex items-center justify-between first:mt-0">
							<Typography
								tag="h3"
								id={`section-${sec.status}`}
								className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
							>
								{t(STATUS_LABEL[sec.status])}
							</Typography>
							<Typography tag="span" className="text-[11px] text-t-3">
								{t("vocabulary.wordsCount", { count: sec.total })}
							</Typography>
						</header>
						{sec.items.map((entry) => (
							<WordCard
								key={entry.id}
								entry={entry}
								expanded={expandedId === entry.id}
								onToggle={() =>
									setExpandedId((prev) => (prev === entry.id ? null : entry.id))
								}
							/>
						))}
					</section>
				),
			)}
		</div>
	);
};
