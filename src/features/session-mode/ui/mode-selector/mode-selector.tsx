"use client";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { SectionLabel } from "@/shared/ui/section-label";
import type { SessionMode } from "../../model/types";

interface ModeSelectorProps {
	value: SessionMode;
	onChange: (mode: SessionMode) => void;
}

interface ModeOption {
	value: SessionMode;
	labelKey: string;
	descKey: string;
	icon: string;
}

const OPTIONS: ModeOption[] = [
	{
		value: "flashcard",
		labelKey: "review.mode.flashcard.label",
		descKey: "review.mode.flashcard.desc",
		icon: "🃏",
	},
	{
		value: "choice",
		labelKey: "review.mode.choice.label",
		descKey: "review.mode.choice.desc",
		icon: "🎯",
	},
	{
		value: "typing",
		labelKey: "review.mode.typing.label",
		descKey: "review.mode.typing.desc",
		icon: "⌨️",
	},
];

export const ModeSelector = ({ value, onChange }: ModeSelectorProps) => {
	const { t } = useI18n();

	return (
		<div className="w-full max-w-[420px]">
			<SectionLabel>
				{t("review.mode.label")}
			</SectionLabel>
			<div className="flex gap-2">
				{OPTIONS.map(opt => {
					const active = value === opt.value;
					const handleClick = () => onChange(opt.value);
					return (
						<button
							key={opt.value}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex flex-1 flex-col items-center gap-1 rounded-card border-[0.5px] px-2 py-2 text-center transition-colors md:py-2.5",
								active
									? "border-acc/40 bg-acc-bg text-acc"
									: "border-bd-2 bg-surf text-t-3 hover:border-bd-3 hover:bg-surf-2 hover:text-t-2",
							)}
						>
							<span className="text-[16px] leading-none" aria-hidden="true">
								{opt.icon}
							</span>
							<span
								className={cn(
									"text-[11.5px] font-semibold leading-tight",
									active ? "text-acc" : "text-t-2",
								)}
							>
								{t(opt.labelKey)}
							</span>
							<span className="text-[10px] leading-tight text-t-3 max-md:hidden">
								{t(opt.descKey)}
							</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};
