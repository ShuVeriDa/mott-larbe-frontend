"use client";

import { FONT_FAMILY_CLASS, useReaderFontFamily, type ReaderFontFamily } from "@/features/reader-font-family";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export interface FontFamilyRowProps {
	label: string;
	description?: string;
}

const FAMILIES: Array<{ value: ReaderFontFamily; label: string }> = [
	{ value: "sans",         label: "Inter"          },
	{ value: "golos",        label: "Golos Text"     },
	{ value: "lora",         label: "Lora"           },
	{ value: "serif",        label: "Serif"          },
	{ value: "merriweather", label: "Merriweather"   },
	{ value: "pt-serif",     label: "PT Serif"       },
	{ value: "source-serif", label: "Source Serif 4" },
	{ value: "mono",         label: "Mono"           },
];

export const FontFamilyRow = ({ label, description }: FontFamilyRowProps) => {
	const family = useReaderFontFamily(s => s.family);
	const setFamily = useReaderFontFamily(s => s.setFamily);

	return (
		<div className="flex flex-col gap-2 border-b-[0.5px] border-bd-1 px-4 py-3 last:border-b-0">
			<div>
				<Typography tag="p" className="text-[13px] font-medium text-t-1">
					{label}
				</Typography>
				{description ? (
					<Typography tag="p" className="mt-0.5 text-[11.5px] leading-normal text-t-3">
						{description}
					</Typography>
				) : null}
			</div>
			<div className="flex flex-wrap gap-1.5" role="group" aria-label={label}>
				{FAMILIES.map(opt => {
					const active = opt.value === family;
					const handleClick = () => setFamily(opt.value);
					return (
						<button
							key={opt.value}
							onClick={handleClick}
							aria-pressed={active}
							className={cn(
								"flex items-center gap-1.5 rounded-[6px] border-[0.5px] px-2.5 py-1.5",
								"transition-colors duration-100",
								active
									? "border-acc/20 bg-acc-bg text-acc-t"
									: "border-bd-1 bg-surf-2 text-t-2 hover:border-bd-2 hover:text-t-1",
							)}
						>
							<Typography
								tag="span"
								className={cn("text-[16px] leading-none", FONT_FAMILY_CLASS[opt.value])}
								aria-hidden="true"
							>
								Аа
							</Typography>
							<Typography tag="span" className="text-[11.5px] font-medium font-sans leading-none">
								{opt.label}
							</Typography>
						</button>
					);
				})}
			</div>
		</div>
	);
};
