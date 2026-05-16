"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Input } from "@/shared/ui/input";
import { SearchIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import type { LemmaSearchResult } from "../api";
import { LemmaResultItem } from "./lemma-result-item";

interface LemmaSearchSectionProps {
	query: string;
	isSearching: boolean;
	results: LemmaSearchResult[];
	selectedLemmaId: string | null;
	onQueryChange: (e: ChangeEvent<HTMLInputElement>) => void;
	onSelectLemma: (lemma: LemmaSearchResult) => void;
}

export const LemmaSearchSection = ({
	query,
	isSearching,
	results,
	selectedLemmaId,
	onQueryChange,
	onSelectLemma,
}: LemmaSearchSectionProps) => {
	const { t } = useI18n();

	return (
		<div className="border-t border-hairline border-bd-1 px-5 py-3">
			<div className="relative mb-2">
				<SearchIcon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-t-3" />
				<Input
					value={query}
					onChange={onQueryChange}
					placeholder={t("reader.annotate.searchPlaceholder")}
					className="bg-white pl-8"
					autoFocus
				/>
			</div>
			<div className="max-h-[150px] overflow-y-auto rounded-base border border-hairline border-bd-1">
				{isSearching ? (
					<div className="flex items-center justify-center py-5">
						<div className="size-4 animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
					</div>
				) : results.length > 0 ? (
					<div className="p-1">
						{results.map(lemma => (
							<LemmaResultItem
								key={lemma.id}
								lemma={lemma}
								selected={selectedLemmaId === lemma.id}
								onSelect={() => onSelectLemma(lemma)}
							/>
						))}
					</div>
				) : query.trim().length >= 2 ? (
					<div className="py-5 text-center text-[12px] text-t-3">
						{t("reader.annotate.noResults")}
					</div>
				) : (
					<div className="py-5 text-center text-[12px] text-t-3">
						{t("reader.annotate.searchHint")}
					</div>
				)}
			</div>
		</div>
	);
};
