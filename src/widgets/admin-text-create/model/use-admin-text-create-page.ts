"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import { useAdminTextCreate } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import type { TextLanguage, TextLevel, TextStatus } from "@/entities/admin-text";

export interface TipTapNode {
	type: string;
	text?: string;
	marks?: { type: string }[];
	attrs?: Record<string, unknown>;
	content?: TipTapNode[];
}

export interface TipTapDoc {
	type: "doc";
	content: TipTapNode[];
}

export interface PageContent {
	doc: TipTapDoc;
	wordCount: number;
}

export interface TagEntry {
	id?: string;
	name: string;
}

export type SaveState = "initial" | "unsaved" | "saving" | "saved";

const EMPTY_DOC: TipTapDoc = { type: "doc", content: [{ type: "paragraph" }] };

export const useAdminTextCreatePage = () => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { success, error: toastError } = useToast();
	const { create, update, uploadCover } = useAdminTextCreate();

	const [title, setTitle] = useState("");
	const [pages, setPages] = useState<PageContent[]>([{ doc: EMPTY_DOC, wordCount: 0 }]);
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

	const savedIdRef = useRef<string | null>(null);
	const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const doSave = async (targetStatus: TextStatus, silent: boolean) => {
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
			contentRich: page.doc,
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
				const result = await create.mutateAsync({
					...commonFields,
					source: source.trim() || undefined,
					autoTokenize: true,
				});
				savedIdRef.current = result.id;
				resultId = result.id;
			} else {
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
	};

	const scheduleAutoSave = () => {
		if (!savedIdRef.current) return;
		if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
		autoSaveTimerRef.current = setTimeout(() => {
			void doSave("draft", true);
		}, 2000);
	};

	const markUnsaved = () => {
		setSaveState("unsaved");
		scheduleAutoSave();
	};

	useEffect(() => {
		if (saveState !== "unsaved") return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [saveState]);

	useEffect(() => {
		return () => {
			if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
		};
	}, []);

	const handleTitleChange = (value: string) => {
		setTitle(value);
		markUnsaved();
	};

	const handlePageContentChange = (doc: TipTapDoc, wordCount: number) => {
		setPages((prev) => {
			const next = [...prev];
			next[activePage] = { doc, wordCount };
			return next;
		});
		markUnsaved();
	};

	const handleAddPage = () => {
		setPages((prev) => [...prev, { doc: EMPTY_DOC, wordCount: 0 }]);
		setActivePage((prev) => prev + 1);
		markUnsaved();
	};

	const handleSelectPage = (index: number) => {
		setActivePage(index);
	};

	const handleDeletePage = (index: number) => {
		setPages(prev => {
			if (prev.length <= 1) return prev;
			return prev.filter((_, i) => i !== index);
		});
		setActivePage(prev => {
			if (index < prev) return prev - 1;
			if (index === prev) return Math.max(0, prev - 1);
			return prev;
		});
		markUnsaved();
	};

	const handleCoverSelect = (file: File) => {
		setPendingCoverFile(file);
		setCoverPreviewUrl(URL.createObjectURL(file));
		markUnsaved();
	};

	const handleAddTag = (name: string, id?: string) => {
		const trimmed = name.trim();
		if (!trimmed) return;
		setTags((prev) => {
			if (prev.some(t => t.name.toLowerCase() === trimmed.toLowerCase())) return prev;
			return [...prev, id ? { id, name: trimmed } : { name: trimmed }];
		});
		markUnsaved();
	};

	const handleRemoveTag = (index: number) => {
		setTags((prev) => prev.filter((_, i) => i !== index));
		markUnsaved();
	};

	const handleSaveDraft = () => doSave("draft", false);
	const handlePublish = () => doSave("published", false);

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
		handleDeletePage,
		handleSaveDraft,
		handlePublish,
	};
};
