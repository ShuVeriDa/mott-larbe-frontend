"use client";

import type { DashboardResponse } from "@/entities/dashboard";
import type { UserProfile } from "@/entities/user";
import { variants } from "@/shared/lib/animation";
import { useI18n } from "@/shared/lib/i18n";
import type { CefrLevel } from "@/shared/types";
import { AnimatePresence, motion } from "framer-motion";
import { ByLevelSection } from "./by-level-section";
import { ContinueReading } from "./continue-reading";
import { GenresSection } from "./genres-section";
import { GreetingSection } from "./greeting-section";
import { StatsGrid } from "./stats-grid";
import { TextsRowSection } from "./texts-row-section";

interface DashboardContentProps {
	data: DashboardResponse;
	user: UserProfile | undefined;
	lang: string;
	showReviewReminder: boolean;
	dailyWordsGoal: number | null;
}


export const DashboardContent = ({ data, user, lang, showReviewReminder, dailyWordsGoal }: DashboardContentProps) => {
	const { t } = useI18n();
	const { sections } = data;

	const userLevel = (sections.userLevel ?? null) as CefrLevel | null;
	const showByLevel = userLevel !== null && sections.byLevelTexts.length > 0;

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<motion.div
				className="flex flex-col gap-5 overflow-y-auto px-[22px] pb-8 pt-4 [scrollbar-color:var(--bd-2)_transparent] [scrollbar-width:thin] max-md:px-4 max-sm:gap-4 max-sm:px-3.5 max-sm:pt-3.5 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:rounded-[2px] [&::-webkit-scrollbar-thumb]:bg-bd-2"
				variants={variants.staggerContainer}
				initial="hidden"
				animate="visible"
			>
				<motion.div variants={variants.staggerItem}>
					<GreetingSection user={user} lang={lang} />
				</motion.div>

				<motion.div variants={variants.staggerItem}>
					<StatsGrid stats={data.stats} lang={lang} showReviewReminder={showReviewReminder} dailyWordsGoal={dailyWordsGoal} />
				</motion.div>

				<motion.div variants={variants.staggerItem}>
					<GenresSection lang={lang} />
				</motion.div>

				<AnimatePresence>
					{data.continueReading.length > 0 && (
						<motion.div key="continue" variants={variants.staggerItem}>
							<ContinueReading items={data.continueReading} lang={lang} />
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{showByLevel && (
						<motion.div key="by-level" variants={variants.staggerItem}>
							<ByLevelSection
								level={userLevel!}
								items={sections.byLevelTexts}
								isPending={false}
								lang={lang}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{sections.popularTexts.length > 0 && (
						<motion.div key="popular" variants={variants.staggerItem}>
							<TextsRowSection
								title={t("dashboard.popularTexts.title")}
								viewAllHref={`/${lang}/texts?orderBy=popular`}
								viewAllLabel={t("dashboard.viewAll")}
								items={sections.popularTexts}
								isPending={false}
								lang={lang}
							/>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div variants={variants.staggerItem}>
					<TextsRowSection
						title={t("dashboard.recentTexts.title")}
						viewAllHref={`/${lang}/texts?orderBy=newest`}
						viewAllLabel={t("dashboard.viewAll")}
						items={sections.recentTexts}
						isPending={false}
						lang={lang}
					/>
				</motion.div>

				<motion.div variants={variants.staggerItem}>
					<TextsRowSection
						title={t("dashboard.shortTexts.title")}
						viewAllHref={`/${lang}/texts?orderBy=length&maxWords=400`}
						viewAllLabel={t("dashboard.viewAll")}
						items={sections.shortTexts}
						isPending={false}
						lang={lang}
					/>
				</motion.div>
			</motion.div>
		</div>
	);
};
