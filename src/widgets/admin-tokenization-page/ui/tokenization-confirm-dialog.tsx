"use client";

import { useI18n } from "@/shared/lib/i18n";

interface TokenizationConfirmDialogProps {
	open: boolean;
	count: number;
	isLoading: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export const TokenizationConfirmDialog = ({
	open,
	count,
	isLoading,
	onConfirm,
	onClose,
}: TokenizationConfirmDialogProps) => {
	const { t } = useI18n();

	if (!open) return null;

	const message = t("admin.tokenization.bulk.resetConfirmMessage").replace(
		"{count}",
		String(count),
	);

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px] max-sm:items-end max-sm:p-0"
			onClick={onClose}
		>
			<div
				className="w-full max-w-[360px] overflow-hidden rounded-[14px] border border-bd-2 bg-surf shadow-md max-sm:rounded-b-none"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="px-5 pb-4 pt-5">
					<p className="text-[14.5px] font-semibold text-t-1">
						{t("admin.tokenization.bulk.resetConfirmTitle")}
					</p>
					<p className="mt-1.5 text-[12.5px] leading-relaxed text-t-3">{message}</p>
				</div>

				<div className="flex gap-2 border-t border-bd-1 px-4 py-3.5">
					<button
						onClick={onClose}
						disabled={isLoading}
						className="flex h-[34px] flex-1 items-center justify-center rounded-base border border-bd-2 text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 disabled:opacity-50"
					>
						{t("admin.tokenization.bulk.resetCancelBtn")}
					</button>
					<button
						onClick={onConfirm}
						disabled={isLoading}
						className="flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-base bg-red-500 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
					>
						{isLoading && (
							<span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
						)}
						{t("admin.tokenization.bulk.resetConfirmBtn")}
					</button>
				</div>
			</div>
		</div>
	);
};
