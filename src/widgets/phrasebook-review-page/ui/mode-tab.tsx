import { cn } from "@/shared/lib/cn";

interface ModeTabProps {
	label: string;
	shortLabel: string;
	active: boolean;
	onClick: () => void;
}

export const ModeTab = ({ label, shortLabel, active, onClick }: ModeTabProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			"min-w-0 flex-1 rounded-[6px] px-1.5 py-1.5 text-[11.5px] font-medium transition-colors duration-150 cursor-pointer border-0 leading-tight text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acc/60",
			active
				? "bg-surf font-semibold text-t-1 shadow-sm"
				: "bg-transparent text-t-3 hover:text-t-2",
		)}
	>
		<span className="max-md:hidden">{label}</span>
		<span className="md:hidden">{shortLabel}</span>
	</button>
);
