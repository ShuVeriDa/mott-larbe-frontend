import { Info } from "lucide-react";

interface StatBoxProps {
	value: number;
	label: string;
	tone: "amb" | "acc" | "grn";
	hint?: string;
}

const toneClasses: Record<NonNullable<StatBoxProps["tone"]>, string> = {
	amb: "text-amb",
	acc: "text-acc",
	grn: "text-grn",
};

export const StatBox = ({ value, label, tone, hint }: StatBoxProps) => (
	<div
		title={hint}
		className="min-w-0 flex-1 rounded-card border-[0.5px] border-bd-2 bg-surf px-3 py-3 text-center shadow-sm md:min-w-[80px] md:flex-none md:px-4"
	>
		<div className={`font-display text-[22px] font-semibold leading-[1.1] tabular-nums max-md:text-[20px] ${toneClasses[tone]}`}>
			{value}
		</div>
		<div className="mt-1 flex items-center justify-center gap-0.5 text-[11px] text-t-3">
			{label}
			{hint ? (
				<Info className="size-3 shrink-0 text-t-4 opacity-60" />
			) : null}
		</div>
	</div>
);
