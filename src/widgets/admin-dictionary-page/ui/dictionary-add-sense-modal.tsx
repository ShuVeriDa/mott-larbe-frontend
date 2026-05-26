"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { AdminDictListItem } from "@/entities/dictionary";
import { ComponentProps, useEffect, useState } from 'react';
import { Modal, ModalActions } from "@/shared/ui/modal";

interface DictionaryAddSenseModalProps {
	entry: AdminDictListItem | null;
	isSubmitting: boolean;
	onConfirm: (definition: string) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const DictionaryAddSenseModal = ({
	entry,
	isSubmitting,
	onConfirm,
	onClose,
	t,
}: DictionaryAddSenseModalProps) => {
	const [definition, setDefinition] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (entry) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- clear modal state when target entry changes
			setDefinition("");
			setError("");
		}
	}, [entry]);

	const handleSubmit = () => {
		if (!definition.trim()) {
			setError(t("admin.dictionary.addSenseModal.required"));
			return;
		}
		onConfirm(definition.trim());
	};

	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => {
		setDefinition(e.currentTarget.value);
		setError("");
	};

	return (
		<Modal
			open={!!entry}
			onClose={onClose}
			title={t("admin.dictionary.addSenseModal.title")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.dictionary.addSenseModal.subtitle")}{" "}
				<Typography tag="span" className="font-medium text-t-2">{entry?.baseForm}</Typography>
			</Typography>
			<div className="mb-4">
				<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
					{t("admin.dictionary.addSenseModal.definitionLabel")} *
				</Typography>
				<textarea
					className="w-full min-h-[72px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
					placeholder={t("admin.dictionary.addSenseModal.definitionPlaceholder")}
					value={definition}
					onChange={handleChange}
					autoFocus
				/>
				{error && <Typography tag="p" className="mt-1 text-[11px] text-red-t">{error}</Typography>}
			</div>
			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isSubmitting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.dictionary.addSenseModal.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={handleSubmit}
					disabled={isSubmitting}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
				>
					{isSubmitting
						? t("admin.dictionary.addSenseModal.adding")
						: t("admin.dictionary.addSenseModal.add")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
