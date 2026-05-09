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

		const handleAddWord: NonNullable<React.ComponentProps<typeof VocabularyTopbar>["onAddWord"]> = () => setAddWordOpen(true);
	const handleOpenDrawer: NonNullable<React.ComponentProps<typeof VocabularyTopbar>["onOpenDrawer"]> = () => setDrawerOpen(true);
	const handleCreateFolder: NonNullable<React.ComponentProps<typeof VocabularySidebar>["onCreateFolder"]> = () => setCreateFolderOpen(true);
	const handleClose: NonNullable<React.ComponentProps<typeof AddWordModal>["onClose"]> = () => setAddWordOpen(false);
	const handleClose2: NonNullable<React.ComponentProps<typeof CreateFolderModal>["onClose"]> = () => setCreateFolderOpen(false);
	const handleClose3: NonNullable<React.ComponentProps<typeof VocabularyDrawer>["onClose"]> = () => setDrawerOpen(false);
	const handleCreateFolder2: NonNullable<React.ComponentProps<typeof VocabularyDrawer>["onCreateFolder"]> = () => {
					setDrawerOpen(false);
					setCreateFolderOpen(true);
				};
return (
		<>
			<VocabularyTopbar
				onAddWord={handleAddWord}
				onOpenDrawer={handleOpenDrawer}
			/>

			<div className="flex min-h-0 flex-1 overflow-hidden max-md:flex-col max-md:overflow-visible">
				<VocabularySidebar onCreateFolder={handleCreateFolder} />
				<section className="flex min-w-0 flex-1 flex-col overflow-hidden max-md:overflow-visible bg-panel">
					<ReviewBanner lang={lang} />
					<FilterBar />
					<VocabularyList />
				</section>
			</div>

			<AddWordModal open={addWordOpen} onClose={handleClose} />
			<CreateFolderModal
				open={createFolderOpen}
				onClose={handleClose2}
			/>
			<VocabularyDrawer
				open={drawerOpen}
				onClose={handleClose3}
				onCreateFolder={handleCreateFolder2}
			/>
		</>
	);
};
