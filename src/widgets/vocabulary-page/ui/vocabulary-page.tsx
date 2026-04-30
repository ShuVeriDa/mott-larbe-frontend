"use client";

import { AddWordModal } from "@/features/add-word";
import { CreateFolderModal } from "@/features/create-folder";
import { ReviewBanner } from "@/features/review-banner";
import { FilterBar } from "@/features/vocabulary-filters";
import { useI18n } from "@/shared/lib/i18n";
import { VocabularyDrawer } from "@/widgets/vocabulary-drawer";
import { VocabularyList } from "@/widgets/vocabulary-list";
import { VocabularySidebar } from "@/widgets/vocabulary-sidebar";
import { VocabularyTopbar } from "@/widgets/vocabulary-topbar";
import { useState } from "react";

export const VocabularyPage = () => {
	const { lang } = useI18n();
	const [addWordOpen, setAddWordOpen] = useState(false);
	const [createFolderOpen, setCreateFolderOpen] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<>
			<VocabularyTopbar
				onAddWord={() => setAddWordOpen(true)}
				onOpenDrawer={() => setDrawerOpen(true)}
			/>

			<div className="flex min-h-0 flex-1 overflow-hidden max-md:flex-col max-md:overflow-visible">
				<VocabularySidebar onCreateFolder={() => setCreateFolderOpen(true)} />
				<section className="flex min-w-0 flex-1 flex-col overflow-hidden max-md:overflow-visible bg-panel">
					<ReviewBanner lang={lang} />
					<FilterBar />
					<VocabularyList />
				</section>
			</div>

			<AddWordModal open={addWordOpen} onClose={() => setAddWordOpen(false)} />
			<CreateFolderModal
				open={createFolderOpen}
				onClose={() => setCreateFolderOpen(false)}
			/>
			<VocabularyDrawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				onCreateFolder={() => {
					setDrawerOpen(false);
					setCreateFolderOpen(true);
				}}
			/>
		</>
	);
};
