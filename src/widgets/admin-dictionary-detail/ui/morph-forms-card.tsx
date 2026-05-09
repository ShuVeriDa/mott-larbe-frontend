"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictMorphForm } from "@/entities/dictionary";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";

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

const IconEdit = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
		<path d="M10.5 3.5l2 2L5 13H3v-2l7.5-7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const IconTrash = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
		<path d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
		<path d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
	</svg>
);

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
				<span className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.morphForms")}
				</span>
				<div className="flex items-center gap-1.5">
					<span className="text-[11.5px] text-t-3">{forms.length} {t("admin.dictionaryDetail.formCount")}</span>
					<button
						className="flex h-[26px] items-center gap-1.5 rounded-md border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
						onClick={handleClick}
					>
						<svg width="11" height="11" viewBox="0 0 16 16" fill="none">
							<path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
						</svg>
						{t("admin.dictionaryDetail.add")}
					</button>
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
								<span className="min-w-[90px] text-[10.5px] font-medium text-t-3">
									{formLabel(form)}
								</span>
								<span className="flex-1 font-display text-[13.5px] font-medium text-t-1">
									{form.form}
								</span>
								<div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
									<button
										className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
										onClick={handleClick}
									>
										<IconEdit />
									</button>
									<button
										className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
										onClick={handleClick2}
									>
										<IconTrash />
									</button>
								</div>
							</div>
						);
						})}
					</div>

					{forms.length > INITIAL_COUNT && (
						<button
							className="w-full border-t border-bd-1 py-2.5 text-center text-[12px] text-t-3 transition-colors hover:bg-surf-2 hover:text-acc-t"
							onClick={onToggleAll}
						>
							{showAll
								? t("admin.dictionaryDetail.showLess")
								: t("admin.dictionaryDetail.showAllForms", { count: forms.length })}
							<svg
								width="11"
								height="11"
								viewBox="0 0 16 16"
								fill="none"
								className={`ml-1 inline align-middle transition-transform ${showAll ? "rotate-180" : ""}`}
							>
								<path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					)}
				</>
			)}
		</div>
	);
};
