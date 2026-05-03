"use client";

import { useState, useEffect } from "react";
import { cn } from "@/shared/lib/cn";
import type {
	FeatureFlagCategory,
	FeatureFlagEnvironment,
	FeatureFlagItem,
	CreateFeatureFlagDto,
	UpdateFeatureFlagDto,
} from "@/entities/feature-flag";
import { FlagToggle } from "./flag-toggle";

const CATEGORIES: FeatureFlagCategory[] = ["FUNCTIONAL", "EXPERIMENTS", "TECHNICAL", "MONETIZATION"];
const ENVIRONMENTS: FeatureFlagEnvironment[] = ["PROD", "STAGE", "DEV"];

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

const DEFAULT_ENVS: FeatureFlagEnvironment[] = ["PROD", "STAGE", "DEV"];

export const FeatureFlagModal = ({
	open,
	editFlag,
	isSubmitting,
	onSubmit,
	onClose,
	t,
}: FeatureFlagModalProps) => {
	const isEdit = !!editFlag;

	const [key, setKey] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState<FeatureFlagCategory>("FUNCTIONAL");
	const [environments, setEnvironments] = useState<FeatureFlagEnvironment[]>(DEFAULT_ENVS);
	const [rolloutPercent, setRolloutPercent] = useState(100);
	const [isEnabled, setIsEnabled] = useState(false);
	const [keyError, setKeyError] = useState("");

	useEffect(() => {
		if (!open) return;
		if (editFlag) {
			setKey(editFlag.key);
			setDescription(editFlag.description ?? "");
			setCategory(editFlag.category);
			setEnvironments(editFlag.environments);
			setRolloutPercent(editFlag.rolloutPercent);
			setIsEnabled(editFlag.isEnabled);
		} else {
			setKey("");
			setDescription("");
			setCategory("FUNCTIONAL");
			setEnvironments(DEFAULT_ENVS);
			setRolloutPercent(100);
			setIsEnabled(false);
		}
		setKeyError("");
	}, [open, editFlag]);

	const toggleEnv = (env: FeatureFlagEnvironment) => {
		setEnvironments((prev) =>
			prev.includes(env) ? prev.filter((e) => e !== env) : [...prev, env],
		);
	};

	const handleSubmit = () => {
		const keyPattern = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
		if (!keyPattern.test(key)) {
			setKeyError(t("admin.featureFlags.modal.keyHint"));
			return;
		}
		if (environments.length === 0) return;

		const dto: CreateFeatureFlagDto = {
			key,
			description: description.trim() || undefined,
			isEnabled,
			category,
			environments,
			rolloutPercent,
		};
		onSubmit(dto);
	};

	if (!open) return null;

	const inputCls =
		"h-[34px] w-full rounded-[8px] border border-bd-2 bg-bg px-2.5 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc";

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
		>
			<div className="w-[480px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] max-sm:w-full max-sm:max-h-[92vh] max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<h2 className="font-display text-[16px] text-t-1 mb-1">
					{isEdit ? t("admin.featureFlags.modal.editTitle") : t("admin.featureFlags.modal.createTitle")}
				</h2>
				<p className="mb-4 text-[12.5px] text-t-3">
					{isEdit ? t("admin.featureFlags.modal.editSubtitle") : t("admin.featureFlags.modal.createSubtitle")}
				</p>

				{/* Key */}
				<div className="mb-3.5">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.modal.keyLabel")} *
					</label>
					<input
						className={cn(inputCls, keyError && "border-red-400")}
						placeholder="category.feature_name"
						value={key}
						onChange={(e) => { setKey(e.target.value); setKeyError(""); }}
						disabled={isEdit}
					/>
					{keyError ? (
						<p className="mt-1 text-[11px] text-red-t">{keyError}</p>
					) : (
						<p className="mt-1 text-[11px] text-t-3">{t("admin.featureFlags.modal.keyHint")}</p>
					)}
				</div>

				{/* Description */}
				<div className="mb-3.5">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.modal.descLabel")}
					</label>
					<textarea
						className="w-full min-h-[64px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
						placeholder={t("admin.featureFlags.modal.descPlaceholder")}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</div>

				{/* Category + Rollout */}
				<div className="mb-3.5 grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
					<div>
						<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
							{t("admin.featureFlags.modal.categoryLabel")}
						</label>
						<select
							className="h-[34px] w-full cursor-pointer rounded-[8px] border border-bd-2 bg-bg px-2.5 text-[13px] text-t-1 outline-none transition-colors focus:border-acc"
							value={category}
							onChange={(e) => setCategory(e.target.value as FeatureFlagCategory)}
						>
							{CATEGORIES.map((c) => (
								<option key={c} value={c}>{t(`admin.featureFlags.category.${c}`)}</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
							{t("admin.featureFlags.modal.rolloutLabel")}
						</label>
						<input
							type="number"
							min={0}
							max={100}
							className={inputCls}
							value={rolloutPercent}
							onChange={(e) => setRolloutPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
						/>
					</div>
				</div>

				{/* Environments */}
				<div className="mb-3.5">
					<label className="mb-1.5 block text-[11.5px] font-semibold text-t-2">
						{t("admin.featureFlags.modal.envsLabel")}
					</label>
					<div className="flex flex-wrap gap-1.5">
						{ENVIRONMENTS.map((env) => {
							const selected = environments.includes(env);
							return (
								<button
									key={env}
									type="button"
									onClick={() => toggleEnv(env)}
									className={cn(
										"flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-2.5 py-[5px] text-[12px] transition-all select-none",
										selected
											? ENV_SELECTED_STYLES[env]
											: "border-bd-2 bg-bg text-t-2 hover:border-bd-3",
									)}
								>
									<span
										className={cn(
											"size-1.5 shrink-0 rounded-full",
											selected ? ENV_DOT_STYLES[env] : "bg-surf-4",
										)}
									/>
									{env}
								</button>
							);
						})}
					</div>
				</div>

				{/* Enabled toggle */}
				<div className="mb-3.5 flex items-center justify-between rounded-[8px] border border-bd-1 bg-bg px-3 py-2.5">
					<span className="text-[12.5px] text-t-2">{t("admin.featureFlags.modal.enabledLabel")}</span>
					<FlagToggle enabled={isEnabled} onChange={setIsEnabled} />
				</div>

				{/* Footer */}
				<div className="mt-5 flex justify-end gap-2 max-sm:flex-col-reverse">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-[7px] border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px] max-sm:text-[14px]"
					>
						{t("admin.featureFlags.modal.cancel")}
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={isSubmitting || !key || environments.length === 0}
						className="h-8 cursor-pointer rounded-[7px] bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px] max-sm:text-[14px]"
					>
						{isSubmitting
							? t("admin.featureFlags.modal.saving")
							: isEdit
								? t("admin.featureFlags.modal.save")
								: t("admin.featureFlags.modal.create")}
					</button>
				</div>
			</div>
		</div>
	);
};
