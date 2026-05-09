"use client";

import { ChevronDown, Plus } from "lucide-react";
import { ComponentProps, useState } from 'react';
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

export const ReaderMock = () => {
	const { t } = useI18n();
	const [highlighted, setHighlighted] = useState(t("landing.hero.readerHl"));

	const tags = t("landing.hero.popupTags")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);

	const original = t("landing.hero.readerOriginal");
	const hl = t("landing.hero.readerHl");

	const tokens = original.split(/(\s+)/);

	return (
		<div className="relative" style={{ perspective: "1400px" }}>
			<div className="absolute -top-4 right-6 z-[4] flex items-center gap-2 rounded-[10px] border-hairline border-bd-2 bg-surf px-3 py-2.5 text-[12px] shadow-md max-[640px]:hidden animate-[chipFloat_5s_ease-in-out_infinite]">
				<span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-grn-bg text-grn-t">
					<svg
						width="11"
						height="11"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<path d="M2 6l3 3 5-5" />
					</svg>
				</span>
				<Typography tag="span">
					<Typography tag="span" className="block font-semibold text-t-1">
						{t("landing.hero.chip1Title")}
					</Typography>
					<Typography tag="span" className="mt-px block text-[10.5px] text-t-3">
						{t("landing.hero.chip1Sub")}
					</Typography>
				</Typography>
			</div>

			<div className="absolute -bottom-3.5 left-7 z-[4] flex items-center gap-2 rounded-[10px] border-hairline border-bd-2 bg-surf px-3 py-2.5 text-[12px] shadow-md max-[640px]:hidden animate-[chipFloat_6s_ease-in-out_infinite_reverse]">
				<span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-pur-bg text-pur-t">
					<svg
						width="11"
						height="11"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
					>
						<path d="M3 6c0-1.66 1.34-3 3-3M9 6c0 1.66-1.34 3-3 3M8.5 2.5L9 4l1.5-.5M3.5 9.5L3 8l-1.5.5" />
					</svg>
				</span>
				<Typography tag="span">
					<Typography tag="span" className="block font-semibold text-t-1">
						{t("landing.hero.chip2Title")}
					</Typography>
					<Typography tag="span" className="mt-px block text-[10.5px] text-t-3">
						{t("landing.hero.chip2Sub")}
					</Typography>
				</Typography>
			</div>

			<div className="overflow-hidden rounded-[14px] border-hairline border-bd-2 bg-surf shadow-lg transition-transform duration-300 -rotate-1 hover:rotate-0 max-[640px]:rotate-0">
				<div className="flex items-center gap-1.5 border-hairline border-b border-bd-1 bg-surf-2 px-[14px] py-[10px]">
					<span
						aria-hidden="true"
						className="h-[9px] w-[9px] rounded-full"
						style={{ background: "#e87171", opacity: 0.55 }}
					/>
					<span
						aria-hidden="true"
						className="h-[9px] w-[9px] rounded-full"
						style={{ background: "#f5a524", opacity: 0.55 }}
					/>
					<span
						aria-hidden="true"
						className="h-[9px] w-[9px] rounded-full"
						style={{ background: "#3dc87a", opacity: 0.55 }}
					/>
					<Typography
						tag="span"
						className="ml-2.5 truncate font-display text-[12px] italic text-t-2"
					>
						{t("landing.hero.readerTitle")}
					</Typography>
					<Typography
						tag="span"
						className="ml-auto rounded bg-acc-bg px-[7px] py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.5px] text-acc-t"
					>
						{t("landing.hero.readerLevel")}
					</Typography>
				</div>

				<div className="px-[30px] py-7 font-display text-[17px] leading-[1.75] text-t-1 max-[640px]:px-[22px] max-[640px]:py-[22px] max-[640px]:text-[15px] max-[640px]:leading-[1.65]">
					<Typography>
						{tokens.map((tok, i) => {
							if (!tok.trim()) return tok;
							const clean = tok.replace(/[.,!?;:«»]/g, "");
							const isHl = clean === hl && highlighted === hl;
														const handleClick: NonNullable<ComponentProps<typeof Typography>["onClick"]> = () => setHighlighted(clean);
							const handleKeyDown: NonNullable<ComponentProps<typeof Typography>["onKeyDown"]> = (e) => {
										if (e.key === "Enter") setHighlighted(clean);
									};
return (
								<Typography
									tag="span"
									key={`${tok}-${i}`}
									role="button"
									tabIndex={0}
									onClick={handleClick}
									onKeyDown={handleKeyDown}
									className={cn(
										"inline cursor-pointer rounded-[3px] px-[2px] py-[1px] transition-colors hover:bg-acc/10",
										isHl &&
											"!bg-acc-bg !text-acc-t font-semibold outline outline-[0.5px] outline-acc/25",
									)}
								>
									{tok}
								</Typography>
							);
						})}
					</Typography>
					<Typography className="mt-[14px] text-[14px] italic text-t-3">
						{t("landing.hero.readerTranslation")}
					</Typography>
				</div>

				<div className="absolute left-[38%] top-[47%] z-[5] w-[240px] overflow-hidden rounded-[11px] border-hairline border-bd-2 bg-surf shadow-lg animate-[popupFloat_4s_ease-in-out_infinite] max-[640px]:left-[32%] max-[640px]:top-1/2 max-[640px]:w-[200px]">
					<div className="absolute -top-1.5 left-[30px] h-3 w-3 rotate-45 border-l-[0.5px] border-t-[0.5px] border-bd-2 bg-surf" />
					<div className="border-hairline border-b border-bd-1 px-[13px] pb-[9px] pt-[11px]">
						<div className="mb-[2px] text-[16px] font-semibold tracking-[-0.2px] text-t-1">
							{hl}
						</div>
						<div className="text-[11px] text-t-3">
							{t("landing.hero.popupBase")}{" "}
							<Typography tag="strong" className="font-medium text-t-2">
								{t("landing.hero.popupBaseValue")}
							</Typography>{" "}
							· {t("landing.hero.popupPos")}
						</div>
					</div>
					<div className="border-hairline border-b border-bd-1 px-[13px] py-[9px]">
						<div className="mb-[3px] text-[13.5px] font-medium text-t-1">
							{t("landing.hero.popupTrans")}
						</div>
						<div className="text-[11.5px] leading-[1.5] text-t-3">
							{t("landing.hero.popupExtra")}
						</div>
					</div>
					{tags.length > 0 ? (
						<div className="flex flex-wrap gap-1 border-hairline border-b border-bd-1 px-[13px] py-[7px]">
							{tags.map((tag) => (
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
							className="flex h-7 flex-1 items-center justify-center gap-1 rounded-md border-0 bg-acc text-[11px] font-semibold text-white"
						>
							<Plus size={11} strokeWidth={2} />
							{t("landing.hero.popupAdd")}
						</button>
						<button
							type="button"
							aria-hidden="true"
							className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-hairline border-bd-1 bg-surf-2 text-t-2"
						>
							<ChevronDown size={11} strokeWidth={2} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
