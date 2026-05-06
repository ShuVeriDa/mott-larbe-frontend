"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { useAdminTextBulkImport } from "@/entities/admin-text";
import type { BulkImportResultItem, CreateTextDto } from "@/entities/admin-text";

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

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setFileName(file.name);
		setParseError("");
		setModalState("idle");
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
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
			onSuccess: (data) => {
				setResults(data.items);
				setSummary({ total: data.total, created: data.created, failed: data.failed });
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

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
			onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
		>
			<div className="flex w-full max-w-[560px] flex-col rounded-[12px] border border-bd-2 bg-surf shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-bd-1 px-5 py-4">
					<h2 className="text-[14px] font-semibold text-t-1">
						{t("admin.texts.import.title")}
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="flex size-7 cursor-pointer items-center justify-center rounded-[6px] border-none bg-transparent text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
						</svg>
					</button>
				</div>

				{/* Body */}
				<div className="p-5">
					{modalState === "done" ? (
						<div className="flex flex-col gap-4">
							{/* Summary */}
							<div className="flex gap-3 rounded-[8px] border border-bd-1 bg-surf-2 px-4 py-3 text-[12.5px]">
								<span className="text-t-2">
									{t("admin.texts.import.summaryTotal", { count: summary.total })}
								</span>
								<span className="text-grn-t font-medium">
									{t("admin.texts.import.summaryCreated", { count: summary.created })}
								</span>
								{summary.failed > 0 && (
									<span className="text-red-t font-medium">
										{t("admin.texts.import.summaryFailed", { count: summary.failed })}
									</span>
								)}
							</div>

							{/* Per-row results */}
							<div className="max-h-[280px] overflow-y-auto rounded-[8px] border border-bd-1 [&::-webkit-scrollbar]:w-0">
								{results.map((item) => (
									<div
										key={item.index}
										className="flex items-start gap-3 border-b border-bd-1 px-3 py-2.5 last:border-b-0"
									>
										<span className="mt-px shrink-0 text-[10.5px] text-t-4">
											#{item.index + 1}
										</span>
										<span
											className={`mt-px shrink-0 text-[10.5px] font-semibold ${
												item.status === "ok" ? "text-grn-t" : "text-red-t"
											}`}
										>
											{item.status === "ok"
												? t("admin.texts.import.resultOk")
												: t("admin.texts.import.resultError")}
										</span>
										<div className="min-w-0 flex-1">
											<p className="truncate text-[12px] text-t-1">{item.title}</p>
											{item.error && (
												<p className="mt-0.5 text-[11px] text-red-t">{item.error}</p>
											)}
										</div>
									</div>
								))}
							</div>

							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={handleReset}
									className="h-8 cursor-pointer rounded-[7px] border border-bd-2 bg-transparent px-4 text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2"
								>
									{t("admin.texts.import.importMore")}
								</button>
								<button
									type="button"
									onClick={onClose}
									className="h-8 cursor-pointer rounded-[7px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88"
								>
									{t("admin.texts.import.done")}
								</button>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<p className="text-[12.5px] text-t-3">
								{t("admin.texts.import.description")}
							</p>

							{/* File picker */}
							<div
								className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-bd-3 bg-surf-2 px-4 py-8 transition-colors hover:border-acc hover:bg-surf-3"
								onClick={() => fileRef.current?.click()}
								onKeyDown={(e) => { if (e.key === "Enter") fileRef.current?.click(); }}
								role="button"
								tabIndex={0}
							>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-t-3">
									<path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									<path d="M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
								</svg>
								{fileName ? (
									<span className="max-w-[320px] truncate text-[12.5px] font-medium text-t-1">
										{fileName}
									</span>
								) : (
									<span className="text-[12.5px] text-t-3">
										{t("admin.texts.import.chooseFile")}
									</span>
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
								<p className="rounded-[6px] bg-red-bg px-3 py-2 text-[12px] text-red-t">
									{parseError}
								</p>
							)}

							{bulkImport.isError && (
								<p className="rounded-[6px] bg-red-bg px-3 py-2 text-[12px] text-red-t">
									{t("admin.texts.import.serverError")}
								</p>
							)}

							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={onClose}
									className="h-8 cursor-pointer rounded-[7px] border border-bd-2 bg-transparent px-4 text-[12.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2"
								>
									{t("admin.texts.import.cancel")}
								</button>
								<button
									type="submit"
									disabled={!fileName || bulkImport.isPending}
									className="h-8 cursor-pointer rounded-[7px] bg-acc px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-40"
								>
									{bulkImport.isPending
										? t("admin.texts.import.importing")
										: t("admin.texts.import.submit")}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};
