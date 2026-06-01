import { Skeleton } from "@/shared/ui/skeleton";

export interface PhrasebookStatItemProps {
	value: number | null;
	label: string;
}

export const PhrasebookStatItem = ({ value, label }: PhrasebookStatItemProps) => (
	<div className="flex items-center gap-1.5">
		{value === null ? (
			<Skeleton className="w-6 h-5 rounded" />
		) : (
			<span className="font-display text-[18px] text-t-1 leading-none">
				{value}
			</span>
		)}
		<span className="text-[11.5px] text-t-2">{label}</span>
	</div>
);
