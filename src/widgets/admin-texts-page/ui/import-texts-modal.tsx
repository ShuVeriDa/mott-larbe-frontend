"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type {
	BulkImportResultItem,
	CreateTextDto,
} from "@/entities/admin-text";
import { useAdminTextBulkImport } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { X, Upload } from "lucide-react";
import { ChangeEvent, ComponentProps, useRef, useState } from "react";
interface ImportTextsModalProps {
	onClose: () => void;
}

type ModalState = "idle" | "parsing-error" | "done";

export const ImportTextsModal = ({ onClose }: ImportTextsModalProps) => {
	const { t } = useI18n();
	const fileRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState("");
	const [parseError, setParseError] = useState("");
	const [modalState, setModalState] = useState<ModalState>("idle");
	const [results, setResults] = useState<BulkImportResultItem[]>([]);
	const [summary, setSummary] = useState({ total: 0, created: 0, failed: 0 });

	const bulkImport = useAdminTextBulkImport();

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.currentTarget.files?.[0];
		if (!file) return;
		setFileName(file.name);
		setParseError("");
		setModalState("idle");
	};

	const handleSubmit = async () => {
		const file = fileRef.current?.files?.[0];
		if (!file) return;

		let items: CreateTextDto[];
		try {
			const text = await file.text();
			const parsed: unknown = JSON.parse(text);
			if (!Array.isArray(parsed)) throw new Error("not-array");
			items = parsed as CreateTextDto[];
		} catch {
			setParseError(t("admin.texts.import.parseError"));
			setModalState("parsing-error");
			return;
		}

		if (items.length === 0) {
			setParseError(t("admin.texts.import.emptyArray"));
			setModalState("parsing-error");
			return;
		}

		bulkImport.mutate(items, {
			onSuccess: data => {
				setResults(data.items);
				setSummary({
					total: data.total,
					created: data.created,
					failed: data.failed,
				});
				setModalState("done");
			},
		});
	};

	const handleReset = () => {
		setFileName("");
		setParseError("");
		setModalState("idle");
		setResults([]);
		if (fileRef.current) fileRef.current.value = "";
	};

		const handleMouseDown: NonNullable<ComponentProps<"div">["onMouseDown"]> = e => {
				if (/* intentional: backdrop-only click */ e.target === e.currentTarget) onClose();
			};
	const handleFilePickerClick: NonNullable<ComponentProps<"div">["onClick"]> = () => fileRef.current?.click();
	const handleKeyDown: NonNullable<ComponentProps<"div">["onKeyDown"]> = e => {
									if (e.key === "Enter") fileRef.current?.click();
								};
return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onMouseDown={handleMouseDown}
		>
			<div className="flex w-full max-w-[560px] flex-col rounded-[12px] border border-bd-2 bg-surf shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-bd-1 px-5 py-4">
					<Typography tag="h2" className="text-[14px] font-semibold text-t-1">
						{t("admin.texts.import.title")}
					</Typography>
					<Button
						onClick={onClose}
						className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<X className="size-[14px]" />
					</Button>
				</div>

				{/* Body */}
				<div className="p-5">
					{modalState === "done" ? (
						<div className="flex flex-col gap-4">
							{/* Summary */}
							<div className="flex gap-3 rounded-[8px] border border-bd-1 bg-surf-2 px-4 py-3 text-[12.5px]">
								<Typography tag="span" className="text-t-2">
									{t("admin.texts.import.summaryTotal", {
										count: summary.total,
									})}
								</Typography>
								<Typography tag="span" className="text-grn-t font-medium">
									{t("admin.texts.import.summaryCreated", {
										count: summary.created,
									})}
								</Typography>
								{summary.failed > 0 && (
									<Typography tag="span" className="text-red-t font-medium">
										{t("admin.texts.import.summaryFailed", {
											count: summary.failed,
										})}
									</Typography>
								)}
							</div>

							{/* Per-row results */}
							<div className="max-h-[280px] overflow-y-auto rounded-[8px] border border-bd-1 [&::-webkit-scrollbar]:w-0">
								{results.map(item => (
									<div
										key={item.index}
										className="flex items-start gap-3 border-b border-bd-1 px-3 py-2.5 last:border-b-0"
									>
										<Typography tag="span" className="mt-px shrink-0 text-[10.5px] text-t-4">
											#{item.index + 1}
										</Typography>
										<Typography tag="span"
											className={`mt-px shrink-0 text-[10.5px] font-semibold ${
												item.status === "ok" ? "text-grn-t" : "text-red-t"
											}`}
										>
											{item.status === "ok"
												? t("admin.texts.import.resultOk")
												: t("admin.texts.import.resultError")}
										</Typography>
										<div className="min-w-0 flex-1">
											<Typography tag="p" className="truncate text-[12px] text-t-1">
												{item.title}
											</Typography>
											{item.error && (
												<Typography tag="p" className="mt-0.5 text-[11px] text-red-t">
													{item.error}
												</Typography>
											)}
										</div>
									</div>
								))}
							</div>

							<div className="flex justify-end gap-2">
								<Button
									onClick={handleReset}
									className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-4 text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2"
								>
									{t("admin.texts.import.importMore")}
								</Button>
								<Button
									onClick={onClose}
									className="h-8 cursor-pointer rounded-base bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88"
								>
									{t("admin.texts.import.done")}
								</Button>
							</div>
						</div>
					) : (
						<form action={handleSubmit} className="flex flex-col gap-4">
							<Typography tag="p" className="text-[12.5px] text-t-3">
								{t("admin.texts.import.description")}
							</Typography>

							{/* File picker */}
							<div
								className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-bd-3 bg-surf-2 px-4 py-8 transition-colors hover:border-acc hover:bg-surf-3"
								onClick={handleFilePickerClick}
								onKeyDown={handleKeyDown}
								role="button"
								tabIndex={0}
							>
								<Upload className="size-6 text-t-3" />
								{fileName ? (
									<Typography tag="span" className="max-w-[320px] truncate text-[12.5px] font-medium text-t-1">
										{fileName}
									</Typography>
								) : (
									<Typography tag="span" className="text-[12.5px] text-t-3">
										{t("admin.texts.import.chooseFile")}
									</Typography>
								)}
								<input
									ref={fileRef}
									type="file"
									accept=".json"
									className="hidden"
									onChange={handleFileChange}
								/>
							</div>

							{parseError && (
								<Typography tag="p" className="rounded-[6px] bg-red-bg px-3 py-2 text-[12px] text-red-t">
									{parseError}
								</Typography>
							)}

							{bulkImport.isError && (
								<Typography tag="p" className="rounded-[6px] bg-red-bg px-3 py-2 text-[12px] text-red-t">
									{t("admin.texts.import.serverError")}
								</Typography>
							)}

							<div className="flex justify-end gap-2">
								<Button
									onClick={onClose}
									className="h-8 cursor-pointer rounded-base border border-bd-2 bg-transparent px-4 text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2"
								>
									{t("admin.texts.import.cancel")}
								</Button>
								<Button
									type="submit"
									disabled={!fileName || bulkImport.isPending}
									className="h-8 cursor-pointer rounded-base bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-40"
								>
									{bulkImport.isPending
										? t("admin.texts.import.importing")
										: t("admin.texts.import.submit")}
								</Button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};
