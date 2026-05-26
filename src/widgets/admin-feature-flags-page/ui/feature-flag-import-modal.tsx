"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type {
	ImportFeatureFlagsDto,
	ImportFeatureFlagsResult,
} from "@/entities/feature-flag";
import { cn } from "@/shared/lib/cn";
import { Modal, ModalActions } from "@/shared/ui/modal";
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

	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => {
		setRaw(e.currentTarget.value);
		setParseError("");
		setPreview(null);
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={t("admin.featureFlags.importModal.title")}
			className="max-w-[520px]"
		>
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
							{t("admin.featureFlags.importModal.wouldCreate", { n: preview.wouldCreate ?? 0 })}
						</Typography>
						<Typography tag="span">
							{t("admin.featureFlags.importModal.wouldUpdate", { n: preview.wouldUpdate ?? 0 })}
						</Typography>
						<Typography tag="span">
							{t("admin.featureFlags.importModal.processed", { n: preview.processed })}
						</Typography>
					</div>
				</div>
			)}

			<ModalActions>
				<Button
					variant="ghost"
					onClick={handleClose}
					disabled={isPreviewLoading || isApplying}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.featureFlags.modal.cancel")}
				</Button>
				<Button
					variant="outline"
					onClick={handlePreview}
					disabled={!raw.trim() || isPreviewLoading || isApplying}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{isPreviewLoading
						? t("admin.featureFlags.importModal.previewing")
						: t("admin.featureFlags.importModal.preview")}
				</Button>
				<Button
					variant="action"
					onClick={handleApply}
					disabled={!raw.trim() || isPreviewLoading || isApplying}
					className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
				>
					{isApplying
						? t("admin.featureFlags.importModal.applying")
						: t("admin.featureFlags.importModal.apply")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
