import { cn } from "@/shared/lib/cn";

const POS_STYLES: Record<string, string> = {
	noun: "bg-acc-bg text-acc-t",
	verb: "bg-grn-bg text-grn-t",
	adj: "bg-amb-bg text-amb-t",
	adv: "bg-pur-bg text-pur-t",
	particle: "bg-surf-3 text-t-2",
	pron: "bg-red-bg text-red-t",
	num: "bg-surf-3 text-t-2",
	conj: "bg-surf-3 text-t-2",
	prep: "bg-surf-3 text-t-2",
};

interface PosBadgeProps {
	pos: string | null;
	label?: string;
}

export const PosBadge = ({ pos, label }: PosBadgeProps) => {
	if (!pos) return <span className="text-[11px] text-t-4">—</span>;
	const style = POS_STYLES[pos.toLowerCase()] ?? "bg-surf-3 text-t-2";
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-[5px] px-[7px] py-[2px] text-[10.5px] font-semibold whitespace-nowrap",
				style,
			)}
		>
			{label ?? pos}
		</span>
	);
};
