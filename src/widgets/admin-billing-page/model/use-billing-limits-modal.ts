"use client";

import { type ComponentProps, type SyntheticEvent, useEffect, useState } from "react";
import type { AdminPlan, PlanLimits } from "@/entities/admin-billing";
import { useI18n } from "@/shared/lib/i18n";

interface NumericField {
	key: keyof PlanLimits;
	label: string;
}

interface BoolField {
	key: keyof PlanLimits;
	label: string;
}

const numericFields: NumericField[] = [
	{ key: "translationsPerDay", label: "Переводов в день" },
	{ key: "wordsInDictionary", label: "Слов в словаре" },
	{ key: "availableTexts", label: "Доступных текстов" },
	{ key: "statisticsDays", label: "Дней статистики" },
	{ key: "maxFolders", label: "Папок словаря" },
];

const boolFields: BoolField[] = [
	{ key: "readTexts", label: "Чтение текстов" },
	{ key: "wordTranslation", label: "Перевод слов" },
	{ key: "tokenAnalysis", label: "Анализ токенов" },
	{ key: "personalDictionary", label: "Личный словарь" },
	{ key: "dictionaryFolders", label: "Папки словаря" },
	{ key: "hasComplexTexts", label: "Сложные тексты" },
	{ key: "textProgress", label: "Прогресс чтения" },
	{ key: "spaceRepetition", label: "Система повторений" },
	{ key: "hasFlashcards", label: "Флэш-карточки" },
	{ key: "wordContexts", label: "Контексты слов" },
	{ key: "analytics", label: "Статистика" },
	{ key: "hasAdvancedAnalytics", label: "Расш. аналитика" },
	{ key: "hasPrioritySupport", label: "Приоритетная поддержка" },
];

type NumericState = Record<string, string>;
type BoolState = Record<string, boolean>;

const buildInitialNumeric = (limits: PlanLimits): NumericState => {
	const result: NumericState = {};
	for (const { key } of numericFields) {
		const value = limits[key as keyof PlanLimits];
		result[key as string] = value !== undefined ? String(value) : "-1";
	}
	return result;
};

const buildInitialBool = (limits: PlanLimits): BoolState => {
	const result: BoolState = {};
	for (const { key } of boolFields) {
		result[key as string] = Boolean(limits[key as keyof PlanLimits]);
	}
	return result;
};

interface UseBillingLimitsModalParams {
	open: boolean;
	plan: AdminPlan | null;
	onSubmit: (id: string, limits: Partial<PlanLimits>) => void;
}

export const useBillingLimitsModal = ({
	open,
	plan,
	onSubmit,
}: UseBillingLimitsModalParams) => {
	const { t } = useI18n();
	const [numeric, setNumeric] = useState<NumericState>({});
	const [bools, setBools] = useState<BoolState>({});

	useEffect(() => {
		if (!open || !plan) return;
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setNumeric(buildInitialNumeric(plan.limits));
		setBools(buildInitialBool(plan.limits));
	}, [open, plan]);

	const handleSubmit = (event: SyntheticEvent) => {
		event.preventDefault();
		if (!plan) return;

		const limits: Partial<PlanLimits> = { ...plan.limits };
		for (const { key } of numericFields) {
			(limits as Record<string, unknown>)[key as string] = Number(
				numeric[key as string] ?? -1,
			);
		}
		for (const { key } of boolFields) {
			(limits as Record<string, unknown>)[key as string] =
				bools[key as string] ?? false;
		}
		onSubmit(plan.id, limits);
	};

	const handleContainerClick: NonNullable<ComponentProps<"div">["onClick"]> = (
		event,
	) => event.stopPropagation();
	const handleNumericChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => {
		const field = event.currentTarget.dataset.field;
		if (!field) return;
		setNumeric((prev) => ({ ...prev, [field]: event.currentTarget.value }));
	};
	const handleBoolChange: NonNullable<ComponentProps<"input">["onChange"]> = (
		event,
	) => {
		const field = event.currentTarget.dataset.field;
		if (!field) return;
		setBools((prev) => ({ ...prev, [field]: event.currentTarget.checked }));
	};

	return {
		t,
		numericFields,
		boolFields,
		numeric,
		bools,
		handleSubmit,
		handleContainerClick,
		handleNumericChange,
		handleBoolChange,
	};
};
