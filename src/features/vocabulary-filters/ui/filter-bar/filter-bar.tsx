"use client";

import { Chip } from "@/shared/ui/chip";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { CEFR_LEVELS, LEARNING_LEVELS } from "@/shared/types";
import type { DictionarySort } from "@/entities/dictionary";
import { useVocabularyFilters } from "../../model";

const STATUS_LABELS: Record<string, string> = {
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

export const FilterBar = () => {
	const { t } = useI18n();
	const status = useVocabularyFilters((s) => s.status);
	const cefrLevel = useVocabularyFilters((s) => s.cefrLevel);
	const sort = useVocabularyFilters((s) => s.sort);
	const setStatus = useVocabularyFilters((s) => s.setStatus);
	const setCefrLevel = useVocabularyFilters((s) => s.setCefrLevel);
	const setSort = useVocabularyFilters((s) => s.setSort);

	return (
		<div
			className="flex shrink-0 items-center gap-1.5 overflow-x-auto border-hairline border-b border-bd-1 bg-surf px-[18px] py-2.5 transition-colors duration-200 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden max-md:px-[14px]"
			role="toolbar"
			aria-label={t("vocabulary.openFilters")}
		>
			<Typography
				tag="span"
				className="shrink-0 whitespace-nowrap text-[11px] font-medium text-t-3 max-md:hidden"
			>
				{t("vocabulary.filterByStatus")}
			</Typography>
			<Chip active={status === null} onClick={() => setStatus(null)}>
				{t("vocabulary.all")}
			</Chip>
			{LEARNING_LEVELS.map((level) => (
				<Chip
					key={level}
					active={status === level}
					onClick={() => setStatus(level)}
				>
					{t(STATUS_LABELS[level])}
				</Chip>
			))}

			<span
				aria-hidden="true"
				className="h-4 w-px shrink-0 bg-bd-2 max-md:hidden"
			/>

			<Typography
				tag="span"
				className="shrink-0 whitespace-nowrap text-[11px] font-medium text-t-3 max-md:hidden"
			>
				{t("vocabulary.filterByLevel")}
			</Typography>
			<Chip
				active={cefrLevel === null}
				onClick={() => setCefrLevel(null)}
			>
				{t("vocabulary.all")}
			</Chip>
			{CEFR_LEVELS.map((level) => (
				<Chip
					key={level}
					active={cefrLevel === level}
					onClick={() => setCefrLevel(level)}
				>
					{level}
				</Chip>
			))}

			<Select
				wrapperClassName="ml-auto w-auto shrink-0"
				className="!h-[26px] !text-[11px]"
				value={sort}
				onChange={(e) => setSort(e.target.value as DictionarySort)}
				aria-label={t("vocabulary.sort.added")}
			>
				{SORT_OPTIONS.map((opt) => (
					<option key={opt} value={opt}>
						{t(SORT_LABEL_KEY[opt])}
					</option>
				))}
			</Select>
		</div>
	);
};
