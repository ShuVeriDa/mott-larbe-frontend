"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type {
	CreateMorphRuleDto,
	MorphRule,
	MorphRuleType,
} from "@/entities/morph-rule";
import { useI18n } from "@/shared/lib/i18n";
import { Input } from "@/shared/ui/input";
import { ComponentProps, useEffect, useState } from "react";
import { Select } from "@/shared/ui/select";
import { Modal, ModalActions } from "@/shared/ui/modal";

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

	const isEdit = !!rule;

	const handleSubmit = () => {
		onSubmit({
			...form,
			add: form.add || undefined,
			pos: form.pos || undefined,
			description: form.description || undefined,
		});
	};

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
		<Modal
			open={open}
			onClose={onClose}
			title={isEdit
				? t("admin.morphology.ruleModal.editTitle")
				: t("admin.morphology.ruleModal.addTitle")}
			className="max-w-[480px]"
		>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3">
				{t("admin.morphology.ruleModal.subtitle")}
			</Typography>

			<form action={handleSubmit} className="flex flex-col gap-3.5">
				{/* Pattern */}
				<div>
					<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.morphology.ruleModal.suffixLabel")}
					</Typography>
					<Input
						required
						type="text"
						value={form.suffix}
						onChange={handleSuffixChange}
						placeholder={t("admin.morphology.ruleModal.suffixPlaceholder")}
						aria-label={t("admin.morphology.ruleModal.suffixLabel")}
						className="h-9 rounded-lg font-mono placeholder:font-sans placeholder:text-[12.5px]"
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
						<Input
							type="text"
							value={form.add ?? ""}
							onChange={handleAddChange}
							placeholder="∅"
							aria-label={t("admin.morphology.ruleModal.addLabel")}
							className="h-9 rounded-lg font-mono placeholder:font-sans placeholder:text-[12.5px]"
						/>
					</div>

					{/* POS */}
					<div className="w-28">
						<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.morphology.ruleModal.posLabel")}
						</Typography>
						<Input
							type="text"
							value={form.pos ?? ""}
							onChange={handlePosChange}
							placeholder="NOUN"
							aria-label={t("admin.morphology.ruleModal.posLabel")}
							className="h-9 rounded-lg text-[12.5px]"
						/>
					</div>
				</div>

				<div className="flex gap-2.5">
					{/* Type */}
					<div className="flex-1">
						<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.morphology.ruleModal.typeLabel")}
						</Typography>
						<Select
							variant="lg"
							value={form.type}
							onChange={handleTypeChange}
							className="rounded-lg h-9"
						>
							{TYPE_OPTIONS.map(tp => (
								<option key={tp} value={tp}>
									{t(`admin.morphology.ruleType.${tp}` as never) || tp}
								</option>
							))}
						</Select>
					</div>

					{/* Priority */}
					<div className="w-24">
						<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
							{t("admin.morphology.ruleModal.priorityLabel")}
						</Typography>
						<Input
							type="number"
							min={0}
							max={99}
							value={form.priority ?? 1}
							onChange={handlePriorityChange}
							aria-label={t("admin.morphology.ruleModal.priorityLabel")}
							className="h-9 rounded-lg text-[12.5px]"
						/>
					</div>
				</div>

				{/* Description */}
				<div>
					<Typography tag="label" className="mb-1.5 block text-[11px] font-semibold tracking-[0.3px] text-t-2">
						{t("admin.morphology.ruleModal.descriptionLabel")}
					</Typography>
					<Input
						type="text"
						value={form.description ?? ""}
						onChange={handleDescriptionChange}
						placeholder={t(
							"admin.morphology.ruleModal.descriptionPlaceholder",
						)}
						aria-label={t("admin.morphology.ruleModal.descriptionLabel")}
						className="h-9 rounded-lg placeholder:text-[12.5px]"
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

				<ModalActions>
					<Button
						type="button"
						onClick={onClose}
						title={t("admin.morphology.ruleModal.cancel")}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("admin.morphology.ruleModal.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isLoading || !form.suffix || !form.type}
						title={isEdit ? t("admin.morphology.ruleModal.save") : t("admin.morphology.ruleModal.create")}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{isLoading
							? "…"
							: isEdit
								? t("admin.morphology.ruleModal.save")
								: t("admin.morphology.ruleModal.create")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
