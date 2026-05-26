"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type {
	AdminDictLanguage,
	CreateAdminEntryDto,
} from "@/entities/dictionary";
import { cn } from "@/shared/lib/cn";
import { CEFR_LEVELS } from "@/shared/types";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Modal, ModalActions } from "@/shared/ui/modal";
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

	const labelCls = "mb-1.5 block text-[11.5px] font-semibold text-t-2";

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
		<Modal
			open={open}
			onClose={onClose}
			title={t("admin.dictionary.createModal.title")}
			className="max-w-[500px]"
		>
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
								title={l === "CHE" ? t("admin.dictionary.createModal.langChe") : t("admin.dictionary.createModal.langRu")}
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
					<Input
						className={cn("rounded-[8px]", errors.word && "border-red-400")}
						placeholder={t("admin.dictionary.createModal.wordPlaceholder")}
						value={word}
						onChange={handleWordChange}
						aria-label={t("admin.dictionary.createModal.wordLabel")}
						aria-invalid={Boolean(errors.word)}
						aria-describedby={errors.word ? "dict-word-error" : undefined}
					/>
					{errors.word && (
						<Typography id="dict-word-error" tag="p" className="mt-1 text-[11px] text-red-t">{errors.word}</Typography>
					)}
				</div>
				<div>
					<Typography tag="label" className={labelCls}>
						{t("admin.dictionary.createModal.normalizedLabel")}
					</Typography>
					<Input
						className="rounded-[8px]"
						placeholder={
							word.toLowerCase() ||
							t("admin.dictionary.createModal.normalizedPlaceholder")
						}
						value={normalized}
						onChange={handleNormalizedChange}
						aria-label={t("admin.dictionary.createModal.normalizedLabel")}
					/>
				</div>
			</div>

			{/* Translation */}
			<div className="mb-3.5">
				<Typography tag="label" className={labelCls}>
					{t("admin.dictionary.createModal.translationLabel")} *
				</Typography>
				<Input
					className={cn("rounded-[8px]", errors.translation && "border-red-400")}
					placeholder={t("admin.dictionary.createModal.translationPlaceholder")}
					value={translation}
					onChange={handleTranslationChange}
					aria-label={t("admin.dictionary.createModal.translationLabel")}
					aria-invalid={Boolean(errors.translation)}
					aria-describedby={errors.translation ? "dict-translation-error" : undefined}
				/>
				{errors.translation && (
					<Typography id="dict-translation-error" tag="p" className="mt-1 text-[11px] text-red-t">{errors.translation}</Typography>
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
			<div className="mb-2">
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

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isSubmitting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.dictionary.createModal.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={handleSubmit}
					disabled={isSubmitting}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
				>
					{isSubmitting
						? t("admin.dictionary.createModal.creating")
						: t("admin.dictionary.createModal.create")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
