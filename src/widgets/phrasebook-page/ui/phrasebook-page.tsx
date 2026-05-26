"use client";

import { usePhrasebookCategories } from "@/entities/phrasebook";
import { SuggestPhraseModal } from "@/features/suggest-phrase";
import { useState } from "react";
import { PhrasebookCategoryChips } from "./phrasebook-category-chips";
import { PhrasebookCategorySidebar } from "./phrasebook-category-sidebar";
import { PhrasebookFilters } from "./phrasebook-filters";
import { PhrasebookMobileFilters } from "./phrasebook-mobile-filters";
import { PhrasebookMobileOverview } from "./phrasebook-mobile-overview";
import { PhrasebookMobileTopbar } from "./phrasebook-mobile-topbar";
import { PhrasebookOverview } from "./phrasebook-overview";
import { PhrasebookTopbar } from "./phrasebook-topbar";
import { PhraseList } from "./phrase-list";

export const PhrasebookPage = () => {
	const [suggestOpen, setSuggestOpen] = useState(false);
	const { data: categories } = usePhrasebookCategories();

	const handleSuggestOpen = () => setSuggestOpen(true);
	const handleSuggestClose = () => setSuggestOpen(false);

	return (
		<>
			{/* ── Desktop topbar ── */}
			<div className="max-md:hidden">
				<PhrasebookTopbar />
			</div>

			{/* ── Mobile topbar ── */}
			<div className="md:hidden">
				<PhrasebookMobileTopbar />
			</div>

			{/* ── Mobile: overview stats ── */}
			<div className="md:hidden">
				<PhrasebookMobileOverview />
			</div>

			{/* ── Mobile: category chips ── */}
			<div className="md:hidden">
				<PhrasebookCategoryChips />
			</div>

			{/* ── Mobile: filters ── */}
			<div className="md:hidden">
				<PhrasebookMobileFilters />
			</div>

			{/* ── Main content ── */}
			<div className="flex min-h-0 flex-1 overflow-hidden flex-col">
				<div className="flex flex-col gap-3.5 p-[22px] flex-1 min-h-0 overflow-auto max-md:p-0 max-md:overflow-hidden">
					{/* Desktop: overview strip */}
					<div className="max-md:hidden">
						<PhrasebookOverview
							categoriesCount={categories?.length}
							onSuggest={handleSuggestOpen}
						/>
					</div>

					{/* Desktop: filters */}
					<div className="max-md:hidden">
						<PhrasebookFilters />
					</div>

					{/* Desktop + mobile: body layout */}
					<div className="flex gap-3.5 flex-1 min-h-0 max-md:flex-col max-md:gap-0 max-md:flex-1">
						{/* Desktop: category sidebar */}
						<div className="max-md:hidden">
							<PhrasebookCategorySidebar />
						</div>

						{/* Phrase list */}
						<div className="flex-1 min-w-0 flex flex-col max-md:overflow-hidden max-md:flex-1">
							<div className="flex-1 overflow-y-auto flex flex-col gap-1.5 max-md:px-3 max-md:py-2.5 max-md:pb-[calc(72px+env(safe-area-inset-bottom)+8px)] [&::-webkit-scrollbar]:hidden">
								<PhraseList />
							</div>
						</div>
					</div>
				</div>
			</div>

			<SuggestPhraseModal open={suggestOpen} onClose={handleSuggestClose} />
		</>
	);
};
