"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export interface TagEntry {
	id?: string;
	name: string;
}

export type SaveState = "initial" | "unsaved" | "saving" | "saved";

export const useAdminTextCreatePage = () => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { success, error: toastError } = useToast();
	const { create, update, uploadCover } = useAdminTextCreate();

	const [title, setTitle] = useState("");
	const [pages, setPages] = useState<PageContent[]>([{ html: "", wordCount: 0 }]);
	const [activePage, setActivePage] = useState(0);
	const [status, setStatus] = useState<TextStatus>("draft");
	const [language, setLanguage] = useState<TextLanguage>("CHE");
	const [level, setLevel] = useState<TextLevel | null>(null);
	const [author, setAuthor] = useState("");
	const [source, setSource] = useState("");
	const [tags, setTags] = useState<TagEntry[]>([]);
	const [description, setDescription] = useState("");
	const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
	const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
	const [autoTokenizeOnSave, setAutoTokenizeOnSave] = useState(true);
	const [useNormalization, setUseNormalization] = useState(true);
	const [useMorphAnalysis, setUseMorphAnalysis] = useState(false);
	const [saveState, setSaveState] = useState<SaveState>("initial");

	// Stable ref tracking the saved text id — null until first POST succeeds
	const savedIdRef = useRef<string | null>(null);
	const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Pattern: updated every render so the auto-save timer always calls the latest closure
	const saveNowRef = useRef<((targetStatus: TextStatus, silent: boolean) => Promise<void>) | undefined>(undefined);

	const doSave = useCallback(async (targetStatus: TextStatus, silent: boolean) => {
		if (!title.trim()) {
			if (!silent) toastError(t("admin.texts.createPage.titleRequired"));
			return;
		}
		if (!silent && author.trim() && (author.trim().length < 2 || author.trim().length > 50)) {
			toastError(t("admin.texts.createPage.authorLengthError"));
			return;
		}
		if (!silent && description.trim().length > 1000) {
			toastError(t("admin.texts.createPage.descriptionTooLong"));
			return;
		}

		setSaveState("saving");

		const pagesDto = pages.map((page, i) => ({
			pageNumber: i + 1,
			contentRich: htmlToTipTap(page.html),
		}));

		const commonFields = {
			title: title.trim(),
			language,
			level: level ?? undefined,
			description: description.trim() || undefined,
			author: author.trim() || undefined,
			tagIds: tags.filter(tag => tag.id).map(tag => tag.id!),
			tagNames: tags.filter(tag => !tag.id).map(tag => tag.name),
			status: targetStatus,
			autoTokenizeOnSave,
			useNormalization,
			useMorphAnalysis,
			pages: pagesDto,
		};

		try {
			let resultId: string;

			if (!savedIdRef.current) {
				// First save → POST with autoTokenize to trigger immediate processing
				const result = await create.mutateAsync({
					...commonFields,
					source: source.trim() || undefined,
					autoTokenize: true,
				});
				savedIdRef.current = result.id;
				resultId = result.id;
			} else {
				// Subsequent saves → PATCH; send null for source to allow clearing
				const result = await update.mutateAsync({
					id: savedIdRef.current,
					dto: { ...commonFields, source: source.trim() || null },
				});
				resultId = result.id;
			}

			if (pendingCoverFile) {
				await uploadCover.mutateAsync({ id: resultId, file: pendingCoverFile });
				setPendingCoverFile(null);
			}

			setSaveState("saved");

			if (!silent) {
				if (targetStatus === "published") {
					success(t("admin.texts.createPage.textPublished"));
					router.push(`/${lang}/admin/texts/${resultId}`);
				} else {
					success(t("admin.texts.createPage.savedDraft"));
				}
			}
		} catch {
			setSaveState("unsaved");
			if (!silent) toastError(t("admin.texts.createPage.saveFailed"));
		}
	}, [
		title, author, description, pages, language, level, tags, source,
		autoTokenizeOnSave, useNormalization, useMorphAnalysis,
		create, update, uploadCover, pendingCoverFile,
		t, toastError, success, lang, router,
	]);

	// Always point to the latest doSave — the auto-save timer reads this ref
	saveNowRef.current = doSave;

	// Debounced auto-save: fires 2 s after the last change, only once first save is done
	const scheduleAutoSave = useCallback(() => {
		if (!savedIdRef.current) return;
		if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
		autoSaveTimerRef.current = setTimeout(() => {
			saveNowRef.current?.("draft", true);
		}, 2000);
	}, []);

	const markUnsaved = useCallback(() => {
		setSaveState("unsaved");
		scheduleAutoSave();
	}, [scheduleAutoSave]);

	// Warn the user before navigating away with unsaved changes
	useEffect(() => {
		if (saveState !== "unsaved") return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [saveState]);

	// Cancel pending auto-save on unmount
	useEffect(() => {
		return () => {
			if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
		};
	}, []);

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

	const handleAddTag = useCallback((name: string, id?: string) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setTags((prev) => {
			if (prev.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) return prev;
			return [...prev, id ? { id, name: trimmed } : { name: trimmed }];
		});
		markUnsaved();
	}, [markUnsaved]);

	const handleRemoveTag = useCallback((index: number) => {
		setTags((prev) => prev.filter((_, i) => i !== index));
		markUnsaved();
	}, [markUnsaved]);

	const handleSaveDraft = useCallback(() => doSave("draft", false), [doSave]);
	const handlePublish = useCallback(() => doSave("published", false), [doSave]);

	const isSaving = create.isPending || update.isPending || uploadCover.isPending;

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
		saveState,
		isSaving,
		handleTitleChange,
		handlePageContentChange,
		handleAddPage,
		handleSelectPage,
		handleCoverSelect,
		handleAddTag,
		handleRemoveTag,
		setStatus,
		setLanguage: (v: TextLanguage) => { setLanguage(v); markUnsaved(); },
		setLevel: (v: TextLevel | null) => { setLevel(v); markUnsaved(); },
		setAuthor: (v: string) => { setAuthor(v); markUnsaved(); },
		setDescription: (v: string) => { setDescription(v); markUnsaved(); },
		setSource: (v: string) => { setSource(v); markUnsaved(); },
		setAutoTokenizeOnSave: (v: boolean) => { setAutoTokenizeOnSave(v); markUnsaved(); },
		setUseNormalization: (v: boolean) => { setUseNormalization(v); markUnsaved(); },
		setUseMorphAnalysis: (v: boolean) => { setUseMorphAnalysis(v); markUnsaved(); },
		handleSaveDraft,
		handlePublish,
	};
};
