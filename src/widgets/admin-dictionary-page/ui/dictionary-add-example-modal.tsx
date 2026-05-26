"use client";

import { Typography } from "@/shared/ui/typography";

import type { AdminDictListItem } from "@/entities/dictionary";
import { ComponentProps, useEffect, useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
interface DictionaryAddExampleModalProps {
	entry: AdminDictListItem | null;
	isSubmitting: boolean;
	onConfirm: (text: string) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const DictionaryAddExampleModal = ({
	entry,
	isSubmitting,
	onConfirm,
	onClose,
	t,
}: DictionaryAddExampleModalProps) => {
	const [text, setText] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (entry) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- clear modal state when target entry changes
			setText("");
			setError("");
		}
	}, [entry]);

	const handleSubmit = () => {
		if (!text.trim()) {
			setError(t("admin.dictionary.addExampleModal.required"));
			return;
		}
		onConfirm(text.trim());
	};

	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => {
		setText(e.currentTarget.value);
		setError("");
	};

	return (
		<Modal
			open={!!entry}
			onClose={onClose}
			title={t("admin.dictionary.addExampleModal.title")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.dictionary.addExampleModal.subtitle")}{" "}
				<Typography tag="span" className="font-medium text-t-2">{entry?.baseForm}</Typography>
			</Typography>
			{entry?.sensesCount === 0 && (
				<div className="mb-3 rounded-[8px] border border-amber-500/30 bg-amber-500/8 px-3 py-2 text-[12px] text-t-2">
					{t("admin.dictionary.addExampleModal.noSensesWarning")}
				</div>
			)}
			<form action={handleSubmit}>
				<div className="mb-4">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.dictionary.addExampleModal.textLabel")} *
					</Typography>
					<textarea
						className="w-full min-h-[72px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
						placeholder={t("admin.dictionary.addExampleModal.textPlaceholder")}
						value={text}
						onChange={handleChange}
						autoFocus
					/>
					{error && <Typography tag="p" className="mt-1 text-[11px] text-red-t">{error}</Typography>}
				</div>
				<ModalActions>
					<Button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("admin.dictionary.addExampleModal.cancel")}
					</Button>
					<Button
						type="submit"
						onClick={handleSubmit}
						disabled={isSubmitting || entry?.sensesCount === 0}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{isSubmitting
							? t("admin.dictionary.addExampleModal.adding")
							: t("admin.dictionary.addExampleModal.add")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
