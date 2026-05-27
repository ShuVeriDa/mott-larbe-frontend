"use client";

import type { DictionarySort } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { CEFR_LEVELS, LEARNING_LEVELS } from "@/shared/types";
import { Chip } from "@/shared/ui/chip";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { ComponentProps } from "react";
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

export const FilterControls = () => {
	const { t } = useI18n();
	const status = useVocabularyFilters(s => s.status);
	const cefrLevel = useVocabularyFilters(s => s.cefrLevel);
	const sort = useVocabularyFilters(s => s.sort);
	const setStatus = useVocabularyFilters(s => s.setStatus);
	const setCefrLevel = useVocabularyFilters(s => s.setCefrLevel);
	const setSort = useVocabularyFilters(s => s.setSort);

	const handleAllStatus: NonNullable<ComponentProps<typeof Chip>["onClick"]> = () => setStatus(null);
	const handleAllLevel: NonNullable<ComponentProps<typeof Chip>["onClick"]> = () => setCefrLevel(null);
	const handleSortChange: NonNullable<ComponentProps<typeof Select>["onChange"]> = e =>
		setSort(e.currentTarget.value as DictionarySort);

	return (
		<div className="flex flex-col gap-3">
			{/* Status */}
			<div>
				<Typography tag="p" className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
					{t("vocabulary.filterByStatus")}
				</Typography>
				<div className="flex flex-wrap gap-1.5">
					<Chip active={status === null} onClick={handleAllStatus}>
						{t("vocabulary.all")}
					</Chip>
					{LEARNING_LEVELS.map(level => {
						const handleClick: NonNullable<ComponentProps<typeof Chip>["onClick"]> =
							() => setStatus(level);
						return (
							<Chip key={level} active={status === level} onClick={handleClick}>
								{t(STATUS_LABELS[level])}
							</Chip>
						);
					})}
				</div>
			</div>

			{/* Level */}
			<div>
				<Typography tag="p" className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
					{t("vocabulary.filterByLevel")}
				</Typography>
				<div className="flex flex-wrap gap-1.5">
					<Chip active={cefrLevel === null} onClick={handleAllLevel}>
						{t("vocabulary.all")}
					</Chip>
					{CEFR_LEVELS.map(level => {
						const handleClick: NonNullable<ComponentProps<typeof Chip>["onClick"]> =
							() => setCefrLevel(level);
						return (
							<Chip key={level} active={cefrLevel === level} onClick={handleClick}>
								{level}
							</Chip>
						);
					})}
				</div>
			</div>

			{/* Sort */}
			<div>
				<Typography tag="p" className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
					{t("vocabulary.sort.label")}
				</Typography>
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
