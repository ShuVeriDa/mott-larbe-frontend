import type { GenerationTone } from "@/entities/text-generation";

export const TONE_OPTIONS: { value: GenerationTone; labelKey: string }[] = [
	{ value: "NEUTRAL", labelKey: "myTexts.generate.tone.neutral" },
	{ value: "CONVERSATIONAL", labelKey: "myTexts.generate.tone.conversational" },
	{ value: "FORMAL", labelKey: "myTexts.generate.tone.formal" },
];
