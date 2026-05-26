"use client";

import { Button } from "@/shared/ui/button";

import type { AdminDictExample } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

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
			// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate modal from edited example/open state
			setText(editExample?.text ?? "");
			setTranslation(editExample?.translation ?? "");
			setTimeout(() => textareaRef.current?.focus(), 50);
		}
	}, [isOpen, editExample]);

	const handleSubmit = () => {
		if (!text.trim()) return;
		onSave({ text: text.trim(), translation: translation.trim() });
	};

	const taCls =
		"w-full resize-y rounded-lg border border-bd-2 bg-surf-2 px-2.5 py-2 text-[12.5px] text-t-1 outline-none placeholder:text-t-3 transition-colors focus:border-acc";

	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => setText(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"textarea">["onChange"]> = e => setTranslation(e.currentTarget.value);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={editExample
				? t("admin.dictionaryDetail.editExample")
				: t("admin.dictionaryDetail.addExampleTitle")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3">
				{t("admin.dictionaryDetail.exampleModalSub")}
			</Typography>
			<form action={handleSubmit}>
				<div className="mb-3.5">
					<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.dictionaryDetail.exampleSrc")}
					</div>
					<textarea
						ref={textareaRef}
						className={`${taCls} min-h-[68px]`}
						placeholder={t("admin.dictionaryDetail.exampleSrcPlaceholder")}
						value={text}
						onChange={handleChange}
					/>
				</div>
				<div className="mb-0">
					<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.dictionaryDetail.exampleTranslation")}
					</div>
					<textarea
						className={`${taCls} min-h-[50px]`}
						placeholder={t(
							"admin.dictionaryDetail.exampleTranslationPlaceholder",
						)}
						value={translation}
						onChange={handleChange2}
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
						disabled={isPending || !text.trim()}
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
