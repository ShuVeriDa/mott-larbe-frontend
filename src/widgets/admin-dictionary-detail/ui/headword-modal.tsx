"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface HeadwordModalProps {
	isOpen: boolean;
	isPending: boolean;
	onClose: () => void;
	onSave: (data: { word: string; isPrimary: boolean }) => void;
}

export const HeadwordModal = ({
	isOpen,
	isPending,
	onClose,
	onSave,
}: HeadwordModalProps) => {
	const { t } = useI18n();
	const [word, setWord] = useState("");
	const [isPrimary, setIsPrimary] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- reset modal fields on open
			setWord("");
			setIsPrimary(false);
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [isOpen]);

	const handleSubmit = () => {
		if (!word.trim()) return;
		onSave({ word: word.trim(), isPrimary });
	};

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setWord(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"input">["onChange"]> = e => setIsPrimary(e.currentTarget.checked);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={t("admin.dictionaryDetail.addHeadwordTitle")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3">
				{t("admin.dictionaryDetail.headwordModalSub")}
			</Typography>
			<form action={handleSubmit}>
				<div className="mb-3.5">
					<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.dictionaryDetail.headword")}
					</div>
					<Input
						ref={inputRef}
						className="rounded-lg font-display text-[14px]"
						type="text"
						placeholder={t("admin.dictionaryDetail.headwordPlaceholder")}
						value={word}
						onChange={handleChange}
						aria-label={t("admin.dictionaryDetail.headword")}
					/>
				</div>
				<Typography tag="label" className="flex cursor-pointer items-center gap-2.5">
					<input
						type="checkbox"
						className="size-4 cursor-pointer rounded"
						checked={isPrimary}
						onChange={handleChange2}
					/>
					<Typography tag="span" className="text-[13px] text-t-2">
						{t("admin.dictionaryDetail.markAsPrimary")}
					</Typography>
				</Typography>
				<ModalActions>
					<Button
						type="button"
						onClick={onClose}
						title={t("admin.dictionaryDetail.cancel")}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("admin.dictionaryDetail.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending || !word.trim()}
						title={t("admin.dictionaryDetail.add")}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{t("admin.dictionaryDetail.add")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
