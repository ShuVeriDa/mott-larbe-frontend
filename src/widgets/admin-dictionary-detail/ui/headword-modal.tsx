"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";

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
			setWord("");
			setIsPrimary(false);
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [isOpen]);

	const handleSubmit = (
		e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		if (!word.trim()) return;
		onSave({ word: word.trim(), isPrimary });
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="w-[440px] max-w-[calc(100vw-24px)] rounded-[14px] border border-bd-2 bg-surf p-[22px] shadow-lg max-sm:p-4.5">
				<div className="mb-1 font-display text-[15px] text-t-1">
					{t("admin.dictionaryDetail.addHeadwordTitle")}
				</div>
				<div className="mb-4.5 text-[12px] text-t-3">
					{t("admin.dictionaryDetail.headwordModalSub")}
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3.5">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.headword")}
						</div>
						<input
							ref={inputRef}
							className="w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 h-[34px] font-display text-[14px] text-t-1 outline-none placeholder:text-t-3 transition-colors focus:border-acc"
							type="text"
							placeholder={t("admin.dictionaryDetail.headwordPlaceholder")}
							value={word}
							onChange={(e) => setWord(e.target.value)}
						/>
					</div>
					<label className="flex cursor-pointer items-center gap-2.5">
						<input
							type="checkbox"
							className="size-4 cursor-pointer rounded"
							checked={isPrimary}
							onChange={(e) => setIsPrimary(e.target.checked)}
						/>
						<span className="text-[13px] text-t-2">
							{t("admin.dictionaryDetail.markAsPrimary")}
						</span>
					</label>
					<div className="mt-5 flex justify-end gap-2">
						<button
							type="button"
							className="flex h-[30px] items-center gap-1.5 rounded-[7px] border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:bg-surf-2"
							onClick={onClose}
						>
							{t("admin.dictionaryDetail.cancel")}
						</button>
						<button
							type="submit"
							disabled={isPending || !word.trim()}
							className="flex h-[30px] items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-50"
						>
							{t("admin.dictionaryDetail.add")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
