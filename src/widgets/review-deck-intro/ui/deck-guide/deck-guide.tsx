"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { READER_MOBILE_SHEET_OVERLAY_CLASSES } from "@/shared/ui/reader-mobile-sheet-header";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { BookOpenIcon, X } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";

export const DeckGuide = () => {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Button
				variant="outline"
				onClick={handleOpen}
				className="h-7 gap-1.5 border-bd-3 bg-surf-2 px-2.5 text-[12px] text-t-1 hover:bg-surf-3 hover:text-t-1"
			>
				<BookOpenIcon className="size-3.5 text-t-2" />
				<span className="max-sm:hidden">{t("review.deck.guide.openBtn")}</span>
			</Button>

			{/* Desktop: fixed right aside with width transition */}
			{open && typeof window !== "undefined"
				? createPortal(
						<div
							role="presentation"
							className="fixed inset-0 z-40 hidden md:block"
							onClick={handleClose}
						/>,
						document.body,
					)
				: null}
			<aside
				aria-hidden={!open}
				className={cn(
					"fixed right-0 top-0 z-50 flex h-dvh shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
					"border-l border-[0.5px] transition-[width,border-color] duration-200",
					open ? "w-[420px] border-bd-1" : "w-0 border-l-transparent",
				)}
			>
				<GuideHeader
					title={t("review.deck.guide.title")}
					onClose={handleClose}
				/>
				<ScrollArea className="flex min-h-0 flex-1 overflow-y-auto">
					<GuideBody />
				</ScrollArea>
			</aside>

			{/* Mobile: portal bottom sheet */}
			<DeckGuideMobileSheet open={open} onClose={handleClose} />
		</>
	);
};

interface GuideHeaderProps {
	title: string;
	onClose: () => void;
}

const GuideHeader = ({ title, onClose }: GuideHeaderProps) => {
	const { t } = useI18n();
	const handleClose = () => onClose();

	return (
		<div className="flex shrink-0 items-center justify-between border-b-[0.5px] border-bd-1 px-5 py-3.5">
			<div className="flex items-center gap-2">
				<BookOpenIcon className="size-4 shrink-0 text-t-3" />
				<span className="text-[13px] font-semibold text-t-1">{title}</span>
			</div>
			<Button
				variant="bare"
				size={null}
				onClick={handleClose}
				aria-label={t("reader.panel.close")}
				className="flex size-7 items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-4" />
			</Button>
		</div>
	);
};

interface DeckGuideMobileSheetProps {
	open: boolean;
	onClose: () => void;
}

const DeckGuideMobileSheet = ({ open, onClose }: DeckGuideMobileSheetProps) => {
	const { t } = useI18n();

	const handleBackdropClick = () => onClose();
	const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
	};

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="presentation"
			className={READER_MOBILE_SHEET_OVERLAY_CLASSES}
			onClick={handleBackdropClick}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("review.deck.guide.title")}
				className="flex max-h-[88dvh] min-h-0 w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
				onClick={handleSheetClick}
			>
				<GuideHeader title={t("review.deck.guide.title")} onClose={onClose} />
				<ScrollArea className="min-h-0 flex-1 overflow-y-auto">
					<GuideBody />
				</ScrollArea>
			</div>
		</div>,
		document.body,
	);
};

const resolvePath = (obj: unknown, path: string): unknown => {
	const parts = path.split(".");
	let cur: unknown = obj;
	for (const part of parts) {
		if (cur && typeof cur === "object" && part in cur) {
			cur = (cur as Record<string, unknown>)[part];
		} else {
			return undefined;
		}
	}
	return cur;
};

