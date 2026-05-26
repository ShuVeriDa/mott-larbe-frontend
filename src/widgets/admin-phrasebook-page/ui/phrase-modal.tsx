"use client";

import { useState, useEffect, type ComponentProps } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type {
	AdminPhrasebookCategory,
	AdminPhrasebookPhrase,
	CreateAdminPhraseDto,
	UpdateAdminPhraseDto,
	CreateAdminPhraseWordDto,
	CreateAdminPhraseExampleDto,
	PhraseLang,
} from "@/entities/phrasebook";
import { PHRASE_LANGS } from "../lib/constants";

interface PhraseModalProps {
	open: boolean;
	phrase?: AdminPhrasebookPhrase | null;
	categories: AdminPhrasebookCategory[];
	defaultCategoryId?: string;
	isSubmitting: boolean;
	onCreate: (dto: CreateAdminPhraseDto) => void;
	onUpdate: (id: string, dto: UpdateAdminPhraseDto) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const PhraseModal = ({
	open,
	phrase,
	categories,
	defaultCategoryId,
	isSubmitting,
	onCreate,
	onUpdate,
	onClose,
	t,
}: PhraseModalProps) => {
	const isEdit = !!phrase;

	const [categoryId, setCategoryId] = useState("");
	const [original, setOriginal] = useState("");
	const [transliteration, setTransliteration] = useState("");
	const [translation, setTranslation] = useState("");
	const [lang, setLang] = useState<PhraseLang>("che");
	const [sortOrder, setSortOrder] = useState("0");
	const [words, setWords] = useState<CreateAdminPhraseWordDto[]>([]);
	const [examples, setExamples] = useState<CreateAdminPhraseExampleDto[]>([]);
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!open) return;
		setCategoryId(phrase?.categoryId ?? defaultCategoryId ?? categories[0]?.id ?? "");
		setOriginal(phrase?.original ?? "");
		setTransliteration(phrase?.transliteration ?? "");
		setTranslation(phrase?.translation ?? "");
		setLang((phrase?.lang as PhraseLang) ?? "che");
		setSortOrder(String(phrase?.sortOrder ?? 0));
		setWords(phrase?.words.map((w) => ({ original: w.original, translation: w.translation, position: w.position })) ?? []);
		setExamples(phrase?.examples.map((e) => ({ phrase: e.phrase, translation: e.translation, context: e.context || undefined })) ?? []);
		setErrors({});
	}, [open, phrase, defaultCategoryId, categories]);

	const handleSubmit: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		const errs: Record<string, string> = {};
		if (!categoryId) errs.categoryId = t("adminPhrasebook.phraseModal.categoryRequired");
		if (!original.trim()) errs.original = t("adminPhrasebook.phraseModal.originalRequired");
		if (!translation.trim()) errs.translation = t("adminPhrasebook.phraseModal.translationRequired");
		if (Object.keys(errs).length > 0) { setErrors(errs); return; }

		const dto: CreateAdminPhraseDto = {
			categoryId,
			original: original.trim(),
			transliteration: transliteration.trim() || undefined,
			translation: translation.trim(),
			lang,
			sortOrder: Number(sortOrder),
			words: words.length > 0 ? words : undefined,
			examples: examples.length > 0 ? examples : undefined,
		};

		if (isEdit && phrase) onUpdate(phrase.id, dto);
		else onCreate(dto);
	};

	const handleCategoryChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => {
		setCategoryId(e.currentTarget.value);
		setErrors((p) => ({ ...p, categoryId: "" }));
	};

	const handleOriginalChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => {
		setOriginal(e.currentTarget.value);
		setErrors((p) => ({ ...p, original: "" }));
	};

	const handleTransliterationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
		setTransliteration(e.currentTarget.value);

	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => {
		setTranslation(e.currentTarget.value);
		setErrors((p) => ({ ...p, translation: "" }));
	};

	const handleSortOrderChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
		setSortOrder(e.currentTarget.value);

	const handleAddWord: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		setWords((prev) => [...prev, { original: "", translation: "", position: prev.length }]);

	const handleAddExample: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		setExamples((prev) => [...prev, { phrase: "", translation: "" }]);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={isEdit ? t("adminPhrasebook.phraseModal.editTitle") : t("adminPhrasebook.phraseModal.createTitle")}
			className="max-w-[520px]"
		>
			<div className="max-h-[60vh] overflow-y-auto space-y-3.5 pr-1 -mr-1">
				<div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
							{t("adminPhrasebook.phraseModal.categoryLabel")} *
						</Typography>
						<Select
							value={categoryId}
							onChange={handleCategoryChange}
							className={cn(errors.categoryId && "border-red-400")}
						>
							<option value="">{t("adminPhrasebook.phraseModal.selectCategory")}</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
							))}
						</Select>
						{errors.categoryId && (
							<Typography tag="p" className="mt-1 text-[11px] text-red-500">{errors.categoryId}</Typography>
						)}
					</div>
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
							{t("adminPhrasebook.phraseModal.langLabel")}
						</Typography>
						<div className="flex gap-1.5">
							{PHRASE_LANGS.map((l) => {
								const handleLangClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setLang(l);
								return (
									<Button
										key={l}
										onClick={handleLangClick}
										className={cn(
											"flex h-[34px] flex-1 cursor-pointer items-center justify-center rounded-base border text-[11.5px] font-semibold uppercase transition-colors",
											lang === l
												? "border-acc bg-acc-bg text-acc-t"
												: "border-bd-2 bg-bg text-t-3 hover:border-bd-3",
										)}
									>
										{l}
									</Button>
								);
							})}
						</div>
					</div>
				</div>

				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("adminPhrasebook.phraseModal.originalLabel")} *
					</Typography>
					<Input
						className={cn(errors.original && "border-red-400")}
						placeholder={t("adminPhrasebook.phraseModal.originalPlaceholder")}
						value={original}
						onChange={handleOriginalChange}
					/>
					{errors.original && (
						<Typography tag="p" className="mt-1 text-[11px] text-red-500">{errors.original}</Typography>
					)}
				</div>

				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("adminPhrasebook.phraseModal.transliterationLabel")}
					</Typography>
					<Input
						placeholder={t("adminPhrasebook.phraseModal.transliterationPlaceholder")}
						value={transliteration}
						onChange={handleTransliterationChange}
					/>
				</div>

				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("adminPhrasebook.phraseModal.translationLabel")} *
					</Typography>
					<Input
						className={cn(errors.translation && "border-red-400")}
						placeholder={t("adminPhrasebook.phraseModal.translationPlaceholder")}
						value={translation}
						onChange={handleTranslationChange}
					/>
					{errors.translation && (
						<Typography tag="p" className="mt-1 text-[11px] text-red-500">{errors.translation}</Typography>
					)}
				</div>

				<div>
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("adminPhrasebook.phraseModal.sortOrderLabel")}
					</Typography>
					<Input
						type="number"
						min={0}
						className="w-[100px]"
						value={sortOrder}
						onChange={handleSortOrderChange}
					/>
				</div>

				<div>
					<div className="mb-2 flex items-center justify-between">
						<Typography tag="p" className="text-[11.5px] font-semibold text-t-2">
							{t("adminPhrasebook.phraseModal.wordsLabel")}
						</Typography>
						<Button
							onClick={handleAddWord}
							className="flex h-[26px] cursor-pointer items-center gap-1 rounded-md border border-bd-2 bg-transparent px-2 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2"
						>
							<Plus className="size-3" />
							{t("adminPhrasebook.phraseModal.addWord")}
						</Button>
					</div>
					{words.map((w, i) => {
						const handleWordOriginalChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
							setWords((prev) => prev.map((x, idx) => idx === i ? { ...x, original: e.currentTarget.value } : x));
						const handleWordTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
							setWords((prev) => prev.map((x, idx) => idx === i ? { ...x, translation: e.currentTarget.value } : x));
						const handleRemoveWord: NonNullable<ComponentProps<"button">["onClick"]> = () =>
							setWords((prev) => prev.filter((_, idx) => idx !== i));
						return (
							<div key={i} className="mb-1.5 flex items-center gap-1.5">
								<Input
									placeholder={t("adminPhrasebook.phraseModal.wordOriginalPlaceholder")}
									value={w.original}
									onChange={handleWordOriginalChange}
									className="flex-1 text-[12.5px]"
								/>
								<Input
									placeholder={t("adminPhrasebook.phraseModal.wordTranslationPlaceholder")}
									value={w.translation}
									onChange={handleWordTranslationChange}
									className="flex-1 text-[12.5px]"
								/>
								<Button
									onClick={handleRemoveWord}
									className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
								>
									<X className="size-[13px]" />
								</Button>
							</div>
						);
					})}
				</div>

				<div>
					<div className="mb-2 flex items-center justify-between">
						<Typography tag="p" className="text-[11.5px] font-semibold text-t-2">
							{t("adminPhrasebook.phraseModal.examplesLabel")}
						</Typography>
						<Button
							onClick={handleAddExample}
							className="flex h-[26px] cursor-pointer items-center gap-1 rounded-md border border-bd-2 bg-transparent px-2 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2"
						>
							<Plus className="size-3" />
							{t("adminPhrasebook.phraseModal.addExample")}
						</Button>
					</div>
					{examples.map((ex, i) => {
						const handleExPhraseChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
							setExamples((prev) => prev.map((x, idx) => idx === i ? { ...x, phrase: e.currentTarget.value } : x));
						const handleExTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
							setExamples((prev) => prev.map((x, idx) => idx === i ? { ...x, translation: e.currentTarget.value } : x));
						const handleExContextChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) =>
							setExamples((prev) => prev.map((x, idx) => idx === i ? { ...x, context: e.currentTarget.value } : x));
						const handleRemoveExample: NonNullable<ComponentProps<"button">["onClick"]> = () =>
							setExamples((prev) => prev.filter((_, idx) => idx !== i));
						return (
							<div key={i} className="mb-2 rounded-[9px] border border-bd-1 bg-surf-2 p-2.5">
								<div className="flex items-start gap-1.5">
									<div className="flex-1 space-y-1.5">
										<Input
											placeholder={t("adminPhrasebook.phraseModal.examplePhrasePlaceholder")}
											value={ex.phrase}
											onChange={handleExPhraseChange}
											className="text-[12.5px]"
										/>
										<Input
											placeholder={t("adminPhrasebook.phraseModal.exampleTranslationPlaceholder")}
											value={ex.translation}
											onChange={handleExTranslationChange}
											className="text-[12.5px]"
										/>
										<Input
											placeholder={t("adminPhrasebook.phraseModal.exampleContextPlaceholder")}
											value={ex.context ?? ""}
											onChange={handleExContextChange}
											className="text-[12.5px]"
										/>
									</div>
									<Button
										onClick={handleRemoveExample}
										className="flex size-[34px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
									>
										<X className="size-[13px]" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<ModalActions>
				<Button
					variant="ghost"
					onClick={onClose}
					disabled={isSubmitting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("adminPhrasebook.cancel")}
				</Button>
				<Button
					variant="action"
					onClick={handleSubmit}
					disabled={isSubmitting}
					className="h-[34px] flex-1 rounded-lg text-[13px]"
				>
					{isSubmitting
						? t("adminPhrasebook.saving")
						: isEdit
							? t("adminPhrasebook.save")
							: t("adminPhrasebook.create")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
