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
import Link from "next/link";
import { ComponentProps, InputHTMLAttributes, KeyboardEvent, ReactNode, SelectHTMLAttributes, useRef, useState } from 'react';
import type { PageContent } from "../model/use-admin-text-edit-page";

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

const LEVELS: TextLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const levelColorMap: Record<TextLevel, string> = {
	A1: "bg-grn-muted border-grn/25 text-grn-strong",
	A2: "bg-[#d1fae5] border-[rgba(6,95,70,0.25)] text-[#065f46] dark:bg-[rgba(6,95,70,0.12)] dark:text-[#6ee7b7]",
	B1: "bg-acc-muted border-acc/25 text-acc-strong",
	B2: "bg-pur-muted border-pur/20 text-pur-strong",
	C1: "bg-amb-muted border-amb/20 text-amb-strong",
	C2: "bg-red-muted border-red/20 text-red-strong",
};

const MetaSection = ({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) => (
	<div className="border-b border-bd-1 px-4 py-[14px]">
		<div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3">
			{title}
		</div>
		{children}
	</div>
);

const FieldLabel = ({ children }: { children: ReactNode }) => (
	<Typography tag="label" className="mb-1.5 block text-[11px] font-medium text-t-3">
		{children}
	</Typography>
);

const FieldInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
	<input
		{...props}
		className="h-[34px] w-full rounded-base border border-bd-2 bg-surf px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
	/>
);

const FieldSelect = (props: SelectHTMLAttributes<HTMLSelectElement>) => (
	<select
		{...props}
		className="h-[34px] w-full cursor-pointer appearance-none rounded-base border border-bd-2 bg-surf px-2.5 pr-7 text-[13px] text-t-1 outline-none transition-colors focus:border-acc"
	/>
);

const Toggle = ({
	checked,
	onChange,
}: {
	checked: boolean;
	onChange: (v: boolean) => void;
}) => {
  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onChange(!checked);
  return (
	<Button
		role="switch"
		aria-checked={checked}
		onClick={handleClick}
		className={`relative h-[18px] w-[34px] shrink-0 rounded-full border-none p-0 transition-colors ${checked ? "bg-acc" : "bg-surf-3"}`}
	>
		<Typography tag="span"
			className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[16px] left-[2px]" : "translate-x-0 left-[2px]"}`}
		/>
	</Button>
);
};

const formatVersionDate = (iso: string): string => {
	try {
		return new Date(iso).toLocaleString("ru-RU", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		});
	} catch {
		return iso;
	}
};

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
	const fileInputRef = useRef<HTMLInputElement>(null);
	const tagInputRef = useRef<HTMLInputElement>(null);
	const [tagInputValue, setTagInputValue] = useState("");
	const [metaOpen, setMetaOpen] = useState(false);

	const maxWordCount = Math.max(...pages.map(p => p.wordCount), 1);

	const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (tagInputValue.trim()) {
				onTagAdd(tagInputValue.trim());
				setTagInputValue("");
			}
		}
	};

	const tokenStatusLabel = (): string =>
		t(`admin.texts.editPage.tokenStatus.${processingStatus}`);

	const tokenStatusClass = (): string => {
		switch (processingStatus) {
			case "COMPLETED":
				return "bg-grn-muted text-grn-strong";
			case "RUNNING":
				return "bg-amb-muted text-amb-strong";
			case "ERROR":
				return "bg-red-muted text-red-strong";
			default:
				return "bg-surf-3 text-t-3";
		}
	};

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setMetaOpen(v => !v);
	const handleChange: NonNullable<ComponentProps<typeof FieldSelect>["onChange"]> = e => onStatusChange(e.currentTarget.value as TextStatus);
	const handleChange2: NonNullable<ComponentProps<typeof FieldSelect>["onChange"]> = e => onLanguageChange(e.currentTarget.value as TextLanguage);
	const handleChange3: NonNullable<ComponentProps<typeof FieldInput>["onChange"]> = e => onAuthorChange(e.currentTarget.value);
	const handleChange4: NonNullable<ComponentProps<typeof FieldInput>["onChange"]> = e => onSourceChange(e.currentTarget.value);
	const handleClick2: NonNullable<ComponentProps<"div">["onClick"]> = () => tagInputRef.current?.focus();
	const handleChange5: NonNullable<ComponentProps<"input">["onChange"]> = e => setTagInputValue(e.currentTarget.value);
	const handleChange6: NonNullable<ComponentProps<"textarea">["onChange"]> = e => onDescriptionChange(e.currentTarget.value);
	const handleChange7: NonNullable<ComponentProps<"input">["onChange"]> = e => {
							const f = e.currentTarget.files?.[0];
							if (f) onCoverSelect(f);
						};
	const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = () => fileInputRef.current?.click();
