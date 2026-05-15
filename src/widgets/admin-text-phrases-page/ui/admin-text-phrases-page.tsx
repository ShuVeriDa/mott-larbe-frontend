"use client";

import { ComponentProps } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import { useAdminTextPhrasesPage } from "../model/use-admin-text-phrases-page";
import { PhrasesTopbar } from "./phrases-topbar";
import { PhrasesLeftColumn } from "./phrases-left-column";
import { PhraseCard } from "./phrase-card";
import { PhraseCreateModal } from "./phrase-create-modal";
import { PhraseDeleteModal } from "./phrase-delete-modal";
import { PhraseOccurrenceDeleteModal } from "./phrase-occurrence-delete-modal";
import type { TextPhraseListItem } from "@/entities/text-phrase";

export const AdminTextPhrasesPage = () => {
	const { t, lang } = useI18n();

	const {
		selectedId,
		page,
		language,
		localSearch,
		createOpen,
		deleteTarget,
		deleteOccurrenceTarget,
		editMode,
		editTranslation,
		editNotes,
		listQuery,
		detailQuery,
		total,
		totalPages,
		LIMIT,
		isCreating,
		isUpdating,
		isDeleting,
		isDeletingOccurrence,
		setCreateOpen,
		setDeleteTarget,
		setDeleteOccurrenceTarget,
		setEditTranslation,
		setEditNotes,
		handleSearchChange,
		handleLanguageChange,
		handleSelectPhrase,
		handleSetPage,
		handleStartEdit,
		handleCancelEdit,
		handleSaveEdit,
		handleCreate,
		handleDeleteConfirm,
		handleDeleteOccurrenceConfirm,
	} = useAdminTextPhrasesPage();

	const items = listQuery.data?.items ?? [];

	const handleCreateOpen: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		setCreateOpen(true);
	const handleCreateClose = () => setCreateOpen(false);
	const handleDeleteClose = () => setDeleteTarget(null);
	const handleDeleteOccurrenceClose = () => setDeleteOccurrenceTarget(null);

	const handleEditPhrase = (item: TextPhraseListItem) => {
		handleSelectPhrase(item.id);
		handleStartEdit();
	};

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<PhrasesTopbar
				total={total}
				isLoading={listQuery.isLoading}
				t={t}
				actions={
					<Button
						variant="action"
						size="default"
						onClick={handleCreateOpen}
					>
						<Plus className="size-[11px]" strokeWidth={2.5} />
						{t("admin.textPhrases.newPhrase")}
					</Button>
				}
			/>

			<div className="flex flex-1 overflow-hidden max-sm:flex-col">
				{/* Left column */}
				<div className="flex w-[320px] shrink-0 flex-col overflow-hidden bg-surf max-sm:h-[50vh] max-sm:w-full max-sm:border-b max-sm:border-bd-1">
					<PhrasesLeftColumn
						items={items}
						isLoading={listQuery.isLoading}
						selectedId={selectedId}
						search={localSearch}
						language={language}
						page={page}
						totalPages={totalPages}
						total={total}
						limit={LIMIT}
						onSearchChange={handleSearchChange}
						onLanguageChange={handleLanguageChange}
						onSelectPhrase={handleSelectPhrase}
						onEditPhrase={handleEditPhrase}
						onDeletePhrase={setDeleteTarget}
						onPageChange={handleSetPage}
						onCreateOpen={() => setCreateOpen(true)}
						t={t}
					/>
				</div>

				{/* Right column */}
				<div className="min-w-0 flex-1 overflow-y-auto bg-surf max-sm:flex-1">
					<PhraseCard
						phrase={detailQuery.data}
						isLoading={detailQuery.isLoading && Boolean(selectedId)}
						editMode={editMode}
						editTranslation={editTranslation}
						editNotes={editNotes}
						isSaving={isUpdating}
						lang={lang}
						onStartEdit={handleStartEdit}
						onCancelEdit={handleCancelEdit}
						onSaveEdit={handleSaveEdit}
						onTranslationChange={setEditTranslation}
						onNotesChange={setEditNotes}
						onDelete={setDeleteTarget}
						onDeleteOccurrence={setDeleteOccurrenceTarget}
						t={t}
					/>
				</div>
			</div>

			<PhraseCreateModal
				open={createOpen}
				isSubmitting={isCreating}
				onSubmit={handleCreate}
				onClose={handleCreateClose}
				t={t}
			/>

			<PhraseDeleteModal
				phrase={deleteTarget}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={handleDeleteClose}
				t={t}
			/>

			<PhraseOccurrenceDeleteModal
				occurrence={deleteOccurrenceTarget}
				isDeleting={isDeletingOccurrence}
				onConfirm={handleDeleteOccurrenceConfirm}
				onClose={handleDeleteOccurrenceClose}
				t={t}
			/>
		</div>
	);
};
