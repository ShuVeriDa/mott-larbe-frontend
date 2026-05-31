import { ChangeEvent } from "react";
import { AdminTopbar } from "@/shared/ui/admin-topbar";
import { Select } from "@/shared/ui/select";
import type { SuggestionType } from "@/features/suggestions";

interface SuggestionsTopbarProps {
	total: number;
	isLoading: boolean;
	typeFilter: SuggestionType | undefined;
	onTypeFilterChange: (e: ChangeEvent<HTMLSelectElement>) => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const SuggestionsTopbar = ({
	total, isLoading, typeFilter, onTypeFilterChange, t,
}: SuggestionsTopbarProps) => (
	<AdminTopbar
		title={t("adminSuggestions.title")}
		subtitle={t("adminSuggestions.subtitle", { total })}
		isLoading={isLoading}
	>
		<Select value={typeFilter ?? ""} onChange={onTypeFilterChange} wrapperClassName="w-auto shrink-0" variant="sm">
			<option value="">{t("adminSuggestions.typeFilter.all")}</option>
			<option value="entry">{t("adminSuggestions.typeFilter.entry")}</option>
			<option value="text">{t("adminSuggestions.typeFilter.text")}</option>
		</Select>
	</AdminTopbar>
);
