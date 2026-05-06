"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminTag } from "@/entities/admin-tag";
import type { TextLanguage, TextLevel, TextStatus } from "@/entities/admin-text";
import type { PageContent, TagEntry } from "../model/use-admin-text-create-page";

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

const LEVELS: TextLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const levelColorMap: Record<TextLevel, string> = {
	A1: "bg-grn-muted border-grn/25 text-grn-strong",
	A2: "bg-[#d1fae5] border-[rgba(6,95,70,0.25)] text-[#065f46] dark:bg-[rgba(6,95,70,0.12)] dark:text-[#6ee7b7]",
	B1: "bg-acc-muted border-acc/25 text-acc-strong",
	B2: "bg-pur-muted border-pur/20 text-pur-strong",
	C1: "bg-amb-muted border-amb/20 text-amb-strong",
	C2: "bg-red-muted border-red/20 text-red-strong",
};

const MetaSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<div className="border-b border-bd-1 px-4 py-[14px]">
		<div className="mb-3 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3">
			{title}
		</div>
		{children}
	</div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
	<label className="mb-1.5 block text-[11px] font-medium text-t-3">{children}</label>
);

const FieldInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
	<input
		{...props}
		className="h-[34px] w-full rounded-[7px] border border-bd-2 bg-surf px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
	/>
);

const FieldSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
	<select
		{...props}
		className="h-[34px] w-full cursor-pointer appearance-none rounded-[7px] border border-bd-2 bg-surf px-2.5 pr-7 text-[13px] text-t-1 outline-none transition-colors focus:border-acc"
	/>
);

