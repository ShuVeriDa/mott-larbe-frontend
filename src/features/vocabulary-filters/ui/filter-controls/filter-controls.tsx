"use client";

import type { DictionarySort } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { CEFR_LEVELS, LEARNING_LEVELS } from "@/shared/types";
import type { LearningLevel, CefrLevel } from "@/shared/types";
import { FilterGroup } from "@/shared/ui/filter-group";
import { SectionLabel } from "@/shared/ui/section-label";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import type { ComponentProps } from "react";
import { useVocabularyFilters } from "../../model";

const STATUS_LABELS: Record<LearningLevel, string> = {
	NEW: "vocabulary.status.new",
	LEARNING: "vocabulary.status.learning",
	KNOWN: "vocabulary.status.known",
};

const SORT_OPTIONS: DictionarySort[] = ["added", "alpha", "review", "status"];

const SORT_LABEL_KEY: Record<DictionarySort, string> = {
	added: "vocabulary.sort.added",
	alpha: "vocabulary.sort.alpha",
	review: "vocabulary.sort.review",
	status: "vocabulary.sort.status",
};

export const FilterControls = () => {
	const { t } = useI18n();
	const status = useVocabularyFilters(s => s.status);
	const cefrLevel = useVocabularyFilters(s => s.cefrLevel);
	const sort = useVocabularyFilters(s => s.sort);
	const setStatus = useVocabularyFilters(s => s.setStatus);
	const setCefrLevel = useVocabularyFilters(s => s.setCefrLevel);
	const setSort = useVocabularyFilters(s => s.setSort);

	const statusOptions: { value: LearningLevel | null; label: string }[] = [
		{ value: null, label: t("vocabulary.all") },
		...LEARNING_LEVELS.map(l => ({ value: l, label: t(STATUS_LABELS[l]) })),
	];

	const levelOptions: { value: CefrLevel | null; label: string }[] = [
		{ value: null, label: t("vocabulary.all") },
		...CEFR_LEVELS.map(l => ({ value: l, label: l })),
	];

	const handleSortChange: NonNullable<ComponentProps<typeof Select>["onChange"]> = e =>
		setSort(e.currentTarget.value as DictionarySort);

	return (
		<div className="flex flex-col gap-3">
			<div>
				<SectionLabel className="mb-1.5">
					{t("vocabulary.filterByStatus")}
				</SectionLabel>
				<FilterGroup options={statusOptions} value={status} onValueChange={setStatus} />
			</div>

			<div>
				<SectionLabel className="mb-1.5">
					{t("vocabulary.filterByLevel")}
				</SectionLabel>
				<FilterGroup options={levelOptions} value={cefrLevel} onValueChange={setCefrLevel} />
			</div>

			<div>
				<SectionLabel className="mb-1.5">
					{t("vocabulary.sort.label")}
				</SectionLabel>
				<Select
					wrapperClassName="w-auto"
					className="h-[30px]! text-[12px]!"
					value={sort}
					onChange={handleSortChange}
					aria-label={t("vocabulary.sort.label")}
				>
					{SORT_OPTIONS.map(opt => (
						<option key={opt} value={opt}>
							{t(SORT_LABEL_KEY[opt])}
						</option>
					))}
				</Select>
			</div>
		</div>
	);
};
