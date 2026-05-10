"use client";

import type { AdminTag } from "@/entities/admin-tag";
import type {
	TextLanguage,
	TextLevel,
	TextStatus,
} from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import {
	FieldInput,
	FieldLabel,
	levelColorMap,
	LEVELS,
	MetaSection,
} from "@/shared/ui/admin-text-meta-fields";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { ComponentProps, KeyboardEvent } from "react";
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
import { TextCreateMetaStatusSection } from "./text-create-meta-status-section";
import { TextCreateMetaTagsSection } from "./text-create-meta-tags-section";

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
	onAutoTokenizeChange,
	onNormalizationChange,
	onMorphAnalysisChange,
	onSaveDraft,
	onPublish,
}: TextCreateMetaPanelProps) => {
	const { t } = useI18n();
	const [tagInputValue, setTagInputValue] = useState("");
	const [metaOpen, setMetaOpen] = useState(false);

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

	const handleToggleMeta: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => setMetaOpen(v => !v);
	const handleAuthorChange: NonNullable<
		ComponentProps<typeof FieldInput>["onChange"]
	> = e => onAuthorChange(e.currentTarget.value);
	const handleSourceChange: NonNullable<
		ComponentProps<typeof FieldInput>["onChange"]
	> = e => onSourceChange(e.currentTarget.value);
	const handleLevelClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = e => {
		const lvl = (e.currentTarget as HTMLButtonElement).dataset.level as
			| TextLevel
			| undefined;
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
				<Typography
					tag="span"
					className="flex items-center gap-2 text-[13px] font-medium text-t-1"
				>
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path
							d="M2 4.5h12M2 8.5h8M2 12.5h5"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
					</svg>
					{t("admin.texts.createPage.sections.settings")}
				</Typography>
				<svg
					width="14"
					height="14"
					viewBox="0 0 16 16"
					fill="none"
					className={`text-t-3 transition-transform ${metaOpen ? "rotate-180" : ""}`}
				>
					<path
						d="M4 6l4 4 4-4"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</Button>

			<div
				className={`flex flex-col max-[900px]:${metaOpen ? "flex" : "hidden"}`}
			>
				<TextCreateMetaStatusSection
					status={status}
					language={language}
					labels={{
						statusSection: t("admin.texts.createPage.sections.status"),
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
										level === lvl
											? levelColorMap[lvl]
											: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:bg-surf-2"
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

				<TextCreateMetaTagsSection
					tags={tags}
					allTags={allTags}
					tagInputValue={tagInputValue}
					sectionTitle={t("admin.texts.createPage.sections.tags")}
					tagsAddPlaceholder={t("admin.texts.createPage.tagsAddPlaceholder")}
					tagsHint={t("admin.texts.createPage.tagsHint")}
					tagsCreate={t("admin.texts.createPage.tagsCreate")}
					onTagAdd={onTagAdd}
					onTagRemove={onTagRemove}
					onTagInputChange={setTagInputValue}
					onTagKeyDown={handleTagKeyDown}
				/>

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
					onCoverSelect={onCoverSelect}
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
			</div>
		</div>
	);
};
