"use client";
import { ComponentProps, useState } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { RunScope, TokenizationStats } from "@/entities/token";

interface TokenizationRunModalProps {
	open: boolean;
	isLoading: boolean;
	stats: TokenizationStats | undefined;
	onClose: () => void;
	onRun: (scope: RunScope) => void;
}

export const TokenizationRunModal = ({
	open,
	isLoading,
	stats,
	onClose,
	onRun,
}: TokenizationRunModalProps) => {
	const { t } = useI18n();
	const [scope, setScope] = useState<RunScope>("pending");

	if (!open) return null;

	const options: { value: RunScope; labelKey: string; subKey: string; count: number | undefined }[] =
		[
			{
				value: "pending",
				labelKey: "admin.tokenization.runModal.pending",
				subKey: "admin.tokenization.runModal.pendingSub",
				count: stats?.tabs.pending,
			},
			{
				value: "errors",
				labelKey: "admin.tokenization.runModal.errors",
				subKey: "admin.tokenization.runModal.errorsSub",
				count: stats?.tabs.issues,
			},
			{
				value: "all",
				labelKey: "admin.tokenization.runModal.all",
				subKey: "admin.tokenization.runModal.allSub",
				count: stats?.tabs.all,
			},
		];

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => e.stopPropagation();
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onRun(scope);
return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] max-sm:items-end max-sm:p-0"
			onClick={onClose}
		>
			<div
				className="w-full max-w-[400px] overflow-hidden rounded-[14px] border border-bd-2 bg-surf shadow-md max-sm:rounded-b-none"
				onClick={handleClick}
			>
				<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
					<span className="font-display text-[15px] text-t-1">
						{t("admin.tokenization.runModal.title")}
					</span>
					<button
						onClick={onClose}
						className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path
								d="M4 4l8 8M12 4l-8 8"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				<div className="p-4">
					<p className="mb-3.5 text-[12px] text-t-3">
						{t("admin.tokenization.runModal.subtitle")}
					</p>
					<div className="flex flex-col gap-2">
						{options.map((opt) => {
						  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = () => setScope(opt.value);
						  return (
							<label
								key={opt.value}
								className={cn(
									"flex cursor-pointer items-start gap-2.5 rounded-[9px] border p-3 transition-colors",
									scope === opt.value
										? "border-acc bg-acc-bg"
										: "border-bd-2 hover:border-bd-3 hover:bg-surf-2",
								)}
							>
								<input
									type="radio"
									name="scope"
									value={opt.value}
									checked={scope === opt.value}
									onChange={handleChange}
									className="mt-0.5 size-[15px] shrink-0 accent-acc"
								/>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-2">
										<span className="text-[12.5px] font-medium text-t-1">
											{t(opt.labelKey)}
										</span>
										{opt.count !== undefined && (
											<span className="shrink-0 rounded-full bg-surf-3 px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums text-t-2">
												{opt.count}
											</span>
										)}
									</div>
									<div className="mt-0.5 text-[11px] text-t-3">{t(opt.subKey)}</div>
								</div>
							</label>
						);
						})}
					</div>
				</div>

				<div className="flex gap-2 border-t border-bd-1 px-4 py-3.5">
					<button
						onClick={onClose}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base border border-bd-2 text-[12.5px] text-t-2 transition-colors hover:bg-surf-2"
					>
						{t("admin.tokenization.runModal.cancelBtn")}
					</button>
					<button
						onClick={handleClick2}
						disabled={isLoading}
						className="flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-base bg-acc text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{isLoading ? (
							<span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
						) : (
							<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
								<path d="M5 3l8 5-8 5V3z" fill="currentColor" />
							</svg>
						)}
						{t("admin.tokenization.runModal.runBtn")}
					</button>
				</div>
			</div>
		</div>
	);
};
