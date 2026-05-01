"use client";

import type { ActivityItem, ActivityType } from "@/entities/statistics";
import { formatRelativeFromNow } from "@/shared/lib/format-relative-time";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface ActivityLogProps {
	items: ActivityItem[];
}

const TONE_BY_TYPE: Record<
	ActivityType,
	{ bg: string; stroke: string; icon: React.ReactNode }
> = {
	READ_TEXT: {
		bg: "bg-acc-bg",
		stroke: "stroke-acc",
		icon: (
			<>
				<path d="M2 3h5v10H2z" />
				<path d="M9 3h5v10H9z" />
			</>
		),
	},
	REVIEW: {
		bg: "bg-amb-bg",
		stroke: "stroke-amb",
		icon: (
			<>
				<circle cx="8" cy="8" r="5.5" />
				<path d="M8 5v3.5l2 2" strokeLinecap="round" />
			</>
		),
	},
	ADD_WORDS: {
		bg: "bg-grn-bg",
		stroke: "stroke-grn",
		icon: <path d="M3 5h10M3 8h7M3 11h5" strokeLinecap="round" />,
	},
};

export const ActivityLog = ({ items }: ActivityLogProps) => {
	const { t } = useI18n();

	return (
		<section className="rounded-card border-hairline border-bd-1 bg-surf p-4">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.activity.title")}
				</Typography>
			</header>

			{items.length === 0 ? (
				<div className="py-6 text-center text-[11px] text-t-3">
					{t("statistics.activity.empty")}
				</div>
			) : (
				<ul className="flex flex-col">
					{items.map((item, idx) => {
						const tone = TONE_BY_TYPE[item.type];
						const time = formatRelativeFromNow(item.date, t);
						return (
							<li
								key={`${item.date}-${idx}`}
								className="flex items-center gap-2.5 border-b border-bd-1 py-2 last:border-b-0"
							>
								<div
									className={`flex size-7 shrink-0 items-center justify-center rounded-base ${tone.bg}`}
									aria-hidden="true"
								>
									<svg
										viewBox="0 0 16 16"
										fill="none"
										strokeWidth="1.5"
										className={`size-3 ${tone.stroke}`}
									>
										{tone.icon}
									</svg>
								</div>
								<div className="min-w-0 flex-1">
									<Typography
										tag="p"
										className="truncate text-xs font-medium text-t-1"
									>
										{item.title}
									</Typography>
									<Typography
										tag="p"
										className="truncate text-[11px] text-t-3"
									>
										{item.description}
									</Typography>
								</div>
								<span className="whitespace-nowrap text-[11px] text-t-3">
									{time}
								</span>
							</li>
						);
					})}
				</ul>
			)}
		</section>
	);
};
