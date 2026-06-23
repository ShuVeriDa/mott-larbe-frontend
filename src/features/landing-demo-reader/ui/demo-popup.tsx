"use client";

import { Button } from "@/shared/ui/button";

import type { DemoWordEntry } from "@/entities/landing";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { BookOpen, Check, ExternalLink, Pencil } from "lucide-react";
import type { CSSProperties } from "react";

interface DemoPopupProps {
	word: string;
	data: DemoWordEntry;
	position: {
		top: number;
		left: number;
		arrowX: number;
		above: boolean;
	} | null;
	isMobile: boolean;
	isAdded: boolean;
	onAdd: () => void;
	onClose: () => void;
}

export const DemoPopup = ({
	word,
	data,
	position,
	isMobile,
	isAdded,
	onAdd,
}: DemoPopupProps) => {
	const { t } = useI18n();

	if (!position) return null;

	const style: CSSProperties = isMobile
		? { top: Math.max(12, position.top) }
		: {
				top: position.top,
				left: position.left,
				["--arrow-x" as string]: `${position.arrowX}px`,
			};

	return (
		<div
			data-demo-popup
			role="dialog"
			aria-label={word}
			style={style}
			className={cn(
				"absolute z-30 w-[280px] overflow-hidden rounded-card border-[0.5px] border-bd-2 bg-surf shadow-lg",
				"max-[640px]:left-4 max-[640px]:right-4 max-[640px]:w-[calc(100%-32px)] max-[640px]:max-w-[340px]",
				"before:absolute before:h-3 before:w-3 before:bg-surf",
				"before:border-l-[0.5px] before:border-t-[0.5px] before:border-bd-2",
				"before:max-[640px]:hidden",
				"before:left-[var(--arrow-x,30px)]",
				position.above
					? "before:bottom-[-6px] before:rotate-[225deg]"
					: "before:top-[-6px] before:rotate-45",
			)}
		>
			{/* Header: word + badge */}
			<div className="border-b-[0.5px] border-bd-1 px-3 pb-2.5 pt-3">
				<div className="flex items-center gap-2">
					<div className="text-[16px] font-semibold tracking-[-0.2px] text-t-1">
						{word}
					</div>
					<span className="flex shrink-0 items-center gap-1 rounded-[4px] border-[0.5px] border-grn/30 bg-grn/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.5px] text-grn">
						<BookOpen className="size-2" strokeWidth={1.8} />
						{t("landing.hero.popupBadge")}
					</span>
				</div>
			</div>

			{/* Body: translation + base + pos */}
			<div className="border-b-[0.5px] border-bd-1 px-3 py-2.5">
				<div className="text-[14px] font-medium text-t-1">{data.trans}</div>
				<div className="mt-1.5 text-[11.5px] text-t-3">
					{t("landing.hero.popupBase")}{" "}
					<Typography tag="span" className="font-medium text-t-2">
						{data.base}
					</Typography>
				</div>
				<div className="mt-0.5 text-[11.5px] text-t-3">
					{t("landing.hero.popupPosLabel")}{" "}
					<Typography tag="span" className="text-t-2">
						{data.pos}
					</Typography>
				</div>
				{data.extra ? (
					<div className="mt-1 text-[11px] italic text-t-3">{data.extra}</div>
				) : null}
			</div>

			{/* Footer: add button + icon buttons */}
			<div className="flex items-center justify-between gap-1.5 px-3 py-2">
				<Button
					onClick={onAdd}
					className={cn(
						"flex h-[30px] flex-1 items-center justify-center gap-1.5 rounded-base text-[11.5px] font-semibold transition-opacity",
						isAdded
							? "bg-grn text-white hover:opacity-[0.88]"
							: "bg-grn text-white hover:opacity-[0.88]",
					)}
				>
					<Check size={10} strokeWidth={2.2} />
					{isAdded ? t("landing.demo.addedBtn") : t("landing.demo.addBtn")}
				</Button>
				<div className="flex gap-1">
					<Button
						size={"bare"}
						aria-hidden="true"
						className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<Pencil size={11} strokeWidth={1.5} />
					</Button>
					<Button
						size={"bare"}
						aria-hidden="true"
						className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-base border-[0.5px] border-bd-1 bg-surf-2 text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<ExternalLink size={11} strokeWidth={1.5} />
					</Button>
				</div>
			</div>
		</div>
	);
};
