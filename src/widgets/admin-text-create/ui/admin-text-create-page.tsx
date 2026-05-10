"use client";

import { useAdminTags } from "@/entities/admin-tag";
import { AdminTextPageShell } from "@/shared/ui/admin-text-editor";
import { useState } from "react";
import { useAdminTextCreatePage } from "../model/use-admin-text-create-page";
import { TextCreateEditor } from "./text-create-editor";
import { TextCreateMetaPanel } from "./text-create-meta-panel";
import { TextCreateTopbar } from "./text-create-topbar";

export const AdminTextCreatePage = () => {
	const { data: allTags = [] } = useAdminTags();
	const [isMetaPanelVisible, setIsMetaPanelVisible] = useState(true);

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
		saveState,
		isSaving,
		handleTitleChange,
		handlePageContentChange,
		handleAddPage,
		handleSelectPage,
		handleDeletePage,
		handleCoverSelect,
		handleCoverRemove,
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
	const handleToggleMetaPanel = () => setIsMetaPanelVisible(v => !v);

	return (
		<AdminTextPageShell
			isMetaPanelVisible={isMetaPanelVisible}
			topbar={
				<TextCreateTopbar
					saveState={saveState}
					isSaving={isSaving}
					isMetaPanelVisible={isMetaPanelVisible}
					onSaveDraft={handleSaveDraft}
					onPublish={handlePublish}
					onToggleMetaPanel={handleToggleMetaPanel}
				/>
			}
			editor={
				<TextCreateEditor
					title={title}
					pages={pages}
					activePage={activePage}
					onTitleChange={handleTitleChange}
					onPageContentChange={handlePageContentChange}
					onAddPage={handleAddPage}
					onSelectPage={handleSelectPage}
					onDeletePage={handleDeletePage}
					onSaveDraft={handleSaveDraft}
					onPublish={handlePublish}
				/>
			}
			metaPanel={
				<TextCreateMetaPanel
					status={status}
					language={language}
					level={level}
					author={author}
					source={source}
					tags={tags}
					allTags={allTags}
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
					onCoverRemove={handleCoverRemove}
					onAutoTokenizeChange={setAutoTokenizeOnSave}
					onNormalizationChange={setUseNormalization}
					onMorphAnalysisChange={setUseMorphAnalysis}
					onSaveDraft={handleSaveDraft}
					onPublish={handlePublish}
				/>
			}
		/>
	);
};
