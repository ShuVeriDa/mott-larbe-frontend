"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReaderFontFamily, FONT_FAMILY_CLASS, type ReaderFontFamily } from "../../model";

interface FontOption {
	value: ReaderFontFamily;
	label: string;
}

const FAMILIES: FontOption[] = [
	{ value: "sans",         label: "Inter"          },
	{ value: "golos",        label: "Golos Text"     },
	{ value: "lora",         label: "Lora"           },
	{ value: "serif",        label: "Serif"          },
	{ value: "merriweather", label: "Merriweather"   },
	{ value: "pt-serif",     label: "PT Serif"       },
	{ value: "source-serif", label: "Source Serif 4" },
	{ value: "mono",         label: "Mono"           },
];

export interface FontFamilyGroupProps {
	className?: string;
	fullWidth?: boolean;
}

export const FontFamilyGroup = ({ className, fullWidth = false }: FontFamilyGroupProps) => {
	const { t } = useI18n();
	const family = useReaderFontFamily((s) => s.family);
	const setFamily = useReaderFontFamily((s) => s.setFamily);
	const [open, setOpen] = useState(false);
	const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);

	const current = FAMILIES.find((f) => f.value === family) ?? FAMILIES[0];

	const handleToggle = () => setOpen(prev => !prev);

	const handleSelect = (value: ReaderFontFamily) => {
		setFamily(value);
		setOpen(false);
	};

	useLayoutEffect(() => {
		if (!open || !triggerRef.current) return;
		const rect = triggerRef.current.getBoundingClientRect();
		setCoords({
			top: rect.bottom + window.scrollY + 4,
			left: rect.left + window.scrollX,
			width: rect.width,
		});
	}, [open]);

	useEffect(() => {
		if (!open) return;
		const handlePointerDown = (e: PointerEvent) => {
			if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [open]);

	return (
		<div className={cn(fullWidth ? "relative w-full" : "relative inline-block", className)}>
			<Button
				ref={triggerRef}
				onClick={handleToggle}
				title={t("reader.settings.font")}
				aria-expanded={open}
				aria-haspopup="listbox"
				aria-label={t("reader.settings.font")}
				className={cn(
					"flex items-center gap-2.5 rounded-[8px] border border-bd-2 bg-surf-2 px-3",
					"text-t-1 transition-colors duration-150 outline-none",
					"hover:border-bd-3 focus-visible:border-acc",
					open && "border-acc",
					fullWidth ? "w-full h-8" : "inline-flex gap-2 rounded-[5px] border-[0.5px] h-7 px-2.5",
				)}
			>
				<Typography
					tag="span"
					className={cn(
						"leading-none shrink-0",
						fullWidth ? "text-[20px]" : "text-[15px]",
						FONT_FAMILY_CLASS[family],
					)}
					aria-hidden="true"
				>
					Аа
				</Typography>
				<Typography
					tag="span"
					className={cn(
						"flex-1 text-left font-sans leading-none",
						fullWidth ? "text-[13px]" : "text-[11px] font-medium text-t-1",
					)}
				>
					{current.label}
				</Typography>
				<ChevronDown
					className={cn(
						"shrink-0 text-t-3 transition-transform duration-150",
						fullWidth ? "size-[14px]" : "size-3",
						open && "rotate-180",
					)}
					strokeWidth={2}
				/>
			</Button>

			{open && coords && typeof document !== "undefined" && createPortal(
				<ul
					role="listbox"
					aria-label={t("reader.settings.font")}
					style={{
						position: "absolute",
						top: coords.top,
						left: coords.left,
						minWidth: Math.max(coords.width, 180),
					}}
					className={cn(
						"z-9999 overflow-hidden rounded-[8px]",
						"border border-bd-2 bg-popover shadow-md ring-1 ring-foreground/10",
						"max-h-[260px] overflow-y-auto",
					)}
				>
					{FAMILIES.map((item) => (
						<li
							key={item.value}
							role="option"
							aria-selected={item.value === family}
							onPointerDown={(e) => {
								e.preventDefault();
								handleSelect(item.value);
							}}
							className={cn(
								"flex cursor-pointer items-center gap-3 px-2.5 py-2 text-[13px]",
								"transition-colors duration-100 hover:bg-surf-2",
								item.value === family && "bg-acc-bg text-acc-t",
							)}
						>
							<Typography
								tag="span"
								className={cn("w-10 shrink-0 text-[18px] leading-none text-center", FONT_FAMILY_CLASS[item.value])}
								aria-hidden="true"
							>
								Аа
							</Typography>
							<Typography tag="span" className="font-sans leading-none">
								{item.label}
							</Typography>
						</li>
					))}
				</ul>,
				document.body,
			)}
		</div>
	);
};
