"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useCurrentUser } from "@/entities/user";
import { useCreateSuggestion } from "@/features/suggestions";

type TextFieldKey = "title" | "author" | "source" | "description" | "notes";

const FIELD_ORDER: TextFieldKey[] = ["title", "author", "source", "description", "notes"];

export interface UseTextSuggestProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	textId: string;
	textTitle: string;
}

export const useTextSuggest = ({
	open,
	onOpenChange,
	onSuccess,
	textId,
	textTitle,
}: UseTextSuggestProps) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { success, error } = useToast();
	const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
	const { mutate, isPending } = useCreateSuggestion();

	const [field, setField] = useState<TextFieldKey>("title");
	const [newValue, setNewValue] = useState("");
	const [comment, setComment] = useState("");

	useEffect(() => {
		if (!open) {
			setField("title");
			setNewValue("");
			setComment("");
		}
	}, [open]);

	useEffect(() => {
		if (open && !isUserLoading && !currentUser) {
			onOpenChange(false);
			router.push(`/${lang}/auth`);
		}
	}, [open, isUserLoading, currentUser, onOpenChange, router, lang]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onOpenChange(false);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onOpenChange]);

	const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setField(e.currentTarget.value as TextFieldKey);
	};

	const handleNewValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewValue(e.currentTarget.value);
	};

	const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setComment(e.currentTarget.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!newValue.trim()) return;

		mutate(
			{
				textId,
				field,
				newValue: newValue.trim(),
				comment: comment.trim() || undefined,
			},
			{
				onSuccess: () => {
					success(t("suggestText.success"));
					onOpenChange(false);
					onSuccess?.();
				},
				onError: () => {
					error(t("suggestText.error"));
				},
			},
		);
	};

	const handleClose = () => onOpenChange(false);

	return {
		t,
		field,
		newValue,
		comment,
		isPending,
		fieldOrder: FIELD_ORDER,
		handleFieldChange,
		handleNewValueChange,
		handleCommentChange,
		handleSubmit,
		handleClose,
	};
};
