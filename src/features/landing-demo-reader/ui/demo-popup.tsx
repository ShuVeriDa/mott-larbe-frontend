"use client";

import { Plus, X } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { DemoWordEntry } from "@/entities/landing";

interface DemoPopupProps {
	word: string;
	data: DemoWordEntry;
	position: { top: number; left: number; arrowX: number; above: boolean } | null;
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
	onClose,
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
				"absolute z-30 w-[240px] overflow-hidden rounded-[11px] border-hairline border-bd-2 bg-surf shadow-lg",
				"max-[640px]:left-4 max-[640px]:right-4 max-[640px]:w-[calc(100%-32px)] max-[640px]:max-w-[320px]",
				"before:absolute before:h-3 before:w-3 before:bg-surf",
				"before:border-l-[0.5px] before:border-t-[0.5px] before:border-bd-2",
				"before:max-[640px]:hidden",
				"before:left-[var(--arrow-x,30px)]",
				position.above
					? "before:bottom-[-6px] before:rotate-[225deg]"
					: "before:top-[-6px] before:rotate-45",
			)}
		>
			<div className="border-hairline border-b border-bd-1 px-[13px] pb-[9px] pt-[11px]">
				<div className="mb-[2px] text-[16px] font-semibold tracking-[-0.2px] text-t-1">
					{word}
				</div>
				<div className="text-[11px] text-t-3">
					{t("landing.demo.baseLabel")}{" "}
					<Typography tag="strong" className="font-medium text-t-2">
						{data.base}
					</Typography>{" "}
					· {data.pos}
				</div>
			</div>
			<div className="border-hairline border-b border-bd-1 px-[13px] py-[9px]">
				<div className="mb-[3px] text-[13.5px] font-medium text-t-1">
					{data.trans}
				</div>
				{data.extra ? (
					<div className="text-[11.5px] leading-[1.5] text-t-3">
						{data.extra}
					</div>
				) : null}
			</div>
			{data.tags.length > 0 ? (
				<div className="flex flex-wrap gap-1 border-hairline border-b border-bd-1 px-[13px] py-[7px]">
					{data.tags.map((tag) => (
						<Typography
							tag="span"
							key={tag}
							className="rounded bg-surf-2 px-[6px] py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.4px] text-t-2"
						>
							{tag}
						</Typography>
					))}
				</div>
			) : null}
			<div className="flex gap-1.5 p-[7px]">
				<button
					type="button"
					onClick={onAdd}
					className={cn(
						"flex h-7 flex-1 items-center justify-center gap-1 rounded-md border-0 text-[11px] font-semibold transition-opacity",
						isAdded
							? "border-hairline border-grn bg-grn-bg text-grn-t"
							: "bg-acc text-white hover:opacity-[0.88]",
					)}
				>
					<Plus size={11} strokeWidth={2} />
					{isAdded ? t("landing.demo.addedBtn") : t("landing.demo.addBtn")}
				</button>
				<button
					type="button"
					onClick={onClose}
					aria-label={t("landing.nav.close")}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-hairline border-bd-1 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
				>
					<X size={11} strokeWidth={2} />
				</button>
			</div>
		</div>
	);
};
