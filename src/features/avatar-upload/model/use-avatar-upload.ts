"use client";

import { useUploadAvatar } from "@/entities/user";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
const MAX_SIZE = 2 * 1024 * 1024;

export const useAvatarUpload = (currentSrc?: string) => {
	const { t } = useI18n();
	const { error: toastError } = useToast();
	const { mutateAsync, isPending } = useUploadAvatar();

	const inputRef = useRef<HTMLInputElement>(null);
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const srcAtUploadRef = useRef<string | undefined>(undefined);

	const handleTrigger = () => {
		if (!isPending) inputRef.current?.click();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleTrigger();
		}
	};

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		e.currentTarget.value = "";

		if (!ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number])) {
			toastError(t("profile.avatar.invalidType"));
			return;
		}
		if (file.size > MAX_SIZE) {
			toastError(t("profile.avatar.fileTooLarge"));
			return;
		}

		if (blobUrl) URL.revokeObjectURL(blobUrl);
		const objectUrl = URL.createObjectURL(file);
		srcAtUploadRef.current = currentSrc;
		setBlobUrl(objectUrl);

		try {
			const updated = await mutateAsync(file);
			// Preload the new server URL before dropping the blob preview,
			// so Radix Avatar never sees a gap between images
			if (updated.avatar) {
				await new Promise<void>(resolve => {
					const img = new window.Image();
					img.onload = () => resolve();
					img.onerror = () => resolve();
					img.src = updated.avatar!;
				});
			}
			URL.revokeObjectURL(objectUrl);
			setBlobUrl(null);
			srcAtUploadRef.current = undefined;
		} catch {
			URL.revokeObjectURL(objectUrl);
			setBlobUrl(null);
			srcAtUploadRef.current = undefined;
		}
	};

	const displaySrc = blobUrl ?? currentSrc;

	return { inputRef, isPending, displaySrc, handleTrigger, handleKeyDown, handleFileChange };
};