const Toggle = ({
	checked,
	onChange,
}: {
	checked: boolean;
	onChange: (v: boolean) => void;
}) => (
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		onClick={() => onChange(!checked)}
		className={`relative h-[18px] w-[34px] shrink-0 rounded-full border-none p-0 transition-colors ${
			checked ? "bg-acc" : "bg-surf-3"
		}`}
	>
		<span
			className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${
				checked ? "translate-x-[16px] left-[2px]" : "translate-x-0 left-[2px]"
			}`}
		/>
	</button>
);

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
	const fileInputRef = useRef<HTMLInputElement>(null);
	const tagInputRef = useRef<HTMLInputElement>(null);
	const [tagInputValue, setTagInputValue] = useState("");
	const [metaOpen, setMetaOpen] = useState(false);

	const maxWordCount = Math.max(...pages.map((p) => p.wordCount), 1);

	// ── Tag autocomplete ──────────────────────────────────────────────────────

	const filteredSuggestions = tagInputValue
		? allTags.filter(
				(tag) =>
					tag.name.toLowerCase().includes(tagInputValue.toLowerCase()) &&
					!tags.some((s) => s.id === tag.id || s.name.toLowerCase() === tag.name.toLowerCase()),
			)
		: [];

	const hasExactMatch = allTags.some(
		(tag) => tag.name.toLowerCase() === tagInputValue.toLowerCase(),
	);
	const canCreateNew =
		tagInputValue.trim().length > 0 &&
		!hasExactMatch &&
		!tags.some((s) => s.name.toLowerCase() === tagInputValue.trim().toLowerCase());

	const commitTag = (name: string, id?: string) => {
		onTagAdd(name, id);
		setTagInputValue("");
	};

	const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const trimmed = tagInputValue.trim();
			if (!trimmed) return;
			const exact = allTags.find((tag) => tag.name.toLowerCase() === trimmed.toLowerCase());
			commitTag(exact ? exact.name : trimmed, exact?.id);
		} else if (e.key === "Escape") {
			setTagInputValue("");
		}
	};

	return (
		<div className="flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">

			{/* Mobile toggle header */}
			<button
				type="button"
				onClick={() => setMetaOpen((v) => !v)}
				className="hidden items-center justify-between border-t border-bd-1 bg-surf-2 px-4 py-[13px] transition-colors hover:bg-surf-3 max-[900px]:flex"
			>
				<span className="flex items-center gap-2 text-[13px] font-medium text-t-1">
					<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
						<path d="M2 4.5h12M2 8.5h8M2 12.5h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
					</svg>
					{t("admin.texts.createPage.sections.settings")}
				</span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 16 16"
					fill="none"
					className={`text-t-3 transition-transform ${metaOpen ? "rotate-180" : ""}`}
				>
					<path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>

			<div className={`flex flex-col max-[900px]:${metaOpen ? "flex" : "hidden"}`}>

				{/* ── Status ── */}
				<MetaSection title={t("admin.texts.createPage.sections.status")}>
					<FieldSelect
						value={status}
						onChange={(e) => onStatusChange(e.target.value as TextStatus)}
					>
						<option value="draft">{t("admin.texts.createPage.statusOptions.draft")}</option>
						<option value="published">{t("admin.texts.createPage.statusOptions.published")}</option>
						<option value="archived">{t("admin.texts.createPage.statusOptions.archived")}</option>
					</FieldSelect>
				</MetaSection>

				{/* ── Metadata ── */}
				<MetaSection title={t("admin.texts.createPage.sections.metadata")}>
					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.langLabel")}</FieldLabel>
						<FieldSelect
							value={language}
							onChange={(e) => onLanguageChange(e.target.value as TextLanguage)}
						>
							<option value="CHE">{t("admin.texts.createPage.langChe")}</option>
							<option value="RU">{t("admin.texts.createPage.langRu")}</option>
						</FieldSelect>
					</div>

					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.levelLabel")}</FieldLabel>
						<div className="grid grid-cols-6 gap-1.5">
							{LEVELS.map((lvl) => (
								<button
									key={lvl}
									type="button"
									onClick={() => onLevelChange(level === lvl ? null : lvl)}
									className={`flex h-[30px] items-center justify-center rounded-[6px] border text-[11.5px] font-semibold transition-colors ${
										level === lvl
											? levelColorMap[lvl]
											: "border-bd-2 bg-surf text-t-2 hover:border-bd-3 hover:bg-surf-2"
									}`}
								>
									{lvl}
								</button>
							))}
						</div>
					</div>

					<div className="mb-[11px]">
						<FieldLabel>{t("admin.texts.createPage.authorLabel")}</FieldLabel>
						<FieldInput
							type="text"
							value={author}
							maxLength={50}
							onChange={(e) => onAuthorChange(e.target.value)}
							placeholder={t("admin.texts.createPage.authorPlaceholder")}
						/>
					</div>

					<div>
						<FieldLabel>{t("admin.texts.createPage.sourceLabel")}</FieldLabel>
						<FieldInput
							type="url"
							value={source}
							onChange={(e) => onSourceChange(e.target.value)}
							placeholder={t("admin.texts.createPage.sourcePlaceholder")}
						/>
					</div>
				</MetaSection>

				{/* ── Tags ── */}
				<MetaSection title={t("admin.texts.createPage.sections.tags")}>
					{/*
						onBlur on the wrapper closes the dropdown when focus leaves the whole block.
						onMouseDown on dropdown items prevents blur from firing before onClick.
					*/}
					<div
						onBlur={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget as Node)) {
								setTagInputValue("");
							}
						}}
						className="relative"
					>
						<div
							className="flex min-h-[38px] cursor-text flex-wrap gap-1.5 rounded-base border border-bd-2 bg-surf px-2 py-1.5 transition-colors focus-within:border-acc"
							onClick={() => tagInputRef.current?.focus()}
						>
							{tags.map((tag, index) => (
								<span
									key={index}
									className="inline-flex items-center gap-1 rounded-[4px] bg-acc-muted px-2 py-[3px] text-[11.5px] font-medium text-acc-strong"
								>
									{tag.name}
									<button
										type="button"
										onClick={(e) => { e.stopPropagation(); onTagRemove(index); }}
										className="flex items-center text-[13px] leading-none opacity-60 hover:opacity-100"
									>
										×
									</button>
								</span>
							))}
							<input
								ref={tagInputRef}
								value={tagInputValue}
								onChange={(e) => setTagInputValue(e.target.value)}
								onKeyDown={handleTagKeyDown}
								placeholder={tags.length === 0 ? t("admin.texts.createPage.tagsAddPlaceholder") : ""}
								className="min-w-[70px] flex-1 border-none bg-transparent text-[12.5px] text-t-1 outline-none placeholder:text-t-3"
							/>
						</div>

						{/* Autocomplete dropdown */}
						{tagInputValue && (filteredSuggestions.length > 0 || canCreateNew) && (
							<div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-[8px] border border-bd-2 bg-bg shadow-lg">
								{filteredSuggestions.map((tag) => (
									<button
										key={tag.id}
										type="button"
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => commitTag(tag.name, tag.id)}
										className="flex w-full items-center gap-2 px-3 py-[9px] text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-2"
									>
										<span className="flex-1">{tag.name}</span>
										<span className="text-[10.5px] text-t-4">{tag._count.texts}</span>
									</button>
								))}
								{canCreateNew && (
									<button
										type="button"
										onMouseDown={(e) => e.preventDefault()}
										onClick={() => commitTag(tagInputValue.trim())}
										className={`flex w-full items-center gap-2 px-3 py-[9px] text-left text-[12.5px] transition-colors hover:bg-acc-muted ${filteredSuggestions.length > 0 ? "border-t border-bd-1" : ""}`}
									>
										<span className="text-[10px] font-semibold uppercase tracking-wide text-t-3">
											{t("admin.texts.createPage.tagsCreate")}
										</span>
										<span className="text-acc-strong">{tagInputValue.trim()}</span>
									</button>
								)}
							</div>
						)}
					</div>
					<p className="mt-1.5 text-[10.5px] text-t-3">
						{t("admin.texts.createPage.tagsHint")}
					</p>
				</MetaSection>

				{/* ── Description ── */}
				<MetaSection title={t("admin.texts.createPage.sections.description")}>
					<textarea
						value={description}
						onChange={(e) => onDescriptionChange(e.target.value)}
						placeholder={t("admin.texts.createPage.descriptionPlaceholder")}
						rows={3}
						maxLength={1000}
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
						onChange={(e) => {
							const file = e.target.files?.[0];
							if (file) onCoverSelect(file);
						}}
					/>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						className="flex h-[82px] w-full flex-col items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-bd-2 bg-surf transition-colors hover:border-acc hover:bg-acc-muted"
					>
						{coverPreviewUrl ? (
							// blob: URL from URL.createObjectURL — next/image cannot handle it
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={coverPreviewUrl}
								alt="cover preview"
								className="h-full w-full rounded-[7px] object-cover"
							/>
						) : (
							<>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-t-3">
									<rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4" />
									<circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
									<path d="M3 16l4.5-4 3 3 3-3 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<span className="text-[11px] text-t-3">{t("admin.texts.createPage.coverUploadLabel")}</span>
								<span className="text-[10px] text-t-4">{t("admin.texts.createPage.coverUploadSub")}</span>
							</>
						)}
					</button>
				</MetaSection>

				{/* ── Processing ── */}
				<MetaSection title={t("admin.texts.createPage.sections.processing")}>
					<div className="mb-2.5 flex items-center justify-between gap-2">
						<div>
							<div className="text-xs text-t-1">{t("admin.texts.createPage.tokenizeLabel")}</div>
							<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.tokenizeSub")}</div>
						</div>
						<Toggle checked={autoTokenizeOnSave} onChange={onAutoTokenizeChange} />
					</div>
					<div className="mb-2.5 flex items-center justify-between gap-2">
						<div>
							<div className="text-xs text-t-1">{t("admin.texts.createPage.normalizationLabel")}</div>
							<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.normalizationSub")}</div>
						</div>
						<Toggle checked={useNormalization} onChange={onNormalizationChange} />
					</div>
					<div className="mb-2.5 flex items-center justify-between gap-2">
						<div>
							<div className="text-xs text-t-1">{t("admin.texts.createPage.morphLabel")}</div>
							<div className="text-[10.5px] text-t-3">{t("admin.texts.createPage.morphSub")}</div>
						</div>
						<Toggle checked={useMorphAnalysis} onChange={onMorphAnalysisChange} />
					</div>

					{autoTokenizeOnSave && (
						<div className="mt-2.5 flex gap-2 rounded-[8px] bg-acc-muted p-3">
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-px shrink-0 text-acc">
								<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
								<path d="M8 7.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
								<circle cx="8" cy="5.5" r=".7" fill="currentColor" />
							</svg>
							<p className="text-[11.5px] leading-relaxed text-acc-strong">
								{t("admin.texts.createPage.processNotice")}
							</p>
						</div>
					)}
				</MetaSection>

				{/* ── Page stats ── */}
				<MetaSection title={t("admin.texts.createPage.sections.pageStats")}>
					{pages.map((page, i) => (
						<div key={i} className={i > 0 ? "mt-2" : ""}>
							<div className="mb-1 flex justify-between text-[11px]">
								<span className="text-t-3">{t("admin.texts.createPage.pageN", { n: i + 1 })}</span>
								<span className="font-medium text-t-2">
									{page.wordCount} {t("admin.texts.createPage.wordsSuffix")}
								</span>
							</div>
							<div className="h-1 overflow-hidden rounded-full bg-surf-3">
								<div
									className="h-full rounded-full bg-acc transition-all"
									style={{ width: `${Math.min(100, Math.round((page.wordCount / maxWordCount) * 100))}%` }}
								/>
							</div>
						</div>
					))}
				</MetaSection>

				{/* ── Action buttons (desktop only) ── */}
				<div className="flex flex-col gap-1.5 border-t border-bd-1 bg-surf-2 px-4 py-[14px] transition-colors max-[900px]:hidden">
					<button
						type="button"
						onClick={onPublish}
						disabled={isSaving}
						className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path d="M8 2v10M3 7l5-5 5 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
						{isSaving ? t("admin.texts.createPage.publishing") : t("admin.texts.createPage.publish")}
					</button>
					<button
						type="button"
						onClick={onSaveDraft}
						disabled={isSaving}
						className="flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-bd-2 bg-transparent text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-3 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path d="M3 4a1 1 0 011-1h6l3 3v6a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.3" />
							<path d="M10 3v3H6V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							<path d="M5 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
						</svg>
						{isSaving ? t("admin.texts.createPage.saving") : t("admin.texts.createPage.saveDraft")}
					</button>
				</div>
			</div>
		</div>
	);
};
