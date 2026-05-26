"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import type {
	AddAdminLemmaDto,
	AdminDictLanguage,
} from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { CEFR_LEVELS, POS_OPTIONS } from "@/shared/types";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Select } from "@/shared/ui/select";
import { Modal, ModalActions } from "@/shared/ui/modal";

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
			// eslint-disable-next-line react-hooks/set-state-in-effect -- reset modal fields for fresh entry
			setBaseForm("");
			setLanguage("CHE");
			setPartOfSpeech("");
			setLevel("");
			setFrequency("");
			setIsPrimary(false);
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [isOpen]);

	const handleSubmit = () => {
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

	const labelCls = "mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2";

	const handleBaseFormChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setBaseForm(e.currentTarget.value);
	const handlePosChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setPartOfSpeech(e.currentTarget.value);
	const handleLevelChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setLevel(e.currentTarget.value as CefrLevel | "");
	const handleFrequencyChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setFrequency(e.currentTarget.value);
	const handleLanguageChange: NonNullable<ComponentProps<"select">["onChange"]> = e => setLanguage(e.currentTarget.value as AdminDictLanguage);
	const handlePrimaryChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setIsPrimary(e.currentTarget.checked);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={t("admin.dictionaryDetail.addLemmaTitle")}
			className="max-w-[480px]"
		>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3">
				{t("admin.dictionaryDetail.addLemmaModalSub")}
			</Typography>
			<form action={handleSubmit}>
				<div className="mb-3.5">
					<div className={labelCls}>
						{t("admin.dictionaryDetail.baseForm")}
					</div>
					<Input
						ref={inputRef}
						className="rounded-lg font-display text-[14px]"
						type="text"
						value={baseForm}
						onChange={handleBaseFormChange}
						placeholder={t("admin.dictionaryDetail.baseFormPlaceholder")}
						aria-label={t("admin.dictionaryDetail.baseForm")}
					/>
				</div>

				<div className="mb-3.5 flex gap-2.5 max-sm:flex-col">
					<div className="flex-1">
						<div className={labelCls}>{t("admin.dictionaryDetail.pos")}</div>
						<Select
							variant="lg"
							value={partOfSpeech}
							onChange={handlePosChange}
						>
							<option value="">
								— {t("admin.dictionaryDetail.selectPos")} —
							</option>
							{POS_OPTIONS.map(p => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
						</Select>
					</div>
					<div className="flex-1">
						<div className={labelCls}>
							{t("admin.dictionaryDetail.level")}
						</div>
						<Select
							variant="lg"
							value={level}
							onChange={handleLevelChange}
						>
							<option value="">
								— {t("admin.dictionaryDetail.selectLevel")} —
							</option>
							{CEFR_LEVELS.map(l => (
								<option key={l} value={l}>
									{l}
								</option>
							))}
						</Select>
					</div>
				</div>

				<div className="mb-3.5 flex gap-2.5 max-sm:flex-col">
					<div className="flex-1">
						<div className={labelCls}>
							{t("admin.dictionaryDetail.frequency")}
						</div>
						<Input
							className="rounded-lg"
							type="number"
							min={0}
							value={frequency}
							onChange={handleFrequencyChange}
							placeholder="0"
							aria-label={t("admin.dictionaryDetail.frequency")}
						/>
					</div>
					<div className="flex-1">
						<div className={labelCls}>
							{t("admin.dictionaryDetail.language")}
						</div>
						<Select
							variant="lg"
							value={language}
							onChange={handleLanguageChange}
						>
							<option value="CHE">CHE</option>
							<option value="RU">RU</option>
						</Select>
					</div>
				</div>

				<Typography tag="label" className="flex cursor-pointer items-center gap-2.5">
					<input
						type="checkbox"
						className="size-4 cursor-pointer rounded"
						checked={isPrimary}
						onChange={handlePrimaryChange}
					/>
					<Typography tag="span" className="text-[13px] text-t-2">
						{t("admin.dictionaryDetail.markAsPrimary")}
					</Typography>
				</Typography>

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
						disabled={isPending || !baseForm.trim()}
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
