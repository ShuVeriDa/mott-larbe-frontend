"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictMorphForm } from "@/entities/dictionary";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";
import { Pencil, Trash2, Plus, ChevronDown } from "lucide-react";

const CASE_LABELS: Record<string, string> = {
	NOM: "Им.",
	GEN: "Род.",
	DAT: "Дат.",
	ERG: "Эрг.",
	INS: "Инстр.",
	LOC: "Местн.",
	ALL: "Аллат.",
};

const NUMBER_LABELS: Record<string, string> = {
	SG: "ед.",
	PL: "мн.",
};

const formLabel = (f: AdminDictMorphForm): string => {
	if (f.gramCase || f.gramNumber) {
		const c = f.gramCase ? (CASE_LABELS[f.gramCase] ?? f.gramCase) : "";
		const n = f.gramNumber ? (NUMBER_LABELS[f.gramNumber] ?? f.gramNumber) : "";
		return [c, n].filter(Boolean).join(" ");
	}
	return f.grammarTag ?? "—";
};


interface MorphFormsCardProps {
	forms: AdminDictMorphForm[] | undefined;
	isLoading: boolean;
	showAll: boolean;
	onToggleAll: () => void;
	onOpenModal: (m: DictModal) => void;
	onDeleteForm: (formId: string) => void;
}

const INITIAL_COUNT = 6;

export const MorphFormsCard = ({
	forms = [],
	isLoading,
	showAll,
	onToggleAll,
	onOpenModal,
	onDeleteForm,
}: MorphFormsCardProps) => {
	const { t } = useI18n();
	const visible = showAll ? forms : forms.slice(0, INITIAL_COUNT);

	if (isLoading) {
		return (
			<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
				<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
					<div className="h-3 w-40 animate-pulse rounded bg-surf-3" />
				</div>
				<div className="grid grid-cols-2">
					{[0, 1, 2, 3].map((i) => (
						<div key={i} className="flex items-center gap-2.5 border-b border-bd-1 px-3.5 py-2 odd:border-r">
							<div className="h-3 w-16 animate-pulse rounded bg-surf-3" />
							<div className="h-4 w-20 animate-pulse rounded bg-surf-3" />
						</div>
					))}
				</div>
			</div>
		);
	}

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onOpenModal({ type: "addForm" });
return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.morphForms")}
				</Typography>
				<div className="flex items-center gap-1.5">
					<Typography tag="span" className="text-[11.5px] text-t-3">{forms.length} {t("admin.dictionaryDetail.formCount")}</Typography>
					<Button
						className="flex h-[26px] items-center gap-1.5 rounded-md border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
						onClick={handleClick}
					>
						<Plus className="size-[11px]" />
						{t("admin.dictionaryDetail.add")}
					</Button>
				</div>
			</div>

			{forms.length === 0 ? (
				<div className="px-4 py-6 text-center text-[12.5px] text-t-3">
					{t("admin.dictionaryDetail.noForms")}
				</div>
			) : (
				<>
					<div className="grid grid-cols-2">
						{visible.map((form, i) => {
						  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onOpenModal({ type: "editForm", form });
						  const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onDeleteForm(form.id);
						  return (
							<div
								key={form.id}
								className={`group flex items-center gap-2.5 border-b border-bd-1 px-3.5 py-2 transition-colors hover:bg-surf-2 ${i % 2 === 0 ? "border-r" : ""} ${i >= forms.length - (forms.length % 2 === 0 ? 2 : 1) ? "border-b-0" : ""}`}
							>
								<Typography tag="span" className="min-w-[90px] text-[10.5px] font-medium text-t-3">
									{formLabel(form)}
								</Typography>
								<Typography tag="span" className="flex-1 font-display text-[13.5px] font-medium text-t-1">
									{form.form}
								</Typography>
								<div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
									<Button
										className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
										onClick={handleClick}
									>
										<Pencil className="size-[13px]" />
									</Button>
									<Button
										className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
										onClick={handleClick2}
									>
										<Trash2 className="size-[13px]" />
									</Button>
								</div>
							</div>
						);
						})}
					</div>

					{forms.length > INITIAL_COUNT && (
						<Button
							className="w-full border-t border-bd-1 py-2.5 text-center text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-acc-t"
							onClick={onToggleAll}
						>
							{showAll
								? t("admin.dictionaryDetail.showLess")
								: t("admin.dictionaryDetail.showAllForms", { count: forms.length })}
							<ChevronDown className={`ml-1 inline size-[11px] align-middle transition-transform ${showAll ? "rotate-180" : ""}`} />
						</Button>
					)}
				</>
			)}
		</div>
	);
};
