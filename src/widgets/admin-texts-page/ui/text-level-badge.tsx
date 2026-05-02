import { cn } from "@/shared/lib/cn";
import type { TextLevel } from "@/entities/admin-text";

const levelStyles: Record<TextLevel, string> = {
	A1: "bg-grn-bg text-grn-t",
	A2: "bg-grn-bg text-grn-t",
	B1: "bg-acc-bg text-acc-t",
	B2: "bg-pur-bg text-pur-t",
	C1: "bg-amb-bg text-amb-t",
	C2: "bg-red-bg text-red-t",
};

export const TextLevelBadge = ({ level }: { level: TextLevel | null }) => {
	if (!level) return <span className="text-[11px] text-t-4">—</span>;

	return (
		<span
			className={cn(
				"inline-flex h-[18px] w-[30px] items-center justify-center rounded-[5px] text-[10px] font-bold tracking-[0.3px]",
				levelStyles[level],
			)}
		>
			{level}
		</span>
	);
};
