"use client";

import type { AdminDictListItem } from "@/entities/dictionary";
import { useEffect, useState } from "react";

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

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={e => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div className="w-[440px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<h2 className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.dictionary.addExampleModal.title")}
				</h2>
				<p className="mb-4 text-[12.5px] text-t-3">
					{t("admin.dictionary.addExampleModal.subtitle")}{" "}
					<span className="font-medium text-t-2">{entry.baseForm}</span>
				</p>
				{entry.sensesCount === 0 && (
					<div className="mb-3 rounded-[8px] border border-amber-500/30 bg-amber-500/8 px-3 py-2 text-[12px] text-t-2">
						{t("admin.dictionary.addExampleModal.noSensesWarning")}
					</div>
				)}
				<div className="mb-4">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.dictionary.addExampleModal.textLabel")} *
					</label>
					<textarea
						className={inputCls}
						placeholder={t("admin.dictionary.addExampleModal.textPlaceholder")}
						value={text}
						onChange={e => {
							setText(e.target.value);
							setError("");
						}}
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
						{t("admin.dictionary.addExampleModal.cancel")}
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitting || entry.sensesCount === 0}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10"
					>
						{isSubmitting
							? t("admin.dictionary.addExampleModal.adding")
							: t("admin.dictionary.addExampleModal.add")}
					</button>
				</div>
			</div>
		</div>
	);
};
