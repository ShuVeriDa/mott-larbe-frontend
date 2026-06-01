"use client";

import {
	usePhrasebookCategories,
	usePhrases,
	type PhrasesQuery,
} from "@/entities/phrasebook";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { useDebounce } from "@/shared/lib/debounce";
import { useI18n } from "@/shared/lib/i18n";
import { PhraseCard } from "./phrase-card";
import { PhraseListSkeleton } from "./phrase-card-skeleton";
import { PhraseEmptyState } from "./phrase-empty-state";

export const PhraseList = () => {
	const { t } = useI18n();
	const { activeCategoryId, lang, savedOnly, search } = usePhrasebookFilters();
	const { data: categories } = usePhrasebookCategories();
	const debouncedSearch = useDebounce(search, 300);

	const query: PhrasesQuery = {
		...(activeCategoryId ? { categoryId: activeCategoryId } : {}),
		...(lang ? { lang } : {}),
		...(savedOnly ? { saved: true as const } : {}),
		...(debouncedSearch ? { search: debouncedSearch } : {}),
	};

	const { data: phrases, isPending } = usePhrases(query);

	const activeCategory = activeCategoryId
		? categories?.find(c => c.id === activeCategoryId)
		: null;

	return (
		<div className="flex-1 flex flex-col min-w-0 gap-2.5">
			{activeCategory && (
				<div className="flex items-center gap-1.5 shrink-0">
					<span className="text-[16px]" aria-hidden="true">{activeCategory.emoji}</span>
					<h2 className="font-display text-[14px] font-semibold text-t-1">
						{activeCategory.name}
					</h2>
					<span className="text-[12px] text-t-3">
						{phrases?.length
							? t("phrasebook.phraseCount", { count: phrases.length })
							: ""}
					</span>
				</div>
			)}

			<div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pb-1 [&::-webkit-scrollbar]:hidden">
				{isPending ? (
					<PhraseListSkeleton />
				) : !phrases?.length ? (
					<PhraseEmptyState />
				) : (
					phrases.map(phrase => <PhraseCard key={phrase.id} phrase={phrase} />)
				)}
			</div>
		</div>
	);
};
