"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import Link from "next/link";
import { useAdminTextEditPage } from "../model/use-admin-text-edit-page";
import { TextEditDeleteModal } from "./text-edit-delete-modal";
import { TextEditEditor } from "./text-edit-editor";
import { TextEditMetaPanel } from "./text-edit-meta-panel";
import { TextEditTopbar } from "./text-edit-topbar";

interface AdminTextEditPageProps {
	textId: string;
}

export const AdminTextEditPage = ({ textId }: AdminTextEditPageProps) => {
	const { t, lang } = useI18n();

	const {
		textData,
		isLoading,
		isError,
		versionsData,
		pageTokenCounts,
		title,
		pages,
		activePage,
		status,
		language,
		level,
		author,
		source,
		tags,
		description,
		coverPreviewUrl,
		autoTokenizeOnSave,
		useNormalization,
		useMorphAnalysis,
		isUnsaved,
		isSaving,
		isDeleting,
		showRetokenizeBar,
		showDeleteModal,
		handleTitleChange,
		handlePageContentChange,
		handleAddPage,
		handleSelectPage,
		handleCoverSelect,
		handleAddTag,
		handleRemoveTag,
		handleSaveDraft,
		handleSaveAndUpdate,
		handleDelete,
		handleTokenize,
		setStatus,
		setLanguage,
		setLevel,
		setAuthor,
		setDescription,
		setSource,
		setAutoTokenizeOnSave,
		setUseNormalization,
		setUseMorphAnalysis,
		setShowRetokenizeBar,
		setShowDeleteModal,
	} = useAdminTextEditPage(textId);

	// ── Loading skeleton ──
	if (isLoading) {
		return (
			<div className="flex min-h-screen flex-col">
				<div className="sticky top-0 z-20 flex h-[52px] items-center border-b border-bd-1 bg-surf px-5">
					<div className="h-4 w-48 animate-pulse rounded-md bg-surf-3" />
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="flex flex-col items-center gap-3 text-t-3">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							className="animate-spin text-acc"
						>
							<circle
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="2"
								strokeDasharray="31.4"
								strokeDashoffset="10"
							/>
						</svg>
						<span className="text-sm">{t("admin.texts.editPage.loading")}</span>
					</div>
				</div>
			</div>
		);
	}

	// ── Error state ──
	if (isError || !textData) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-t-2">
				<svg
					width="40"
					height="40"
					viewBox="0 0 24 24"
					fill="none"
					className="text-t-3"
				>
					<circle
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="1.5"
					/>
					<path
						d="M12 8v4M12 16h.01"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					/>
				</svg>
				<p className="text-sm">{t("admin.texts.editPage.loadError")}</p>
				<Link
					href={`/${lang}/admin/texts`}
					className="text-sm font-medium text-acc hover:underline"
				>
					{t("admin.texts.editPage.back")}
				</Link>
			</div>
		);
	}

	const recentVersions = versionsData?.data ?? [];

		const handleDismissRetokenize: NonNullable<ComponentProps<typeof TextEditEditor>["onDismissRetokenize"]> = () => setShowRetokenizeBar(false);
	const handleDeleteRequest: NonNullable<ComponentProps<typeof TextEditMetaPanel>["onDeleteRequest"]> = () => setShowDeleteModal(true);
	const handleCancel: NonNullable<ComponentProps<typeof TextEditDeleteModal>["onCancel"]> = () => setShowDeleteModal(false);
return (
		<div className="flex min-h-screen flex-col text-t-1 transition-colors">
			<TextEditTopbar
				textId={textId}
				textTitle={textData.title}
				textStatus={status}
				isUnsaved={isUnsaved}
				isSaving={isSaving}
				onSaveDraft={handleSaveDraft}
				onSaveAndUpdate={handleSaveAndUpdate}
			/>

			{/* Two-column layout */}
			<div className="grid flex-1 grid-cols-[1fr_248px] max-[900px]:grid-cols-1">
				<TextEditEditor
					title={title}
					pages={pages}
					activePage={activePage}
					processingStatus={textData.processingStatus}
					processingProgress={textData.processingProgress}
					tokenCount={textData.tokenCount}
					showRetokenizeBar={showRetokenizeBar}
					textId={textId}
					onTitleChange={handleTitleChange}
					onPageContentChange={handlePageContentChange}
					onAddPage={handleAddPage}
					onSelectPage={handleSelectPage}
					onSaveDraft={handleSaveDraft}
					onSaveAndUpdate={handleSaveAndUpdate}
					onDismissRetokenize={handleDismissRetokenize}
				/>

				<TextEditMetaPanel
					textId={textId}
					status={status}
					language={language}
					level={level}
					author={author}
					source={source}
					tags={tags}
					description={description}
					coverPreviewUrl={coverPreviewUrl}
					autoTokenizeOnSave={autoTokenizeOnSave}
					useNormalization={useNormalization}
					useMorphAnalysis={useMorphAnalysis}
					pages={pages}
					pageTokenCounts={pageTokenCounts}
					isSaving={isSaving}
					processingStatus={textData.processingStatus}
					tokenCount={textData.tokenCount}
					recentVersions={recentVersions}
					onStatusChange={setStatus}
					onLanguageChange={setLanguage}
					onLevelChange={setLevel}
					onAuthorChange={setAuthor}
					onSourceChange={setSource}
					onTagAdd={handleAddTag}
					onTagRemove={handleRemoveTag}
					onDescriptionChange={setDescription}
					onCoverSelect={handleCoverSelect}
					onAutoTokenizeChange={setAutoTokenizeOnSave}
					onNormalizationChange={setUseNormalization}
					onMorphAnalysisChange={setUseMorphAnalysis}
					onSaveDraft={handleSaveDraft}
					onSaveAndUpdate={handleSaveAndUpdate}
					onDeleteRequest={handleDeleteRequest}
					onTokenize={handleTokenize}
				/>
			</div>

			{/* Mobile bottom action bar */}
			<div className="sticky bottom-0 z-20 hidden border-t border-bd-1 bg-bg px-4 py-3 max-[900px]:flex max-[900px]:items-center max-[900px]:gap-2">
				<button
					type="button"
					onClick={handleSaveDraft}
					disabled={isSaving}
					className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-sm text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path
							d="M3 4a1 1 0 011-1h6l3 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
							stroke="currentColor"
							strokeWidth="1.3"
						/>
						<path
							d="M10 3v3H6V3"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
						<path
							d="M5 10h6"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
					</svg>
					{t("admin.texts.editPage.saveDraft")}
				</button>
				<button
					type="button"
					onClick={handleSaveAndUpdate}
					disabled={isSaving}
					className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-acc text-sm font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path
							d="M2.5 8.5L6 12l7.5-8"
							stroke="#fff"
							strokeWidth="1.6"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.texts.editPage.saveUpdate")}
				</button>
			</div>

			{/* Delete confirmation modal */}
			{showDeleteModal && (
				<TextEditDeleteModal
					textTitle={textData.title}
					isDeleting={isDeleting}
					onConfirm={handleDelete}
					onCancel={handleCancel}
				/>
			)}
		</div>
	);
};
