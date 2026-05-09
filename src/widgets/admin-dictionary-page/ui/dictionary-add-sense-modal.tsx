"use client";

import type { AdminDictListItem } from "@/entities/dictionary";
import { ComponentProps, useEffect, useState } from 'react';
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

	if (!entry) return null;

	const inputCls =
		"w-full min-h-[72px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc";

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
				if (/* intentional: backdrop-only click */ e.target === e.currentTarget) onClose();
			};
	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => {
							setDefinition(e.currentTarget.value);
							setError("");
						};
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleClick}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<h2 className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.dictionary.addSenseModal.title")}
				</h2>
				<p className="mb-4 text-[12.5px] text-t-3">
					{t("admin.dictionary.addSenseModal.subtitle")}{" "}
					<span className="font-medium text-t-2">{entry.baseForm}</span>
				</p>
				<div className="mb-4">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.dictionary.addSenseModal.definitionLabel")} *
					</label>
					<textarea
						className={inputCls}
						placeholder={t(
							"admin.dictionary.addSenseModal.definitionPlaceholder",
						)}
						value={definition}
						onChange={handleChange}
						autoFocus
					/>
					{error && <p className="mt-1 text-[11px] text-red-t">{error}</p>}
				</div>
				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10"
					>
						{t("admin.dictionary.addSenseModal.cancel")}
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10"
					>
						{isSubmitting
							? t("admin.dictionary.addSenseModal.adding")
							: t("admin.dictionary.addSenseModal.add")}
					</button>
				</div>
			</div>
		</div>
	);
};
