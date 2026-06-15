"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { adminTextApi } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { Download } from "lucide-react";
import { ComponentProps, useState } from "react";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useMutation } from "@tanstack/react-query";

type ExportFormat = "json" | "csv";

interface ExportTextModalProps {
	textId: string;
	onClose: () => void;
}

export const ExportTextModal = ({ textId, onClose }: ExportTextModalProps) => {
	const { t } = useI18n();
	const [format, setFormat] = useState<ExportFormat>("json");
	const [error, setError] = useState("");

	const exportMutation = useMutation({
		mutationFn: async () => {
			await adminTextApi.exportTextById(textId, format);
		},
		onSuccess: () => {
			onClose();
		},
		onError: () => {
			setError(t("admin.texts.export.error"));
		},
	});

	const handleExport = () => {
		setError("");
		exportMutation.mutate();
	};

	return (
		<Modal
			open={!!textId}
			onClose={onClose}
			title={t("admin.texts.export.title")}
			className="max-w-[380px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.texts.export.singleDescription")}
			</Typography>

			<div className="mb-3">
				<Typography tag="p" className="mb-2 text-[12px] font-medium text-t-2">
					{t("admin.texts.export.formatLabel")}
				</Typography>
				<div className="flex gap-2">
					{(["json", "csv"] as ExportFormat[]).map((f) => {
						const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setFormat(f);
						return (
							<Button
								key={f}
								type="button"
								onClick={handleClick}
								title={f.toUpperCase()}
								className={`flex h-[34px] flex-1 cursor-pointer items-center justify-center rounded-lg border text-[12.5px] font-medium transition-colors ${
									format === f
										? "border-acc bg-acc/10 text-acc"
										: "border-bd-2 bg-transparent text-t-2 hover:border-bd-3 hover:bg-surf-2"
								}`}
							>
								{f.toUpperCase()}
							</Button>
						);
					})}
				</div>
			</div>

			{error && (
				<Typography tag="p" className="mb-3 rounded-[6px] bg-red-bg px-3 py-2 text-[12px] text-red-t">
					{error}
				</Typography>
			)}

			<ModalActions>
				<Button
					onClick={onClose}
					disabled={exportMutation.isPending}
					title={t("admin.texts.export.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.texts.export.cancel")}
				</Button>
				<Button
					onClick={handleExport}
					disabled={exportMutation.isPending}
					title={exportMutation.isPending ? t("admin.texts.export.exporting") : t("admin.texts.export.submit")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
				>
					<Download className="size-3" />
					{exportMutation.isPending ? t("admin.texts.export.exporting") : t("admin.texts.export.submit")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
