"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type {
	ImportFeatureFlagsDto,
	ImportFeatureFlagsResult,
} from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";
import { ComponentProps, useState } from 'react';
interface FeatureFlagImportModalProps {
	open: boolean;
	onSubmit: (dto: ImportFeatureFlagsDto) => Promise<ImportFeatureFlagsResult>;
	onClose: () => void;
	t: (key: string, params?: Record<string, string | number>) => string;
}

export const FeatureFlagImportModal = ({
	open,
	onSubmit,
	onClose,
	t,
}: FeatureFlagImportModalProps) => {
	const [raw, setRaw] = useState("");
	const [parseError, setParseError] = useState("");
	const [preview, setPreview] = useState<ImportFeatureFlagsResult | null>(null);
	const [isPreviewLoading, setIsPreviewLoading] = useState(false);
	const [isApplying, setIsApplying] = useState(false);

	if (!open) return null;

	const parseDto = (): ImportFeatureFlagsDto | null => {
		try {
			const parsed: unknown = JSON.parse(raw);
			if (Array.isArray(parsed))
				return { items: parsed, mode: "upsert", dryRun: false };
			return parsed as ImportFeatureFlagsDto;
		} catch {
			setParseError(t("admin.featureFlags.importModal.parseError"));
			return null;
		}
	};

	const handlePreview = async () => {
		setParseError("");
		setPreview(null);
		const dto = parseDto();
		if (!dto) return;
		setIsPreviewLoading(true);
		try {
			const result = await onSubmit({ ...dto, dryRun: true });
			setPreview(result);
		} finally {
			setIsPreviewLoading(false);
		}
	};

	const handleApply = async () => {
		setParseError("");
		const dto = parseDto();
		if (!dto) return;
		setIsApplying(true);
		try {
			await onSubmit({ ...dto, dryRun: false });
			onClose();
		} finally {
			setIsApplying(false);
		}
	};

	const handleClose = () => {
		setRaw("");
		setParseError("");
		setPreview(null);
		onClose();
	};

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => {
				if (/* intentional: backdrop-only click */ e.target === e.currentTarget) handleClose();
			};
	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => {
						setRaw(e.currentTarget.value);
						setParseError("");
						setPreview(null);
					};
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleClick}
		>
			<div className="w-[520px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:max-h-[92vh] max-sm:overflow-y-auto max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:pb-8">
				<Typography tag="h2" className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.featureFlags.importModal.title")}
				</Typography>
				<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
					{t("admin.featureFlags.importModal.subtitle")}
				</Typography>

				<textarea
					className={cn(
						"w-full min-h-[160px] resize-y rounded-[8px] border border-bd-2 bg-bg px-2.5 py-2 font-mono text-[12px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc",
						parseError && "border-red-400",
					)}
					placeholder={t("admin.featureFlags.importModal.placeholder")}
					value={raw}
					onChange={handleChange}
				/>
				{parseError && (
					<Typography tag="p" className="mt-1 text-[11px] text-red-t">{parseError}</Typography>
				)}

				{preview && (
					<div className="mt-3 rounded-[8px] border border-bd-1 bg-surf-2 px-3 py-2.5 text-[12px]">
						<Typography tag="p" className="mb-1 font-semibold text-t-2">
							{t("admin.featureFlags.importModal.previewTitle")}
						</Typography>
						<div className="flex flex-wrap gap-3 text-t-3">
							<Typography tag="span">
								{t("admin.featureFlags.importModal.wouldCreate", {
									n: preview.wouldCreate ?? 0,
								})}
							</Typography>
							<Typography tag="span">
								{t("admin.featureFlags.importModal.wouldUpdate", {
									n: preview.wouldUpdate ?? 0,
								})}
							</Typography>
							<Typography tag="span">
								{t("admin.featureFlags.importModal.processed", {
									n: preview.processed,
								})}
							</Typography>
						</div>
					</div>
				)}

				<div className="mt-5 flex items-center justify-end gap-2 max-sm:flex-col-reverse">
					<Button
						onClick={handleClose}
						disabled={isPreviewLoading || isApplying}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10 max-sm:w-full"
					>
						{t("admin.featureFlags.modal.cancel")}
					</Button>
					<Button
						onClick={handlePreview}
						disabled={!raw.trim() || isPreviewLoading || isApplying}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-surf px-3.5 text-[12.5px] text-t-1 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10 max-sm:w-full"
					>
						{isPreviewLoading
							? t("admin.featureFlags.importModal.previewing")
							: t("admin.featureFlags.importModal.preview")}
					</Button>
					<Button
						onClick={handleApply}
						disabled={!raw.trim() || isPreviewLoading || isApplying}
						className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10 max-sm:w-full"
					>
						{isApplying
							? t("admin.featureFlags.importModal.applying")
							: t("admin.featureFlags.importModal.apply")}
					</Button>
				</div>
			</div>
		</div>
	);
};
