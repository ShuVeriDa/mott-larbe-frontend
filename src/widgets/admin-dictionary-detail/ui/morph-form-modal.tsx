"use client";

import { Button } from "@/shared/ui/button";

import type {
	AdminDictGramCase,
	AdminDictGramNumber,
	AdminDictMorphForm,
} from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Select } from "@/shared/ui/select";
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

	if (!isOpen) return null;

	const inputCls =
		"w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 h-[34px] text-[13px] text-t-1 outline-none placeholder:text-t-3 transition-colors focus:border-acc";

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => /* intentional: backdrop-only click */ e.target === e.currentTarget && onClose();
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setForm(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e =>
									setGramCase(e.currentTarget.value as AdminDictGramCase | "");
	const handleChange3: NonNullable<ComponentProps<"select">["onChange"]> = e =>
									setGramNumber(e.currentTarget.value as AdminDictGramNumber | "");
return (
		<div
			className="fixed inset-0 z-200 flex items-center justify-center bg-black/35 backdrop-blur-[2px]"
			onClick={handleClick}
		>
			<div className="w-[440px] max-w-[calc(100vw-24px)] rounded-[14px] border border-bd-2 bg-surf p-[22px] shadow-lg max-sm:p-4.5">
				<div className="mb-1 font-display text-[15px] text-t-1">
					{editForm
						? t("admin.dictionaryDetail.editForm")
						: t("admin.dictionaryDetail.addFormTitle")}
				</div>
				<div className="mb-4.5 text-[12px] text-t-3">
					{t("admin.dictionaryDetail.formModalSub")}
				</div>
				<form action={handleSubmit}>
					<div className="mb-3.5">
						<div className="mb-1.5 text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.dictionaryDetail.wordForm")}
						</div>
						<input
							ref={inputRef}
							className={`${inputCls} font-display text-[14px]`}
							type="text"
							placeholder={t("admin.dictionaryDetail.wordFormPlaceholder")}
							value={form}
							onChange={handleChange}
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
					<div className="mt-5 flex justify-end gap-2">
						<Button
							className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-[11px] text-[12px] text-t-2 transition-colors hover:bg-surf-2"
							onClick={onClose}
						>
							{t("admin.dictionaryDetail.cancel")}
						</Button>
						<Button
							type="submit"
							disabled={isPending || !form.trim()}
							className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-50"
						>
							{t("admin.dictionaryDetail.add")}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
