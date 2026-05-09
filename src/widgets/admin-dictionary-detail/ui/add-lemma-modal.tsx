"use client";

import type {
	AddAdminLemmaDto,
	AdminDictLanguage,
} from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { ComponentProps, SyntheticEvent, useEffect, useRef, useState } from 'react';
const CEFR_LEVELS: readonly CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const POS_OPTIONS = [
	"noun",
	"verb",
	"adjective",
	"adverb",
	"pronoun",
	"numeral",
	"particle",
	"conjunction",
	"preposition",
	"interjection",
];

interface AddLemmaModalProps {
	isOpen: boolean;
	entryId: string;
	isPending: boolean;
	onClose: () => void;
	onSave: (entryId: string, body: AddAdminLemmaDto) => void;
}

export const AddLemmaModal = ({
	isOpen,
	entryId,
	isPending,
	onClose,
	onSave,
}: AddLemmaModalProps) => {
	const { t } = useI18n();
	const inputRef = useRef<HTMLInputElement>(null);

	const [baseForm, setBaseForm] = useState("");
	const [language, setLanguage] = useState<AdminDictLanguage>("CHE");
	const [partOfSpeech, setPartOfSpeech] = useState("");
	const [level, setLevel] = useState<CefrLevel | "">("");
	const [frequency, setFrequency] = useState("");
	const [isPrimary, setIsPrimary] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setBaseForm("");
			setLanguage("CHE");
			setPartOfSpeech("");
			setLevel("");
			setFrequency("");
			setIsPrimary(false);
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [isOpen]);

	const handleSubmit = (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		if (!baseForm.trim()) return;
		const body: AddAdminLemmaDto = {
			baseForm: baseForm.trim(),
			language,
			partOfSpeech: partOfSpeech || undefined,
			level: level || undefined,
			frequency: frequency !== "" ? Number(frequency) : undefined,
			isPrimary,
		};
		onSave(entryId, body);
	};

	if (!isOpen) return null;

	const inputCls =
		"w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 h-[34px] text-[13px] text-t-1 outline-none placeholder:text-t-3 transition-colors focus:border-acc";
	const selectCls =
		"w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 h-[34px] text-[12.5px] text-t-2 outline-none transition-colors focus:border-acc appearance-none cursor-pointer";
	const labelCls = "mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2";

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => /* intentional: backdrop-only click */ e.target === e.currentTarget && onClose();
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setBaseForm(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => setPartOfSpeech(e.currentTarget.value);
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e => setLevel(e.currentTarget.value as CefrLevel | "");
	const handleChange4: NonNullable<ComponentProps<"input">["onChange"]> = e => setFrequency(e.currentTarget.value);
	const handleChange5: NonNullable<ComponentProps<"select">["onChange"]> = e => setLanguage(e.currentTarget.value as AdminDictLanguage);
	const handleChange6: NonNullable<ComponentProps<"input">["onChange"]> = e => setIsPrimary(e.currentTarget.checked);
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
			onClick={handleClick}
		>
			<div className="w-[480px] max-w-[calc(100vw-24px)] rounded-[14px] border border-bd-2 bg-surf p-[22px] shadow-lg max-sm:p-4.5">
				<div className="mb-1 font-display text-[15px] text-t-1">
					{t("admin.dictionaryDetail.addLemmaTitle")}
				</div>
				<div className="mb-4.5 text-[12px] text-t-3">
					{t("admin.dictionaryDetail.addLemmaModalSub")}
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3.5">
						<div className={labelCls}>
							{t("admin.dictionaryDetail.baseForm")}
						</div>
						<input
							ref={inputRef}
							className={`${inputCls} font-display text-[14px]`}
							type="text"
							value={baseForm}
							onChange={handleChange}
							placeholder={t("admin.dictionaryDetail.baseFormPlaceholder")}
						/>
					</div>

					<div className="mb-3.5 flex gap-2.5 max-sm:flex-col">
						<div className="flex-1">
							<div className={labelCls}>{t("admin.dictionaryDetail.pos")}</div>
							<select
								className={selectCls}
								value={partOfSpeech}
								onChange={handleChange2}
							>
								<option value="">
									— {t("admin.dictionaryDetail.selectPos")} —
								</option>
								{POS_OPTIONS.map(p => (
									<option key={p} value={p}>
										{p}
									</option>
								))}
							</select>
						</div>
						<div className="flex-1">
							<div className={labelCls}>
								{t("admin.dictionaryDetail.level")}
							</div>
							<select
								className={selectCls}
								value={level}
								onChange={handleChange3}
							>
								<option value="">
									— {t("admin.dictionaryDetail.selectLevel")} —
								</option>
								{CEFR_LEVELS.map(l => (
									<option key={l} value={l}>
										{l}
									</option>
								))}
							</select>
						</div>
					</div>

					<div className="mb-3.5 flex gap-2.5 max-sm:flex-col">
						<div className="flex-1">
							<div className={labelCls}>
								{t("admin.dictionaryDetail.frequency")}
							</div>
							<input
								className={inputCls}
								type="number"
								min={0}
								value={frequency}
								onChange={handleChange4}
								placeholder="0"
							/>
						</div>
						<div className="flex-1">
							<div className={labelCls}>
								{t("admin.dictionaryDetail.language")}
							</div>
							<select
								className={selectCls}
								value={language}
								onChange={handleChange5}
							>
								<option value="CHE">CHE</option>
								<option value="RU">RU</option>
							</select>
						</div>
					</div>

					<label className="flex cursor-pointer items-center gap-2.5">
						<input
							type="checkbox"
							className="size-4 cursor-pointer rounded"
							checked={isPrimary}
							onChange={handleChange6}
						/>
						<span className="text-[13px] text-t-2">
							{t("admin.dictionaryDetail.markAsPrimary")}
						</span>
					</label>

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
							disabled={isPending || !baseForm.trim()}
							className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-50"
						>
							{t("admin.dictionaryDetail.add")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
