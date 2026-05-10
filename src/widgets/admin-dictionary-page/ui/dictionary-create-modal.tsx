"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type {
	AdminDictLanguage,
	CreateAdminEntryDto,
} from "@/entities/dictionary";
import { cn } from "@/shared/lib/cn";
import { CEFR_LEVELS } from "@/shared/types";
import { Select } from "@/shared/ui/select";
import { ComponentProps, useEffect, useState } from 'react';
const POS_OPTIONS = [
	"noun",
	"verb",
	"adj",
	"adv",
	"particle",
	"pron",
	"num",
	"conj",
];

interface DictionaryCreateModalProps {
	open: boolean;
	isSubmitting: boolean;
	onSubmit: (dto: CreateAdminEntryDto) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const DictionaryCreateModal = ({
	open,
	isSubmitting,
	onSubmit,
	onClose,
	t,
}: DictionaryCreateModalProps) => {
	const [word, setWord] = useState("");
	const [normalized, setNormalized] = useState("");
	const [language, setLanguage] = useState<AdminDictLanguage>("CHE");
	const [pos, setPos] = useState("");
	const [translation, setTranslation] = useState("");
	const [level, setLevel] = useState("");
	const [notes, setNotes] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!open) return;
		// eslint-disable-next-line react-hooks/set-state-in-effect -- reset create form on each modal open
		setWord("");
		setNormalized("");
		setLanguage("CHE");
		setPos("");
		setTranslation("");
		setLevel("");
		setNotes("");
		setErrors({});
	}, [open]);

	const handleSubmit = () => {
		const errs: Record<string, string> = {};
		if (!word.trim())
			errs.word = t("admin.dictionary.createModal.wordRequired");
		if (!translation.trim())
			errs.translation = t("admin.dictionary.createModal.translationRequired");
		if (Object.keys(errs).length > 0) {
			setErrors(errs);
			return;
		}

		onSubmit({
			word: word.trim(),
			normalized: normalized.trim() || word.trim().toLowerCase(),
			language,
			partOfSpeech: pos || undefined,
			translation: translation.trim(),
			level: (level as import("@/shared/types").CefrLevel) || undefined,
			notes: notes.trim() || undefined,
		});
	};

	if (!open) return null;

	const inputCls =
		"h-[34px] w-full rounded-[8px] border border-bd-2 bg-bg px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc";

	const labelCls = "mb-1.5 block text-[11.5px] font-semibold text-t-2";

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
			if (/* intentional: backdrop-only click */ e.target === e.currentTarget) onClose();
		};
	const handleWordChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		setWord(e.currentTarget.value);
		setErrors(p => ({ ...p, word: "" }));
	};
	const handleNormalizedChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setNormalized(e.currentTarget.value);
	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = e => {
		setTranslation(e.currentTarget.value);
		setErrors(p => ({ ...p, translation: "" }));
	};
	const handlePosChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setPos(e.currentTarget.value);
	const handleLevelChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setLevel(e.currentTarget.value);
	const handleNotesChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => setNotes(e.currentTarget.value);
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleBackdropClick}
		>
			<div className="w-[500px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-h-[90vh] overflow-y-auto max-sm:w-full max-sm:max-h-[92vh] max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.dictionary.createModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.dictionary.createModal.subtitle")}
				</Typography>

				{/* Language */}
				<div className="mb-3.5">
					<Typography tag="label" className={labelCls}>
						{t("admin.dictionary.createModal.languageLabel")}
					</Typography>
					<div className="flex gap-2">
						{(["CHE", "RU"] as AdminDictLanguage[]).map(l => {
						  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setLanguage(l);
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
								{l === "CHE"
									? t("admin.dictionary.createModal.langChe")
									: t("admin.dictionary.createModal.langRu")}
							</Button>
						);
						})}
					</div>
				</div>

				{/* Word + Normalized */}
				<div className="mb-3.5 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<Typography tag="label" className={labelCls}>
							{t("admin.dictionary.createModal.wordLabel")} *
						</Typography>
						<input
							className={cn(inputCls, errors.word && "border-red-400")}
							placeholder={t("admin.dictionary.createModal.wordPlaceholder")}
							value={word}
							onChange={handleWordChange}
						/>
						{errors.word && (
							<Typography tag="p" className="mt-1 text-[11px] text-red-t">{errors.word}</Typography>
						)}
					</div>
					<div>
						<Typography tag="label" className={labelCls}>
							{t("admin.dictionary.createModal.normalizedLabel")}
						</Typography>
						<input
							className={inputCls}
							placeholder={
								word.toLowerCase() ||
								t("admin.dictionary.createModal.normalizedPlaceholder")
							}
							value={normalized}
							onChange={handleNormalizedChange}
						/>
					</div>
				</div>

				{/* Translation */}
				<div className="mb-3.5">
					<Typography tag="label" className={labelCls}>
						{t("admin.dictionary.createModal.translationLabel")} *
					</Typography>
					<input
						className={cn(inputCls, errors.translation && "border-red-400")}
						placeholder={t(
							"admin.dictionary.createModal.translationPlaceholder",
						)}
						value={translation}
						onChange={handleTranslationChange}
					/>
					{errors.translation && (
						<Typography tag="p" className="mt-1 text-[11px] text-red-t">{errors.translation}</Typography>
					)}
				</div>

				{/* POS + Level */}
				<div className="mb-3.5 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<Typography tag="label" className={labelCls}>
							{t("admin.dictionary.createModal.posLabel")}
						</Typography>
						<Select
							variant="lg"
							value={pos}
							onChange={handlePosChange}
						>
							<option value="">
								{t("admin.dictionary.createModal.posNone")}
							</option>
							{POS_OPTIONS.map(p => (
								<option key={p} value={p}>
									{t(`admin.dictionary.pos.${p}`)}
								</option>
							))}
						</Select>
					</div>
					<div>
						<Typography tag="label" className={labelCls}>
							{t("admin.dictionary.createModal.levelLabel")}
						</Typography>
						<Select
							variant="lg"
							value={level}
							onChange={handleLevelChange}
						>
							<option value="">
								{t("admin.dictionary.createModal.levelNone")}
							</option>
							{CEFR_LEVELS.map(l => (
								<option key={l} value={l}>
									{l}
								</option>
							))}
						</Select>
					</div>
				</div>

				{/* Notes */}
				<div className="mb-4">
					<Typography tag="label" className={labelCls}>
						{t("admin.dictionary.createModal.notesLabel")}
					</Typography>
					<textarea
						className="w-full min-h-[56px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
						placeholder={t("admin.dictionary.createModal.notesPlaceholder")}
						value={notes}
						onChange={handleNotesChange}
					/>
				</div>

				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						onClick={onClose}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px]"
					>
						{t("admin.dictionary.createModal.cancel")}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px]"
					>
						{isSubmitting
							? t("admin.dictionary.createModal.creating")
							: t("admin.dictionary.createModal.create")}
					</Button>
				</div>
			</div>
		</div>
	);
};
