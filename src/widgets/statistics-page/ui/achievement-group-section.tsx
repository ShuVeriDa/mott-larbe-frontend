"use client";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import type { AchievementGroup } from "../lib/achievement-groups";
import { ACHIEVEMENT_LABELS } from "../lib/achievement-groups";

interface AchievementGroupSectionProps {
	group: AchievementGroup;
	byId: Record<string, { id: string; icon: string; reached: boolean }>;
	t: (key: string) => string;
}

export const AchievementGroupSection = ({ group, byId, t }: AchievementGroupSectionProps) => {
	const items = group.ids.map(id => byId[id]).filter(Boolean);
	if (items.length === 0) return null;
	return (
		<div>
			<Typography tag="p" className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
				{t(group.labelKey)}
			</Typography>
			<div className="flex flex-wrap gap-1.5">
				{items.map(a => {
					const lbl = ACHIEVEMENT_LABELS[a.id];
					const tooltip = lbl ? `${t(lbl.title)} — ${t(lbl.desc)}` : a.id;
					return (
						<div
							key={a.id}
							title={tooltip}
							className={cn(
								"flex size-8 cursor-default items-center justify-center rounded-lg border-[0.5px] text-base transition-all",
								a.reached
									? "border-amb/25 bg-amb-bg shadow-sm"
									: "border-bd-1 bg-surf-2 opacity-30 grayscale",
							)}
						>
							{a.icon}
						</div>
					);
				})}
			</div>
		</div>
	);
};
