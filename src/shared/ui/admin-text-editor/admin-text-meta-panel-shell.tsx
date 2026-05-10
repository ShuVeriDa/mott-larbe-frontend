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
import { AlignLeft, ChevronDown, X } from "lucide-react";
import type {
	ComponentProps,
	KeyboardEvent,
	MouseEvent,
	ReactNode,
} from "react";
import { useState } from "react";
import { AdminTextMetaStatusSection } from "./admin-text-meta-status-section";
import { AdminTextMetaTagsSection } from "./admin-text-meta-tags-section";

interface AdminTextMetaPanelShellProps {
	status: TextStatus;
	language: TextLanguage;
	level: TextLevel | null;
	author: string;
	source: string;
	tags: { id?: string; name: string }[];
	allTags?: AdminTag[];
	tagInputValue: string;
	tagsCreateLabel?: string;
	onStatusChange: (v: TextStatus) => void;
	onLanguageChange: (v: TextLanguage) => void;
	onLevelChange: (v: TextLevel | null) => void;
	onAuthorChange: (v: string) => void;
	onSourceChange: (v: string) => void;
	onTagAdd: (name: string, id?: string) => void;
	onTagRemove: (index: number) => void;
	onTagInputChange: (v: string) => void;
	onTagKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	children: ReactNode;
}

export const AdminTextMetaPanelShell = ({
	status,
	language,
	level,
	author,
	source,
	tags,
	allTags,
	tagInputValue,
	tagsCreateLabel,
	onStatusChange,
	onLanguageChange,
	onLevelChange,
	onAuthorChange,
	onSourceChange,
	onTagAdd,
	onTagRemove,
	onTagInputChange,
	onTagKeyDown,
	children,
}: AdminTextMetaPanelShellProps) => {
	const { t } = useI18n();
	const [metaOpen, setMetaOpen] = useState(false);

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
	const handleCloseMeta: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => setMetaOpen(false);
	const handleOverlayClick: NonNullable<
		ComponentProps<"div">["onClick"]
	> = () => setMetaOpen(false);
	const handleSheetClick: NonNullable<ComponentProps<"div">["onClick"]> = (
		e: MouseEvent<HTMLDivElement>,
	) => {
		e.stopPropagation();
	};

	const panelContent = (
		<>
			<AdminTextMetaStatusSection
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

			<AdminTextMetaTagsSection
				tags={tags}
				allTags={allTags}
				tagInputValue={tagInputValue}
				sectionTitle={t("admin.texts.createPage.sections.tags")}
				tagsAddPlaceholder={t("admin.texts.createPage.tagsAddPlaceholder")}
				tagsHint={t("admin.texts.createPage.tagsHint")}
				tagsCreate={tagsCreateLabel}
				onTagAdd={onTagAdd}
				onTagRemove={onTagRemove}
				onTagInputChange={onTagInputChange}
				onTagKeyDown={onTagKeyDown}
			/>

			{children}
		</>
	);

	return (
		<>
			<div className="sticky top-[52px] hidden h-[calc(100vh-52px)] flex-col overflow-y-auto min-[768px]:flex">
				{panelContent}
			</div>

			<div className="fixed right-4 bottom-12 z-205 min-[768px]:hidden">
				<Button
					variant="bare"
					size={null}
					onClick={handleToggleMeta}
					className="flex h-10 items-center gap-2 rounded-full border border-bd-2 bg-surf/95 px-3.5 text-t-2 shadow-sm backdrop-blur transition-colors hover:border-bd-3 hover:bg-surf"
				>
					<Typography
						tag="span"
						className="flex items-center gap-1.5 text-[12.5px] font-semibold text-t-1"
					>
						<AlignLeft className="size-3.5 text-t-3" />
						{t("admin.texts.createPage.sections.settings")}
					</Typography>
					<ChevronDown
						className={`size-3.5 text-t-3 transition-transform ${metaOpen ? "rotate-180" : ""}`}
					/>
				</Button>
			</div>

			{metaOpen && (
				<div
					onClick={handleOverlayClick}
					className="fixed inset-0 z-210 hidden bg-black/35 backdrop-blur-[2px] max-[767px]:flex max-[767px]:items-end"
				>
					<div
						onClick={handleSheetClick}
						className="flex max-h-[82vh] w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
					>
						<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
							<Typography
								tag="span"
								className="text-[13px] font-semibold text-t-1"
							>
								{t("admin.texts.createPage.sections.settings")}
							</Typography>
							<Button
								variant="bare"
								size={null}
								onClick={handleCloseMeta}
								className="flex h-7 w-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
							>
								<X className="size-4" />
							</Button>
						</div>
						<div className="overflow-y-auto pb-4">{panelContent}</div>
					</div>
				</div>
			)}
		</>
	);
};
