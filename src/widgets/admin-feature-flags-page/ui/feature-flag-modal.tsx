"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type {
	CreateFeatureFlagDto,
	FeatureFlagEnvironment,
	FeatureFlagItem,
	UpdateFeatureFlagDto,
} from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";
import { useFeatureFlagModal } from "../model/use-feature-flag-modal";
import { Select } from "@/shared/ui/select";
import { FlagToggle } from "./flag-toggle";

const ENV_SELECTED_STYLES: Record<FeatureFlagEnvironment, string> = {
	PROD: "border-red-400 bg-red-bg text-red-t",
	STAGE: "border-amber-400 bg-amb-bg text-amb-t",
	DEV: "border-green-400 bg-grn-bg text-grn-t",
};
const ENV_DOT_STYLES: Record<FeatureFlagEnvironment, string> = {
	PROD: "bg-red-400",
	STAGE: "bg-amber-400",
	DEV: "bg-green-400",
};

interface FeatureFlagModalProps {
	open: boolean;
	editFlag?: FeatureFlagItem | null;
	isSubmitting: boolean;
	onSubmit: (dto: CreateFeatureFlagDto | UpdateFeatureFlagDto) => void;
	onClose: () => void;
	t: (key: string) => string;
}

export const FeatureFlagModal = ({
	open,
	editFlag,
	isSubmitting,
	onSubmit,
	onClose,
	t,
}: FeatureFlagModalProps) => {
	const {
		categories,
		environmentsList,
		isEdit,
		key,
		description,
		category,
		environments,
		rolloutPercent,
		isEnabled,
		keyError,
		setIsEnabled,
		handleSubmit,
		handleBackdropClick,
		handleKeyChange,
		handleDescriptionChange,
		handleCategoryChange,
		handleRolloutPercentChange,
		handleEnvironmentClick,
	} = useFeatureFlagModal({
		open,
		editFlag,
		onSubmit,
		onClose,
		t,
	});

	if (!open) return null;

	const inputCls =
		"h-[34px] w-full rounded-[8px] border border-bd-2 bg-bg px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc";

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleBackdropClick}
		>
			<div className="w-[480px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] max-sm:w-full max-sm:max-h-[92vh] max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{isEdit
						? t("admin.featureFlags.modal.editTitle")
						: t("admin.featureFlags.modal.createTitle")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{isEdit
						? t("admin.featureFlags.modal.editSubtitle")
						: t("admin.featureFlags.modal.createSubtitle")}
				</Typography>

				{/* Key */}
				<div className="mb-3.5">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.modal.keyLabel")} *
					</Typography>
					<input
						className={cn(inputCls, keyError && "border-red-400")}
						placeholder="category.feature_name"
						value={key}
						onChange={handleKeyChange}
						disabled={isEdit}
					/>
					{keyError ? (
						<Typography tag="p" className="mt-1 text-[11px] text-red-t">{keyError}</Typography>
					) : (
						<Typography tag="p" className="mt-1 text-[11px] text-t-3">
							{t("admin.featureFlags.modal.keyHint")}
						</Typography>
					)}
				</div>

				{/* Description */}
				<div className="mb-3.5">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.modal.descLabel")}
					</Typography>
					<textarea
						className="w-full min-h-[64px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
						placeholder={t("admin.featureFlags.modal.descPlaceholder")}
						value={description}
						onChange={handleDescriptionChange}
					/>
				</div>

				{/* Category + Rollout */}
				<div className="mb-3.5 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
							{t("admin.featureFlags.modal.categoryLabel")}
						</Typography>
						<Select
							variant="lg"
							value={category}
							onChange={handleCategoryChange}
							className="bg-bg"
						>
							{categories.map(c => (
								<option key={c} value={c}>
									{t(`admin.featureFlags.category.${c}`)}
								</option>
							))}
						</Select>
					</div>
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
							{t("admin.featureFlags.modal.rolloutLabel")}
						</Typography>
						<input
							type="number"
							min={0}
							max={100}
							className={inputCls}
							value={rolloutPercent}
							onChange={handleRolloutPercentChange}
						/>
					</div>
				</div>

				{/* Environments */}
				<div className="mb-3.5">
					<Typography tag="label" className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.modal.envsLabel")}
					</Typography>
					<div className="flex flex-wrap gap-1.5">
						{environmentsList.map(env => {
							const selected = environments.includes(env);
return (
								<Button
									key={env}
									data-environment={env}
									onClick={handleEnvironmentClick}
									className={cn(
										"flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-2.5 py-[5px] text-[12px] transition-all select-none",
										selected
											? ENV_SELECTED_STYLES[env]
											: "border-bd-2 bg-bg text-t-2 hover:border-bd-3",
									)}
								>
									<Typography tag="span"
										className={cn(
											"size-1.5 shrink-0 rounded-full",
											selected ? ENV_DOT_STYLES[env] : "bg-surf-4",
										)}
									/>
									{env}
								</Button>
							);
						})}
					</div>
				</div>

				{/* Enabled toggle */}
				<div className="mb-3.5 flex items-center justify-between rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<Typography tag="span" className="text-[12.5px] text-t-2">
						{t("admin.featureFlags.modal.enabledLabel")}
					</Typography>
					<FlagToggle enabled={isEnabled} onChange={setIsEnabled} />
				</div>

				{/* Footer */}
				<div className="mt-5 flex justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						onClick={onClose}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px] max-sm:text-[14px]"
					>
						{t("admin.featureFlags.modal.cancel")}
					</Button>
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting || !key || environments.length === 0}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px] max-sm:text-[14px]"
					>
						{isSubmitting
							? t("admin.featureFlags.modal.saving")
							: isEdit
								? t("admin.featureFlags.modal.save")
								: t("admin.featureFlags.modal.create")}
					</Button>
				</div>
			</div>
		</div>
	);
};
