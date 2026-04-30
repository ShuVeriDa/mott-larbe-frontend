export type CefrLevel = "A1" | "A2" | "B1" | "B2";

export const CEFR_LEVELS: readonly CefrLevel[] = [
	"A1",
	"A2",
	"B1",
	"B2",
] as const;
