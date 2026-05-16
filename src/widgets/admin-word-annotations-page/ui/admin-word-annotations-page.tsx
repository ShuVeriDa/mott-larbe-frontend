"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminWordAnnotationsPage } from "../model/use-admin-word-annotations-page";
import { AnnotationCard } from "./annotation-card";
import { AnnotationDeleteModal } from "./annotation-delete-modal";
import { AnnotationsLeftColumn } from "./annotations-left-column";
import { AnnotationsTopbar } from "./annotations-topbar";

export const AdminWordAnnotationsPage = () => {
	const { t } = useI18n();

	const {
		selectedId,
		page,
		localSearch,
		deleteTarget,
		listQuery,
		total,
		totalPages,
		LIMIT,
		isDeleting,
		isSyncing,
		setDeleteTarget,
		handleSearchChange,
		handleSelectForm,
		handleSetPage,
		handleClearSelected,
		handleDeleteConfirm,
		handleSync,
	} = useAdminWordAnnotationsPage();

	const items = listQuery.data?.items ?? [];

	const handleDeleteClose = () => setDeleteTarget(null);

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<AnnotationsTopbar total={total} isLoading={listQuery.isLoading} isSyncing={isSyncing} onSync={handleSync} t={t} />

			<div className="flex flex-1 overflow-hidden max-sm:flex-col">
				<div className="flex w-[320px] shrink-0 flex-col overflow-hidden bg-surf max-sm:h-[50vh] max-sm:w-full max-sm:border-b max-sm:border-bd-1">
					<AnnotationsLeftColumn
						items={items}
						isLoading={listQuery.isLoading}
						selectedId={selectedId}
						search={localSearch}
						page={page}
						totalPages={totalPages}
						total={total}
						limit={LIMIT}
						onSearchChange={handleSearchChange}
						onSelectForm={handleSelectForm}
						onDeleteForm={setDeleteTarget}
						onPageChange={handleSetPage}
						t={t}
					/>
				</div>

				<div className="min-w-0 flex-1 overflow-y-auto bg-surf max-sm:flex-1">
					<AnnotationCard
						morphFormId={selectedId || null}
						onDeleted={handleClearSelected}
						onRequestDelete={setDeleteTarget}
					/>
				</div>
			</div>

			<AnnotationDeleteModal
				form={deleteTarget}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={handleDeleteClose}
				t={t}
			/>
		</div>
	);
};
