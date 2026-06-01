"use client";

import { ReviewBanner } from "@/features/review-banner";
import { FilterBar } from "@/features/vocabulary-filters";
import { useI18n } from "@/shared/lib/i18n";
import { VocabularyList } from "@/widgets/vocabulary-list";
import { VocabularySidebar } from "@/widgets/vocabulary-sidebar";
import { VocabularyTopbar } from "@/widgets/vocabulary-topbar";
import dynamic from "next/dynamic";
import { ComponentProps, useState } from 'react';

const AddWordModal = dynamic(() =>
	import("@/features/add-word").then((m) => m.AddWordModal),
);
const CreateFolderModal = dynamic(() =>
	import("@/features/create-folder").then((m) => m.CreateFolderModal),
);
const VocabularyDrawer = dynamic(() =>
	import("@/widgets/vocabulary-drawer").then((m) => m.VocabularyDrawer),
);
export const VocabularyPage = () => {
	const { lang, t } = useI18n();
	const [addWordOpen, setAddWordOpen] = useState(false);
	const [createFolderOpen, setCreateFolderOpen] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

		const handleAddWord: NonNullable<ComponentProps<typeof VocabularyTopbar>["onAddWord"]> = () => setAddWordOpen(true);
	const handleOpenDrawer: NonNullable<ComponentProps<typeof VocabularyTopbar>["onOpenDrawer"]> = () => setDrawerOpen(true);
	const handleCreateFolder: NonNullable<ComponentProps<typeof VocabularySidebar>["onCreateFolder"]> = () => setCreateFolderOpen(true);
	const handleAddWordClose: NonNullable<ComponentProps<typeof AddWordModal>["onClose"]> = () => setAddWordOpen(false);
	const handleCreateFolderClose: NonNullable<ComponentProps<typeof CreateFolderModal>["onClose"]> = () => setCreateFolderOpen(false);
	const handleDrawerClose: NonNullable<ComponentProps<typeof VocabularyDrawer>["onClose"]> = () => setDrawerOpen(false);
	const handleDrawerCreateFolder: NonNullable<ComponentProps<typeof VocabularyDrawer>["onCreateFolder"]> = () => {
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
				<section className="flex min-w-0 flex-1 flex-col overflow-hidden max-md:overflow-visible bg-panel" aria-labelledby="vocabulary-words-heading">
					<h2 id="vocabulary-words-heading" className="sr-only">{t("vocabulary.title")}</h2>
					<ReviewBanner lang={lang} />
					<FilterBar />
					<VocabularyList />
				</section>
			</div>

			<AddWordModal open={addWordOpen} onClose={handleAddWordClose} />
			<CreateFolderModal
				open={createFolderOpen}
				onClose={handleCreateFolderClose}
			/>
			<VocabularyDrawer
				open={drawerOpen}
				onClose={handleDrawerClose}
				onCreateFolder={handleDrawerCreateFolder}
			/>
		</>
	);
};
