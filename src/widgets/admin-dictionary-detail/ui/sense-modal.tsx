"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import type { AdminDictSense } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

interface SenseModalProps {
	isOpen: boolean;
	editSense?: AdminDictSense | null;
	isPending: boolean;
	onClose: () => void;
	onSave: (data: { definition: string; notes: string }) => void;
}

export const SenseModal = ({
	isOpen,
	editSense,
	isPending,
	onClose,
	onSave,
}: SenseModalProps) => {
	const { t } = useI18n();
	const [definition, setDefinition] = useState("");
	const [notes, setNotes] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate modal fields from selected sense
			setDefinition(editSense?.definition ?? "");
			setNotes(editSense?.notes ?? "");
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [isOpen, editSense]);

	const handleSubmit = () => {
		if (!definition.trim()) return;
		onSave({ definition: definition.trim(), notes: notes.trim() });
	};

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setDefinition(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"input">["onChange"]> = e => setNotes(e.currentTarget.value);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={editSense
				? t("admin.dictionaryDetail.editSense")
				: t("admin.dictionaryDetail.addSenseTitle")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3">
				{t("admin.dictionaryDetail.senseModalSub")}
			</Typography>
			<form action={handleSubmit}>
				<div className="mb-3.5">
					<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.dictionaryDetail.translation")}
					</div>
					<Input
						ref={inputRef}
						className="rounded-lg"
						type="text"
						placeholder={t("admin.dictionaryDetail.translationPlaceholder")}
						value={definition}
						onChange={handleChange}
						aria-label={t("admin.dictionaryDetail.translation")}
					/>
				</div>
				<div className="mb-0">
					<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.dictionaryDetail.gloss")}
					</div>
					<Input
						className="rounded-lg"
						type="text"
						placeholder={t("admin.dictionaryDetail.glossPlaceholder")}
						value={notes}
						onChange={handleChange2}
						aria-label={t("admin.dictionaryDetail.gloss")}
					/>
				</div>
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
						disabled={isPending || !definition.trim()}
						title={t("admin.dictionaryDetail.save")}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{t("admin.dictionaryDetail.save")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
