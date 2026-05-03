"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictExample } from "@/entities/dictionary";

interface ExampleModalProps {
	isOpen: boolean;
	editExample?: AdminDictExample | null;
	isPending: boolean;
	onClose: () => void;
	onSave: (data: { text: string; translation: string }) => void;
}

export const ExampleModal = ({
	isOpen,
	editExample,
	isPending,
	onClose,
	onSave,
}: ExampleModalProps) => {
	const { t } = useI18n();
	const [text, setText] = useState("");
	const [translation, setTranslation] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (isOpen) {
			setText(editExample?.text ?? "");
			setTranslation(editExample?.translation ?? "");
			setTimeout(() => textareaRef.current?.focus(), 50);
		}
	}, [isOpen, editExample]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;
		onSave({ text: text.trim(), translation: translation.trim() });
	};

	if (!isOpen) return null;

	const taCls = "w-full resize-y rounded-lg border border-bd-2 bg-surf-2 px-2.5 py-2 text-[12.5px] text-t-1 outline-none placeholder:text-t-3 transition-colors focus:border-acc";

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="w-[440px] max-w-[calc(100vw-24px)] rounded-[14px] border border-bd-2 bg-surf p-[22px] shadow-lg max-sm:p-4.5">
				<div className="mb-1 font-display text-[15px] text-t-1">
					{editExample ? t("admin.dictionaryDetail.editExample") : t("admin.dictionaryDetail.addExampleTitle")}
				</div>
				<div className="mb-4.5 text-[12px] text-t-3">
					{t("admin.dictionaryDetail.exampleModalSub")}
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3.5">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.exampleSrc")}
						</div>
						<textarea
							ref={textareaRef}
							className={`${taCls} min-h-[68px]`}
							placeholder={t("admin.dictionaryDetail.exampleSrcPlaceholder")}
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
					</div>
					<div className="mb-0">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.exampleTranslation")}
						</div>
						<textarea
							className={`${taCls} min-h-[50px]`}
							placeholder={t("admin.dictionaryDetail.exampleTranslationPlaceholder")}
							value={translation}
							onChange={(e) => setTranslation(e.target.value)}
						/>
					</div>
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
							disabled={isPending || !text.trim()}
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