const GuideBody = () => {
	const { t, dict } = useI18n();

	const how = resolvePath(dict, "review.deck.guide.how") as Array<{
		icon: string;
		name: string;
		desc: string;
	}>;
	const tips = resolvePath(dict, "review.deck.guide.tips") as string[];
	const rating = resolvePath(dict, "review.deck.guide.rating") as Array<{
		label: string;
		desc: string;
	}>;
	const settings = resolvePath(dict, "review.deck.guide.settings") as Array<{
		label: string;
		desc: string;
	}>;

	return (
		<div className="flex flex-col gap-7 px-6 py-6">
			{/* Intro */}
			<p className="text-[13.5px] leading-[1.7] text-t-2">
				{t("review.deck.guide.intro")}
			</p>

			{/* Why it works */}
			<GuideSection title={t("review.deck.guide.whyTitle")}>
				<div className="rounded-card border-[0.5px] border-acc/20 bg-acc-bg px-4 py-3">
					<p className="text-[13px] leading-[1.7] text-t-2">
						{t("review.deck.guide.why")}
					</p>
				</div>
			</GuideSection>

			{/* Word path */}
			<GuideSection title={t("review.deck.guide.howTitle")}>
				<ol className="flex flex-col gap-0">
					{Array.isArray(how) &&
						how.map((step, i) => (
							<PathStep
								key={step.name}
								icon={step.icon}
								name={step.name}
								desc={step.desc}
								isLast={i === how.length - 1}
							/>
						))}
				</ol>
			</GuideSection>

			{/* Rating */}
			<GuideSection title={t("review.deck.guide.ratingTitle")}>
				<div className="flex flex-col gap-2">
					{Array.isArray(rating) &&
						rating.map(r => (
							<div
								key={r.label}
								className="flex items-start gap-3 rounded-base border-[0.5px] border-bd-2 bg-surf px-3.5 py-2.5"
							>
								<span className="mt-px shrink-0 rounded-[4px] bg-surf-2 px-1.5 py-0.5 text-[11px] font-semibold text-t-1">
									{r.label}
								</span>
								<span className="text-[12.5px] leading-[1.6] text-t-3">
									{r.desc}
								</span>
							</div>
						))}
				</div>
			</GuideSection>

			{/* Tips */}
			<GuideSection title={t("review.deck.guide.tipsTitle")}>
				<ul className="flex flex-col gap-2.5">
					{Array.isArray(tips) &&
						tips.map((tip, i) => (
							<li key={i} className="flex items-start gap-2.5">
								<span className="mt-[3px] flex size-[18px] shrink-0 items-center justify-center rounded-full bg-acc text-[9px] font-bold text-white">
									{i + 1}
								</span>
								<span className="text-[13px] leading-[1.6] text-t-2">
									{tip}
								</span>
							</li>
						))}
				</ul>
			</GuideSection>

			{/* Settings */}
			<GuideSection title={t("review.deck.guide.settingsTitle")}>
				<div className="flex flex-col gap-3">
					{Array.isArray(settings) &&
						settings.map(s => (
							<div key={s.label}>
								<div className="text-[12.5px] font-semibold text-t-1">
									{s.label}
								</div>
								<div className="mt-0.5 text-[12px] leading-[1.6] text-t-3">
									{s.desc}
								</div>
							</div>
						))}
				</div>
			</GuideSection>
		</div>
	);
};

interface GuideSectionProps {
	title: string;
	children: React.ReactNode;
}

const GuideSection = ({ title, children }: GuideSectionProps) => (
	<div>
		<h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-t-3">
			{title}
		</h2>
		{children}
	</div>
);

interface PathStepProps {
	icon: string;
	name: string;
	desc: string;
	isLast: boolean;
}

const PathStep = ({ icon, name, desc, isLast }: PathStepProps) => (
	<li className="flex gap-3">
		<div className="flex flex-col items-center">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-base bg-surf-2 text-[15px]">
				{icon}
			</div>
			{!isLast && <div className="mt-1 w-px flex-1 bg-bd-2" />}
		</div>
		<div className={`min-w-0 flex-1 ${isLast ? "pb-0" : "pb-4"}`}>
			<div className="text-[13px] font-semibold text-t-1">{name}</div>
			<p className="mt-0.5 text-[12.5px] leading-[1.65] text-t-3">{desc}</p>
		</div>
	</li>
);
