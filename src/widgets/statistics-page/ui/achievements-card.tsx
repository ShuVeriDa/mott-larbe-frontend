"use client";
import type { AchievementsData } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { useState } from "react";

interface AchievementsCardProps {
	data: AchievementsData;
}

const GROUPS: { labelKey: string; ids: string[] }[] = [
	{
		labelKey: "achievements.group.vocabulary",
		ids: ["first_word","words_5","words_10","words_25","words_50","words_75","words_100","words_150","words_200","words_250","words_350","words_500","words_750","words_1000","words_1500","words_2000","words_3000","words_4000","words_5000","words_7500","words_10000"],
	},
	{
		labelKey: "achievements.group.mastered",
		ids: ["known_1","known_5","known_10","known_25","known_50","known_100","known_250","known_500","known_1000","known_2000","known_5000"],
	},
	{
		labelKey: "achievements.group.speed",
		ids: ["words_day_3","words_day_5","words_day_10","words_day_15","words_day_20","words_day_30","words_day_50","words_day_75","words_day_100"],
	},
	{
		labelKey: "achievements.group.streak",
		ids: ["streak_2","streak_3","streak_5","streak_7","streak_10","streak_14","streak_21","streak_30","streak_45","streak_60","streak_90","streak_100","streak_180","streak_365","streak_500","streak_730"],
	},
	{
		labelKey: "achievements.group.record",
		ids: ["record_3","record_7","record_14","record_30","record_60","record_100","record_180","record_365","record_730"],
	},
	{
		labelKey: "achievements.group.texts",
		ids: ["first_text","texts_2","texts_3","texts_5","texts_7","texts_10","texts_15","texts_20","texts_30","texts_50","texts_100","texts_200","texts_500"],
	},
	{
		labelKey: "achievements.group.reviews",
		ids: ["first_review","reviews_5","reviews_10","reviews_25","reviews_50","reviews_100","reviews_200","reviews_250","reviews_500","reviews_750","reviews_1000","reviews_2000","reviews_3000","reviews_5000","reviews_7500","reviews_10000","reviews_15000","reviews_25000","reviews_50000"],
	},
	{
		labelKey: "achievements.group.accuracy",
		ids: ["acc_50","acc_60","acc_75","acc_85","acc_90","acc_95","acc_99","streak_review_5","streak_review_10","streak_review_25","streak_review_50","streak_review_100","streak_review_200","streak_review_500"],
	},
	{
		labelKey: "achievements.group.phrases",
		ids: ["first_phrase","phrases_5","phrases_10","phrases_25","phrases_50","phrases_100","phrases_200","phrases_500","phrases_1000","phrases_2000"],
	},
	{
		labelKey: "achievements.group.time",
		ids: ["read_5min","read_10min","read_30min","read_60min","read_2h","read_5h","read_10h","read_20h","read_50h","read_100h","read_200h","read_sessions_3","read_sessions_5","read_sessions_10","read_sessions_25","read_sessions_50","read_sessions_100","read_sessions_200","read_sessions_500"],
	},
	{
		labelKey: "achievements.group.account",
		ids: ["days_1","days_3","days_7","days_14","days_30","days_60","days_90","days_180","days_365","days_730","days_1095"],
	},
	{
		labelKey: "achievements.group.learning",
		ids: ["learning_words_5","learning_words_10","learning_words_25","learning_words_50","learning_words_100","learning_words_200"],
	},
	{
		labelKey: "achievements.group.journey",
		ids: ["journey_10pct_known","journey_25pct_known","journey_50pct_known","journey_75pct_known","persist_100w_100r","persist_500w_500r","persist_1000w_1000r","milestone_50w_50r","milestone_200w_200r"],
	},
	{
		labelKey: "achievements.group.combo",
		ids: ["combo_scholar","combo_master","complete_starter","complete_learner","complete_master","complete_expert","phrase_reader","phrase_scholar"],
	},
];

