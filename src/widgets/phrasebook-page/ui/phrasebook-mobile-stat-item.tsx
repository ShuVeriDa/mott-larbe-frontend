import { Skeleton } from "@/shared/ui/skeleton";

export interface PhrasebookMobileStatItemProps {
	value: number | null;
	label: string;
}

export const PhrasebookMobileStatItem = ({
	value,
	label,
}: PhrasebookMobileStatItemProps) => (
	<div className="flex flex-col items-center bg-surf-2 border-[0.5px] border-bd-1 rounded-lg px-3.5 py-1.5 shrink-0">
		{value === null ? (
			<Skeleton className="w-6 h-4 rounded mb-0.5" />
		) : (
			<span className="font-display text-[17px] text-t-1 leading-none">
				{value}
			</span>
		)}
		<span className="text-[10px] text-t-3 mt-0.5 whitespace-nowrap">
			{label}
		</span>
	</div>
);
