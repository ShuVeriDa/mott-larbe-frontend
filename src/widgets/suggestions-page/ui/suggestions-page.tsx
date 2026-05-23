"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { useSuggestionsPage } from "../model/use-suggestions-page";
import { SuggestionCard } from "./suggestion-card";

export const SuggestionsPage = () => {
	const { t } = useI18n();
	const {
		suggestions,
		isLoading,
		isError,
		statusFilter,
		handleStatusChange,
	} = useSuggestionsPage();

	return (
		<main className="mx-auto max-w-2xl px-4 py-8">
			<div className="mb-6 flex items-center justify-between gap-4">
				<Typography tag="h1" className="font-display text-[22px] font-bold text-t-1">
					{t("suggestions.title")}
				</Typography>
				<Select
					value={statusFilter ?? ""}
					onChange={handleStatusChange}
					wrapperClassName="w-auto"
					variant="sm"
				>
					<option value="">{t("adminSuggestions.filter.all")}</option>
					<option value="PENDING">{t("adminSuggestions.filter.pending")}</option>
					<option value="APPROVED">{t("adminSuggestions.filter.approved")}</option>
					<option value="REJECTED">{t("adminSuggestions.filter.rejected")}</option>
				</Select>
			</div>

			{isLoading && (
				<Typography tag="p" className="text-t-3 text-[13px]">
					{t("vocabulary.wordDetail.states.loading")}
				</Typography>
			)}

			{isError && (
				<Typography tag="p" className="text-red text-[13px]">
					{t("vocabulary.wordDetail.states.error")}
				</Typography>
			)}

			{!isLoading && !isError && suggestions.length === 0 && (
				<Typography tag="p" className="text-t-3 text-[13px]">
					{t("suggestions.empty")}
				</Typography>
			)}

			{!isLoading && !isError && suggestions.length > 0 && (
				<ul className="flex flex-col gap-3">
					{suggestions.map((s) => (
						<li key={s.id}>
							<SuggestionCard suggestion={s} />
						</li>
					))}
				</ul>
			)}
		</main>
	);
};
