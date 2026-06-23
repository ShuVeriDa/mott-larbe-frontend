"use client";

import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
	usePhrasebookCategories,
	usePhrasebookStats,
	usePhrases,
} from "@/entities/phrasebook";
import { usePhrasebookFilters } from "@/features/phrasebook-filters";
import { usePhrasebookParams } from "../model/use-phrasebook-params";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useBulkSavePhrases } from "../model/use-bulk-save-phrases";
import { PhraseListSkeleton } from "./phrase-card-skeleton";
import { PhraseEmptyState } from "./phrase-empty-state";
import { VirtualPhraseList } from "./virtual-phrase-list";

export const PhraseList = () => {
	const { t } = useI18n();
	const scrollRef = useRef<HTMLDivElement>(null);
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
	const { data: stats } = usePhrasebookStats();
	const { mutate: bulkSave, isPending: isSaving } = useBulkSavePhrases();

	const {
		data,
		isPending,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = usePhrases({
		...(categoryId ? { categoryId } : {}),
		...(lang ? { lang } : {}),
		...(savedOnly ? { saved: true as const } : {}),
		...(search ? { search } : {}),
	});

	const { ref: sentinelRef } = useInView({
		rootMargin: "300px",
		threshold: 0,
		onChange: (inView) => {
			if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
		},
	});

	const phrases = data?.pages.flatMap(p => p.items) ?? [];
	const activeCategory = categoryId
		? categories?.find(c => c.id === categoryId)
		: null;

	const totalFromQuery = data?.pages[0]?.total;
	const exactCount = totalFromQuery ?? activeCategory?.phraseCount ?? stats?.totalPhrases;

	const allIds = phrases.map(p => p.id);
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

	const canSelect = !isPending && phrases.length > 0;

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
						{exactCount != null && (
							<span className="text-[12px] text-t-3">
								{t("phrasebook.phraseCount", { count: exactCount })}
							</span>
						)}
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
								<Bookmark className="size-3" />
								{t("phrasebook.selection.saveSelected")}
							</Button>
						</div>
					</div>
				)}
			</div>

			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto flex flex-col pb-1 [&::-webkit-scrollbar]:hidden"
			>
				{isPending ? (
					<PhraseListSkeleton />
				) : phrases.length === 0 ? (
					<PhraseEmptyState />
				) : (
					<>
						<VirtualPhraseList
							phrases={phrases}
							scrollRef={scrollRef}
							selectionMode={selectionMode}
							selectedPhraseIds={selectedPhraseIds}
						/>
						<div ref={sentinelRef} className="h-1 shrink-0" />
						{isFetchingNextPage && <PhraseListSkeleton />}
					</>
				)}
			</div>
		</div>
	);
};
