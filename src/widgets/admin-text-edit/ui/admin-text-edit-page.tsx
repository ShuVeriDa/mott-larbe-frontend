"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { type ComponentProps, useState } from "react";
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
	const [isMetaPanelVisible, setIsMetaPanelVisible] = useState(true);

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
						<Typography tag="span" className="text-sm">{t("admin.texts.editPage.loading")}</Typography>
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
				<Typography tag="p" className="text-sm">{t("admin.texts.editPage.loadError")}</Typography>
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

	const handleDismissRetokenize: NonNullable<
		ComponentProps<typeof TextEditEditor>["onDismissRetokenize"]
	> = () => setShowRetokenizeBar(false);
	const handleDeleteRequest: NonNullable<
		ComponentProps<typeof TextEditMetaPanel>["onDeleteRequest"]
	> = () => setShowDeleteModal(true);
	const handleCancel: NonNullable<
		ComponentProps<typeof TextEditDeleteModal>["onCancel"]
	> = () => setShowDeleteModal(false);
	const handleToggleMetaPanel = () => setIsMetaPanelVisible(v => !v);
	const gridColumnsClassName = isMetaPanelVisible
		? "min-[768px]:grid-cols-[1fr_248px]"
		: "min-[768px]:grid-cols-[1fr_0px]";
	const metaPanelClassName = isMetaPanelVisible
		? "min-[768px]:translate-x-0 min-[768px]:opacity-100"
		: "min-[768px]:pointer-events-none min-[768px]:translate-x-3 min-[768px]:opacity-0";

	return (
		<div className="flex h-screen min-h-0 flex-col overflow-hidden text-t-1 transition-colors">
			<TextEditTopbar
				textId={textId}
				textTitle={textData.title}
				textStatus={status}
				isUnsaved={isUnsaved}
				isSaving={isSaving}
				isMetaPanelVisible={isMetaPanelVisible}
				onSaveDraft={handleSaveDraft}
				onSaveAndUpdate={handleSaveAndUpdate}
				onToggleMetaPanel={handleToggleMetaPanel}
			/>

			{/* Two-column layout */}
			<div
				className={`grid min-h-0 flex-1 overflow-hidden transition-[grid-template-columns] duration-300 ease-out max-[767px]:grid-cols-1 ${gridColumnsClassName}`}
			>
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

				<div
					className={`min-h-0 overflow-hidden transition-[opacity,transform] duration-200 ease-out max-[767px]:contents ${metaPanelClassName}`}
				>
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
