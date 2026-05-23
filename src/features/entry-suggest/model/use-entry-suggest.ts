"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useCurrentUser } from "@/entities/user";
import { useCreateSuggestion } from "@/features/suggestions";

type FieldKey = "rawTranslate" | "rawWord" | "rawWordAlt" | "notes";

const FIELD_ORDER: FieldKey[] = ["rawTranslate", "rawWord", "rawWordAlt", "notes"];

export interface UseEntrySuggestProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess?: () => void;
	normalized: string;
	rawWord: string;
	currentTranslation: string;
}

export const useEntrySuggest = ({ open, onOpenChange, onSuccess, normalized, rawWord, currentTranslation }: UseEntrySuggestProps) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { success, error } = useToast();
	const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
	const { mutate, isPending } = useCreateSuggestion();

	const [field, setField] = useState<FieldKey>("rawTranslate");
	const [newValue, setNewValue] = useState("");
	const [comment, setComment] = useState("");

	const isAuthenticated = !!currentUser;

	useEffect(() => {
		if (!open) {
			setField("rawTranslate");
			setNewValue("");
			setComment("");
		}
	}, [open]);

	useEffect(() => {
		if (open && !isUserLoading && !isAuthenticated) {
			onOpenChange(false);
			router.push(`/${lang}/auth`);
		}
	}, [open, isUserLoading, isAuthenticated, onOpenChange, router, lang]);

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onOpenChange(false); };
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onOpenChange]);

	const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setField(e.currentTarget.value as FieldKey);
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
				normalized,
				rawWord,
				currentTranslation,
				field,
				newValue: newValue.trim(),
				comment: comment.trim() || undefined,
			},
			{
				onSuccess: () => {
					success(t("suggest.success"));
					onOpenChange(false);
					onSuccess?.();
				},
				onError: () => {
					error(t("suggest.error"));
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
		isAuthenticated,
		fieldOrder: FIELD_ORDER,
		handleFieldChange,
		handleNewValueChange,
		handleCommentChange,
		handleSubmit,
		handleClose,
	};
};
