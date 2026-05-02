"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminTextCreate } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { htmlToTipTap } from "../lib/html-to-tiptap";
import type { TextLanguage, TextLevel, TextStatus } from "@/entities/admin-text";

export interface PageContent {
	html: string;
	wordCount: number;
}

export const useAdminTextCreatePage = () => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { success, error: toastError } = useToast();

	const { create, uploadCover } = useAdminTextCreate();

	const [title, setTitle] = useState("");
	const [pages, setPages] = useState<PageContent[]>([{ html: "", wordCount: 0 }]);
	const [activePage, setActivePage] = useState(0);
	const [status, setStatus] = useState<TextStatus>("draft");
	const [language, setLanguage] = useState<TextLanguage>("CHE");
	const [level, setLevel] = useState<TextLevel | null>(null);
	const [author, setAuthor] = useState("");
	const [source, setSource] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [description, setDescription] = useState("");
	const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
	const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
	const [autoTokenizeOnSave, setAutoTokenizeOnSave] = useState(true);
	const [useNormalization, setUseNormalization] = useState(true);
	const [useMorphAnalysis, setUseMorphAnalysis] = useState(false);
	const [isUnsaved, setIsUnsaved] = useState(false);

	const markUnsaved = useCallback(() => setIsUnsaved(true), []);

	const handleTitleChange = useCallback((value: string) => {
		setTitle(value);
		markUnsaved();
	}, [markUnsaved]);

	const handlePageContentChange = useCallback((html: string, wordCount: number) => {
		setPages((prev) => {
			const next = [...prev];
			next[activePage] = { html, wordCount };
			return next;
		});
		markUnsaved();
	}, [activePage, markUnsaved]);

	const handleAddPage = useCallback(() => {
		setPages((prev) => [...prev, { html: "", wordCount: 0 }]);
		setActivePage((prev) => prev + 1);
		markUnsaved();
	}, [markUnsaved]);

	const handleSelectPage = useCallback((index: number) => {
		setActivePage(index);
	}, []);

	const handleCoverSelect = useCallback((file: File) => {
		setPendingCoverFile(file);
		setCoverPreviewUrl(URL.createObjectURL(file));
		markUnsaved();
	}, [markUnsaved]);

	const handleAddTag = useCallback((tag: string) => {
		const trimmed = tag.trim();
		if (!trimmed || tags.includes(trimmed)) return;
		setTags((prev) => [...prev, trimmed]);
		markUnsaved();
	}, [tags, markUnsaved]);

	const handleRemoveTag = useCallback((tag: string) => {
		setTags((prev) => prev.filter((t) => t !== tag));
		markUnsaved();
	}, [markUnsaved]);

	const buildPayload = useCallback((targetStatus: TextStatus) => {
		const pagesDto = pages.map((page, i) => ({
			pageNumber: i + 1,
			contentRich: htmlToTipTap(page.html),
		}));

		return {
			title: title.trim(),
			language,
			level: level ?? null,
			description: description.trim() || undefined,
			author: author.trim() || undefined,
			source: source.trim() || undefined,
			tagNames: tags.length ? tags : undefined,
			status: targetStatus,
			autoTokenizeOnSave,
			useNormalization,
			useMorphAnalysis,
			pages: pagesDto,
		};
	}, [pages, title, language, level, description, author, source, tags, autoTokenizeOnSave, useNormalization, useMorphAnalysis]);

	const handleSave = useCallback(async (targetStatus: TextStatus) => {
		if (!title.trim()) {
			toastError(t("admin.texts.createPage.titleRequired"));
			return;
		}

		const payload = buildPayload(targetStatus);

		try {
			const result = await create.mutateAsync(payload);

			if (pendingCoverFile) {
				await uploadCover.mutateAsync({ id: result.id, file: pendingCoverFile });
			}

			setIsUnsaved(false);
			const msgKey = targetStatus === "published"
				? "admin.texts.createPage.textPublished"
				: "admin.texts.createPage.savedDraft";
			success(t(msgKey));
			router.push(`/${lang}/admin/texts`);
		} catch {
			toastError(t("admin.texts.createPage.saveFailed"));
		}
	}, [title, buildPayload, create, pendingCoverFile, uploadCover, lang, router, t, success, toastError]);

	const handleSaveDraft = useCallback(() => handleSave("draft"), [handleSave]);
	const handlePublish = useCallback(() => handleSave("published"), [handleSave]);

	const isSaving = create.isPending || uploadCover.isPending;

	return {
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
		isUnsaved,
		isSaving,
		handleTitleChange,
		handlePageContentChange,
		handleAddPage,
		handleSelectPage,
		handleCoverSelect,
		handleAddTag,
		handleRemoveTag,
		setStatus,
		setLanguage,
		setLevel,
		setAuthor,
		setDescription,
		setSource,
		setAutoTokenizeOnSave: (v: boolean) => { setAutoTokenizeOnSave(v); markUnsaved(); },
		setUseNormalization: (v: boolean) => { setUseNormalization(v); markUnsaved(); },
		setUseMorphAnalysis: (v: boolean) => { setUseMorphAnalysis(v); markUnsaved(); },
		handleSaveDraft,
		handlePublish,
	};
};
