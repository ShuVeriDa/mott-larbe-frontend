"use client";

import { adminTextApi } from "@/entities/admin-text";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { useRef, type ChangeEvent } from "react";
import type { Editor } from "@tiptap/react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_SIZE = 5 * 1024 * 1024;

export const useEditorImageUpload = (getEditor: () => Editor | null) => {
	const { t } = useI18n();
	const { error: toastError } = useToast();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleTrigger = () => {
		inputRef.current?.click();
	};

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		e.currentTarget.value = "";

		if (!ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number])) {
			toastError(t("apiErrors.invalidImageType"));
			return;
		}
		if (file.size > MAX_SIZE) {
			toastError(t("apiErrors.imageTooLarge"));
			return;
		}

		try {
			const { imageUrlOptimized } = await adminTextApi.uploadImage(file);
			getEditor()?.chain().focus().setImage({ src: imageUrlOptimized }).run();
		} catch {
			toastError(t("apiErrors.internalServerError"));
		}
	};

	return { inputRef, handleTrigger, handleFileChange };
};
