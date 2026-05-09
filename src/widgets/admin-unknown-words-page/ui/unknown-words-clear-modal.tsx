"use client";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";

interface UnknownWordsClearModalProps {
	open: boolean;
	totalPending: number;
	isPending: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

export const UnknownWordsClearModal = ({
	open,
	totalPending,
	isPending,
	onClose,
	onConfirm,
}: UnknownWordsClearModalProps) => {
	const { t } = useI18n();

	if (!open) return null;

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = e => /* intentional: backdrop-only click */ e.target === e.currentTarget && onClose();
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 p-4 backdrop-blur-sm max-sm:items-end max-sm:p-0"
			onClick={handleClick}
		>
			<div className="w-full max-w-[420px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] animate-[modal-in_0.15s_ease] max-sm:max-w-full max-sm:rounded-t-[18px] max-sm:rounded-b-none">
				{/* Header */}
				<div className="mb-4 flex items-start justify-between">
					<div>
						<div className="font-display text-[15px] text-t-1">
							{t("admin.unknownWords.clearModal.title")}
						</div>
						<div className="mt-0.5 text-[11.5px] text-t-3">
							{t("admin.unknownWords.clearModal.subtitle")}
						</div>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="flex size-7 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-t-3 transition-colors hover:bg-surf-2 hover:text-t-2"
					>
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path
								d="M4 4l8 8M12 4l-8 8"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				</div>

				<p className="text-[13px] leading-[1.65] text-t-2">
					{t("admin.unknownWords.clearModal.body", { count: totalPending })}
				</p>

				<div className="mt-4 flex justify-end gap-2 border-t border-bd-1 pt-3.5 max-sm:flex-col-reverse">
					<button
						type="button"
						onClick={onClose}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-[12px] font-medium text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 max-sm:h-[42px] max-sm:justify-center max-sm:text-[13.5px]"
					>
						{t("admin.unknownWords.clearModal.cancel")}
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isPending}
						className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border-none bg-red px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 max-sm:h-[42px] max-sm:justify-center max-sm:text-[13.5px]"
					>
						<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
							<path
								d="M3 5h10M5 5V4a1 1 0 011-1h4a1 1 0 011 1v1M6 8v4M10 8v4"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
							/>
							<path
								d="M4 5l.7 7.5A1 1 0 005.7 13h4.6a1 1 0 001-.95L12 5"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
							/>
						</svg>
						{t("admin.unknownWords.clearModal.confirm")}
					</button>
				</div>
			</div>
		</div>
	);
};
