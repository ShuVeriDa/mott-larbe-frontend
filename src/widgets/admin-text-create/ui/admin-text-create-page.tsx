"use client";

import { useAdminTags } from "@/entities/admin-tag";
import { AdminTextPageShell } from "@/shared/ui/admin-text-editor";
import { AnnotateWordFormDialog } from "@/features/word-annotation";
import { useEffect, useState } from "react";
import { useAdminTextCreatePage } from "../model/use-admin-text-create-page";
import { TextCreateEditor, ANNOTATE_WORD_FORM_EVENT } from "./text-create-editor";
import { TextCreateMetaPanel } from "./text-create-meta-panel";
import { TextCreateTopbar } from "./text-create-topbar";
import { PhraseTranslationPanel } from "../../admin-text-edit/ui/phrase-translation-panel";
import { PhrasesListPanel } from "../../admin-text-edit/ui/phrases-list-panel";
import { WordAnnotationsPanel } from "../../admin-text-edit/ui/word-annotations-panel";

export const AdminTextCreatePage = () => {
	const { data: allTags = [] } = useAdminTags();
	const [isMetaPanelVisible, setIsMetaPanelVisible] = useState(true);
	const [annotateWordForm, setAnnotateWordForm] = useState<string | null>(null);
	const [annotateInitialTokenId, setAnnotateInitialTokenId] = useState<string | undefined>(undefined);

	useEffect(() => {
		const handler = (e: Event) => {
			const text = (e as CustomEvent<string>).detail;
			if (text) {
				setAnnotateInitialTokenId(undefined);
				setAnnotateWordForm(text);
			}
		};
		document.addEventListener(ANNOTATE_WORD_FORM_EVENT, handler);
		return () => document.removeEventListener(ANNOTATE_WORD_FORM_EVENT, handler);
	}, []);

	useEffect(() => {
		const handler = (e: Event) => {
			const { tokenId, normalized } = (e as CustomEvent<{ tokenId: string; normalized: string }>).detail;
			if (normalized) {
				setAnnotateInitialTokenId(tokenId);
				setAnnotateWordForm(normalized);
			}
		};
		document.addEventListener("admin:annotate-token", handler);
		return () => document.removeEventListener("admin:annotate-token", handler);
	}, []);

	const {
		title,
		pages,
		activePage,
		savedId,
		status,
		language,
		level,
		author,
		source,
		genreId,
		tags,
		description,
		coverPreviewUrl,
		autoTokenizeOnSave,
		useNormalization,
		useMorphAnalysis,
		saveState,
		isSaving,
		isBackgroundRunning,
		handleTitleChange,
		handlePageContentChange,
		handlePageTitleChange,
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
		setGenreId,
		setAutoTokenizeOnSave,
		setUseNormalization,
		setUseMorphAnalysis,
		handleSaveDraft,
		handlePublish,
	} = useAdminTextCreatePage();
	const handleToggleMetaPanel = () => setIsMetaPanelVisible(v => !v);

	return (
		<>
			<AdminTextPageShell
				isMetaPanelVisible={isMetaPanelVisible}
				topbar={
					<TextCreateTopbar
						saveState={saveState}
						isSaving={isSaving}
						isBackgroundRunning={isBackgroundRunning}
						isMetaPanelVisible={isMetaPanelVisible}
						onSaveDraft={handleSaveDraft}
						onPublish={handlePublish}
						onToggleMetaPanel={handleToggleMetaPanel}
					/>
				}
				editor={
					<TextCreateEditor
						title={title}
						language={language}
						pages={pages}
						activePage={activePage}
						savedId={savedId}
						showStressMark={language === "CHE"}
						showSpellingAdd
						onTitleChange={handleTitleChange}
						onPageContentChange={handlePageContentChange}
						onPageTitleChange={handlePageTitleChange}
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
						genreId={genreId}
						tags={tags}
						allTags={allTags}
						description={description}
						coverPreviewUrl={coverPreviewUrl}
						autoTokenizeOnSave={autoTokenizeOnSave}
						useNormalization={useNormalization}
						useMorphAnalysis={useMorphAnalysis}
						pages={pages}
						isSaving={isSaving}
						isBackgroundRunning={isBackgroundRunning}
						onStatusChange={setStatus}
						onLanguageChange={setLanguage}
						onLevelChange={setLevel}
						onAuthorChange={setAuthor}
						onSourceChange={setSource}
						onGenreChange={setGenreId}
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

			{savedId && (
				<>
					<PhraseTranslationPanel textId={savedId} pageNumber={activePage + 1} language={language} />
					<PhrasesListPanel textId={savedId} pageNumber={activePage + 1} />
					<WordAnnotationsPanel textId={savedId} pageNumber={activePage + 1} />
				</>
			)}

			{annotateWordForm !== null && savedId && (
				<AnnotateWordFormDialog
					wordForm={annotateWordForm}
					textId={savedId}
					initialSelectedTokenId={annotateInitialTokenId}
					open
					onOpenChange={open => {
						if (!open) {
							setAnnotateWordForm(null);
							setAnnotateInitialTokenId(undefined);
						}
					}}
				/>
			)}
		</>
	);
};
