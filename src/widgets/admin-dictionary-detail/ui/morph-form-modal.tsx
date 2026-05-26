"use client";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

import type {
	AdminDictGramCase,
	AdminDictGramNumber,
	AdminDictMorphForm,
} from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Select } from "@/shared/ui/select";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

interface MorphFormModalProps {
	isOpen: boolean;
	editForm?: AdminDictMorphForm | null;
	isPending: boolean;
	onClose: () => void;
	onSave: (data: {
		form: string;
		gramCase?: AdminDictGramCase;
		gramNumber?: AdminDictGramNumber;
	}) => void;
}

const GRAM_CASES: Array<{ value: AdminDictGramCase; label: string }> = [
	{ value: "NOM", label: "Именительный" },
	{ value: "GEN", label: "Родительный" },
	{ value: "DAT", label: "Дательный" },
	{ value: "ERG", label: "Эргативный" },
	{ value: "INS", label: "Инструментальный" },
	{ value: "LOC", label: "Местный" },
	{ value: "ALL", label: "Аллатив" },
];

const GRAM_NUMBERS: Array<{ value: AdminDictGramNumber; label: string }> = [
	{ value: "SG", label: "Единственное" },
	{ value: "PL", label: "Множественное" },
];

export const MorphFormModal = ({
	isOpen,
	editForm,
	isPending,
	onClose,
	onSave,
}: MorphFormModalProps) => {
	const { t } = useI18n();
	const [form, setForm] = useState("");
	const [gramCase, setGramCase] = useState<AdminDictGramCase | "">("");
	const [gramNumber, setGramNumber] = useState<AdminDictGramNumber | "">("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate modal fields from selected form
			setForm(editForm?.form ?? "");
			setGramCase(editForm?.gramCase ?? "");
			setGramNumber(editForm?.gramNumber ?? "");
			setTimeout(() => inputRef.current?.focus(), 50);
		}
	}, [isOpen, editForm]);

	const handleSubmit = () => {
		if (!form.trim()) return;
		onSave({
			form: form.trim(),
			gramCase: gramCase || undefined,
			gramNumber: gramNumber || undefined,
		});
	};

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setForm(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		setGramCase(e.currentTarget.value as AdminDictGramCase | "");
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		setGramNumber(e.currentTarget.value as AdminDictGramNumber | "");

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={editForm
				? t("admin.dictionaryDetail.editForm")
				: t("admin.dictionaryDetail.addFormTitle")}
			className="max-w-[440px]"
		>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3">
				{t("admin.dictionaryDetail.formModalSub")}
			</Typography>
			<form action={handleSubmit}>
				<div className="mb-3.5">
					<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.dictionaryDetail.wordForm")}
					</div>
					<Input
						ref={inputRef}
						className="rounded-lg font-display text-[14px]"
						type="text"
						placeholder={t("admin.dictionaryDetail.wordFormPlaceholder")}
						value={form}
						onChange={handleChange}
						aria-label={t("admin.dictionaryDetail.wordForm")}
					/>
				</div>
				<div className="mb-0 flex gap-2.5 max-sm:flex-col">
					<div className="flex-1">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.gramCase")}
						</div>
						<Select
							variant="lg"
							value={gramCase}
							onChange={handleChange2}
						>
							<option value="">
								— {t("admin.dictionaryDetail.selectCase")} —
							</option>
							{GRAM_CASES.map(c => (
								<option key={c.value} value={c.value}>
									{c.label}
								</option>
							))}
						</Select>
					</div>
					<div className="flex-1">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.gramNumber")}
						</div>
						<Select
							variant="lg"
							value={gramNumber}
							onChange={handleChange3}
						>
							<option value="">
								— {t("admin.dictionaryDetail.selectNumber")} —
							</option>
							{GRAM_NUMBERS.map(n => (
								<option key={n.value} value={n.value}>
									{n.label}
								</option>
							))}
						</Select>
					</div>
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
						disabled={isPending || !form.trim()}
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
