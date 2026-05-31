"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
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
}

export const FontFamilyGroup = ({ className }: FontFamilyGroupProps) => {
	const { t } = useI18n();
	const family = useReaderFontFamily((s) => s.family);
	const setFamily = useReaderFontFamily((s) => s.setFamily);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const current = FAMILIES.find((f) => f.value === family) ?? FAMILIES[0];

	const handleToggle = () => setOpen(prev => !prev);

	const handleSelect = (value: ReaderFontFamily) => {
		setFamily(value);
		setOpen(false);
	};

	useEffect(() => {
		if (!open) return;
		const handlePointerDown = (e: PointerEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("pointerdown", handlePointerDown);
		return () => document.removeEventListener("pointerdown", handlePointerDown);
	}, [open]);

	return (
		<div ref={containerRef} className={cn("relative w-full", className)}>
			<Button
				onClick={handleToggle}
				title={t("reader.settings.font")}
				aria-expanded={open}
				aria-haspopup="listbox"
				aria-label={t("reader.settings.font")}
				className={cn(
					"flex w-full items-center gap-2.5 rounded-[8px] border border-bd-2 bg-surf-2 px-3 h-[38px]",
					"text-t-1 transition-colors duration-150 outline-none",
					"hover:border-bd-3 focus-visible:border-acc",
					open && "border-acc",
				)}
			>
				<Typography
					tag="span"
					className={cn("text-[20px] leading-none shrink-0", FONT_FAMILY_CLASS[family])}
					aria-hidden="true"
				>
					Аа
				</Typography>
				<Typography tag="span" className="flex-1 text-left text-[13px] font-sans">
					{current.label}
				</Typography>
				<ChevronDown
					className={cn("size-[14px] text-t-3 shrink-0 transition-transform duration-150", open && "rotate-180")}
					strokeWidth={2}
				/>
			</Button>

			{open && (
				<ul
					role="listbox"
					aria-label={t("reader.settings.font")}
					className={cn(
						"absolute left-0 right-0 z-10 mt-1 overflow-hidden rounded-[8px]",
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
				</ul>
			)}
		</div>
	);
};
