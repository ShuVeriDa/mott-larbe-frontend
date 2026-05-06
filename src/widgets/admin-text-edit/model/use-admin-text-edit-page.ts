"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
	useAdminTextCreate,
	useAdminTextDetail,
	useAdminTextMutations,
	useAdminTextVersionMutations,
	useAdminTextVersions,
} from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { htmlToTipTap, tiptapToHtml, countWordsInRaw } from "../lib/html-utils";
import type { TextLanguage, TextLevel, TextStatus } from "@/entities/admin-text";

export interface PageContent {
	html: string;
	wordCount: number;
}

export const useAdminTextEditPage = (id: string) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { success, error: toastError } = useToast();

	const { update, uploadCover } = useAdminTextCreate();
	const { remove } = useAdminTextMutations();
	const { runTokenization } = useAdminTextVersionMutations(id);

	const { data: textData, isLoading, isError } = useAdminTextDetail(id);
	const { data: versionsData } = useAdminTextVersions(id);

	// ── Form state ──
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
	const [showRetokenizeBar, setShowRetokenizeBar] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Initialize from server data only once
	const initialized = useRef(false);

	useEffect(() => {
		if (textData && !initialized.current) {
			initialized.current = true;
			setTitle(textData.title);
			setStatus(textData.status);
			setLanguage(textData.language);
			setLevel(textData.level);
			setAuthor(textData.author ?? "");
			setSource(textData.source ?? "");
			setDescription(textData.description ?? "");
			setCoverPreviewUrl(textData.imageUrl);
			setAutoTokenizeOnSave(textData.autoTokenizeOnSave);
			setUseNormalization(textData.useNormalization);
			setUseMorphAnalysis(textData.useMorphAnalysis);
			setTags(textData.tags.map((tg) => tg.name));
			setPages(
				[...textData.pages]
					.sort((a, b) => a.pageNumber - b.pageNumber)
					.map((p) => ({
						html: tiptapToHtml(p.contentRich as { type: string; content?: unknown[] }),
						wordCount: countWordsInRaw(p.contentRaw),
					})),
			);
		}
	}, [textData]);

	const markUnsaved = useCallback(() => {
		setIsUnsaved(true);
		if (textData?.processingStatus === "COMPLETED") {
			setShowRetokenizeBar(true);
		}
	}, [textData?.processingStatus]);

	const handleTitleChange = useCallback(
		(value: string) => {
			setTitle(value);
			markUnsaved();
		},
		[markUnsaved],
	);

	const handlePageContentChange = useCallback(
		(html: string, wordCount: number) => {
			setPages((prev) => {
				const next = [...prev];
				next[activePage] = { html, wordCount };
				return next;
			});
			markUnsaved();
		},
		[activePage, markUnsaved],
	);

	const handleAddPage = useCallback(() => {
		setPages((prev) => [...prev, { html: "", wordCount: 0 }]);
		setActivePage((prev) => prev + 1);
		markUnsaved();
	}, [markUnsaved]);

	const handleSelectPage = useCallback((index: number) => {
		setActivePage(index);
	}, []);

	const handleCoverSelect = useCallback(
		(file: File) => {
			setPendingCoverFile(file);
			setCoverPreviewUrl(URL.createObjectURL(file));
			markUnsaved();
		},
		[markUnsaved],
	);

	const handleAddTag = useCallback(
		(tag: string) => {
			const trimmed = tag.trim();
			if (!trimmed || tags.includes(trimmed)) return;
			setTags((prev) => [...prev, trimmed]);
			markUnsaved();
		},
		[tags, markUnsaved],
	);

	const handleRemoveTag = useCallback(
		(tag: string) => {
			setTags((prev) => prev.filter((tg) => tg !== tag));
			markUnsaved();
		},
		[markUnsaved],
	);

	const handleSave = useCallback(
		async (targetStatus: TextStatus) => {
			if (!title.trim()) {
				toastError(t("admin.texts.editPage.titleRequired"));
				return;
			}

			const pagesDto = pages.map((page, i) => ({
				pageNumber: i + 1,
				contentRich: htmlToTipTap(page.html),
			}));

			try {
				await update.mutateAsync({
					id,
					dto: {
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
					},
				});

				if (pendingCoverFile) {
					await uploadCover.mutateAsync({ id, file: pendingCoverFile });
					setPendingCoverFile(null);
				}

				setIsUnsaved(false);
				setShowRetokenizeBar(false);
				success(t("admin.texts.editPage.updateSuccess"));
			} catch {
				toastError(t("admin.texts.editPage.updateFailed"));
			}
		},
		[
			title,
			pages,
			language,
			level,
			description,
			author,
			source,
			tags,
			autoTokenizeOnSave,
			useNormalization,
			useMorphAnalysis,
			pendingCoverFile,
			id,
			update,
			uploadCover,
			t,
			success,
			toastError,
		],
	);

	const handleSaveDraft = useCallback(() => handleSave("draft"), [handleSave]);
	const handleSaveAndUpdate = useCallback(() => handleSave(status), [handleSave, status]);

	const handleDelete = useCallback(async () => {
		try {
			await remove.mutateAsync(id);
			success(t("admin.texts.editPage.deleteSuccess"));
			router.push(`/${lang}/admin/texts`);
		} catch {
			toastError(t("admin.texts.editPage.deleteFailed"));
		}
	}, [id, remove, lang, router, t, success, toastError]);

	const handleTokenize = useCallback(async () => {
		try {
			await runTokenization.mutateAsync();
			success(t("admin.texts.editPage.tokenizeStarted"));
		} catch {
			toastError(t("admin.texts.editPage.tokenizeFailed"));
		}
	}, [runTokenization, t, success, toastError]);

	const isSaving = update.isPending || uploadCover.isPending;
	const isDeleting = remove.isPending;

	const pageTokenCounts: number[] = textData?.pages
		? [...textData.pages]
			.sort((a, b) => a.pageNumber - b.pageNumber)
			.map((p) => p.tokenCount ?? 0)
		: [];

	return {
		// data
		textData,
		isLoading,
		isError,
		versionsData,
		pageTokenCounts,
		// form state
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
		isDeleting,
		showRetokenizeBar,
		showDeleteModal,
		// handlers
		handleTitleChange,
		handlePageContentChange,
		handleAddPage,
		handleSelectPage,
		handleCoverSelect,
		handleAddTag,
		handleRemoveTag,
		handleSaveDraft,
		handleSaveAndUpdate,
		handleDelete,
		handleTokenize,
		setStatus,
		setLanguage,
		setLevel,
		setAuthor,
		setDescription,
		setSource,
		setAutoTokenizeOnSave: (v: boolean) => { setAutoTokenizeOnSave(v); markUnsaved(); },
		setUseNormalization: (v: boolean) => { setUseNormalization(v); markUnsaved(); },
		setUseMorphAnalysis: (v: boolean) => { setUseMorphAnalysis(v); markUnsaved(); },
		setShowRetokenizeBar,
		setShowDeleteModal,
	};
};
