"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type {
	CreateMorphRuleDto,
	MorphRule,
	MorphRuleType,
} from "@/entities/morph-rule";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useEffect, useState } from "react";
const TYPE_OPTIONS: MorphRuleType[] = [
	"SUFFIX",
	"ENDING",
	"PREFIX",
	"NOUN_CASE",
	"PLURAL",
	"VERB_PAST",
	"REGEX",
];

interface Props {
	open: boolean;
	rule?: MorphRule | null;
	isLoading?: boolean;
	onSubmit: (dto: CreateMorphRuleDto) => void;
	onClose: () => void;
}

const EMPTY: CreateMorphRuleDto = {
	suffix: "",
	add: "",
	pos: "",
	description: "",
	isRegex: false,
	type: "SUFFIX",
	language: "CHE",
	priority: 1,
	isActive: true,
};

export const MorphologyRuleModal = ({
	open,
	rule,
	isLoading,
	onSubmit,
	onClose,
}: Props) => {
	const { t } = useI18n();
	const [form, setForm] = useState<CreateMorphRuleDto>(EMPTY);

	useEffect(() => {
		if (rule) {
			// eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate form when editing existing rule
			setForm({
				suffix: rule.suffix,
				add: rule.add ?? "",
				pos: rule.pos ?? "",
				description: rule.description ?? "",
				isRegex: rule.isRegex,
				type: rule.type,
				language: rule.language,
				priority: rule.priority,
				isActive: rule.isActive,
			});
		} else {
			setForm(EMPTY);
		}
	}, [rule, open]);

	if (!open) return null;

	const isEdit = !!rule;

	const handleSubmit = () => {
		onSubmit({
			...form,
			add: form.add || undefined,
			pos: form.pos || undefined,
			description: form.description || undefined,
		});
	};

	const handleBackdropClick: NonNullable<ComponentProps<"div">["onClick"]> = e => /* intentional: backdrop-only click */ e.target === e.currentTarget && onClose();
	const handleSuffixChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setForm(p => ({ ...p, suffix: e.currentTarget.value }));
	const handleAddChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setForm(p => ({ ...p, add: e.currentTarget.value }));
	const handlePosChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setForm(p => ({ ...p, pos: e.currentTarget.value }));
	const handleTypeChange: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		setForm(p => ({
			...p,
			type: e.currentTarget.value as MorphRuleType,
			isRegex: e.currentTarget.value === "REGEX",
		}));
	const handlePriorityChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setForm(p => ({
			...p,
			priority: parseInt(e.currentTarget.value, 10) || 0,
		}));
	const handleDescriptionChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setForm(p => ({ ...p, description: e.currentTarget.value }));
	const handleActiveChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setForm(p => ({ ...p, isActive: e.currentTarget.checked }));
return (
		<div
			className="fixed inset-0 z-200 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px] sm:p-4 max-sm:items-end max-sm:p-0"
			onClick={handleBackdropClick}
		>
			<div className="w-full max-w-[480px] overflow-y-auto rounded-[14px] border border-bd-2 bg-surf p-5 shadow-md max-sm:max-w-full max-sm:rounded-b-none max-sm:rounded-t-[16px] max-sm:pb-7">
				<Typography tag="h2" className="font-display text-[15px] text-t-1 mb-1">
					{isEdit
						? t("admin.morphology.ruleModal.editTitle")
						: t("admin.morphology.ruleModal.addTitle")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12px] text-t-3">
					{t("admin.morphology.ruleModal.subtitle")}
				</Typography>

				<form action={handleSubmit} className="flex flex-col gap-3.5">
					{/* Pattern */}
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.morphology.ruleModal.suffixLabel")}
						</Typography>
						<input
							required
							type="text"
							value={form.suffix}
							onChange={handleSuffixChange}
							placeholder={t("admin.morphology.ruleModal.suffixPlaceholder")}
							className="h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 font-mono text-[13px] text-t-1 placeholder:font-sans placeholder:text-[12.5px] placeholder:text-t-3 focus:border-acc focus:outline-none"
						/>
					</div>

					<div className="flex gap-2.5">
						{/* Replacement */}
						<div className="flex-1">
							<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
								{t("admin.morphology.ruleModal.addLabel")}
								<Typography tag="span" className="ml-1.5 font-normal tracking-normal text-t-3">
									{t("admin.morphology.ruleModal.addHint")}
								</Typography>
							</Typography>
							<input
								type="text"
								value={form.add ?? ""}
								onChange={handleAddChange}
								placeholder="∅"
								className="h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 font-mono text-[13px] text-t-1 placeholder:font-sans placeholder:text-[12.5px] placeholder:text-t-3 focus:border-acc focus:outline-none"
							/>
						</div>

						{/* POS */}
						<div className="w-28">
							<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
								{t("admin.morphology.ruleModal.posLabel")}
							</Typography>
							<input
								type="text"
								value={form.pos ?? ""}
								onChange={handlePosChange}
								placeholder="NOUN"
								className="h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[12.5px] text-t-1 placeholder:text-t-3 focus:border-acc focus:outline-none"
							/>
						</div>
					</div>

					<div className="flex gap-2.5">
						{/* Type */}
						<div className="flex-1">
							<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
								{t("admin.morphology.ruleModal.typeLabel")}
							</Typography>
							<select
								value={form.type}
								onChange={handleTypeChange}
								className="h-9 w-full appearance-none rounded-lg border border-bd-2 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2211%22%20height%3D%2211%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M4%206l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.4%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-position-[right_8px_center] bg-no-repeat px-2.5 pr-7 text-[12.5px] text-t-2 focus:border-acc focus:outline-none"
							>
								{TYPE_OPTIONS.map(tp => (
									<option key={tp} value={tp}>
										{t(`admin.morphology.ruleType.${tp}` as never) || tp}
									</option>
								))}
							</select>
						</div>

						{/* Priority */}
						<div className="w-24">
							<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
								{t("admin.morphology.ruleModal.priorityLabel")}
							</Typography>
							<input
								type="number"
								min={0}
								max={99}
								value={form.priority ?? 1}
								onChange={handlePriorityChange}
								className="h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[12.5px] text-t-1 focus:border-acc focus:outline-none"
							/>
						</div>
					</div>

					{/* Description */}
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.morphology.ruleModal.descriptionLabel")}
						</Typography>
						<input
							type="text"
							value={form.description ?? ""}
							onChange={handleDescriptionChange}
							placeholder={t(
								"admin.morphology.ruleModal.descriptionPlaceholder",
							)}
							className="h-9 w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 placeholder:text-[12.5px] placeholder:text-t-3 focus:border-acc focus:outline-none"
						/>
					</div>

					{/* Active toggle */}
					<Typography tag="label" className="flex cursor-pointer items-center gap-2.5">
						<input
							type="checkbox"
							checked={form.isActive ?? true}
							onChange={handleActiveChange}
							className="accent-acc"
						/>
						<Typography tag="span" className="text-[12.5px] text-t-2">
							{t("admin.morphology.ruleModal.activeLabel")}
						</Typography>
					</Typography>

					<div className="mt-1.5 flex justify-end gap-2 max-sm:flex-col-reverse">
						<Button
							onClick={onClose}
							className="flex h-[30px] items-center justify-center rounded-base border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-2 max-sm:h-10 max-sm:rounded-[10px] max-sm:text-[13px]"
						>
							{t("admin.morphology.ruleModal.cancel")}
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !form.suffix || !form.type}
							className="flex h-[30px] items-center justify-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60 max-sm:h-10 max-sm:rounded-[10px] max-sm:text-[13px]"
						>
							{isLoading
								? "…"
								: isEdit
									? t("admin.morphology.ruleModal.save")
									: t("admin.morphology.ruleModal.create")}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
