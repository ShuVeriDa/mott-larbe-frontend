"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminTextCreatePage } from "../model/use-admin-text-create-page";
import { TextCreateTopbar } from "./text-create-topbar";
import { TextCreateEditor } from "./text-create-editor";
import { TextCreateMetaPanel } from "./text-create-meta-panel";

export const AdminTextCreatePage = () => {
	const { t } = useI18n();
	const {
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
		handleTitleChange,
		handlePageContentChange,
		handleAddPage,
		handleSelectPage,
		handleCoverSelect,
		handleAddTag,
		handleRemoveTag,
		setStatus,
		setLanguage,
		setLevel,
		setAuthor,
		setDescription,
		setSource,
		setAutoTokenizeOnSave,
		setUseNormalization,
		setUseMorphAnalysis,
		handleSaveDraft,
		handlePublish,
	} = useAdminTextCreatePage();

	return (
		<div className="flex min-h-screen flex-col bg-bg text-t-1 transition-colors">
			<TextCreateTopbar
				isUnsaved={isUnsaved}
				isSaving={isSaving}
				onSaveDraft={handleSaveDraft}
				onPublish={handlePublish}
			/>

			{/* Two-column layout */}
			<div className="grid flex-1 grid-cols-[1fr_248px] max-[900px]:grid-cols-1">
				<TextCreateEditor
					title={title}
					pages={pages}
					activePage={activePage}
					onTitleChange={handleTitleChange}
					onPageContentChange={handlePageContentChange}
					onAddPage={handleAddPage}
					onSelectPage={handleSelectPage}
					onSaveDraft={handleSaveDraft}
					onPublish={handlePublish}
				/>

				<TextCreateMetaPanel
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
					isSaving={isSaving}
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
					onPublish={handlePublish}
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
						<path d="M3 4a1 1 0 011-1h6l3 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
						<path d="M10 3v3H6V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						<path d="M5 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					</svg>
					{t("admin.texts.createPage.saveDraft")}
				</button>

				<button
					type="button"
					onClick={handlePublish}
					disabled={isSaving}
					className="flex h-[38px] flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-acc text-sm font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path d="M8 2v10M3 7l5-5 5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					{t("admin.texts.createPage.publish")}
				</button>
			</div>
		</div>
	);
};
