"use client";
import type { AchievementsData } from "@/entities/statistics";
import { variants } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { LEFT_GROUPS, RIGHT_GROUPS } from "../lib/achievement-groups";
import { AchievementGroupSection } from "./achievement-group-section";

interface AchievementsCardProps {
	data: AchievementsData;
}

export const AchievementsCard = ({ data }: AchievementsCardProps) => {
	const { t } = useI18n();
	const [isExpanded, setIsExpanded] = useState(false);
	const pct = data.total > 0 ? Math.round((data.reached / data.total) * 100) : 0;
	const byId = Object.fromEntries(data.list.map(a => [a.id, a]));

	const handleToggle = () => setIsExpanded(prev => !prev);

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<button
				onClick={handleToggle}
				className="flex w-full items-center gap-3 text-left"
				aria-expanded={isExpanded}
			>
				<Typography tag="span" className="shrink-0 text-[12.5px] font-semibold text-t-1">
					{t("statistics.achievements.title")}
				</Typography>
				<div className="flex flex-1 items-center gap-2">
					<div className="h-1 flex-1 overflow-hidden rounded-full bg-surf-3">
						<div className="h-full rounded-full bg-amb transition-[width]" style={{ width: `${pct}%` }} />
					</div>
					<Typography tag="span" className="shrink-0 text-[11px] text-t-3">
						{data.reached}/{data.total} · {pct}%
					</Typography>
				</div>
				<ChevronDown className={cn("size-4 shrink-0 text-t-3 transition-transform", isExpanded && "rotate-180")} />
			</button>

			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 max-sm:grid-cols-1"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
						style={{ overflow: "hidden" }}
					>
						<div className="flex flex-col gap-3">
							{LEFT_GROUPS.map(group => (
								<AchievementGroupSection key={group.labelKey} group={group} byId={byId} t={t} />
							))}
						</div>
						<div className="flex flex-col gap-3">
							{RIGHT_GROUPS.map(group => (
								<AchievementGroupSection key={group.labelKey} group={group} byId={byId} t={t} />
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
};
