"use client";

import {
	usePhrasebookCategories,
	usePhrases,
	type PhrasesQuery,
} from "@/entities/phrasebook";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { usePhrasebookParams } from "../model/use-phrasebook-params";
import { useDebounce } from "@/shared/lib/debounce";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { toast } from "sonner";
import { useBulkSavePhrases } from "../model/use-bulk-save-phrases";
import { PhraseCard } from "./phrase-card";
import { PhraseListSkeleton } from "./phrase-card-skeleton";
import { PhraseEmptyState } from "./phrase-empty-state";

export const PhraseList = () => {
	const { t } = useI18n();
	const { categoryId, lang, savedOnly } = usePhrasebookParams();
	const {
		search,
		selectionMode,
		selectedPhraseIds,
		enterSelectionMode,
		selectAllPhrases,
		clearSelection,
	} = usePhrasebookFilters();
	const { data: categories } = usePhrasebookCategories();
	const debouncedSearch = useDebounce(search, 300);
	const { mutate: bulkSave, isPending: isSaving } = useBulkSavePhrases();

	const query: PhrasesQuery = {
		...(categoryId ? { categoryId } : {}),
		...(lang ? { lang } : {}),
		...(savedOnly ? { saved: true as const } : {}),
		...(debouncedSearch ? { search: debouncedSearch } : {}),
	};

	const { data: phrases, isPending } = usePhrases(query);

	const activeCategory = categoryId
		? categories?.find(c => c.id === categoryId)
		: null;

	const allIds = phrases?.map(p => p.id) ?? [];
	const allSelected = allIds.length > 0 && allIds.every(id => selectedPhraseIds.has(id));

	const handleToggleSelectAll = () => {
		if (allSelected) clearSelection();
		else selectAllPhrases(allIds);
	};

	const handleBulkSave = () => {
		if (isSaving || selectedPhraseIds.size === 0) return;
		const ids = Array.from(selectedPhraseIds);
		bulkSave(ids, {
			onSuccess: () => {
				clearSelection();
				toast.success(t("phrasebook.selection.saved", { count: ids.length }));
			},
		});
	};

	const canSelect = !isPending && !!phrases?.length;

	return (
		<div className="flex-1 flex flex-col min-w-0 gap-2.5">
			<div className="flex items-center gap-1.5 shrink-0 min-h-[30px]">
				{!selectionMode && (
					<>
						{activeCategory && (
							<>
								<span className="text-[16px]" aria-hidden="true">{activeCategory.emoji}</span>
								<h2 className="font-display text-[14px] font-semibold text-t-1">
									{activeCategory.name}
								</h2>
							</>
						)}
						{phrases?.length ? (
							<span className="text-[12px] text-t-3">
								{t("phrasebook.phraseCount", { count: phrases.length })}
							</span>
						) : null}
						{canSelect && (
							<Button variant="ghost" onClick={enterSelectionMode} className="ml-auto">
								{t("phrasebook.selection.enter")}
							</Button>
						)}
					</>
				)}

				{selectionMode && (
					<div className="flex items-center gap-2 w-full">
						<Button variant="ghost" onClick={handleToggleSelectAll}>
							{allSelected
								? t("phrasebook.selection.deselectAll")
								: t("phrasebook.selection.selectAll")}
						</Button>
						<span className="text-[12px] text-t-3">
							{t("phrasebook.selection.count", { count: selectedPhraseIds.size })}
						</span>
						<div className="ml-auto flex items-center gap-2">
							<Button variant="ghost" onClick={clearSelection}>
								{t("phrasebook.selection.cancel")}
							</Button>
							<Button variant="save" onClick={handleBulkSave} disabled={isSaving}>
								<svg
									viewBox="0 0 16 16"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									className="size-3"
								>
									<path d="M3 2h10v12l-5-3-5 3V2z" />
								</svg>
								{t("phrasebook.selection.saveSelected")}
							</Button>
						</div>
					</div>
				)}
			</div>

			<div className="flex-1 overflow-y-auto flex flex-col gap-1.5 pb-1 [&::-webkit-scrollbar]:hidden">
				{isPending ? (
					<PhraseListSkeleton />
				) : !phrases?.length ? (
					<PhraseEmptyState />
				) : (
					phrases.map(phrase => (
						<PhraseCard
							key={phrase.id}
							phrase={phrase}
							selectionMode={selectionMode}
							selected={selectedPhraseIds.has(phrase.id)}
						/>
					))
				)}
			</div>
		</div>
	);
};
