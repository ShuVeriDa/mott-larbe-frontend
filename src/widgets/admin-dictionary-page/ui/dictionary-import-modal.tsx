"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { AdminImportResult } from "@/entities/dictionary";

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

	const reset = useCallback(() => {
		setFile(null);
		setError("");
		setDragging(false);
		if (inputRef.current) inputRef.current.value = "";
	}, []);

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

	const handleDrop = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setDragging(false);
		const f = e.dataTransfer.files[0];
		if (f) pick(f);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleClose = () => {
		if (isSubmitting) return;
		reset();
		onClose();
	};

	if (!open) return null;

		const handleClick: NonNullable<React.ComponentProps<"div">["onClick"]> = (e) => { if (e.target === e.currentTarget) handleClose(); };
	const handleDragOver: NonNullable<React.ComponentProps<"div">["onDragOver"]> = (e) => { e.preventDefault(); setDragging(true); };
	const handleDragLeave: NonNullable<React.ComponentProps<"div">["onDragLeave"]> = () => setDragging(false);
	const handleClick2: NonNullable<React.ComponentProps<"div">["onClick"]> = () => inputRef.current?.click();
	const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => {
									const f = e.target.files?.[0];
									if (f) pick(f);
								};
	const handleClick3: NonNullable<React.ComponentProps<"button">["onClick"]> = () => { if (file) onSubmit(file); };
return (
		<div
			className="fixed inset-0 z-200 flex items-center justify-center bg-black/30 backdrop-blur-[3px] max-sm:items-end"
			onClick={handleClick}
		>
			<div className="w-[460px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] max-sm:w-full max-sm:rounded-b-none max-sm:rounded-t-[18px] max-sm:px-4.5 max-sm:pb-8">
				<h2 className="font-display text-[16px] text-t-1 mb-1">
					{t("admin.dictionary.importModal.title")}
				</h2>
				<p className="mb-4 text-[12.5px] text-t-3">
					{t("admin.dictionary.importModal.subtitle")}
				</p>

				{result ? (
					<div className="mb-4 rounded-[10px] border border-bd-1 bg-surf-2 p-4">
						<p className="mb-2 text-[13px] font-semibold text-t-1">
							{t("admin.dictionary.importModal.done")}
						</p>
						<div className="flex gap-4 text-[12.5px]">
							<span className="text-t-2">
								{t("admin.dictionary.importModal.created")}:{" "}
								<span className="font-semibold text-acc-t">{result.created}</span>
							</span>
							<span className="text-t-2">
								{t("admin.dictionary.importModal.skipped")}:{" "}
								<span className="font-semibold text-t-1">{result.skipped}</span>
							</span>
							<span className="text-t-2">
								{t("admin.dictionary.importModal.total")}:{" "}
								<span className="font-semibold text-t-1">{result.total}</span>
							</span>
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
							onClick={handleClick2}
						>
							<svg className="size-8 text-t-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
								<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
								<polyline points="17 8 12 3 7 8" strokeLinecap="round" strokeLinejoin="round" />
								<line x1="12" y1="3" x2="12" y2="15" strokeLinecap="round" />
							</svg>
							{file ? (
								<p className="text-[13px] font-medium text-t-1">{file.name}</p>
							) : (
								<>
									<p className="text-[13px] font-medium text-t-1">
										{t("admin.dictionary.importModal.dropHere")}
									</p>
									<p className="text-[11.5px] text-t-3">
										{t("admin.dictionary.importModal.orClick")}
									</p>
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
							<p className="mb-3 text-[11.5px] text-red-t">{error}</p>
						)}
						<p className="mb-4 text-[11px] text-t-3">
							{t("admin.dictionary.importModal.hint")}
						</p>
					</>
				)}

				<div className="flex justify-end gap-2 max-sm:flex-col-reverse">
					<button
						type="button"
						onClick={handleClose}
						disabled={isSubmitting}
						className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-3.5 text-[12.5px] text-t-2 transition-all hover:border-bd-3 hover:bg-surf-2 disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px]"
					>
						{result ? t("admin.dictionary.importModal.close") : t("admin.dictionary.importModal.cancel")}
					</button>
					{!result && (
						<button
							type="button"
							onClick={handleClick3}
							disabled={!file || isSubmitting}
							className="h-8 cursor-pointer rounded-base bg-acc px-3.5 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-[.88] disabled:opacity-50 max-sm:h-10 max-sm:rounded-[9px]"
						>
							{isSubmitting
								? t("admin.dictionary.importModal.importing")
								: t("admin.dictionary.importModal.import")}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