const LABELS: Record<string, { title: string; desc: string }> = {
	first_word:            { title: "achievements.first_word.title",            desc: "achievements.first_word.desc" },
	words_5:               { title: "achievements.words_5.title",               desc: "achievements.words_5.desc" },
	words_10:              { title: "achievements.words_10.title",              desc: "achievements.words_10.desc" },
	words_25:              { title: "achievements.words_25.title",              desc: "achievements.words_25.desc" },
	words_50:              { title: "achievements.words_50.title",              desc: "achievements.words_50.desc" },
	words_75:              { title: "achievements.words_75.title",              desc: "achievements.words_75.desc" },
	words_100:             { title: "achievements.words_100.title",             desc: "achievements.words_100.desc" },
	words_150:             { title: "achievements.words_150.title",             desc: "achievements.words_150.desc" },
	words_200:             { title: "achievements.words_200.title",             desc: "achievements.words_200.desc" },
	words_250:             { title: "achievements.words_250.title",             desc: "achievements.words_250.desc" },
	words_350:             { title: "achievements.words_350.title",             desc: "achievements.words_350.desc" },
	words_500:             { title: "achievements.words_500.title",             desc: "achievements.words_500.desc" },
	words_750:             { title: "achievements.words_750.title",             desc: "achievements.words_750.desc" },
	words_1000:            { title: "achievements.words_1000.title",            desc: "achievements.words_1000.desc" },
	words_1500:            { title: "achievements.words_1500.title",            desc: "achievements.words_1500.desc" },
	words_2000:            { title: "achievements.words_2000.title",            desc: "achievements.words_2000.desc" },
	words_3000:            { title: "achievements.words_3000.title",            desc: "achievements.words_3000.desc" },
	words_4000:            { title: "achievements.words_4000.title",            desc: "achievements.words_4000.desc" },
	words_5000:            { title: "achievements.words_5000.title",            desc: "achievements.words_5000.desc" },
	words_7500:            { title: "achievements.words_7500.title",            desc: "achievements.words_7500.desc" },
	words_10000:           { title: "achievements.words_10000.title",           desc: "achievements.words_10000.desc" },
	known_1:               { title: "achievements.known_1.title",               desc: "achievements.known_1.desc" },
	known_5:               { title: "achievements.known_5.title",               desc: "achievements.known_5.desc" },
	known_10:              { title: "achievements.known_10.title",              desc: "achievements.known_10.desc" },
	known_25:              { title: "achievements.known_25.title",              desc: "achievements.known_25.desc" },
	known_50:              { title: "achievements.known_50.title",              desc: "achievements.known_50.desc" },
	known_100:             { title: "achievements.known_100.title",             desc: "achievements.known_100.desc" },
	known_250:             { title: "achievements.known_250.title",             desc: "achievements.known_250.desc" },
	known_500:             { title: "achievements.known_500.title",             desc: "achievements.known_500.desc" },
	known_1000:            { title: "achievements.known_1000.title",            desc: "achievements.known_1000.desc" },
	known_2000:            { title: "achievements.known_2000.title",            desc: "achievements.known_2000.desc" },
	known_5000:            { title: "achievements.known_5000.title",            desc: "achievements.known_5000.desc" },
	words_day_3:           { title: "achievements.words_day_3.title",           desc: "achievements.words_day_3.desc" },
	words_day_5:           { title: "achievements.words_day_5.title",           desc: "achievements.words_day_5.desc" },
	words_day_10:          { title: "achievements.words_day_10.title",          desc: "achievements.words_day_10.desc" },
	words_day_15:          { title: "achievements.words_day_15.title",          desc: "achievements.words_day_15.desc" },
	words_day_20:          { title: "achievements.words_day_20.title",          desc: "achievements.words_day_20.desc" },
	words_day_30:          { title: "achievements.words_day_30.title",          desc: "achievements.words_day_30.desc" },
	words_day_50:          { title: "achievements.words_day_50.title",          desc: "achievements.words_day_50.desc" },
	words_day_75:          { title: "achievements.words_day_75.title",          desc: "achievements.words_day_75.desc" },
	words_day_100:         { title: "achievements.words_day_100.title",         desc: "achievements.words_day_100.desc" },
	streak_2:              { title: "achievements.streak_2.title",              desc: "achievements.streak_2.desc" },
	streak_3:              { title: "achievements.streak_3.title",              desc: "achievements.streak_3.desc" },
	streak_5:              { title: "achievements.streak_5.title",              desc: "achievements.streak_5.desc" },
	streak_7:              { title: "achievements.streak_7.title",              desc: "achievements.streak_7.desc" },
	streak_10:             { title: "achievements.streak_10.title",             desc: "achievements.streak_10.desc" },
	streak_14:             { title: "achievements.streak_14.title",             desc: "achievements.streak_14.desc" },
	streak_21:             { title: "achievements.streak_21.title",             desc: "achievements.streak_21.desc" },
	streak_30:             { title: "achievements.streak_30.title",             desc: "achievements.streak_30.desc" },
	streak_45:             { title: "achievements.streak_45.title",             desc: "achievements.streak_45.desc" },
	streak_60:             { title: "achievements.streak_60.title",             desc: "achievements.streak_60.desc" },
	streak_90:             { title: "achievements.streak_90.title",             desc: "achievements.streak_90.desc" },
	streak_100:            { title: "achievements.streak_100.title",            desc: "achievements.streak_100.desc" },
	streak_180:            { title: "achievements.streak_180.title",            desc: "achievements.streak_180.desc" },
	streak_365:            { title: "achievements.streak_365.title",            desc: "achievements.streak_365.desc" },
	streak_500:            { title: "achievements.streak_500.title",            desc: "achievements.streak_500.desc" },
	streak_730:            { title: "achievements.streak_730.title",            desc: "achievements.streak_730.desc" },
	record_3:              { title: "achievements.record_3.title",              desc: "achievements.record_3.desc" },
	record_7:              { title: "achievements.record_7.title",              desc: "achievements.record_7.desc" },
	record_14:             { title: "achievements.record_14.title",             desc: "achievements.record_14.desc" },
	record_30:             { title: "achievements.record_30.title",             desc: "achievements.record_30.desc" },
	record_60:             { title: "achievements.record_60.title",             desc: "achievements.record_60.desc" },
	record_100:            { title: "achievements.record_100.title",            desc: "achievements.record_100.desc" },
	record_180:            { title: "achievements.record_180.title",            desc: "achievements.record_180.desc" },
	record_365:            { title: "achievements.record_365.title",            desc: "achievements.record_365.desc" },
	record_730:            { title: "achievements.record_730.title",            desc: "achievements.record_730.desc" },
	first_text:            { title: "achievements.first_text.title",            desc: "achievements.first_text.desc" },
	texts_2:               { title: "achievements.texts_2.title",               desc: "achievements.texts_2.desc" },
	texts_3:               { title: "achievements.texts_3.title",               desc: "achievements.texts_3.desc" },
	texts_5:               { title: "achievements.texts_5.title",               desc: "achievements.texts_5.desc" },
	texts_7:               { title: "achievements.texts_7.title",               desc: "achievements.texts_7.desc" },
	texts_10:              { title: "achievements.texts_10.title",              desc: "achievements.texts_10.desc" },
	texts_15:              { title: "achievements.texts_15.title",              desc: "achievements.texts_15.desc" },
	texts_20:              { title: "achievements.texts_20.title",              desc: "achievements.texts_20.desc" },
	texts_30:              { title: "achievements.texts_30.title",              desc: "achievements.texts_30.desc" },
	texts_50:              { title: "achievements.texts_50.title",              desc: "achievements.texts_50.desc" },
	texts_100:             { title: "achievements.texts_100.title",             desc: "achievements.texts_100.desc" },
	texts_200:             { title: "achievements.texts_200.title",             desc: "achievements.texts_200.desc" },
	texts_500:             { title: "achievements.texts_500.title",             desc: "achievements.texts_500.desc" },
	first_review:          { title: "achievements.first_review.title",          desc: "achievements.first_review.desc" },
	reviews_5:             { title: "achievements.reviews_5.title",             desc: "achievements.reviews_5.desc" },
	reviews_10:            { title: "achievements.reviews_10.title",            desc: "achievements.reviews_10.desc" },
	reviews_25:            { title: "achievements.reviews_25.title",            desc: "achievements.reviews_25.desc" },
	reviews_50:            { title: "achievements.reviews_50.title",            desc: "achievements.reviews_50.desc" },
	reviews_100:           { title: "achievements.reviews_100.title",           desc: "achievements.reviews_100.desc" },
	reviews_200:           { title: "achievements.reviews_200.title",           desc: "achievements.reviews_200.desc" },
	reviews_250:           { title: "achievements.reviews_250.title",           desc: "achievements.reviews_250.desc" },
	reviews_500:           { title: "achievements.reviews_500.title",           desc: "achievements.reviews_500.desc" },
	reviews_750:           { title: "achievements.reviews_750.title",           desc: "achievements.reviews_750.desc" },
	reviews_1000:          { title: "achievements.reviews_1000.title",          desc: "achievements.reviews_1000.desc" },
	reviews_2000:          { title: "achievements.reviews_2000.title",          desc: "achievements.reviews_2000.desc" },
	reviews_3000:          { title: "achievements.reviews_3000.title",          desc: "achievements.reviews_3000.desc" },
	reviews_5000:          { title: "achievements.reviews_5000.title",          desc: "achievements.reviews_5000.desc" },
	reviews_7500:          { title: "achievements.reviews_7500.title",          desc: "achievements.reviews_7500.desc" },
	reviews_10000:         { title: "achievements.reviews_10000.title",         desc: "achievements.reviews_10000.desc" },
	reviews_15000:         { title: "achievements.reviews_15000.title",         desc: "achievements.reviews_15000.desc" },
	reviews_25000:         { title: "achievements.reviews_25000.title",         desc: "achievements.reviews_25000.desc" },
	reviews_50000:         { title: "achievements.reviews_50000.title",         desc: "achievements.reviews_50000.desc" },
	acc_50:                { title: "achievements.acc_50.title",                desc: "achievements.acc_50.desc" },
	acc_60:                { title: "achievements.acc_60.title",                desc: "achievements.acc_60.desc" },
	acc_75:                { title: "achievements.acc_75.title",                desc: "achievements.acc_75.desc" },
	acc_85:                { title: "achievements.acc_85.title",                desc: "achievements.acc_85.desc" },
	acc_90:                { title: "achievements.acc_90.title",                desc: "achievements.acc_90.desc" },
	acc_95:                { title: "achievements.acc_95.title",                desc: "achievements.acc_95.desc" },
	acc_99:                { title: "achievements.acc_99.title",                desc: "achievements.acc_99.desc" },
	streak_review_5:       { title: "achievements.streak_review_5.title",       desc: "achievements.streak_review_5.desc" },
	streak_review_10:      { title: "achievements.streak_review_10.title",      desc: "achievements.streak_review_10.desc" },
	streak_review_25:      { title: "achievements.streak_review_25.title",      desc: "achievements.streak_review_25.desc" },
	streak_review_50:      { title: "achievements.streak_review_50.title",      desc: "achievements.streak_review_50.desc" },
	streak_review_100:     { title: "achievements.streak_review_100.title",     desc: "achievements.streak_review_100.desc" },
	streak_review_200:     { title: "achievements.streak_review_200.title",     desc: "achievements.streak_review_200.desc" },
	streak_review_500:     { title: "achievements.streak_review_500.title",     desc: "achievements.streak_review_500.desc" },
	first_phrase:          { title: "achievements.first_phrase.title",          desc: "achievements.first_phrase.desc" },
	phrases_5:             { title: "achievements.phrases_5.title",             desc: "achievements.phrases_5.desc" },
	phrases_10:            { title: "achievements.phrases_10.title",            desc: "achievements.phrases_10.desc" },
	phrases_25:            { title: "achievements.phrases_25.title",            desc: "achievements.phrases_25.desc" },
	phrases_50:            { title: "achievements.phrases_50.title",            desc: "achievements.phrases_50.desc" },
	phrases_100:           { title: "achievements.phrases_100.title",           desc: "achievements.phrases_100.desc" },
	phrases_200:           { title: "achievements.phrases_200.title",           desc: "achievements.phrases_200.desc" },
	phrases_500:           { title: "achievements.phrases_500.title",           desc: "achievements.phrases_500.desc" },
	phrases_1000:          { title: "achievements.phrases_1000.title",          desc: "achievements.phrases_1000.desc" },
	phrases_2000:          { title: "achievements.phrases_2000.title",          desc: "achievements.phrases_2000.desc" },
	read_5min:             { title: "achievements.read_5min.title",             desc: "achievements.read_5min.desc" },
	read_10min:            { title: "achievements.read_10min.title",            desc: "achievements.read_10min.desc" },
	read_30min:            { title: "achievements.read_30min.title",            desc: "achievements.read_30min.desc" },
	read_60min:            { title: "achievements.read_60min.title",            desc: "achievements.read_60min.desc" },
	read_2h:               { title: "achievements.read_2h.title",               desc: "achievements.read_2h.desc" },
	read_5h:               { title: "achievements.read_5h.title",               desc: "achievements.read_5h.desc" },
	read_10h:              { title: "achievements.read_10h.title",              desc: "achievements.read_10h.desc" },
	read_20h:              { title: "achievements.read_20h.title",              desc: "achievements.read_20h.desc" },
	read_50h:              { title: "achievements.read_50h.title",              desc: "achievements.read_50h.desc" },
	read_100h:             { title: "achievements.read_100h.title",             desc: "achievements.read_100h.desc" },
	read_200h:             { title: "achievements.read_200h.title",             desc: "achievements.read_200h.desc" },
	read_sessions_3:       { title: "achievements.read_sessions_3.title",       desc: "achievements.read_sessions_3.desc" },
	read_sessions_5:       { title: "achievements.read_sessions_5.title",       desc: "achievements.read_sessions_5.desc" },
	read_sessions_10:      { title: "achievements.read_sessions_10.title",      desc: "achievements.read_sessions_10.desc" },
	read_sessions_25:      { title: "achievements.read_sessions_25.title",      desc: "achievements.read_sessions_25.desc" },
	read_sessions_50:      { title: "achievements.read_sessions_50.title",      desc: "achievements.read_sessions_50.desc" },
	read_sessions_100:     { title: "achievements.read_sessions_100.title",     desc: "achievements.read_sessions_100.desc" },
	read_sessions_200:     { title: "achievements.read_sessions_200.title",     desc: "achievements.read_sessions_200.desc" },
	read_sessions_500:     { title: "achievements.read_sessions_500.title",     desc: "achievements.read_sessions_500.desc" },
	days_1:                { title: "achievements.days_1.title",                desc: "achievements.days_1.desc" },
	days_3:                { title: "achievements.days_3.title",                desc: "achievements.days_3.desc" },
	days_7:                { title: "achievements.days_7.title",                desc: "achievements.days_7.desc" },
	days_14:               { title: "achievements.days_14.title",               desc: "achievements.days_14.desc" },
	days_30:               { title: "achievements.days_30.title",               desc: "achievements.days_30.desc" },
	days_60:               { title: "achievements.days_60.title",               desc: "achievements.days_60.desc" },
	days_90:               { title: "achievements.days_90.title",               desc: "achievements.days_90.desc" },
	days_180:              { title: "achievements.days_180.title",              desc: "achievements.days_180.desc" },
	days_365:              { title: "achievements.days_365.title",              desc: "achievements.days_365.desc" },
	days_730:              { title: "achievements.days_730.title",              desc: "achievements.days_730.desc" },
	days_1095:             { title: "achievements.days_1095.title",             desc: "achievements.days_1095.desc" },
	learning_words_5:      { title: "achievements.learning_words_5.title",      desc: "achievements.learning_words_5.desc" },
	learning_words_10:     { title: "achievements.learning_words_10.title",     desc: "achievements.learning_words_10.desc" },
	learning_words_25:     { title: "achievements.learning_words_25.title",     desc: "achievements.learning_words_25.desc" },
	learning_words_50:     { title: "achievements.learning_words_50.title",     desc: "achievements.learning_words_50.desc" },
	learning_words_100:    { title: "achievements.learning_words_100.title",    desc: "achievements.learning_words_100.desc" },
	learning_words_200:    { title: "achievements.learning_words_200.title",    desc: "achievements.learning_words_200.desc" },
	journey_10pct_known:   { title: "achievements.journey_10pct_known.title",   desc: "achievements.journey_10pct_known.desc" },
	journey_25pct_known:   { title: "achievements.journey_25pct_known.title",   desc: "achievements.journey_25pct_known.desc" },
	journey_50pct_known:   { title: "achievements.journey_50pct_known.title",   desc: "achievements.journey_50pct_known.desc" },
	journey_75pct_known:   { title: "achievements.journey_75pct_known.title",   desc: "achievements.journey_75pct_known.desc" },
	persist_100w_100r:     { title: "achievements.persist_100w_100r.title",     desc: "achievements.persist_100w_100r.desc" },
	persist_500w_500r:     { title: "achievements.persist_500w_500r.title",     desc: "achievements.persist_500w_500r.desc" },
	persist_1000w_1000r:   { title: "achievements.persist_1000w_1000r.title",   desc: "achievements.persist_1000w_1000r.desc" },
	milestone_50w_50r:     { title: "achievements.milestone_50w_50r.title",     desc: "achievements.milestone_50w_50r.desc" },
	milestone_200w_200r:   { title: "achievements.milestone_200w_200r.title",   desc: "achievements.milestone_200w_200r.desc" },
	combo_scholar:         { title: "achievements.combo_scholar.title",         desc: "achievements.combo_scholar.desc" },
	combo_master:          { title: "achievements.combo_master.title",          desc: "achievements.combo_master.desc" },
	complete_starter:      { title: "achievements.complete_starter.title",      desc: "achievements.complete_starter.desc" },
	complete_learner:      { title: "achievements.complete_learner.title",      desc: "achievements.complete_learner.desc" },
	complete_master:       { title: "achievements.complete_master.title",       desc: "achievements.complete_master.desc" },
	complete_expert:       { title: "achievements.complete_expert.title",       desc: "achievements.complete_expert.desc" },
	phrase_reader:         { title: "achievements.phrase_reader.title",         desc: "achievements.phrase_reader.desc" },
	phrase_scholar:        { title: "achievements.phrase_scholar.title",        desc: "achievements.phrase_scholar.desc" },
};

