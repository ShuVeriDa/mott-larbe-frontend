"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { ComponentProps } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PALOCHKA_ROWS = [
	{ char: "\u04C0", unicodeLabel: "U+04C0", tone: "uppercase" },
	{ char: "\u04CF", unicodeLabel: "U+04CF", tone: "lowercase" },
] as const;

const PALOCHKA_ROW_CLASS: Record<
	(typeof PALOCHKA_ROWS)[number]["tone"],
	{ row: string; label: string; code: string; button: string }
> = {
	uppercase: {
		row: "border-l-acc bg-acc-bg",
		label: "text-acc-t",
		code: "text-acc-t font-mono opacity-90",
		button:
			"border-acc/35 bg-surf text-acc-t shadow-[0_1px_0_0] shadow-acc/25 hover:border-acc hover:bg-acc-bg hover:text-acc-t active:scale-[0.98]",
	},
	lowercase: {
		row: "border-l-pur bg-pur-bg",
		label: "text-pur-t",
		code: "text-pur-t font-mono opacity-90",
		button:
			"border-pur/35 bg-surf text-pur-t shadow-[0_1px_0_0] shadow-pur/25 hover:border-pur hover:bg-pur-bg hover:text-pur-t active:scale-[0.98]",
	},
};

export const CharsPopup = ({
	onInsert,
}: {
	onInsert: (char: string) => void;
}) => {
	const [open, setOpen] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const { t } = useI18n();

	const handleToggle: NonNullable<
		ComponentProps<"button">["onMouseDown"]
	> = e => {
		e.preventDefault();
		if (open) {
			setAnchorRect(null);
			setOpen(false);
			return;
		}
		setAnchorRect(ref.current?.getBoundingClientRect() ?? null);
		setOpen(true);
	};

	useLayoutEffect(() => {
		if (!open) return;
		const syncAnchor = () => {
			const next = ref.current?.getBoundingClientRect();
			if (next) setAnchorRect(next);
		};
		syncAnchor();
		window.addEventListener("scroll", syncAnchor, true);
		window.addEventListener("resize", syncAnchor);
		return () => {
			window.removeEventListener("scroll", syncAnchor, true);
			window.removeEventListener("resize", syncAnchor);
		};
	}, [open]);

	const panel =
		open &&
		anchorRect &&
		createPortal(
			<div
				className="fixed z-9999 w-auto min-w-[260px] max-w-[min(92vw,340px)] overflow-hidden rounded-[10px] border border-bd-2 bg-surf py-2 shadow-lg ring-0"
				style={{
					left: anchorRect.left,
					bottom: window.innerHeight - anchorRect.top + 8,
				}}
			>
				<div className="flex flex-col gap-1.5 px-2">
					<div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2 px-1 pt-0.5">
						<Typography
							tag="span"
							className="text-[10px] font-medium uppercase tracking-[0.04em] text-t-3"
						>
							{t("admin.texts.editPage.palochkaColumnPurpose")}
						</Typography>
						<Typography
							tag="span"
							className="text-[10px] font-medium uppercase tracking-[0.04em] text-t-3"
						>
							{t("admin.texts.editPage.palochkaColumnUnicode")}
						</Typography>
						<span aria-hidden className="w-9 shrink-0" />
					</div>
					{PALOCHKA_ROWS.map(row => {
						const tone = PALOCHKA_ROW_CLASS[row.tone];
						const purposeLabel =
							row.tone === "uppercase"
								? t("admin.texts.editPage.palochkaUppercase")
								: t("admin.texts.editPage.palochkaLowercase");
						const handleCharMouseDown: NonNullable<
							ComponentProps<"button">["onMouseDown"]
						> = e => {
							e.preventDefault();
							onInsert(row.char);
							setAnchorRect(null);
							setOpen(false);
						};
						const insertTitle = `${purposeLabel} (${row.unicodeLabel})`;
						return (
							<div
								key={row.unicodeLabel}
								className={`grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-2 rounded-[6px] border-l-[3px] py-1.5 pl-2 pr-1 ${tone.row}`}
							>
								<Typography
									tag="span"
									className={`text-[12px] font-medium ${tone.label}`}
								>
									{purposeLabel}
								</Typography>
								<Typography
									tag="span"
									className={`text-[11px] tabular-nums ${tone.code}`}
								>
									{row.unicodeLabel}
								</Typography>
								<Button
									size="bare"
									onMouseDown={handleCharMouseDown}
									title={insertTitle}
									className={`inline-flex h-8 min-w-9 shrink-0 items-center justify-center justify-self-end rounded-[4px] border px-2 py-1 font-[inherit] text-[12px] font-medium leading-none transition-colors ${tone.button}`}
								>
									{row.char}
								</Button>
							</div>
						);
					})}
				</div>
			</div>,
			document.body,
		);

	return (
		<div ref={ref} className="relative">
			<Button
				title={t("admin.texts.editPage.palochkaToolbarTitle")}
				onMouseDown={handleToggle}
				className="flex h-7 items-center gap-1 rounded-[5px] px-1.5 text-[11px] font-semibold text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
			>
				Ӏ
			</Button>
			{panel}
		</div>
	);
};
