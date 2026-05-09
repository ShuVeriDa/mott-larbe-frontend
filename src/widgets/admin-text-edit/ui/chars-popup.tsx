"use client";

import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";

const CHECHEN_CHARS = [
	"Ӏ", "гӀ", "ГӀ", "кх", "КХ", "нх", "НХ",
	"хь", "Хь", "цх", "ЦХ", "чх", "ЧХ",
];

export const CharsPopup = ({ onInsert }: { onInsert: (char: string) => void }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const { t } = useI18n();

	const handleToggle: NonNullable<ComponentProps<"button">["onMouseDown"]> = e => {
		e.preventDefault();
		setOpen(v => !v);
	};

	return (
		<div ref={ref} className="relative">
			<Button
				title={t("admin.texts.editPage.specialChars")}
				onMouseDown={handleToggle}
				className="flex h-7 items-center gap-1 rounded-[5px] px-1.5 text-[11px] font-semibold text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
			>
				Ӏ
			</Button>
			{open && (
				<div
					className="absolute bottom-full left-0 z-30 mb-2 flex flex-wrap gap-1 rounded-[8px] border border-bd-2 bg-bg p-2 shadow-md"
					style={{ width: "192px" }}
				>
					{CHECHEN_CHARS.map(ch => {
						const handleCharMouseDown: NonNullable<ComponentProps<"button">["onMouseDown"]> = e => {
							e.preventDefault();
							onInsert(ch);
							setOpen(false);
						};
						return (
							<Button
								key={ch}
								onMouseDown={handleCharMouseDown}
								className="flex h-7 min-w-[40px] items-center justify-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[12px] font-medium text-t-1 transition-colors hover:border-acc hover:bg-acc-muted hover:text-acc-strong"
							>
								{ch}
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
};
