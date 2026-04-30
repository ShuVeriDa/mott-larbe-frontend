export type LearningLevel = "NEW" | "LEARNING" | "KNOWN";

export const LEARNING_LEVELS: readonly LearningLevel[] = [
	"NEW",
	"LEARNING",
	"KNOWN",
] as const;
