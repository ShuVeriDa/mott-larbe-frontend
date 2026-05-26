"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminPhrasebookPage } from "../model/use-admin-phrasebook-page";
import { PhrasebookTopbar } from "./phrasebook-topbar";
import { PhrasebookStatsRow } from "./phrasebook-stats-row";
import { PhrasebookTabBar } from "./phrasebook-tab-bar";
import { CategoriesTab } from "./categories-tab";
import { PhrasesTab } from "./phrases-tab";
import { SuggestionsTab } from "./suggestions-tab";
import { CategoryModal } from "./category-modal";
import { PhraseModal } from "./phrase-modal";
import { DeleteConfirmModal } from "./delete-confirm-modal";

export const AdminPhrasebookPage = () => {
	const { t } = useI18n();
	const {
		tab,
		page,
		localSearch,
		categoryId,
		categories,
		phrases,
		phrasesTotal,
		totalPages,
		suggestions,
		categoriesLoading,
		phrasesLoading,
		suggestionsLoading,
		createCategoryOpen,
		editCategory,
		deleteCategory,
		createPhraseOpen,
		editPhrase,
		deletePhrase,
		deleteSuggestionId,
		acceptSuggestion,
		isCreatingCategory,
		isUpdatingCategory,
		isDeletingCategory,
		isCreatingPhrase,
		isUpdatingPhrase,
		isDeletingPhrase,
		isDeletingSuggestion,
		setCreateCategoryOpen,
		setEditCategory,
		setDeleteCategory,
		setCreatePhraseOpen,
		setEditPhrase,
		setDeletePhrase,
		setDeleteSuggestionId,
		setAcceptSuggestion,
		handleTabChange,
		handleSearchChange,
		handleCategoryFilter,
		handlePageChange,
		handleCreateCategory,
		handleUpdateCategory,
		handleDeleteCategory,
		handleCreatePhrase,
		handleUpdatePhrase,
		handleDeletePhrase,
		handleDeleteSuggestion,
	} = useAdminPhrasebookPage();

	const handleOpenAddPhrase = () => {
		setCreatePhraseOpen(true);
	};

	const handleOpenAddCategory = () => {
		setCreateCategoryOpen(true);
	};

	const handleAcceptSuggestion = (s: { id: string; original: string; translation: string; lang: string }) => {
		setAcceptSuggestion(s);
		setCreatePhraseOpen(true);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<PhrasebookTopbar
				categoriesCount={categories.length}
				phrasesCount={phrasesTotal}
				suggestionsCount={suggestions.length}
				onAddCategory={handleOpenAddCategory}
				onAddPhrase={handleOpenAddPhrase}
				t={t}
			/>

			<div className="overflow-y-auto px-[22px] py-4 pb-8 max-sm:px-3.5 max-sm:pb-6">
				<PhrasebookStatsRow
					categoriesCount={categories.length}
					phrasesTotal={phrasesTotal}
					suggestionsCount={suggestions.length}
					isLoading={categoriesLoading || phrasesLoading}
					t={t}
				/>

				<PhrasebookTabBar
					active={tab}
					categoriesCount={categories.length}
					phrasesTotal={phrasesTotal}
					suggestionsCount={suggestions.length}
					onChange={handleTabChange}
					t={t}
				/>

				{tab === "categories" && (
					<CategoriesTab
						categories={categories}
						isLoading={categoriesLoading}
						onEdit={setEditCategory}
						onDelete={setDeleteCategory}
						t={t}
					/>
				)}
				{tab === "phrases" && (
					<PhrasesTab
						phrases={phrases}
						categories={categories}
						isLoading={phrasesLoading}
						search={localSearch}
						categoryId={categoryId}
						total={phrasesTotal}
						page={page}
						totalPages={totalPages}
						onSearchChange={handleSearchChange}
						onCategoryFilter={handleCategoryFilter}
						onPageChange={handlePageChange}
						onEdit={setEditPhrase}
						onDelete={setDeletePhrase}
						t={t}
					/>
				)}
				{tab === "suggestions" && (
					<SuggestionsTab
						suggestions={suggestions}
						isLoading={suggestionsLoading}
						onAccept={handleAcceptSuggestion}
						onDelete={setDeleteSuggestionId}
						t={t}
					/>
				)}
			</div>

			<CategoryModal
				key={editCategory?.id ?? (createCategoryOpen ? "new" : "closed")}
				open={createCategoryOpen || !!editCategory}
				category={editCategory}
				isSubmitting={isCreatingCategory || isUpdatingCategory}
				onCreate={handleCreateCategory}
				onUpdate={handleUpdateCategory}
				onClose={() => { setCreateCategoryOpen(false); setEditCategory(null); }}
				t={t}
			/>

			<PhraseModal
				open={createPhraseOpen || !!editPhrase}
				phrase={editPhrase}
				categories={categories}
				defaultCategoryId={
					acceptSuggestion ? undefined : categoryId
				}
				isSubmitting={isCreatingPhrase || isUpdatingPhrase}
				onCreate={handleCreatePhrase}
				onUpdate={handleUpdatePhrase}
				onClose={() => { setCreatePhraseOpen(false); setEditPhrase(null); setAcceptSuggestion(null); }}
				t={t}
			/>

			<DeleteConfirmModal
				open={!!deleteCategory}
				title={t("adminPhrasebook.deleteCategory.title")}
				description={t("adminPhrasebook.deleteCategory.description")}
				itemLabel={deleteCategory ? `${deleteCategory.emoji} ${deleteCategory.name}` : ""}
				itemSublabel={deleteCategory
					? t("adminPhrasebook.categories.phraseCount").replace("{count}", String(deleteCategory._count.phrases))
					: undefined}
				isDeleting={isDeletingCategory}
				onConfirm={handleDeleteCategory}
				onClose={() => setDeleteCategory(null)}
				t={t}
			/>

			<DeleteConfirmModal
				open={!!deletePhrase}
				title={t("adminPhrasebook.deletePhrase.title")}
				description={t("adminPhrasebook.deletePhrase.description")}
				itemLabel={deletePhrase?.original ?? ""}
				itemSublabel={deletePhrase?.translation}
				isDeleting={isDeletingPhrase}
				onConfirm={handleDeletePhrase}
				onClose={() => setDeletePhrase(null)}
				t={t}
			/>

			<DeleteConfirmModal
				open={!!deleteSuggestionId}
				title={t("adminPhrasebook.deleteSuggestion.title")}
				description={t("adminPhrasebook.deleteSuggestion.description")}
				itemLabel={suggestions.find((s) => s.id === deleteSuggestionId)?.original ?? ""}
				isDeleting={isDeletingSuggestion}
				onConfirm={handleDeleteSuggestion}
				onClose={() => setDeleteSuggestionId(null)}
				t={t}
			/>
		</div>
	);
};
