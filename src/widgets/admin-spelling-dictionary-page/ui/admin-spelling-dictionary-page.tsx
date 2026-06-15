"use client";

import { Plus, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AdminCard } from "@/shared/ui/admin-card";
import { Typography } from "@/shared/ui/typography";
import { useI18n } from "@/shared/lib/i18n";
import { useAdminSpellingDictionaryPage } from "../model/use-admin-spelling-dictionary-page";
import { SpellingEntriesTable } from "./spelling-entries-table";
import { SpellingEntryFormModal } from "./spelling-entry-form-modal";
import { SpellingEntryDeleteDialog } from "./spelling-entry-delete-dialog";
import { SpellingPagination } from "./spelling-pagination";

export const AdminSpellingDictionaryPage = () => {
	const { t } = useI18n();
	const {
		page,
		limit,
		search,
		query,
		total,
		modalOpen,
		editEntry,
		deleteEntry,
		isSubmitting,
		isDeleting,
		handleSearchChange,
		handleLimitChange,
		setPage,
		openCreate,
		openEdit,
		handleModalSubmit,
		openDelete,
		setDeleteEntry,
		handleDeleteConfirm,
		setModalOpen,
		setEditEntry,
	} = useAdminSpellingDictionaryPage();

	const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		handleSearchChange(e.currentTarget.value);

	const handleModalClose = () => {
		setModalOpen(false);
		setEditEntry(null);
	};

	const handleDeleteClose = () => setDeleteEntry(null);

	const items = query.data?.items ?? [];

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-[18px] py-3 transition-colors">
				<div>
					<Typography tag="h1" className="font-display text-[16px] text-t-1">
						{t("admin.spellingDictionary.title")}
					</Typography>
					<Typography tag="p" className="mt-px text-[12px] text-t-3">
						{total > 0
							? t("admin.spellingDictionary.entriesCount", { count: total })
							: t("admin.spellingDictionary.subtitle")}
					</Typography>
				</div>
				<div className="ml-auto shrink-0">
					<Button
						onClick={openCreate}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88"
					>
						<Plus className="size-[13px]" />
						<Typography tag="span" className="max-sm:hidden">
							{t("admin.spellingDictionary.add")}
						</Typography>
					</Button>
				</div>
			</header>

			<div className="overflow-y-auto px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
				<AdminCard>
					<div className="flex items-center justify-between gap-3 border-b border-bd-1 px-4 py-3">
						<Typography tag="p" className="text-[13px] font-medium text-t-1">
							{t("admin.spellingDictionary.entries")}
						</Typography>
						<div className="relative">
							<Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-t-3" />
							<Input
								className="h-8 pl-8 text-xs"
								placeholder={t("admin.spellingDictionary.searchPlaceholder")}
								value={search}
								onChange={handleSearchInputChange}
							/>
						</div>
					</div>

					{query.isError ? (
						<div className="py-12 text-center text-[13px] text-red-500">
							{t("admin.spellingDictionary.loadError")}
						</div>
					) : (
						<SpellingEntriesTable
							items={items}
							isLoading={query.isPending}
							onEdit={openEdit}
							onDelete={openDelete}
						/>
					)}

					{!query.isPending && total > 0 && (
						<SpellingPagination
							page={page}
							limit={limit}
							total={total}
							onPageChange={setPage}
							onLimitChange={handleLimitChange}
						/>
					)}
				</AdminCard>
			</div>

			<SpellingEntryFormModal
				open={modalOpen}
				editEntry={editEntry}
				isSubmitting={isSubmitting}
				onSubmit={handleModalSubmit}
				onClose={handleModalClose}
			/>

			<SpellingEntryDeleteDialog
				entry={deleteEntry}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={handleDeleteClose}
			/>
		</div>
	);
};