return (
		<div className="flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
			{/* Mobile toggle header */}
			<Button
				onClick={handleClick}
				className="hidden items-center justify-between border-t border-bd-1 bg-surf-2 px-4 py-[13px] transition-colors hover:bg-surf-3 max-[900px]:flex"
			>
				<Typography tag="span" className="flex items-center gap-2 text-[13px] font-medium text-t-1">
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
				{/* ── Status ── */}
				<MetaSection title={t("admin.texts.createPage.sections.status")}>
					<FieldSelect
						value={status}
						onChange={handleChange}
					>
						<option value="draft">
							{t("admin.texts.createPage.statusOptions.draft")}
						</option>
						<option value="published">
							{t("admin.texts.createPage.statusOptions.published")}
						</option>
						<option value="archived">
							{t("admin.texts.createPage.statusOptions.archived")}
						</option>
					</FieldSelect>
				</MetaSection>

				{/* ── Metadata ── */}
				<MetaSection title={t("admin.texts.createPage.sections.metadata")}>
					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.langLabel")}</FieldLabel>
						<FieldSelect
							value={language}
							onChange={handleChange2}
						>
							<option value="CHE">{t("admin.texts.createPage.langChe")}</option>
							<option value="RU">{t("admin.texts.createPage.langRu")}</option>
						</FieldSelect>
					</div>

					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.levelLabel")}</FieldLabel>
						<div className="grid grid-cols-6 gap-1.5">
							{LEVELS.map(lvl => {
							  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onLevelChange(level === lvl ? null : lvl);
							  return (
								<Button
									key={lvl}
									onClick={handleClick}
									className={`flex h-[30px] items-center justify-center rounded-[6px] border text-[11.5px] font-semibold transition-colors ${
										level === lvl
											? levelColorMap[lvl]
											: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:bg-surf-2"
									}`}
								>
									{lvl}
								</Button>
							);
							})}
						</div>
					</div>

					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.authorLabel")}</FieldLabel>
						<FieldInput
							type="text"
							value={author}
							onChange={handleChange3}
							placeholder={t("admin.texts.createPage.authorPlaceholder")}
						/>
					</div>

					<div>
						<FieldLabel>{t("admin.texts.createPage.sourceLabel")}</FieldLabel>
						<FieldInput
							type="url"
							value={source}
							onChange={handleChange4}
							placeholder={t("admin.texts.createPage.sourcePlaceholder")}
						/>
					</div>
				</MetaSection>

				{/* ── Tags ── */}
				<MetaSection title={t("admin.texts.createPage.sections.tags")}>
					<div
						className="flex min-h-[38px] cursor-text flex-wrap gap-1.5 rounded-base border border-bd-2 bg-surf px-2 py-1.5 transition-colors focus-within:border-acc"
						onClick={handleClick2}
					>
						{tags.map(tag => {
						  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = e => {
										e.stopPropagation();
										onTagRemove(tag);
									};
						  return (
							<Typography tag="span"
								key={tag}
								className="inline-flex items-center gap-1 rounded-[4px] bg-acc-muted px-2 py-[3px] text-[11.5px] font-medium text-acc-strong"
							>
								{tag}
								<Button
									onClick={handleClick}
									className="flex items-center text-[13px] leading-none opacity-60 hover:opacity-100"
								>
									×
								</Button>
							</Typography>
						);
						})}
						<input
							ref={tagInputRef}
							value={tagInputValue}
							onChange={handleChange5}
							onKeyDown={handleTagKeyDown}
							placeholder={
								tags.length === 0
									? t("admin.texts.createPage.tagsAddPlaceholder")
									: ""
							}
							className="min-w-[70px] flex-1 border-none bg-transparent text-[12.5px] text-t-1 outline-none placeholder:text-t-3"
						/>
					</div>
					<Typography tag="p" className="mt-1.5 text-[10.5px] text-t-3">
						{t("admin.texts.createPage.tagsHint")}
					</Typography>
				</MetaSection>

				{/* ── Description ── */}
				<MetaSection title={t("admin.texts.createPage.sections.description")}>
					<textarea
						value={description}
						onChange={handleChange6}
						placeholder={t("admin.texts.createPage.descriptionPlaceholder")}
						rows={3}
						className="w-full resize-y rounded-base border border-bd-2 bg-surf px-2.5 py-2 text-[13px] leading-relaxed text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
						style={{ minHeight: "68px" }}
					/>
				</MetaSection>

				{/* ── Cover ── */}
				<MetaSection title={t("admin.texts.createPage.sections.cover")}>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/jpeg,image/png,image/webp"
						className="hidden"
						onChange={handleChange7}
					/>
					<Button
						onClick={handleClick3}
						className="flex h-[82px] w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[8px] border border-dashed border-bd-2 bg-surf transition-colors hover:border-acc hover:bg-acc-muted"
					>
						{coverPreviewUrl ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={coverPreviewUrl}
								alt="cover preview"
								className="h-full w-full object-cover"
							/>
						) : (
							<>
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									className="text-t-3"
								>
									<rect
										x="3"
										y="3"
										width="18"
										height="18"
										rx="3"
										stroke="currentColor"
										strokeWidth="1.4"
									/>
									<circle
										cx="8.5"
										cy="8.5"
										r="1.5"
										stroke="currentColor"
										strokeWidth="1.3"
									/>
									<path
										d="M3 16l4.5-4 3 3 3-3 4 4"
										stroke="currentColor"
										strokeWidth="1.3"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<Typography tag="span" className="text-[11px] text-t-3">
									{t("admin.texts.createPage.coverUploadLabel")}
								</Typography>
								<Typography tag="span" className="text-[10px] text-t-4">
									{t("admin.texts.createPage.coverUploadSub")}
								</Typography>
							</>
						)}
					</Button>
				</MetaSection>

				{/* ── Tokenization ── */}
				<MetaSection title={t("admin.texts.editPage.sections.tokenization")}>
					<div className="mb-2 flex items-center justify-between">
						<Typography tag="span" className="text-xs text-t-2">
							{t("admin.texts.editPage.tokenStatusLabel")}
						</Typography>
						<Typography tag="span"
							className={`rounded-[4px] px-2 py-0.5 text-[10.5px] font-semibold ${tokenStatusClass()}`}
						>
							{tokenStatusLabel()}
						</Typography>
					</div>

					{tokenCount > 0 && (
						<Typography tag="p" className="mb-2 text-[11.5px] leading-relaxed text-t-3">
							<Typography tag="strong" className="text-t-2">{tokenCount}</Typography>{" "}
							{t("admin.texts.editPage.tokenCountSuffix")}
						</Typography>
					)}

					{processingStatus !== "RUNNING" && (
						<Button
							onClick={onTokenize}
							className="mb-3 flex w-full items-center justify-center gap-1.5 rounded-base border border-acc/25 bg-acc-muted px-3 py-[7px] text-[11.5px] font-medium text-acc transition-opacity hover:opacity-80"
						>
							<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
								<circle
									cx="8"
									cy="8"
									r="6"
									stroke="currentColor"
									strokeWidth="1.3"
								/>
								<path
									d="M8 5v3.5l2 1"
									stroke="currentColor"
									strokeWidth="1.3"
									strokeLinecap="round"
								/>
							</svg>
							{t("admin.texts.editPage.tokenizeNow")}
						</Button>
					)}

					<Link
						href={`/${lang}/admin/texts/${textId}/versions`}
						className="mb-3 flex items-center gap-1.5 rounded-base border border-acc/15 bg-acc-muted px-3 py-[7px] text-[11.5px] font-medium text-acc transition-opacity hover:opacity-80"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<circle
								cx="8"
								cy="8"
								r="6"
								stroke="currentColor"
								strokeWidth="1.3"
							/>
							<path
								d="M8 5v3l2 1"
								stroke="currentColor"
								strokeWidth="1.3"
								strokeLinecap="round"
							/>
						</svg>
						{t("admin.texts.editPage.tokenHistoryLink")}
					</Link>

					<div className="mb-2.5 flex items-center justify-between gap-2">
						<div>
							<div className="text-xs text-t-1">
								{t("admin.texts.createPage.tokenizeLabel")}
							</div>
							<div className="text-[10.5px] text-t-3">
								{t("admin.texts.createPage.tokenizeSub")}
							</div>
						</div>
						<Toggle
							checked={autoTokenizeOnSave}
							onChange={onAutoTokenizeChange}
						/>
					</div>
					<div className="mb-2.5 flex items-center justify-between gap-2">
						<div>
							<div className="text-xs text-t-1">
								{t("admin.texts.createPage.normalizationLabel")}
							</div>
							<div className="text-[10.5px] text-t-3">
								{t("admin.texts.createPage.normalizationSub")}
							</div>
						</div>
						<Toggle
							checked={useNormalization}
							onChange={onNormalizationChange}
						/>
					</div>
					<div className="flex items-center justify-between gap-2">
						<div>
							<div className="text-xs text-t-1">
								{t("admin.texts.createPage.morphLabel")}
							</div>
							<div className="text-[10.5px] text-t-3">
								{t("admin.texts.createPage.morphSub")}
							</div>
						</div>
						<Toggle
							checked={useMorphAnalysis}
							onChange={onMorphAnalysisChange}
						/>
					</div>
				</MetaSection>

				{/* ── Page stats ── */}
				<MetaSection title={t("admin.texts.createPage.sections.pageStats")}>
					{pages.map((page, i) => {
						const tc = pageTokenCounts[i] ?? 0;
						return (
							<div key={i} className={i > 0 ? "mt-2" : ""}>
								<div className="mb-1 flex justify-between text-[11px]">
									<Typography tag="span" className="text-t-3">
										{t("admin.texts.createPage.pageN", { n: i + 1 })}
									</Typography>
									<Typography tag="span" className="font-medium text-t-2">
										{tc > 0
											? `${tc} ${t("admin.texts.editPage.tokenCountSuffix")} · ${page.wordCount} ${t("admin.texts.createPage.wordsSuffix")}`
											: `${page.wordCount} ${t("admin.texts.createPage.wordsSuffix")}`}
									</Typography>
								</div>
								<div className="h-1 overflow-hidden rounded-full bg-surf-3">
									<div
										className="h-full rounded-full bg-acc transition-all"
										style={{
											width: `${Math.min(100, Math.round((page.wordCount / maxWordCount) * 100))}%`,
										}}
									/>
								</div>
							</div>
						);
					})}
				</MetaSection>

				{/* ── Version history ── */}
				{recentVersions.length > 0 && (
					<MetaSection title={t("admin.texts.editPage.sections.versions")}>
						<div className="flex flex-col">
							{recentVersions.slice(0, 4).map((v, i) => (
								<div
									key={v.id}
									className={`group flex items-start gap-2 ${i < recentVersions.slice(0, 4).length - 1 ? "pb-3" : ""}`}
								>
									<div className="flex shrink-0 flex-col items-center">
										<div
											className={`mt-[3px] h-2 w-2 rounded-full ${
												v.isCurrent
													? "bg-grn shadow-[0_0_0_2px] shadow-grn-muted"
													: v.trigger === "AUTO_ON_SAVE"
														? "border-[1.5px] border-acc bg-acc-muted"
														: "bg-surf-4"
											}`}
										/>
										{i < recentVersions.slice(0, 4).length - 1 && (
											<div
												className="mt-1 w-px flex-1 bg-bd-2"
												style={{ minHeight: "14px" }}
											/>
										)}
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-xs font-medium text-t-1">
											{v.isCurrent
												? t("admin.texts.editPage.versionCurrent")
												: (v.label ?? `v${v.version}`)}
										</div>
										<div className="mt-0.5 text-[10.5px] text-t-3">
											{formatVersionDate(v.createdAt)}
											{v.initiator ? ` · ${v.initiator.name}` : ""}
										</div>
									</div>
								</div>
							))}
						</div>
						<Link
							href={`/${lang}/admin/texts/${textId}/versions`}
							className="mt-2.5 flex items-center justify-center gap-1.5 rounded-[6px] py-1.5 text-[11.5px] font-medium text-acc transition-colors hover:bg-acc-muted"
						>
							<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
								<circle
									cx="8"
									cy="8"
									r="6"
									stroke="currentColor"
									strokeWidth="1.3"
								/>
								<path
									d="M8 5v3l2 1"
									stroke="currentColor"
									strokeWidth="1.3"
									strokeLinecap="round"
								/>
							</svg>
							{t("admin.texts.editPage.allVersions")}
						</Link>
					</MetaSection>
				)}

				{/* ── Action buttons ── */}
				<div className="flex flex-col gap-1.5 border-t border-bd-1 bg-surf-2 px-4 py-[14px] transition-colors max-[900px]:hidden">
					<Button
						onClick={onSaveAndUpdate}
						disabled={isSaving}
						className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path
								d="M2.5 8.5L6 12l7.5-8"
								stroke="#fff"
								strokeWidth="1.6"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{isSaving
							? t("admin.texts.editPage.saving")
							: t("admin.texts.editPage.saveUpdate")}
					</Button>
					<Button
						onClick={onSaveDraft}
						disabled={isSaving}
						className="relative flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path
								d="M3 4a1 1 0 011-1h6l3 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
								stroke="currentColor"
								strokeWidth="1.3"
							/>
							<path
								d="M10 3v3H6V3"
								stroke="currentColor"
								strokeWidth="1.3"
								strokeLinecap="round"
							/>
							<path
								d="M5 10h6"
								stroke="currentColor"
								strokeWidth="1.3"
								strokeLinecap="round"
							/>
						</svg>
						{isSaving
							? t("admin.texts.editPage.saving")
							: t("admin.texts.editPage.saveDraft")}
					</Button>
				</div>

				{/* ── Danger zone ── */}
				<div className="border-t border-bd-1 px-4 py-3">
					<div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.6px] text-red opacity-60">
						{t("admin.texts.editPage.dangerZone")}
					</div>
					<Button
						onClick={onDeleteRequest}
						className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-red/25 bg-transparent py-[7px] text-[11.5px] text-red transition-colors hover:border-red/40 hover:bg-red-muted"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path
								d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1M5 4v8a1 1 0 001 1h4a1 1 0 001-1V4"
								stroke="currentColor"
								strokeWidth="1.3"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						{t("admin.texts.editPage.deleteText")}
					</Button>
				</div>
			</div>
		</div>
	);
};
