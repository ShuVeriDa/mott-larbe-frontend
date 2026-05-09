"use client";

import { Typography } from "@/shared/ui/typography";

import type { AdminDictListItem } from "@/entities/dictionary";
import { ComponentProps, useEffect, useState } from 'react';
import { Button } from "@/shared/ui/button";
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

	if (!entry) return null;

	const inputCls =
		"w-full min-h-[72px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc";

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
				if (/* intentional: backdrop-only click */ e.target === e.currentTarget) onClose();
			};
	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => {
							setText(e.currentTarget.value);
							setError("");
						};
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleClick}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.dictionary.addExampleModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.dictionary.addExampleModal.subtitle")}{" "}
					<Typography tag="span" className="font-medium text-t-2">{entry.baseForm}</Typography>
				</Typography>
				{entry.sensesCount === 0 && (
					<div className="mb-3 rounded-[8px] border border-amber-500/30 bg-amber-500/8 px-3 py-2 text-[12px] text-t-2">
						{t("admin.dictionary.addExampleModal.noSensesWarning")}
					</div>
				)}
				<div className="mb-4">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.dictionary.addExampleModal.textLabel")} *
					</Typography>
					<textarea
						className={inputCls}
						placeholder={t("admin.dictionary.addExampleModal.textPlaceholder")}
						value={text}
						onChange={handleChange}
						autoFocus
					/>
					{error && <Typography tag="p" className="mt-1 text-[11px] text-red-t">{error}</Typography>}
				</div>
				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						variant="outline"
						size="default"
						onClick={onClose}
						disabled={isSubmitting}
						className="h-8 px-3.5 text-[12.5px] max-sm:h-10"
					>
						{t("admin.dictionary.addExampleModal.cancel")}
					</Button>
					<Button
						variant="action"
						size="default"
						onClick={handleSubmit}
						disabled={isSubmitting || entry.sensesCount === 0}
						className="h-8 px-3.5 text-[12.5px] max-sm:h-10"
					>
						{isSubmitting
							? t("admin.dictionary.addExampleModal.adding")
							: t("admin.dictionary.addExampleModal.add")}
					</Button>
				</div>
			</div>
		</div>
	);
};
