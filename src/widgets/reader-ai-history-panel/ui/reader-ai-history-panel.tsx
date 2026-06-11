"use client";

import { useAiSessionStore } from "@/features/ai-word-lookup";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerTitle,
} from "@/shared/ui/drawer";
import { Typography } from "@/shared/ui/typography";
import { MessageSquare, Sparkles, X } from "lucide-react";
import { useEffect } from "react";
import { useMediaQuery } from "@/shared/lib/media-query";

export interface ReaderAiHistoryPanelProps {
	open: boolean;
	onClose: () => void;
}

const AiHistoryPanelBody = () => {
	const { t } = useI18n();
	const entries = useAiSessionStore(s => s.entries);

	if (entries.length === 0) {
		return (
			<div className="flex flex-col items-center gap-2 py-8 text-center">
				<Sparkles className="size-8 text-t-4" strokeWidth={1.2} />
				<Typography className="text-[13px] text-t-3">
					{t("aiTranslation.history.empty")}
				</Typography>
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-2">
			{entries.map(entry => (
				<div
					key={entry.word}
					className="rounded-[8px] border border-[0.5px] border-bd-1 bg-surf-2 px-3 py-2.5"
				>
					<div className="mb-1 flex items-start justify-between gap-2">
						<div className="text-[14px] font-semibold text-t-1">
							{entry.word}
						</div>
						<span
							className={cn(
								"mt-0.5 shrink-0 rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.4px]",
								entry.translation.status === "APPROVED"
									? "bg-grn/15 text-grn border-[0.5px] border-grn/30"
									: "bg-pur/10 text-pur-t border-[0.5px] border-pur/30",
							)}
						>
							{entry.translation.status === "APPROVED"
								? t("aiTranslation.history.statusApproved")
								: t("aiTranslation.history.statusPending")}
						</span>
					</div>
					<div className="text-[13px] text-t-2">
						{entry.translation.translation}
					</div>
					{entry.translation.partOfSpeech && (
						<div className="mt-0.5 text-[11px] text-t-3">
							{t("aiTranslation.popup.partOfSpeech")}:{" "}
							{entry.translation.partOfSpeech}
						</div>
					)}
					{entry.refinedTranslation && (
						<div className="mt-1.5 rounded-[6px] border border-[0.5px] border-pur/20 bg-pur-bg/50 px-2 py-1.5">
							<div className="mb-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.4px] text-pur-t">
								<MessageSquare className="size-2.5" strokeWidth={1.8} />
								{t("aiTranslation.history.refined")}
							</div>
							<div className="text-[12px] font-medium text-t-1">
								{entry.refinedTranslation}
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

const AiHistoryPanelHeader = ({ onClose }: { onClose: () => void }) => {
	const { t } = useI18n();
	return (
		<div className="flex shrink-0 items-center justify-between border-b-[0.5px] border-bd-1 px-3.5 py-2.5">
			<Typography
				tag="span"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("aiTranslation.history.title")}
			</Typography>
			<Button
				onClick={onClose}
				aria-label={t("reader.panel.close")}
				title={t("reader.panel.close")}
				className="inline-flex size-6 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-3" strokeWidth={1.6} />
			</Button>
		</div>
	);
};

export const ReaderAiHistoryAside = ({
	open,
	onClose,
}: ReaderAiHistoryPanelProps) => {
	useEffect(() => {
		if (!open) return;
		const handle = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handle);
		return () => document.removeEventListener("keydown", handle);
	}, [open, onClose]);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-[0.5px] transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<AiHistoryPanelHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<AiHistoryPanelBody />
			</div>
		</aside>
	);
};

export const ReaderAiHistorySheet = ({
	open,
	onClose,
}: ReaderAiHistoryPanelProps) => {
	const { t } = useI18n();
	const isMobile = !useMediaQuery("(min-width: 768px)");
	const handleOpenChange = (isOpen: boolean) => { if (!isOpen) onClose(); };

	return (
		<Drawer open={open && isMobile} onOpenChange={handleOpenChange}>
			<DrawerContent className="max-h-[90dvh]" aria-describedby={undefined}>
				<DrawerTitle className="sr-only">{t("aiTranslation.history.title")}</DrawerTitle>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<AiHistoryPanelBody />
				</div>
			</DrawerContent>
		</Drawer>
	);
};
