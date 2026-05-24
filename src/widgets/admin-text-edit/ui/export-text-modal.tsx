"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { adminTextApi } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { X, Download } from "lucide-react";
import { ComponentProps, useState } from "react";

type ExportFormat = "json" | "csv";

interface ExportTextModalProps {
	textId: string;
	onClose: () => void;
}

export const ExportTextModal = ({ textId, onClose }: ExportTextModalProps) => {
	const { t } = useI18n();
	const [format, setFormat] = useState<ExportFormat>("json");
	const [isExporting, setIsExporting] = useState(false);
	const [error, setError] = useState("");

	const handleExport = async () => {
		setIsExporting(true);
		setError("");
		try {
			await adminTextApi.exportTextById(textId, format);
			onClose();
		} catch {
			setError(t("admin.texts.export.error"));
		} finally {
			setIsExporting(false);
		}
	};

	const handleBackdropMouseDown: NonNullable<ComponentProps<"div">["onMouseDown"]> = (e) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onMouseDown={handleBackdropMouseDown}
		>
			<div className="flex w-full max-w-[380px] flex-col rounded-[12px] border border-bd-2 bg-surf shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-bd-1 px-5 py-4">
					<Typography tag="h2" className="text-[14px] font-semibold text-t-1">
						{t("admin.texts.export.title")}
					</Typography>
					<Button
						onClick={onClose}
						title={t("admin.texts.export.cancel")}
						className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<X className="size-[14px]" />
					</Button>
				</div>

				{/* Body */}
				<div className="flex flex-col gap-4 p-5">
					<Typography tag="p" className="text-[12.5px] text-t-3">
						{t("admin.texts.export.singleDescription")}
					</Typography>

					<div className="flex flex-col gap-2">
						<Typography tag="p" className="text-[12px] font-medium text-t-2">
							{t("admin.texts.export.formatLabel")}
						</Typography>
						<div className="flex gap-2">
							{(["json", "csv"] as ExportFormat[]).map((f) => (
								<Button
									key={f}
									type="button"
									onClick={() => setFormat(f)}
									title={f.toUpperCase()}
									className={`flex h-8 flex-1 cursor-pointer items-center justify-center rounded-[7px] border text-[12.5px] font-medium transition-colors ${
										format === f
											? "border-acc bg-acc/10 text-acc"
											: "border-bd-2 bg-transparent text-t-2 hover:border-bd-3 hover:bg-surf-2"
									}`}
								>
									{f.toUpperCase()}
								</Button>
							))}
						</div>
					</div>

					{error && (
						<Typography tag="p" className="rounded-[6px] bg-red-bg px-3 py-2 text-[12px] text-red-t">
							{error}
						</Typography>
					)}
				</div>

				{/* Footer */}
				<div className="flex justify-end gap-2 border-t border-bd-1 px-5 py-4">
					<Button
						onClick={onClose}
						disabled={isExporting}
						title={t("admin.texts.export.cancel")}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-4 text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50"
					>
						{t("admin.texts.export.cancel")}
					</Button>
					<Button
						onClick={handleExport}
						disabled={isExporting}
						title={isExporting ? t("admin.texts.export.exporting") : t("admin.texts.export.submit")}
						className="flex h-8 cursor-pointer items-center gap-1.5 rounded-base bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-40"
					>
						<Download className="size-3" />
						{isExporting ? t("admin.texts.export.exporting") : t("admin.texts.export.submit")}
					</Button>
				</div>
			</div>
		</div>
	);
};
