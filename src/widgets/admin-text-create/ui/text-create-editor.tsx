"use client";

import { useI18n } from "@/shared/lib/i18n";
import {
	AdminTextEditorShell,
	hasTextContent,
} from "@/shared/ui/admin-text-editor";
import type { TipTapDoc, TipTapNode } from "@/shared/ui/notion-editor";
import { useState } from "react";
import type { PageContent } from "../model/use-admin-text-create-page";
import { TextCreateDeletePageDialog } from "./text-create-delete-page-dialog";

export type { TipTapDoc, TipTapNode };

interface TextCreateEditorProps {
	title: string;
	pages: PageContent[];
	activePage: number;
	onTitleChange: (value: string) => void;
	onPageContentChange: (doc: TipTapDoc, wordCount: number) => void;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onDeletePage: (index: number) => void;
	onSaveDraft: () => void;
	onPublish: () => void;
}

export const TextCreateEditor = ({
	title,
	pages,
	activePage,
	onTitleChange,
	onPageContentChange,
	onAddPage,
	onSelectPage,
	onDeletePage,
	onSaveDraft,
	onPublish,
}: TextCreateEditorProps) => {
	const { t } = useI18n();
	const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
		null,
	);

	const handleDeletePageRequest = (index: number) => {
		const hasContent = hasTextContent(pages[index].doc);
		if (hasContent) {
			setConfirmDeleteIndex(index);
		} else {
			onDeletePage(index);
		}
	};

	const handleConfirmDelete = () => {
		if (confirmDeleteIndex !== null) {
			onDeletePage(confirmDeleteIndex);
			setConfirmDeleteIndex(null);
		}
	};

	const handleCancelDelete = () => setConfirmDeleteIndex(null);

	return (
		<>
			<AdminTextEditorShell
				title={title}
				pages={pages}
				activePage={activePage}
				stickyTopClassName="top-[93px]"
				pagesSummary={t("admin.texts.createPage.pages", { n: pages.length })}
				primaryShortcutLabel={t("admin.texts.createPage.publish")}
				onTitleChange={onTitleChange}
				onPageContentChange={onPageContentChange}
				onAddPage={onAddPage}
				onSelectPage={onSelectPage}
				onSaveDraft={onSaveDraft}
				onPrimaryAction={onPublish}
				onDeletePage={handleDeletePageRequest}
				getPageLabel={index =>
					t("admin.texts.createPage.pageN", { n: index + 1 })
				}
			/>

			{confirmDeleteIndex !== null && (
				<TextCreateDeletePageDialog
					pageIndex={confirmDeleteIndex}
					onConfirm={handleConfirmDelete}
					onCancel={handleCancelDelete}
					t={t}
				/>
			)}
		</>
	);
};