// Split groups evenly into two columns
const LEFT_GROUPS = GROUPS.filter((_, i) => i % 2 === 0);
const RIGHT_GROUPS = GROUPS.filter((_, i) => i % 2 === 1);

const GroupSection = ({ group, byId, t }: { group: typeof GROUPS[0]; byId: Record<string, { id: string; icon: string; reached: boolean }>; t: (key: string) => string }) => {
	const items = group.ids.map(id => byId[id]).filter(Boolean);
	if (items.length === 0) return null;
	return (
		<div>
			<Typography tag="p" className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
				{t(group.labelKey)}
			</Typography>
			<div className="flex flex-wrap gap-1.5">
				{items.map(a => {
					const lbl = LABELS[a.id];
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
				<svg
					viewBox="0 0 16 16"
					fill="none"
					strokeWidth="1.5"
					className={cn("size-4 shrink-0 stroke-t-3 transition-transform", isExpanded && "rotate-180")}
				>
					<path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</button>

			{isExpanded && (
				<div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 max-sm:grid-cols-1">
					<div className="flex flex-col gap-3">
						{LEFT_GROUPS.map(group => (
							<GroupSection key={group.labelKey} group={group} byId={byId} t={t} />
						))}
					</div>
					<div className="flex flex-col gap-3">
						{RIGHT_GROUPS.map(group => (
							<GroupSection key={group.labelKey} group={group} byId={byId} t={t} />
						))}
					</div>
				</div>
			)}
		</section>
	);
};
