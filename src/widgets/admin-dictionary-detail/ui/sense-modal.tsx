"use client";

import type { AdminDictSense } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useEffect, useRef, useState } from "react";
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

	if (!isOpen) return null;

	const inputCls =
		"w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 py-0 h-[34px] text-[13px] text-t-1 outline-none placeholder:text-t-3 transition-colors focus:border-acc";

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => /* intentional: backdrop-only click */ e.target === e.currentTarget && onClose();
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setDefinition(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"input">["onChange"]> = e => setNotes(e.currentTarget.value);
return (
		<div
			className="fixed inset-0 z-200 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
			onClick={handleClick}
		>
			<div className="w-[440px] max-w-[calc(100vw-24px)] rounded-[14px] border border-bd-2 bg-surf p-[22px] shadow-lg max-sm:p-4.5">
				<div className="mb-1 font-display text-[15px] text-t-1">
					{editSense
						? t("admin.dictionaryDetail.editSense")
						: t("admin.dictionaryDetail.addSenseTitle")}
				</div>
				<div className="mb-4.5 text-[12px] text-t-3">
					{t("admin.dictionaryDetail.senseModalSub")}
				</div>
				<form action={handleSubmit}>
					<div className="mb-3.5">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.translation")}
						</div>
						<input
							ref={inputRef}
							className={inputCls}
							type="text"
							placeholder={t("admin.dictionaryDetail.translationPlaceholder")}
							value={definition}
							onChange={handleChange}
						/>
					</div>
					<div className="mb-0">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.gloss")}
						</div>
						<input
							className={inputCls}
							type="text"
							placeholder={t("admin.dictionaryDetail.glossPlaceholder")}
							value={notes}
							onChange={handleChange2}
						/>
					</div>
					<div className="mt-5 flex justify-end gap-2">
						<button
							type="button"
							className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:bg-surf-2"
							onClick={onClose}
						>
							{t("admin.dictionaryDetail.cancel")}
						</button>
						<button
							type="submit"
							disabled={isPending || !definition.trim()}
							className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-50"
						>
							{t("admin.dictionaryDetail.save")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
