"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, DragEvent, useRef, useState } from 'react';
import { cn } from "@/shared/lib/cn";
import type { AdminImportResult } from "@/entities/dictionary";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface DictionaryImportModalProps {
	open: boolean;
	isSubmitting: boolean;
	result: AdminImportResult | null;
	onSubmit: (file: File) => void;
	onClose: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

const MAX_SIZE = 10 * 1024 * 1024;

export const DictionaryImportModal = ({
	open,
	isSubmitting,
	result,
	onSubmit,
	onClose,
	t,
}: DictionaryImportModalProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState("");
	const [dragging, setDragging] = useState(false);

	const reset = () => {
		setFile(null);
		setError("");
		setDragging(false);
		if (inputRef.current) inputRef.current.value = "";
	};

	const validate = (f: File): boolean => {
		if (!f.name.endsWith(".json")) {
			setError(t("admin.dictionary.importModal.errorNotJson"));
			return false;
		}
		if (f.size > MAX_SIZE) {
			setError(t("admin.dictionary.importModal.errorTooLarge"));
			return false;
		}
		setError("");
		return true;
	};

	const pick = (f: File) => {
		if (validate(f)) setFile(f);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setDragging(false);
		const f = e.dataTransfer.files[0];
		if (f) pick(f);
	};

	const handleClose = () => {
		if (isSubmitting) return;
		reset();
		onClose();
	};

	const handleDragOver: NonNullable<ComponentProps<"div">["onDragOver"]> = (e) => { e.preventDefault(); setDragging(true); };
	const handleDragLeave: NonNullable<ComponentProps<"div">["onDragLeave"]> = () => setDragging(false);
	const handleDropzoneClick: NonNullable<ComponentProps<"div">["onClick"]> = () => inputRef.current?.click();
	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => {
		const f = e.currentTarget.files?.[0];
		if (f) pick(f);
	};
	const handleImportClick: NonNullable<ComponentProps<"button">["onClick"]> = () => { if (file) onSubmit(file); };

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={t("admin.dictionary.importModal.title")}
			className="max-w-[460px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.dictionary.importModal.subtitle")}
			</Typography>

			{result ? (
				<div className="mb-4 rounded-[10px] border border-bd-1 bg-surf-2 p-4">
					<Typography tag="p" className="mb-2 text-[13px] font-semibold text-t-1">
						{t("admin.dictionary.importModal.done")}
					</Typography>
					<div className="flex gap-4 text-[12.5px]">
						<Typography tag="span" className="text-t-2">
							{t("admin.dictionary.importModal.created")}:{" "}
							<Typography tag="span" className="font-semibold text-acc-t">{result.created}</Typography>
						</Typography>
						<Typography tag="span" className="text-t-2">
							{t("admin.dictionary.importModal.skipped")}:{" "}
							<Typography tag="span" className="font-semibold text-t-1">{result.skipped}</Typography>
						</Typography>
						<Typography tag="span" className="text-t-2">
							{t("admin.dictionary.importModal.total")}:{" "}
							<Typography tag="span" className="font-semibold text-t-1">{result.total}</Typography>
						</Typography>
					</div>
				</div>
			) : (
				<>
					<div
						className={cn(
							"mb-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed px-4 py-8 transition-colors",
							dragging ? "border-acc bg-acc-bg" : "border-bd-2 hover:border-bd-3",
						)}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={handleDropzoneClick}
					>
						<svg className="size-8 text-t-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
							<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
							<polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
							<line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
						</svg>
						{file ? (
							<Typography tag="p" className="text-[13px] font-medium text-t-1">{file.name}</Typography>
						) : (
							<>
								<Typography tag="p" className="text-[13px] font-medium text-t-1">
									{t("admin.dictionary.importModal.dropHere")}
								</Typography>
								<Typography tag="p" className="text-[11.5px] text-t-3">
									{t("admin.dictionary.importModal.orClick")}
								</Typography>
							</>
						)}
						<input
							ref={inputRef}
							type="file"
							accept=".json"
							className="hidden"
							onChange={handleChange}
						/>
					</div>
					{error && (
						<Typography tag="p" className="mb-3 text-[11.5px] text-red-t">{error}</Typography>
					)}
					<Typography tag="p" className="mb-2 text-[11px] text-t-3">
						{t("admin.dictionary.importModal.hint")}
					</Typography>
				</>
			)}

			<ModalActions>
				<Button
					variant="ghost"
					onClick={handleClose}
					disabled={isSubmitting}
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{result ? t("admin.dictionary.importModal.close") : t("admin.dictionary.importModal.cancel")}
				</Button>
				{!result && (
					<Button
						variant="action"
						onClick={handleImportClick}
						disabled={!file || isSubmitting}
						className="h-[34px] flex-1 px-4 rounded-lg text-[13px]"
					>
						{isSubmitting
							? t("admin.dictionary.importModal.importing")
							: t("admin.dictionary.importModal.import")}
					</Button>
				)}
			</ModalActions>
		</Modal>
	);
};
