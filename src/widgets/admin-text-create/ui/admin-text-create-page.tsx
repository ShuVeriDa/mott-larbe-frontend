"use client";

import { useAdminTags } from "@/entities/admin-tag";
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
	const gridColumnsClassName = isMetaPanelVisible
		? "min-[768px]:grid-cols-[1fr_248px]"
		: "min-[768px]:grid-cols-[1fr_0px]";
	const metaPanelClassName = isMetaPanelVisible
		? "min-[768px]:translate-x-0 min-[768px]:opacity-100"
		: "min-[768px]:pointer-events-none min-[768px]:translate-x-3 min-[768px]:opacity-0";

	return (
		<div className="flex h-screen min-h-0 flex-col overflow-hidden text-t-1 transition-colors">
			<TextCreateTopbar
				saveState={saveState}
				isSaving={isSaving}
				isMetaPanelVisible={isMetaPanelVisible}
				onSaveDraft={handleSaveDraft}
				onPublish={handlePublish}
				onToggleMetaPanel={handleToggleMetaPanel}
			/>

			{/* Two-column layout */}
			<div
				className={`grid min-h-0 flex-1 overflow-hidden transition-[grid-template-columns] duration-300 ease-out max-[767px]:grid-cols-1 ${gridColumnsClassName}`}
			>
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

				<div
					className={`min-h-0 overflow-hidden transition-[opacity,transform] duration-200 ease-out max-[767px]:contents ${metaPanelClassName}`}
				>
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
				</div>
			</div>

		</div>
	);
};
