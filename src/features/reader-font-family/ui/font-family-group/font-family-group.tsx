"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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

	const current = FAMILIES.find((f) => f.value === family) ?? FAMILIES[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					title={t("reader.settings.font")}
					className={cn(
						"flex w-full items-center gap-2.5 rounded-[8px] border border-bd-2 bg-surf-2 px-3 h-[38px]",
						"text-t-1 transition-colors duration-150 outline-none",
						"hover:border-bd-3 focus-visible:border-acc",
						className,
					)}
					aria-label={t("reader.settings.font")}
				>
					<Typography tag="span"
						className={cn("text-[20px] leading-none shrink-0", FONT_FAMILY_CLASS[family])}
						aria-hidden="true"
					>
						Аа
					</Typography>
					<Typography tag="span" className="flex-1 text-left text-[13px] font-sans">{current.label}</Typography>
					<ChevronDown className="size-[14px] text-t-3 shrink-0" strokeWidth={2} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="p-1.5">
				<DropdownMenuRadioGroup
					value={family}
					onValueChange={(v) => setFamily(v as ReaderFontFamily)}
				>
					{FAMILIES.map((item) => (
						<DropdownMenuRadioItem
							key={item.value}
							value={item.value}
							className="flex items-center gap-3 px-2.5 py-2 rounded-[6px] cursor-pointer"
						>
							<Typography tag="span"
								className={cn("w-10 shrink-0 text-[18px] leading-none text-center", FONT_FAMILY_CLASS[item.value])}
								aria-hidden="true"
							>
								Аа
							</Typography>
							<Typography tag="span" className="text-[13px] font-sans leading-none">{item.label}</Typography>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
