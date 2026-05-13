import type { CefrLevel } from "@/shared/types";

export const CEFR_LEVEL_BADGE_CLASS: Record<CefrLevel, string> = {
	A: "bg-grn-bg text-grn-t",
	B: "bg-acc-bg text-acc-t",
	C: "bg-amb-bg text-amb-t",
};
