"use client";

import type { ProcessTextDto } from "@/entities/admin-text";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, FormEvent, useState } from 'react';
interface RunProcessModalProps {
	defaultNormalization: boolean;
	defaultMorphAnalysis: boolean;
	isPending: boolean;
	onConfirm: (dto: ProcessTextDto) => void;
	onClose: () => void;
}

export const RunProcessModal = ({
	defaultNormalization,
	defaultMorphAnalysis,
	isPending,
	onConfirm,
	onClose,
}: RunProcessModalProps) => {
	const { t } = useI18n();
	const [useNormalization, setUseNormalization] =
		useState(defaultNormalization);
	const [useMorphAnalysis, setUseMorphAnalysis] =
		useState(defaultMorphAnalysis);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onConfirm({ useNormalization, useMorphAnalysis });
	};

	return (
		<>
			<div
				className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div
				role="dialog"
				aria-modal="true"
				className="fixed inset-0 z-50 flex items-center justify-center p-5 max-sm:items-end max-sm:p-0"
			>
				<div className="w-[400px] max-w-full overflow-hidden rounded-[14px] border border-bd-2 bg-surf shadow-lg max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[16px]">
					<div className="flex items-center justify-between border-b border-bd-1 px-4.5 py-3.5">
						<span className="font-display text-[15px] text-t-1">
							{t("admin.texts.versions.runModal.title")}
						</span>
						<button
							type="button"
							onClick={onClose}
							className="flex size-[26px] cursor-pointer items-center justify-center rounded-[6px] border-none bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
						>
							<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
								<path
									d="M3 3l10 10M13 3L3 13"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
								/>
							</svg>
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="flex flex-col gap-1 px-4.5 py-4">
							<CheckboxRow
								label={t("admin.texts.versions.runModal.tokenization")}
								checked={true}
								disabled
								description={t(
									"admin.texts.versions.runModal.tokenizationDesc",
								)}
							/>
							<CheckboxRow
								label={t("admin.texts.versions.runModal.normalization")}
								checked={useNormalization}
								onChange={setUseNormalization}
								description={t(
									"admin.texts.versions.runModal.normalizationDesc",
								)}
							/>
							<CheckboxRow
								label={t("admin.texts.versions.runModal.morphAnalysis")}
								checked={useMorphAnalysis}
								onChange={setUseMorphAnalysis}
								description={t(
									"admin.texts.versions.runModal.morphAnalysisDesc",
								)}
							/>
						</div>

						<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
							<button
								type="button"
								onClick={onClose}
								className="flex h-[30px] items-center rounded-base border border-bd-2 bg-transparent px-3 text-[12px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
							>
								{t("admin.texts.versions.runModal.cancel")}
							</button>
							<button
								type="submit"
								disabled={isPending}
								className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-60"
							>
								{isPending && (
									<span className="inline-block size-3 animate-spin rounded-full border border-white/30 border-t-white" />
								)}
								{isPending
									? t("admin.texts.versions.runModal.running")
									: t("admin.texts.versions.runModal.run")}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

interface CheckboxRowProps {
	label: string;
	description: string;
	checked: boolean;
	disabled?: boolean;
	onChange?: (v: boolean) => void;
}

const CheckboxRow = ({
	label,
	description,
	checked,
	disabled,
	onChange,
}: CheckboxRowProps) => {
  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => onChange?.(e.currentTarget.checked);
  return (
	<label
		className={cn(
			"flex cursor-pointer items-start gap-3 rounded-[10px] border border-bd-1 bg-surf-2 px-3.5 py-3 transition-colors",
			disabled && "cursor-default opacity-60",
			!disabled && "hover:border-bd-2 hover:bg-surf-3",
		)}
	>
		<div className="mt-0.5 shrink-0">
			<div
				className={cn(
					"flex size-4 items-center justify-center rounded-[4px] border transition-colors",
					checked ? "border-acc bg-acc" : "border-bd-2 bg-surf",
				)}
			>
				{checked && (
					<svg width="9" height="9" viewBox="0 0 12 12" fill="none">
						<path
							d="M2 6l3 3 5-5"
							stroke="white"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				)}
			</div>
		</div>
		<div className="flex flex-col gap-0.5">
			<span className="text-[13px] font-medium text-t-1">{label}</span>
			<span className="text-[11.5px] text-t-3">{description}</span>
		</div>
		{!disabled && (
			<input
				type="checkbox"
				className="sr-only"
				checked={checked}
				onChange={handleChange}
			/>
		)}
	</label>
);
};
