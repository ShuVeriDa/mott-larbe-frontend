import { cn } from "@/shared/lib/cn";
import type { AdminLogLevel } from "@/entities/admin-log";

const LEVEL_STYLES: Record<
	AdminLogLevel,
	{ badge: string; dot: string; label: string }
> = {
	debug: {
		badge: "bg-surf-3 text-t-2",
		dot: "bg-t-3",
		label: "Debug",
	},
	info: {
		badge: "bg-acc-bg text-acc-t",
		dot: "bg-acc",
		label: "Info",
	},
	warn: {
		badge: "bg-amb-bg text-amb-t",
		dot: "bg-amb",
		label: "Warning",
	},
	error: {
		badge: "bg-red-bg text-red-t",
		dot: "bg-red",
		label: "Error",
	},
	critical: {
		badge: "bg-pur-bg text-pur-t",
		dot: "bg-pur",
		label: "Critical",
	},
};

interface LevelBadgeProps {
	level: AdminLogLevel;
	label?: string;
}

export const LevelBadge = ({ level, label }: LevelBadgeProps) => {
	const styles = LEVEL_STYLES[level];
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold whitespace-nowrap",
				styles.badge,
			)}
		>
			<span className={cn("size-1.5 shrink-0 rounded-full", styles.dot)} />
			{label ?? styles.label}
		</span>
	);
};

export { LEVEL_STYLES };
