interface DoneStatProps {
	value: number;
	label: string;
	tone: "grn" | "acc" | "amb";
}

const toneClasses: Record<DoneStatProps["tone"], string> = {
	grn: "text-grn",
	acc: "text-acc",
	amb: "text-amb",
};

export const DoneStat = ({ value, label, tone }: DoneStatProps) => (
	<div className="min-w-[78px] rounded-card border-[0.5px] border-bd-2 bg-surf px-4 py-3 text-center shadow-sm max-md:min-w-0 max-md:flex-1">
		<div className={`font-display text-[22px] font-semibold leading-[1.1] tabular-nums ${toneClasses[tone]}`}>
			{value}
		</div>
		<div className="mt-0.5 text-[11px] text-t-3">{label}</div>
	</div>
);
