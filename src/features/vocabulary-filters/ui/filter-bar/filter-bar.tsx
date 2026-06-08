"use client";

import type { DictionarySort } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { CEFR_LEVELS, LEARNING_LEVELS } from "@/shared/types";
import type { LearningLevel, CefrLevel } from "@/shared/types";
import { FilterGroup } from "@/shared/ui/filter-group";
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

export const FilterBar = () => {
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
		<div
			className="@container shrink-0 border-b-[0.5px] border-bd-1 bg-surf transition-colors duration-200 max-md:hidden"
			role="toolbar"
			aria-label={t("vocabulary.openFilters")}
		>
			{/* Wide: one row */}
			<div className="hidden items-center gap-1.5 px-[18px] py-2.5 @[700px]:flex">
				<FilterGroup
					label={t("vocabulary.filterByStatus")}
					options={statusOptions}
					value={status}
					onValueChange={setStatus}
				/>
				<span aria-hidden="true" className="h-4 w-px shrink-0 bg-bd-2" />
				<FilterGroup
					label={t("vocabulary.filterByLevel")}
					options={levelOptions}
					value={cefrLevel}
					onValueChange={setCefrLevel}
				/>
				<Select
					wrapperClassName="ml-auto w-auto shrink-0"
					className="h-[26px]! text-[11px]!"
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

			{/* Narrow: two aligned rows */}
			<div
				className="grid px-[18px] py-2 @[700px]:hidden"
				style={{ gridTemplateColumns: "auto 1fr" }}
			>
				<Typography
					tag="span"
					className="flex items-center whitespace-nowrap pr-3 text-[11px] font-medium text-t-3"
				>
					{t("vocabulary.filterByStatus")}
				</Typography>
				<div className="flex items-center gap-1.5 py-1">
					<FilterGroup options={statusOptions} value={status} onValueChange={setStatus} />
				</div>

				<Typography
					tag="span"
					className="flex items-center whitespace-nowrap pr-3 text-[11px] font-medium text-t-3"
				>
					{t("vocabulary.filterByLevel")}
				</Typography>
				<div className="flex items-center gap-1.5 py-1">
					<FilterGroup options={levelOptions} value={cefrLevel} onValueChange={setCefrLevel} />
					<Select
						wrapperClassName="ml-auto w-auto shrink-0"
						className="h-[26px]! text-[11px]!"
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
		</div>
	);
};
