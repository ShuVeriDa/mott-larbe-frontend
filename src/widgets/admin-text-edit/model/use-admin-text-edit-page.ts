"use client";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import { useAutoSave } from "@/shared/lib/auto-save";
import { useQuery } from "@tanstack/react-query";
import {
	useAdminTextCreate,
	useAdminTextDetail,
	useAdminTextMutations,
	useAdminTextVersionMutations,
	useAdminTextVersions,
} from "@/entities/admin-text";
import { scriptVersionsQueryOptions } from "@/entities/text-script-version";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { countWordsInRaw } from "../lib/tiptap-utils";
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
	title: string;
}

const EMPTY_DOC: TipTapDoc = { type: "doc", content: [{ type: "paragraph" }] };
const EMPTY_PAGE: PageContent = { doc: EMPTY_DOC, wordCount: 0, title: "" };

export const useAdminTextEditPage = (id: string) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { toast, success, error: toastError } = useToast();

	const { update, uploadCover } = useAdminTextCreate();
	const { remove } = useAdminTextMutations();
	const { runTokenization } = useAdminTextVersionMutations(id);

	const { data: textData, isLoading, isError } = useAdminTextDetail(id);
	const { data: versionsData } = useAdminTextVersions(id);
	const { data: scriptVersions = [] } = useQuery(scriptVersionsQueryOptions(id));

	const [title, setTitle] = useState("");
	const [pages, setPages] = useState<PageContent[]>([EMPTY_PAGE]);
	const [activePage, setActivePage] = useState(0);
	const [status, setStatus] = useState<TextStatus>("draft");
	const [language, setLanguage] = useState<TextLanguage>("CHE");
	const [level, setLevel] = useState<TextLevel | null>(null);
	const [author, setAuthor] = useState("");
	const [source, setSource] = useState("");
	const [genreId, setGenreId] = useState<string | null>(null);
	const [tags, setTags] = useState<string[]>([]);
	const [description, setDescription] = useState("");
	const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
	const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
	const [autoTokenizeOnSave, setAutoTokenizeOnSave] = useState(true);
	const [useNormalization, setUseNormalization] = useState(true);
	const [useMorphAnalysis, setUseMorphAnalysis] = useState(true);
	const [isUnsaved, setIsUnsaved] = useState(false);
	const [showRetokenizeBar, setShowRetokenizeBar] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

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
			setGenreId((textData as unknown as Record<string, unknown>).genreId as string | null ?? null);
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
						doc: (p.contentRich as TipTapDoc) ?? EMPTY_DOC,
						wordCount: countWordsInRaw(p.contentRaw),
						title: p.title ?? "",
					})),
			);
		}
	}, [textData]);

	const markUnsaved = () => {
		setIsUnsaved(true);
		if (textData?.processingStatus === "COMPLETED") {
			setShowRetokenizeBar(true);
		}
	};

	useEffect(() => {
		if (!isUnsaved) return;
		const handler = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handler);
		return () => window.removeEventListener("beforeunload", handler);
	}, [isUnsaved]);

	const handleTitleChange = (value: string) => {
		setTitle(value);
		markUnsaved();
	};

	const handlePageContentChange = (doc: TipTapDoc, wordCount: number) => {
		setPages((prev) => {
			const next = [...prev];
			next[activePage] = { ...next[activePage], doc, wordCount };
			return next;
		});
		markUnsaved();
	};

	const handlePageTitleChange = (title: string) => {
		setPages((prev) => {
			const next = [...prev];
			next[activePage] = { ...next[activePage], title };
			return next;
		});
		markUnsaved();
	};

	const handleAddPage = () => {
		setPages((prev) => [...prev, EMPTY_PAGE]);
		setActivePage((prev) => prev + 1);
		markUnsaved();
	};

	const handleSelectPage = (index: number) => {
		setActivePage(index);
	};

	const handleCoverSelect = (file: File) => {
		setPendingCoverFile(file);
		setCoverPreviewUrl(URL.createObjectURL(file));
		markUnsaved();
	};

	const handleAddTag = (tag: string) => {
		const trimmed = tag.trim();
		if (!trimmed || tags.includes(trimmed)) return;
		setTags((prev) => [...prev, trimmed]);
		markUnsaved();
	};

	const handleRemoveTag = (tag: string) => {
		setTags((prev) => prev.filter((tg) => tg !== tag));
		markUnsaved();
	};

	const handleSave = async (targetStatus: TextStatus, silent = false) => {
		if (!title.trim()) {
			if (!silent) toastError(t("admin.texts.editPage.titleRequired"));
			return;
		}

		const pagesDto = pages.map((page, i) => ({
			pageNumber: i + 1,
			title: page.title.trim() || undefined,
			contentRich: page.doc,
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
					source: source.trim() || null,
					genreId: genreId ?? null,
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
			if (!silent) {
				success(t("admin.texts.editPage.updateSuccess"));
				if (isBackgroundRunning) {
					toast(t("admin.texts.editPage.backgroundSaveWarning"));
				}
			}
		} catch {
			if (!silent) toastError(t("admin.texts.editPage.updateFailed"));
		}
	};

	const handleSaveDraft = () => handleSave("draft");
	const handleSaveAndUpdate = () => handleSave(status);

	useAutoSave({
		onSave: () => handleSave("draft", true),
		isDirty: isUnsaved,
		isReady: !!id,
		isSaving: update.isPending || uploadCover.isPending,
	});

	const handleDelete = async () => {
		try {
			await remove.mutateAsync(id);
			success(t("admin.texts.editPage.deleteSuccess"));
			router.push(`/${lang}/admin/texts`);
		} catch {
			toastError(t("admin.texts.editPage.deleteFailed"));
		}
	};

	const handleTokenize = async () => {
		try {
			await runTokenization.mutateAsync();
			success(t("admin.texts.editPage.tokenizeStarted"));
		} catch {
			toastError(t("admin.texts.editPage.tokenizeFailed"));
		}
	};

	const isSaving = update.isPending || uploadCover.isPending;
	const isDeleting = remove.isPending;
	const isBackgroundRunning =
		textData?.processingStatus === "RUNNING" ||
		scriptVersions.some((v) => v.status === "RUNNING");

	const pageTokenCounts: number[] = textData?.pages
		? [...textData.pages]
			.sort((a, b) => a.pageNumber - b.pageNumber)
			.map((p) => p.tokenCount ?? 0)
		: [];

	return {
		textData,
		isLoading,
		isError,
		versionsData,
		pageTokenCounts,
		title,
		pages,
		activePage,
		status,
		language,
		level,
		author,
		source,
		genreId,
		tags,
		description,
		coverPreviewUrl,
		autoTokenizeOnSave,
		useNormalization,
		useMorphAnalysis,
		isUnsaved,
		isSaving,
		isDeleting,
		isBackgroundRunning,
		showRetokenizeBar,
		showDeleteModal,
		handleTitleChange,
		handlePageContentChange,
		handlePageTitleChange,
		handleAddPage,
		handleSelectPage,
		handleCoverSelect,
		handleAddTag,
		handleRemoveTag,
		handleSaveDraft,
		handleSaveAndUpdate,
		handleDelete,
		handleTokenize,
		setStatus: (v: TextStatus) => { setStatus(v); markUnsaved(); },
		setLanguage: (v: TextLanguage) => { setLanguage(v); markUnsaved(); },
		setLevel: (v: TextLevel | null) => { setLevel(v); markUnsaved(); },
		setAuthor: (v: string) => { setAuthor(v); markUnsaved(); },
		setDescription: (v: string) => { setDescription(v); markUnsaved(); },
		setSource: (v: string) => { setSource(v); markUnsaved(); },
		setGenreId: (v: string | null) => { setGenreId(v); markUnsaved(); },
		setAutoTokenizeOnSave: (v: boolean) => { setAutoTokenizeOnSave(v); markUnsaved(); },
		setUseNormalization: (v: boolean) => { setUseNormalization(v); markUnsaved(); },
		setUseMorphAnalysis: (v: boolean) => { setUseMorphAnalysis(v); markUnsaved(); },
		setShowRetokenizeBar,
		setShowDeleteModal,
	};
};
