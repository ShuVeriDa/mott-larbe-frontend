"use client";

import type {
	ProcessingStatus,
	TextLanguage,
	TextLevel,
	TextStatus,
	TextVersionListItem,
} from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import {
	AdminTextMetaPanelShell,
} from "@/shared/ui/admin-text-editor";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import type { PageContent } from "../model/use-admin-text-edit-page";
import { TokenizationSection } from "./tokenization-section";
import { TextEditMetaDescriptionSection } from "./text-edit-meta-description-section";
import { TextEditMetaCoverSection } from "./text-edit-meta-cover-section";
import { TextEditMetaPageStatsSection } from "./text-edit-meta-page-stats-section";
import { TextEditMetaVersionsSection } from "./text-edit-meta-versions-section";
import { TextEditMetaActionsSection } from "./text-edit-meta-actions-section";

interface TextEditMetaPanelProps {
	textId: string;
	status: TextStatus;
	language: TextLanguage;
	level: TextLevel | null;
	author: string;
	source: string;
	tags: string[];
	description: string;
	coverPreviewUrl: string | null;
	autoTokenizeOnSave: boolean;
	useNormalization: boolean;
	useMorphAnalysis: boolean;
	pages: PageContent[];
	pageTokenCounts: number[];
	isSaving: boolean;
	processingStatus: ProcessingStatus;
	tokenCount: number;
	recentVersions: TextVersionListItem[];
	onStatusChange: (v: TextStatus) => void;
	onLanguageChange: (v: TextLanguage) => void;
	onLevelChange: (v: TextLevel | null) => void;
	onAuthorChange: (v: string) => void;
	onSourceChange: (v: string) => void;
	onTagAdd: (tag: string) => void;
	onTagRemove: (tag: string) => void;
	onDescriptionChange: (v: string) => void;
	onCoverSelect: (file: File) => void;
	onAutoTokenizeChange: (v: boolean) => void;
	onNormalizationChange: (v: boolean) => void;
	onMorphAnalysisChange: (v: boolean) => void;
	onSaveDraft: () => void;
	onSaveAndUpdate: () => void;
	onDeleteRequest: () => void;
	onTokenize: () => void;
}

export const TextEditMetaPanel = ({
	textId,
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
	pages,
	pageTokenCounts,
	isSaving,
	processingStatus,
	tokenCount,
	recentVersions,
	onStatusChange,
	onLanguageChange,
	onLevelChange,
	onAuthorChange,
	onSourceChange,
	onTagAdd,
	onTagRemove,
	onDescriptionChange,
	onCoverSelect,
	onAutoTokenizeChange,
	onNormalizationChange,
	onMorphAnalysisChange,
	onSaveDraft,
	onSaveAndUpdate,
	onDeleteRequest,
	onTokenize,
}: TextEditMetaPanelProps) => {
	const { t, lang } = useI18n();
	const [tagInputValue, setTagInputValue] = useState("");
	const tagItems = tags.map(tag => ({ name: tag }));

	const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (tagInputValue.trim()) {
				onTagAdd(tagInputValue.trim());
				setTagInputValue("");
			}
		}
	};

	return (
		<AdminTextMetaPanelShell
			status={status}
			language={language}
			level={level}
			author={author}
			source={source}
			tags={tagItems}
			tagInputValue={tagInputValue}
			onStatusChange={onStatusChange}
			onLanguageChange={onLanguageChange}
			onLevelChange={onLevelChange}
			onAuthorChange={onAuthorChange}
			onSourceChange={onSourceChange}
			onTagAdd={onTagAdd}
			onTagRemove={index => {
				const targetTag = tags[index];
				if (!targetTag) return;
				onTagRemove(targetTag);
			}}
			onTagInputChange={setTagInputValue}
			onTagKeyDown={handleTagKeyDown}
		>
				<TextEditMetaDescriptionSection
					description={description}
					sectionTitle={t("admin.texts.createPage.sections.description")}
					placeholder={t("admin.texts.createPage.descriptionPlaceholder")}
					onDescriptionChange={onDescriptionChange}
				/>

				<TextEditMetaCoverSection
					coverPreviewUrl={coverPreviewUrl}
					sectionTitle={t("admin.texts.createPage.sections.cover")}
					uploadLabel={t("admin.texts.createPage.coverUploadLabel")}
					uploadSub={t("admin.texts.createPage.coverUploadSub")}
					onCoverSelect={onCoverSelect}
				/>

				<TokenizationSection
					processingStatus={processingStatus}
					tokenCount={tokenCount}
					autoTokenizeOnSave={autoTokenizeOnSave}
					useNormalization={useNormalization}
					useMorphAnalysis={useMorphAnalysis}
					textId={textId}
					lang={lang}
					t={t}
					onTokenize={onTokenize}
					onAutoTokenizeChange={onAutoTokenizeChange}
					onNormalizationChange={onNormalizationChange}
					onMorphAnalysisChange={onMorphAnalysisChange}
				/>

				<TextEditMetaPageStatsSection
					pages={pages}
					pageTokenCounts={pageTokenCounts}
					sectionTitle={t("admin.texts.createPage.sections.pageStats")}
					pageLabel={t("admin.texts.createPage.pageN")}
					tokenCountSuffix={t("admin.texts.editPage.tokenCountSuffix")}
					wordsSuffix={t("admin.texts.createPage.wordsSuffix")}
				/>

				<TextEditMetaVersionsSection
					recentVersions={recentVersions}
					textId={textId}
					lang={lang}
					sectionTitle={t("admin.texts.editPage.sections.versions")}
					currentLabel={t("admin.texts.editPage.versionCurrent")}
					allVersionsLabel={t("admin.texts.editPage.allVersions")}
				/>

				<TextEditMetaActionsSection
					isSaving={isSaving}
					labels={{
						saveUpdate: isSaving ? t("admin.texts.editPage.saving") : t("admin.texts.editPage.saveUpdate"),
						saveDraft: isSaving ? t("admin.texts.editPage.saving") : t("admin.texts.editPage.saveDraft"),
						dangerZone: t("admin.texts.editPage.dangerZone"),
						deleteText: t("admin.texts.editPage.deleteText"),
					}}
					onSaveAndUpdate={onSaveAndUpdate}
					onSaveDraft={onSaveDraft}
					onDeleteRequest={onDeleteRequest}
				/>
		</AdminTextMetaPanelShell>
	);
};
