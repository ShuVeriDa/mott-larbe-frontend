"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { ImportMorphRulesResult } from "@/entities/morph-rule";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { ChangeEvent, ComponentProps, DragEvent, useRef, useState } from "react";
import { Download } from "lucide-react";

interface Props {
	open: boolean;
	isLoading?: boolean;
	result?: ImportMorphRulesResult | null;
	onSubmit: (file: File, overwrite: boolean) => void;
	onClose: () => void;
}

export const MorphologyImportModal = ({
	open,
	isLoading,
	result,
	onSubmit,
	onClose,
}: Props) => {
	const { t } = useI18n();
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [overwrite, setOverwrite] = useState(false);
	const [dragging, setDragging] = useState(false);

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setDragging(false);
		const f = e.dataTransfer.files[0];
		if (f) setFile(f);
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const f = e.currentTarget.files?.[0];
		if (f) setFile(f);
	};

	const handleSubmit = () => {
		if (!file) return;
		onSubmit(file, overwrite);
	};

	const handleDragOver: NonNullable<ComponentProps<"div">["onDragOver"]> = e => {
		e.preventDefault();
		setDragging(true);
	};
	const handleDragLeave: NonNullable<ComponentProps<"div">["onDragLeave"]> = () => setDragging(false);
	const handleFilePickerClick: NonNullable<ComponentProps<"div">["onClick"]> = () => inputRef.current?.click();
	const handleOverwriteChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setOverwrite(e.currentTarget.checked);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("admin.morphology.importModal.title")}
			className="max-w-[480px]"
		>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3">
				{t("admin.morphology.importModal.subtitle")}
			</Typography>

			{result ? (
				<>
					<div className="mb-4 rounded-[10px] border border-bd-1 bg-surf-2 p-4">
						<div className="mb-3 text-[13px] font-semibold text-t-1">
							{t("admin.morphology.importModal.resultTitle")}
						</div>
						<div className="grid grid-cols-2 gap-2 text-[12px]">
							<div className="flex justify-between">
								<Typography tag="span" className="text-t-3">
									{t("admin.morphology.importModal.created")}
								</Typography>
								<Typography tag="span" className="font-semibold text-grn-t">
									{result.created}
								</Typography>
							</div>
							<div className="flex justify-between">
								<Typography tag="span" className="text-t-3">
									{t("admin.morphology.importModal.updated")}
								</Typography>
								<Typography tag="span" className="font-semibold text-acc-t">
									{result.updated}
								</Typography>
							</div>
							<div className="flex justify-between">
								<Typography tag="span" className="text-t-3">
									{t("admin.morphology.importModal.skipped")}
								</Typography>
								<Typography tag="span" className="font-semibold text-t-2">{result.skipped}</Typography>
							</div>
							<div className="flex justify-between">
								<Typography tag="span" className="text-t-3">
									{t("admin.morphology.importModal.total")}
								</Typography>
								<Typography tag="span" className="font-semibold text-t-1">{result.total}</Typography>
							</div>
						</div>
						{result.errors.length > 0 && (
							<div className="mt-3 rounded-lg bg-red-bg p-2.5 text-[11px] text-red-t">
								{result.errors.slice(0, 5).map((e, i) => (
									<div key={i}>{e}</div>
								))}
								{result.errors.length > 5 && (
									<div className="mt-1 text-t-3">
										+ {result.errors.length - 5}{" "}
										{t("admin.morphology.importModal.moreErrors")}
									</div>
								)}
							</div>
						)}
					</div>
					<ModalActions>
						<Button
							variant="action"
							onClick={onClose}
							className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
						>
							{t("admin.morphology.importModal.close")}
						</Button>
					</ModalActions>
				</>
			) : (
				<form action={handleSubmit} className="flex flex-col gap-3.5">
					<div
						className={cn(
							"cursor-pointer rounded-[9px] border-[1.5px] border-dashed border-bd-2 p-6 text-center transition-colors",
							dragging
								? "border-acc bg-acc-bg"
								: "hover:border-acc hover:bg-acc-bg",
						)}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={handleFilePickerClick}
					>
						<input
							ref={inputRef}
							type="file"
							accept=".csv,.json"
							className="hidden"
							onChange={handleFileChange}
						/>
						<div className="mb-2 text-t-3">
							<Download className="mx-auto size-6" />
						</div>
						{file ? (
							<div className="text-[13px] font-semibold text-t-1">
								{file.name}
							</div>
						) : (
							<>
								<div className="text-[13px] font-semibold text-t-2">
									{t("admin.morphology.importModal.dropTitle")}
								</div>
								<div className="mt-1 text-[11.5px] text-t-3">
									{t("admin.morphology.importModal.dropSub")}
								</div>
							</>
						)}
					</div>

					<Typography tag="label" className="flex cursor-pointer items-center gap-2.5">
						<input
							type="checkbox"
							checked={overwrite}
							onChange={handleOverwriteChange}
							className="accent-acc"
						/>
						<Typography tag="span" className="text-[12.5px] text-t-2">
							{t("admin.morphology.importModal.overwrite")}
						</Typography>
					</Typography>

					<ModalActions>
						<Button
							variant="ghost"
							onClick={onClose}
							className="h-[34px] px-4 rounded-lg text-[13px]"
						>
							{t("admin.morphology.importModal.cancel")}
						</Button>
						<Button
							variant="action"
							type="submit"
							disabled={isLoading || !file}
							className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
						>
							{isLoading ? "…" : t("admin.morphology.importModal.submit")}
						</Button>
					</ModalActions>
				</form>
			)}
		</Modal>
	);
};
