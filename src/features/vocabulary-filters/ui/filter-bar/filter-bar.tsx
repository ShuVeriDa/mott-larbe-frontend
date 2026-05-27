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

export const FilterBar = () => {
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
		<div
			className="@container shrink-0 border-[0.5px] border-b border-bd-1 bg-surf transition-colors duration-200 max-md:hidden"
			role="toolbar"
			aria-label={t("vocabulary.openFilters")}
		>
			{/* Wide: one row */}
			<div className="hidden items-center gap-1.5 px-[18px] py-2.5 @[700px]:flex">
				<Typography tag="span" className="shrink-0 whitespace-nowrap text-[11px] font-medium text-t-3">
					{t("vocabulary.filterByStatus")}
				</Typography>
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
				<span aria-hidden="true" className="h-4 w-px shrink-0 bg-bd-2" />
				<Typography tag="span" className="shrink-0 whitespace-nowrap text-[11px] font-medium text-t-3">
					{t("vocabulary.filterByLevel")}
				</Typography>
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
				<Typography tag="span" className="flex items-center whitespace-nowrap pr-3 text-[11px] font-medium text-t-3">
					{t("vocabulary.filterByStatus")}
				</Typography>
				<div className="flex items-center gap-1.5 py-1">
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

				<Typography tag="span" className="flex items-center whitespace-nowrap pr-3 text-[11px] font-medium text-t-3">
					{t("vocabulary.filterByLevel")}
				</Typography>
				<div className="flex items-center gap-1.5 py-1">
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
