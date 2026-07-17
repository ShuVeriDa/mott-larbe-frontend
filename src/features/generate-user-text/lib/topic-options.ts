import type { GenerationTopic } from "@/entities/text-generation";

// Значения (value) должны точно совпадать с GENERATION_TOPICS в backend
// generate-user-text.dto.ts — ручная синхронизация, нет общего пакета FE/BE.
export const TOPIC_OPTIONS: { value: GenerationTopic; labelKey: string }[] = [
	{ value: "FAMILY", labelKey: "myTexts.generate.topic.family" },
	{ value: "FOOD", labelKey: "myTexts.generate.topic.food" },
	{ value: "TRAVEL", labelKey: "myTexts.generate.topic.travel" },
	{ value: "NATURE", labelKey: "myTexts.generate.topic.nature" },
	{ value: "CITY", labelKey: "myTexts.generate.topic.city" },
	{ value: "WORK", labelKey: "myTexts.generate.topic.work" },
	{ value: "HOLIDAYS", labelKey: "myTexts.generate.topic.holidays" },
	{ value: "FRIENDSHIP", labelKey: "myTexts.generate.topic.friendship" },
	{ value: "CUSTOM", labelKey: "myTexts.generate.topic.custom" },
];
