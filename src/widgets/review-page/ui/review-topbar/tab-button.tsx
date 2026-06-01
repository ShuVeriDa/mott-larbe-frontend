import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
interface TabButtonProps {
	label: string;
	count: number | null;
	active: boolean;
	onClick: () => void;
}

export const TabButton = ({ label, count, active, onClick }: TabButtonProps) => (
	<Button
		role="tab"
		aria-selected={active}
		onClick={onClick}
		className={cn(
			"flex h-[26px] min-w-0 cursor-pointer items-center gap-1 rounded-[6px] border-0 px-1.5 text-[11px] font-medium transition-colors duration-150 max-md:flex-1 max-md:justify-center md:gap-1.5 md:px-2.5 md:text-[12px]",
			active
				? "bg-surf font-semibold text-t-1 shadow-sm"
				: "bg-transparent text-t-3 hover:text-t-2",
		)}
	>
		{label}
		{count !== null && count > 0 ? (
			<Typography
				tag="span"
				className={cn(
					"rounded-[3px] px-1 py-px text-[10px] font-bold",
					active ? "bg-acc-bg text-acc-t" : "bg-amb-bg text-amb-t",
				)}
			>
				{count}
			</Typography>
		) : null}
	</Button>
);
