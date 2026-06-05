"use client";

import { useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useCreateTextSubmission } from "@/features/text-submission";

export type LanguageOption = "che" | "ru" | "en" | "other";

export const useSuggestTextPage = () => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutate, isPending } = useCreateTextSubmission();

	const [title, setTitle] = useState("");
	const [language, setLanguage] = useState<LanguageOption>("che");
	const [author, setAuthor] = useState("");
	const [sourceUrl, setSourceUrl] = useState("");
	const [content, setContent] = useState("");
	const [comment, setComment] = useState("");
	const [sourceError, setSourceError] = useState(false);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.currentTarget.value);
	};

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLanguage(e.currentTarget.value as LanguageOption);
	};

	const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAuthor(e.currentTarget.value);
	};

	const handleSourceUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSourceUrl(e.currentTarget.value);
		if (e.currentTarget.value) setSourceError(false);
	};

	const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setContent(e.currentTarget.value);
		if (e.currentTarget.value) setSourceError(false);
	};

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setComment(e.currentTarget.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!sourceUrl.trim() && !content.trim()) {
			setSourceError(true);
			return;
		}

		mutate(
			{
				title: title.trim(),
				language,
				author: author.trim() || undefined,
				sourceUrl: sourceUrl.trim() || undefined,
				content: content.trim() || undefined,
				comment: comment.trim() || undefined,
				status: "PENDING",
			},
			{
				onSuccess: () => {
					success(t("suggestTextPage.success"));
					setTitle("");
					setLanguage("che");
					setAuthor("");
					setSourceUrl("");
					setContent("");
					setComment("");
					setSourceError(false);
				},
				onError: () => {
					error(t("suggestTextPage.error"));
				},
			},
		);
	};

	return {
		t,
		title,
		language,
		author,
		sourceUrl,
		content,
		comment,
		sourceError,
		isPending,
		contentLength: content.length,
		handleTitleChange,
		handleLanguageChange,
		handleAuthorChange,
		handleSourceUrlChange,
		handleContentChange,
		handleCommentChange,
		handleSubmit,
	};
};
