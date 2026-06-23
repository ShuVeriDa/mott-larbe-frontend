"use client";

import type {
	ActivityItem,
	ActivityItemMetaAddWords,
	ActivityItemMetaReadText,
	ActivityItemMetaReview,
	ActivityType,
} from "@/entities/statistics";
import { variants } from "@/shared/lib/animation";
import { formatRelativeFromNow } from "@/shared/lib/format-relative-time";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import { AlignLeft, BookOpen, Clock } from "lucide-react";
import { ReactNode } from "react";

interface ActivityLogProps {
	items: ActivityItem[];
}

const TONE_BY_TYPE: Record<
	ActivityType,
	{ bg: string; icon: ReactNode }
> = {
	READ_TEXT: {
		bg: "bg-acc-bg",
		icon: <BookOpen className="size-3 text-acc" />,
	},
	REVIEW: {
		bg: "bg-amb-bg",
		icon: <Clock className="size-3 text-amb" />,
	},
	ADD_WORDS: {
		bg: "bg-grn-bg",
		icon: <AlignLeft className="size-3 text-grn" />,
	},
};

const getActivityStrings = (
	item: ActivityItem,
	t: (k: string, v?: Record<string, unknown>) => string,
) => {
	if (item.type === "READ_TEXT") {
		const m = item.meta as ActivityItemMetaReadText;
		const textTitle = m.textTitle ?? t("statistics.activity.unknownText");
		const title = t("statistics.activity.readText", { title: textTitle });
		const description =
			m.pageNumber != null
				? t("statistics.activity.page", { n: m.pageNumber })
				: "";
		return { title, description };
	}
	if (item.type === "ADD_WORDS") {
		const m = item.meta as ActivityItemMetaAddWords;
		const title = t("statistics.activity.addedWords", { count: m.count });
		return { title, description: "" };
	}
	// REVIEW
	const m = item.meta as ActivityItemMetaReview;
	const title = t("statistics.activity.types.REVIEW");
	const description =
		m.total > 0
			? t("statistics.activity.reviewDesc", {
					total: m.total,
					accuracy: m.accuracy,
				})
			: "";
	return { title, description };
};

export const ActivityLog = ({ items }: ActivityLogProps) => {
	const { t } = useI18n();

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4">
			<header className="mb-3 gap-1 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.activity.title")}
				</Typography>
			</header>

			{items.length === 0 ? (
				<div className="py-6 text-center text-[11px] text-t-3">
					{t("statistics.activity.empty")}
				</div>
			) : (
				<motion.ul
					className="flex max-h-[220px] flex-col overflow-y-auto"
					variants={variants.staggerContainer}
					initial="hidden"
					animate="visible"
				>
					{items.map((item, idx) => {
						const tone = TONE_BY_TYPE[item.type];
						const time = formatRelativeFromNow(item.date, t);
						const { title, description } = getActivityStrings(item, t);
						return (
							<motion.li
								key={`${item.date}-${idx}`}
								variants={variants.staggerItem}
								className="flex items-center gap-2.5 border-b border-bd-1 py-2 last:border-b-0"
							>
								<div
									className={`flex size-7 shrink-0 items-center justify-center rounded-base ${tone.bg}`}
									aria-hidden="true"
								>
									{tone.icon}
								</div>
								<div className="min-w-0 flex-1">
									<Typography
										tag="p"
										className="truncate text-xs font-medium text-t-1"
									>
										{title}
									</Typography>
									{description && (
										<Typography tag="p" className="text-[11px] text-t-3">
											{description}
										</Typography>
									)}
									<Typography tag="p" className="text-[11px] text-t-3">
										{time}
									</Typography>
								</div>
							</motion.li>
						);
					})}
				</motion.ul>
			)}
		</section>
	);
};
