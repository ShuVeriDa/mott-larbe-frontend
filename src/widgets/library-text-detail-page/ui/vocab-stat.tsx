import { Typography } from "@/shared/ui/typography";

interface VocabStatProps {
	dotClass: string;
	value: number;
	label: string;
}

export const VocabStat = ({ dotClass, value, label }: VocabStatProps) => (
	<div className="flex-1 flex flex-col items-center px-1 py-2.5 bg-surf-2 rounded-base">
		<Typography tag="span" className={`w-1.5 h-1.5 rounded-full mb-1.5 ${dotClass}`} />
		<Typography tag="span" className="font-display text-[20px] font-normal text-t-1 leading-none">
			{value}
		</Typography>
		<Typography tag="span" className="text-[10px] text-t-3 mt-0.5">{label}</Typography>
	</div>
);
