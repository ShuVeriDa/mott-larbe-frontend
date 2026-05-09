"use client";
import { useEffect, useRef, useState } from 'react';
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
}

const EMPTY_DOC: TipTapDoc = { type: "doc", content: [{ type: "paragraph" }] };

export const useAdminTextEditPage = (id: string) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { success, error: toastError } = useToast();

	const { update, uploadCover } = useAdminTextCreate();
	const { remove } = useAdminTextMutations();
	const { runTokenization } = useAdminTextVersionMutations(id);

	const { data: textData, isLoading, isError } = useAdminTextDetail(id);
	const { data: versionsData } = useAdminTextVersions(id);

	const [title, setTitle] = useState("");
	const [pages, setPages] = useState<PageContent[]>([{ doc: EMPTY_DOC, wordCount: 0 }]);
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
						doc: (p.contentRich as TipTapDoc) ?? EMPTY_DOC,
						wordCount: countWordsInRaw(p.contentRaw),
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

	const handleSave = async (targetStatus: TextStatus) => {
		if (!title.trim()) {
			toastError(t("admin.texts.editPage.titleRequired"));
			return;
		}

		const pagesDto = pages.map((page, i) => ({
			pageNumber: i + 1,
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
	};

	const handleSaveDraft = () => handleSave("draft");
	const handleSaveAndUpdate = () => handleSave(status);

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
