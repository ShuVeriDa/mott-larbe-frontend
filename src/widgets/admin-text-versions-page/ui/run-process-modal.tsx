"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { ProcessTextDto } from "@/entities/admin-text";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Check } from "lucide-react";
import { ComponentProps, useState } from "react";

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
	const [useNormalization, setUseNormalization] = useState(defaultNormalization);
	const [useMorphAnalysis, setUseMorphAnalysis] = useState(defaultMorphAnalysis);

	const handleSubmit = () => {
		onConfirm({ useNormalization, useMorphAnalysis });
	};

	return (
		<Modal
			open
			onClose={onClose}
			title={t("admin.texts.versions.runModal.title")}
			className="max-w-[400px]"
		>
			<form action={handleSubmit}>
				<div className="flex flex-col gap-1 mb-2">
					<CheckboxRow
						label={t("admin.texts.versions.runModal.tokenization")}
						checked={true}
						disabled
						description={t("admin.texts.versions.runModal.tokenizationDesc")}
					/>
					<CheckboxRow
						label={t("admin.texts.versions.runModal.normalization")}
						checked={useNormalization}
						onChange={setUseNormalization}
						description={t("admin.texts.versions.runModal.normalizationDesc")}
					/>
					<CheckboxRow
						label={t("admin.texts.versions.runModal.morphAnalysis")}
						checked={useMorphAnalysis}
						onChange={setUseMorphAnalysis}
						description={t("admin.texts.versions.runModal.morphAnalysisDesc")}
					/>
				</div>

				<ModalActions>
					<Button
						variant="ghost"
						onClick={onClose}
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("admin.texts.versions.runModal.cancel")}
					</Button>
					<Button
						variant="action"
						type="submit"
						disabled={isPending}
						className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
					>
						{isPending && (
							<Typography tag="span" className="inline-block size-3 animate-spin rounded-full border border-white/30 border-t-white" />
						)}
						{isPending
							? t("admin.texts.versions.runModal.running")
							: t("admin.texts.versions.runModal.run")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
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
		<Typography
			tag="label"
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
						<Check className="size-[9px] text-white" />
					)}
				</div>
			</div>
			<div className="flex flex-col gap-0.5">
				<Typography tag="span" className="text-[13px] font-medium text-t-1">{label}</Typography>
				<Typography tag="span" className="text-[11.5px] text-t-3">{description}</Typography>
			</div>
			{!disabled && (
				<input
					type="checkbox"
					className="sr-only"
					checked={checked}
					onChange={handleChange}
				/>
			)}
		</Typography>
	);
};
