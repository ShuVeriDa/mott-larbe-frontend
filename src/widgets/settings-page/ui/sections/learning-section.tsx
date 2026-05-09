"use client";

import { type UserGoals, type UserPreferences } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { InputLabel } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { useLearningSection } from "../../model/use-learning-section";
import { SectionHeader } from "../section-header";
import { SettingCard } from "../setting-card";
import { ToggleRow } from "../toggle-row";

export interface LearningSectionProps {
	preferences: UserPreferences;
	goals: UserGoals;
}

export const LearningSection = ({
	preferences,
	goals,
}: LearningSectionProps) => {
	const { t } = useI18n();
	const {
		learningLang,
		level,
		transLang,
		dailyWords,
		dailyMinutes,
		isPrefSaving,
		isGoalsSaving,
		handleLanguageSave,
		handleGoalsSave,
		handleLearningLangChange,
		handleLevelChange,
		handleTransLangChange,
		handleDailyWordsChange,
		handleDailyMinutesChange,
		handleAutoAddChange,
		handleShowGrammarChange,
		handleShowExamplesChange,
		handleShowReviewReminderChange,
		handleEnableDecksChange,
	} = useLearningSection({ preferences, goals });

	return (
		<div className="flex flex-col gap-3.5">
			<SectionHeader
				title={t("settings.learning.title")}
				subtitle={t("settings.learning.sub")}
			/>

			<SettingCard title={t("settings.learning.languageLevel")}>
				<form action={handleLanguageSave} className="flex flex-col gap-3">
					<div className="flex gap-2.5 max-sm:flex-col">
						<div className="flex-1">
							<InputLabel htmlFor="learning-lang">
								{t("settings.learning.learningLang")}
							</InputLabel>
							<Select
								id="learning-lang"
								value={learningLang}
								onChange={handleLearningLangChange}
							>
								<option value="CHE">
									{t("settings.learning.learningLangChe")}
								</option>
								<option value="RU">
									{t("settings.learning.learningLangRu")}
								</option>
							</Select>
						</div>
						<div className="flex-1">
							<InputLabel htmlFor="learning-level">
								{t("settings.learning.level")}
							</InputLabel>
							<Select
								id="learning-level"
								value={level}
								onChange={handleLevelChange}
							>
								<option value="A1">{t("settings.learning.levelA1")}</option>
								<option value="A2">{t("settings.learning.levelA2")}</option>
								<option value="B1">{t("settings.learning.levelB1")}</option>
								<option value="B2">{t("settings.learning.levelB2")}</option>
								<option value="C1">{t("settings.learning.levelC1")}</option>
								<option value="C2">{t("settings.learning.levelC2")}</option>
							</Select>
						</div>
					</div>
					<div>
						<InputLabel htmlFor="trans-lang">
							{t("settings.learning.transLang")}
						</InputLabel>
						<Select
							id="trans-lang"
							value={transLang}
							onChange={handleTransLangChange}
							wrapperClassName="max-w-[280px]"
						>
							<option value="RU">{t("settings.appearance.langRu")}</option>
							<option value="EN">{t("settings.appearance.langEn")}</option>
						</Select>
						<Typography
							tag="span"
							className="mt-1.5 block text-[11px] text-t-3"
						>
							{t("settings.learning.transLangHint")}
						</Typography>
					</div>
					<div className="mt-1 flex justify-end">
						<Button type="submit" variant="action" disabled={isPrefSaving}>
							{isPrefSaving
								? t("settings.common.saving")
								: t("settings.common.save")}
						</Button>
					</div>
				</form>
			</SettingCard>

			<SettingCard title={t("settings.learning.dailyGoal")}>
				<form action={handleGoalsSave} className="flex flex-col gap-3">
					<div>
						<InputLabel htmlFor="daily-words">
							{t("settings.learning.newWords")}
						</InputLabel>
						<Select
							id="daily-words"
							value={dailyWords}
							onChange={handleDailyWordsChange}
							wrapperClassName="max-w-[200px]"
						>
							{[5, 10, 20, 30, 50].map(n => (
								<option key={n} value={n}>
									{n} {t("settings.learning.wordsUnit")}
								</option>
							))}
						</Select>
					</div>
					<div>
						<InputLabel htmlFor="daily-minutes">
							{t("settings.learning.readingMinutes")}
						</InputLabel>
						<Select
							id="daily-minutes"
							value={dailyMinutes}
							onChange={handleDailyMinutesChange}
							wrapperClassName="max-w-[200px]"
						>
							{[5, 15, 30, 60].map(n => (
								<option key={n} value={n}>
									{n} {t("settings.learning.minutesUnit")}
								</option>
							))}
						</Select>
					</div>
					<div className="mt-1 flex justify-end">
						<Button type="submit" variant="action" disabled={isGoalsSaving}>
							{isGoalsSaving
								? t("settings.common.saving")
								: t("settings.common.save")}
						</Button>
					</div>
				</form>
			</SettingCard>

			<SettingCard title={t("settings.learning.dictBehavior")} noBody>
				<ToggleRow
					label={t("settings.learning.autoAdd")}
					description={t("settings.learning.autoAddDesc")}
					checked={preferences.autoAddOnClick}
					onChange={handleAutoAddChange}
				/>
				<ToggleRow
					label={t("settings.learning.showGrammar")}
					description={t("settings.learning.showGrammarDesc")}
					checked={preferences.showGrammar}
					onChange={handleShowGrammarChange}
				/>
				<ToggleRow
					label={t("settings.learning.showExamples")}
					description={t("settings.learning.showExamplesDesc")}
					checked={preferences.showExamples}
					onChange={handleShowExamplesChange}
				/>
			</SettingCard>

			<SettingCard
				title={t("settings.learning.srs")}
				headExtra={
					<span className="rounded bg-pur-bg px-1.5 py-0.5 text-[10.5px] font-medium text-pur-t">
						{t("settings.premium")}
					</span>
				}
				noBody
			>
				<ToggleRow
					label={t("settings.learning.reviewReminder")}
					description={t("settings.learning.reviewReminderDesc")}
					checked={preferences.showReviewReminder}
					onChange={handleShowReviewReminderChange}
				/>
				<ToggleRow
					label={t("settings.learning.enableDecks")}
					description={t("settings.learning.enableDecksDesc")}
					checked={preferences.enableDecks}
					onChange={handleEnableDecksChange}
				/>
			</SettingCard>
		</div>
	);
};
