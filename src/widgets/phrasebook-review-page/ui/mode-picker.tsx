"use client";

import type { ChangeEvent } from "react";
import { usePhrasebookCategories } from "@/entities/phrasebook";
import { useI18n } from "@/shared/lib/i18n";
import type { PhraseReviewMode } from "../model";
import { ModeTab } from "./mode-tab";

interface ModePickerProps {
	mode: PhraseReviewMode;
	selectedCategoryId: string | undefined;
	onModeChange: (mode: PhraseReviewMode) => void;
	onCategoryChange: (id: string | undefined) => void;
}

export const ModePicker = ({ mode, selectedCategoryId, onModeChange, onCategoryChange }: ModePickerProps) => {
	const { t } = useI18n();
	const { data: categories } = usePhrasebookCategories();

	const handleAll = () => {
		onModeChange("all");
		onCategoryChange(undefined);
	};
	const handleCategory = () => {
		onModeChange("category");
		if (!selectedCategoryId && categories?.[0]) {
			onCategoryChange(categories[0].id);
		}
	};
	const handleSaved = () => {
		onModeChange("saved");
		onCategoryChange(undefined);
	};
	const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		onCategoryChange(e.currentTarget.value || undefined);
	};

	return (
		<div className="flex w-full max-w-[340px] flex-col items-center gap-2 max-md:max-w-full">
			<div className="flex w-full gap-1 rounded-base border-[0.5px] border-bd-2 bg-surf-2 p-0.5">
				<ModeTab
					label={t("phrasebook.review.startReview")}
					shortLabel={t("phrasebook.review.startReviewShort")}
					active={mode === "all"}
					onClick={handleAll}
				/>
				<ModeTab
					label={t("phrasebook.review.startCategory")}
					shortLabel={t("phrasebook.review.startCategoryShort")}
					active={mode === "category"}
					onClick={handleCategory}
				/>
				<ModeTab
					label={t("phrasebook.review.startSaved")}
					shortLabel={t("phrasebook.review.startSavedShort")}
					active={mode === "saved"}
					onClick={handleSaved}
				/>
			</div>

			{mode === "category" && categories && categories.length > 0 ? (
				<select
					value={selectedCategoryId ?? ""}
					onChange={handleSelectChange}
					aria-label={t("phrasebook.review.categorySelect.label")}
					className="w-full rounded-base border-[0.5px] border-bd-2 bg-surf px-3 py-2 text-[13px] text-t-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-acc/60 focus-visible:border-acc"
				>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.emoji} {cat.name} ({cat.phraseCount})
						</option>
					))}
				</select>
			) : null}
		</div>
	);
};
