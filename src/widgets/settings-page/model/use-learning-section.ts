import {
	useUpdateGoals,
	useUpdatePreferences,
	type TranslationLanguage,
	type UserGoals,
	type UserPreferences,
} from "@/entities/settings";
import {
	useCurrentUser,
	useUpdateUser,
	type UserLanguage,
	type UserLevel,
} from "@/entities/user";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from "react";

export interface UseLearningSectionParams {
	preferences: UserPreferences;
	goals: UserGoals;
}

export const useLearningSection = ({
	preferences,
	goals,
}: UseLearningSectionParams) => {
	const { t } = useI18n();
	const { data: user } = useCurrentUser();
	const { mutateAsync: updatePrefs, isPending: isPrefSaving } =
		useUpdatePreferences();
	const { mutateAsync: updateGoals, isPending: isGoalsSaving } =
		useUpdateGoals();
	const { mutateAsync: updateUser, isPending: isUserSaving } = useUpdateUser();
	const { success, error } = useToast();

	const [learningLang, setLearningLang] = useState<UserLanguage>(
		user?.language ?? "CHE",
	);
	const [level, setLevel] = useState<UserLevel>(user?.level ?? "B1");
	const [transLang, setTransLang] = useState<TranslationLanguage>(
		preferences.translationLanguage,
	);
	const [dailyWords, setDailyWords] = useState<number>(goals.dailyWords);
	const [dailyMinutes, setDailyMinutes] = useState<number>(goals.dailyMinutes);

	useEffect(() => {
		if (user?.language) setLearningLang(user.language);
		if (user?.level) setLevel(user.level);
	}, [user?.language, user?.level]);

	const handleLanguageSave = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		try {
			await Promise.all([
				updatePrefs({ translationLanguage: transLang }),
				updateUser({ language: learningLang, level }),
			]);
			success(t("settings.toasts.languageSaved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	const handleGoalsSave = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		try {
			await updateGoals({ dailyWords, dailyMinutes });
			success(t("settings.toasts.goalsSaved"));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	const handleLearningLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setLearningLang(e.currentTarget.value as "CHE" | "RU");
	};

	const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setLevel(e.currentTarget.value);
	};

	const handleTransLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setTransLang(e.currentTarget.value as TranslationLanguage);
	};

	const handleDailyWordsChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setDailyWords(Number(e.currentTarget.value));
	};

	const handleDailyMinutesChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setDailyMinutes(Number(e.currentTarget.value));
	};

	const updatePreference = async (
		patch: Partial<UserPreferences>,
		successKey = "settings.toasts.saved",
	) => {
		try {
			await updatePrefs(patch);
			success(t(successKey));
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	const handleAutoAddChange = (value: boolean) =>
		updatePreference({ autoAddOnClick: value });

	const handleShowGrammarChange = (value: boolean) =>
		updatePreference({ showGrammar: value });

	const handleShowExamplesChange = (value: boolean) =>
		updatePreference({ showExamples: value });

	const handleShowReviewReminderChange = (value: boolean) =>
		updatePreference({ showReviewReminder: value });

	const handleEnableDecksChange = (value: boolean) =>
		updatePreference({ enableDecks: value });

	return {
		learningLang,
		level,
		transLang,
		dailyWords,
		dailyMinutes,
		isPrefSaving: isPrefSaving || isUserSaving,
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
	};
};
