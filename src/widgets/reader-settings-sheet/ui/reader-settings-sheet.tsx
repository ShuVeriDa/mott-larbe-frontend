"use client";

import { Typography } from "@/shared/ui/typography";
import { useEffect } from 'react';
import { createPortal } from "react-dom";
import { FontSizeGroup } from "@/features/reader-font-size";
import { useI18n } from "@/shared/lib/i18n";

const LEGEND = [
	{ key: "KNOWN", color: "var(--grn)" },
	{ key: "LEARNING", color: "var(--amb)" },
	{ key: "NEW", color: "var(--t-4)" },
] as const;

export interface ReaderSettingsSheetProps {
	open: boolean;
	onClose: () => void;
}

export const ReaderSettingsSheet = ({
	open,
	onClose,
}: ReaderSettingsSheetProps) => {
	const { t } = useI18n();

	useEffect(() => {
		if (!open) return;
		const onKey = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<>
			<div
				className="fixed inset-0 z-[175] bg-black/40"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("reader.settings.title")}
				className="fixed inset-x-0 bottom-0 z-[185] flex max-h-[70vh] flex-col rounded-t-2xl border-t border-hairline border-bd-2 bg-surf shadow-lg animate-[fadeUp_0.22s_ease]"
			>
				<div className="flex justify-center pt-2.5 pb-1.5">
					<div className="h-1 w-9 rounded-full bg-surf-4" />
				</div>
				<div className="border-b border-hairline border-bd-1 px-4 pb-3.5">
					<div className="text-[12px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("reader.settings.title")}
					</div>
				</div>
				<div className="overflow-y-auto p-4">
					<div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("reader.settings.size")}
					</div>
					<FontSizeGroup
						className="mb-5 grid grid-cols-3 gap-2"
						buttonClassName="h-10 w-full text-[14px]"
					/>
					<div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
						{t("reader.settings.legend")}
					</div>
					<div className="flex flex-col gap-2">
						{LEGEND.map((item) => (
							<div
								key={item.key}
								className="flex items-center gap-2.5 text-[13px] text-t-2"
							>
								<Typography tag="span"
									aria-hidden="true"
									className="block h-0.5 w-5 rounded-[1px]"
									style={{ background: item.color }}
								/>
								{t(`reader.learnStatus.${item.key}`)}
							</div>
						))}
					</div>
				</div>
			</div>
		</>,
		document.body,
	);
};
