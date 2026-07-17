import type { GeneratedContentType } from "@/entities/text-generation";

export const CONTENT_TYPE_OPTIONS: { value: GeneratedContentType; labelKey: string }[] = [
	{ value: "PROSE", labelKey: "myTexts.generate.contentType.prose" },
	{ value: "DIALOGUE", labelKey: "myTexts.generate.contentType.dialogue" },
	{ value: "STORY", labelKey: "myTexts.generate.contentType.story" },
];
