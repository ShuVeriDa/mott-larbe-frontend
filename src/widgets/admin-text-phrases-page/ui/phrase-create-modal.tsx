"use client";

import { ComponentProps, useEffect, useState } from "react";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { CreateTextPhraseDto, TextPhraseLanguage } from "@/entities/text-phrase";

const LANGUAGES: TextPhraseLanguage[] = ["CHE", "RU", "EN"];

interface PhraseCreateModalProps {
	open: boolean;
	isSubmitting: boolean;
	onSubmit: (dto: CreateTextPhraseDto) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const PhraseCreateModal = ({
	open,
	isSubmitting,
	onSubmit,
	onClose,
	t,
}: PhraseCreateModalProps) => {
	const [original, setOriginal] = useState("");
	const [translation, setTranslation] = useState("");
	const [language, setLanguage] = useState<TextPhraseLanguage>("CHE");
	const [notes, setNotes] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!open) return;
		setOriginal("");
		setTranslation("");
		setLanguage("CHE");
		setNotes("");
		setErrors({});
	}, [open]);

	const handleSubmit = () => {
		const errs: Record<string, string> = {};
		if (!original.trim()) errs.original = t("admin.textPhrases.createModal.originalRequired");
		if (!translation.trim()) errs.translation = t("admin.textPhrases.createModal.translationRequired");
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			return;
		}
		onSubmit({
			original: original.trim(),
			translation: translation.trim(),
			language,
			notes: notes.trim() || undefined,
		});
	};

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => {
		if (e.target === e.currentTarget) onClose();
	};
	const handleOriginalChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => {
		setOriginal(e.currentTarget.value);
		setErrors((p) => ({ ...p, original: "" }));
	};
	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => {
		setTranslation(e.currentTarget.value);
		setErrors((p) => ({ ...p, translation: "" }));
	};
	const handleNotesChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
		setNotes(e.currentTarget.value);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleBackdropClick}
		>
			<div className="w-[480px] max-h-[90vh] overflow-y-auto rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:max-h-[92vh] max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.textPhrases.createModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.textPhrases.createModal.subtitle")}
				</Typography>

				{/* Language selector */}
				<div className="mb-3.5">
					<InputLabel>{t("admin.textPhrases.createModal.languageLabel")}</InputLabel>
					<div className="flex gap-2">
						{LANGUAGES.map((l) => {
							const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
								setLanguage(l);
							return (
								<Button
									key={l}
									onClick={handleClick}
									className={cn(
										"flex h-[34px] cursor-pointer items-center gap-1.5 rounded-[8px] border px-3 text-[12.5px] transition-colors select-none",
										language === l
											? "border-acc bg-acc-bg text-acc-t"
											: "border-bd-2 bg-bg text-t-2 hover:border-bd-3",
									)}
								>
									{l}
								</Button>
							);
						})}
					</div>
				</div>

				{/* Original */}
				<div className="mb-3.5">
					<InputLabel>{t("admin.textPhrases.createModal.originalLabel")}</InputLabel>
					<Input
						className={cn(errors.original && "border-red-400")}
						placeholder={t("admin.textPhrases.createModal.originalPlaceholder")}
						value={original}
						onChange={handleOriginalChange}
						autoFocus
					/>
					{errors.original && (
						<Typography tag="p" className="mt-1 text-[11px] text-red-t">
							{errors.original}
						</Typography>
					)}
				</div>

				{/* Translation */}
				<div className="mb-3.5">
					<InputLabel>{t("admin.textPhrases.createModal.translationLabel")}</InputLabel>
					<Input
						className={cn(errors.translation && "border-red-400")}
						placeholder={t("admin.textPhrases.createModal.translationPlaceholder")}
						value={translation}
						onChange={handleTranslationChange}
					/>
					{errors.translation && (
						<Typography tag="p" className="mt-1 text-[11px] text-red-t">
							{errors.translation}
						</Typography>
					)}
				</div>

				{/* Notes */}
				<div className="mb-4">
					<InputLabel>{t("admin.textPhrases.createModal.notesLabel")}</InputLabel>
					<Input
						placeholder={t("admin.textPhrases.createModal.notesPlaceholder")}
						value={notes}
						onChange={handleNotesChange}
					/>
				</div>

				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						variant="ghost"
						size="default"
						onClick={onClose}
						disabled={isSubmitting}
					>
						{t("admin.textPhrases.createModal.cancel")}
					</Button>
					<Button
						variant="action"
						size="default"
						onClick={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting
							? t("admin.textPhrases.createModal.creating")
							: t("admin.textPhrases.createModal.create")}
					</Button>
				</div>
			</div>
		</div>
	);
};
