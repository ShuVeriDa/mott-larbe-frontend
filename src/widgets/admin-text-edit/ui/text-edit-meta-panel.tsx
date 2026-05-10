"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type {
	ProcessingStatus,
	TextLanguage,
	TextLevel,
	TextStatus,
	TextVersionListItem,
} from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import {
	FieldInput,
	FieldLabel,
	LEVELS,
	levelColorMap,
	MetaSection,
} from "@/shared/ui/admin-text-meta-fields";
import type { ComponentProps, KeyboardEvent } from "react";
import { useState } from "react";
import type { PageContent } from "../model/use-admin-text-edit-page";
import { TokenizationSection } from "./tokenization-section";
import { TextEditMetaStatusSection } from "./text-edit-meta-status-section";
import { TextEditMetaTagsSection } from "./text-edit-meta-tags-section";
import { TextEditMetaDescriptionSection } from "./text-edit-meta-description-section";
import { TextEditMetaCoverSection } from "./text-edit-meta-cover-section";
import { TextEditMetaPageStatsSection } from "./text-edit-meta-page-stats-section";
import { TextEditMetaVersionsSection } from "./text-edit-meta-versions-section";
import { TextEditMetaActionsSection } from "./text-edit-meta-actions-section";
import { AlignLeft, ChevronDown } from "lucide-react";

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
	const [metaOpen, setMetaOpen] = useState(false);

	const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (tagInputValue.trim()) {
				onTagAdd(tagInputValue.trim());
				setTagInputValue("");
			}
		}
	};

	const handleToggleMeta: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		setMetaOpen(v => !v);
	const handleAuthorChange: NonNullable<ComponentProps<typeof FieldInput>["onChange"]> = e =>
		onAuthorChange(e.currentTarget.value);
	const handleSourceChange: NonNullable<ComponentProps<typeof FieldInput>["onChange"]> = e =>
		onSourceChange(e.currentTarget.value);
	const handleLevelClick: NonNullable<ComponentProps<"button">["onClick"]> = e => {
		const lvl = (e.currentTarget as HTMLButtonElement).dataset.level as TextLevel | undefined;
		if (lvl) onLevelChange(level === lvl ? null : lvl);
	};

	return (
		<div className="sticky top-[52px] flex h-[calc(100vh-52px)] flex-col overflow-y-auto">
			<Button
				variant="bare"
				size={null}
				onClick={handleToggleMeta}
				className="hidden items-center justify-between border-t border-bd-1 bg-surf-2 px-4 py-[13px] transition-colors hover:bg-surf-3 max-[900px]:flex"
			>
				<Typography tag="span" className="flex items-center gap-2 text-[13px] font-medium text-t-1">
					<AlignLeft className="size-3.5" />
					{t("admin.texts.createPage.sections.settings")}
				</Typography>
				<ChevronDown className={`size-3.5 text-t-3 transition-transform ${metaOpen ? "rotate-180" : ""}`} />
			</Button>

			<div className={`flex flex-col max-[900px]:${metaOpen ? "flex" : "hidden"}`}>
				<TextEditMetaStatusSection
					status={status}
					language={language}
					labels={{
						statusSection: t("admin.texts.createPage.sections.status"),
						statusDraft: t("admin.texts.createPage.statusOptions.draft"),
						statusPublished: t("admin.texts.createPage.statusOptions.published"),
						statusArchived: t("admin.texts.createPage.statusOptions.archived"),
						langLabel: t("admin.texts.createPage.sections.metadata"),
						langChe: t("admin.texts.createPage.langChe"),
						langRu: t("admin.texts.createPage.langRu"),
					}}
					onStatusChange={onStatusChange}
					onLanguageChange={onLanguageChange}
				/>

				<MetaSection title={t("admin.texts.createPage.sections.metadata")}>
					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.levelLabel")}</FieldLabel>
						<div className="grid grid-cols-6 gap-1.5">
							{LEVELS.map(lvl => (
								<Button
									key={lvl}
									variant="bare"
									size={null}
									data-level={lvl}
									onClick={handleLevelClick}
									className={`flex h-[30px] items-center justify-center rounded-[6px] border text-[11.5px] font-semibold transition-colors ${
										level === lvl ? levelColorMap[lvl] : "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:bg-surf-2"
									}`}
								>
									{lvl}
								</Button>
							))}
						</div>
					</div>

					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.authorLabel")}</FieldLabel>
						<FieldInput
							type="text"
							value={author}
							maxLength={50}
							onChange={handleAuthorChange}
							placeholder={t("admin.texts.createPage.authorPlaceholder")}
						/>
					</div>

					<div>
						<FieldLabel>{t("admin.texts.createPage.sourceLabel")}</FieldLabel>
						<FieldInput
							type="url"
							value={source}
							onChange={handleSourceChange}
							placeholder={t("admin.texts.createPage.sourcePlaceholder")}
						/>
					</div>
				</MetaSection>

				<TextEditMetaTagsSection
					tags={tags}
					tagInputValue={tagInputValue}
					sectionTitle={t("admin.texts.createPage.sections.tags")}
					tagsAddPlaceholder={t("admin.texts.createPage.tagsAddPlaceholder")}
					tagsHint={t("admin.texts.createPage.tagsHint")}
					onTagAdd={onTagAdd}
					onTagRemove={onTagRemove}
					onTagInputChange={setTagInputValue}
					onTagKeyDown={handleTagKeyDown}
				/>

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
			</div>
		</div>
	);
};
