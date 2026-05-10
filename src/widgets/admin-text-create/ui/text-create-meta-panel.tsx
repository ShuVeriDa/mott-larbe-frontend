"use client";

import type { AdminTag } from "@/entities/admin-tag";
import type {
	TextLanguage,
	TextLevel,
	TextStatus,
} from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import {
	AdminTextMetaPanelShell,
} from "@/shared/ui/admin-text-editor";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import type {
	PageContent,
	TagEntry,
} from "../model/use-admin-text-create-page";
import { ProcessingSection } from "./processing-section";
import { TextCreateMetaActionsSection } from "./text-create-meta-actions-section";
import { TextCreateMetaCoverSection } from "./text-create-meta-cover-section";
import { TextCreateMetaDescriptionSection } from "./text-create-meta-description-section";
import { TextCreateMetaPageStatsSection } from "./text-create-meta-page-stats-section";

interface TextCreateMetaPanelProps {
	status: TextStatus;
	language: TextLanguage;
	level: TextLevel | null;
	author: string;
	source: string;
	tags: TagEntry[];
	allTags: AdminTag[];
	description: string;
	coverPreviewUrl: string | null;
	autoTokenizeOnSave: boolean;
	useNormalization: boolean;
	useMorphAnalysis: boolean;
	pages: PageContent[];
	isSaving: boolean;
	onStatusChange: (v: TextStatus) => void;
	onLanguageChange: (v: TextLanguage) => void;
	onLevelChange: (v: TextLevel | null) => void;
	onAuthorChange: (v: string) => void;
	onSourceChange: (v: string) => void;
	onTagAdd: (name: string, id?: string) => void;
	onTagRemove: (index: number) => void;
	onDescriptionChange: (v: string) => void;
	onCoverSelect: (file: File) => void;
	onCoverRemove: () => void;
	onAutoTokenizeChange: (v: boolean) => void;
	onNormalizationChange: (v: boolean) => void;
	onMorphAnalysisChange: (v: boolean) => void;
	onSaveDraft: () => void;
	onPublish: () => void;
}

export const TextCreateMetaPanel = ({
	status,
	language,
	level,
	author,
	source,
	tags,
	allTags,
	description,
	coverPreviewUrl,
	autoTokenizeOnSave,
	useNormalization,
	useMorphAnalysis,
	pages,
	isSaving,
	onStatusChange,
	onLanguageChange,
	onLevelChange,
	onAuthorChange,
	onSourceChange,
	onTagAdd,
	onTagRemove,
	onDescriptionChange,
	onCoverSelect,
	onCoverRemove,
	onAutoTokenizeChange,
	onNormalizationChange,
	onMorphAnalysisChange,
	onSaveDraft,
	onPublish,
}: TextCreateMetaPanelProps) => {
	const { t } = useI18n();
	const [tagInputValue, setTagInputValue] = useState("");

	const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const trimmed = tagInputValue.trim();
			if (!trimmed) return;
			const exact = allTags.find(
				tag => tag.name.toLowerCase() === trimmed.toLowerCase(),
			);
			onTagAdd(exact ? exact.name : trimmed, exact?.id);
			setTagInputValue("");
		} else if (e.key === "Escape") {
			setTagInputValue("");
		}
	};

	return (
		<AdminTextMetaPanelShell
			status={status}
			language={language}
			level={level}
			author={author}
			source={source}
			tags={tags}
			allTags={allTags}
			tagInputValue={tagInputValue}
			tagsCreateLabel={t("admin.texts.createPage.tagsCreate")}
			onStatusChange={onStatusChange}
			onLanguageChange={onLanguageChange}
			onLevelChange={onLevelChange}
			onAuthorChange={onAuthorChange}
			onSourceChange={onSourceChange}
			onTagAdd={onTagAdd}
			onTagRemove={onTagRemove}
			onTagInputChange={setTagInputValue}
			onTagKeyDown={handleTagKeyDown}
		>
				<TextCreateMetaDescriptionSection
					description={description}
					sectionTitle={t("admin.texts.createPage.sections.description")}
					placeholder={t("admin.texts.createPage.descriptionPlaceholder")}
					onDescriptionChange={onDescriptionChange}
				/>

				<TextCreateMetaCoverSection
					coverPreviewUrl={coverPreviewUrl}
					sectionTitle={t("admin.texts.createPage.sections.cover")}
					uploadLabel={t("admin.texts.createPage.coverUploadLabel")}
					uploadSub={t("admin.texts.createPage.coverUploadSub")}
					removeLabel={t("admin.texts.createPage.coverRemoveLabel")}
					onCoverSelect={onCoverSelect}
					onCoverRemove={onCoverRemove}
				/>

				<ProcessingSection
					autoTokenizeOnSave={autoTokenizeOnSave}
					useNormalization={useNormalization}
					useMorphAnalysis={useMorphAnalysis}
					t={t}
					onAutoTokenizeChange={onAutoTokenizeChange}
					onNormalizationChange={onNormalizationChange}
					onMorphAnalysisChange={onMorphAnalysisChange}
				/>

				<TextCreateMetaPageStatsSection
					pages={pages}
					sectionTitle={t("admin.texts.createPage.sections.pageStats")}
					pageLabel={t("admin.texts.createPage.pageN")}
					wordsSuffix={t("admin.texts.createPage.wordsSuffix")}
				/>

				<TextCreateMetaActionsSection
					isSaving={isSaving}
					labels={{
						publish: isSaving
							? t("admin.texts.createPage.publishing")
							: t("admin.texts.createPage.publish"),
						saveDraft: isSaving
							? t("admin.texts.createPage.saving")
							: t("admin.texts.createPage.saveDraft"),
					}}
					onPublish={onPublish}
					onSaveDraft={onSaveDraft}
				/>
		</AdminTextMetaPanelShell>
	);
};
