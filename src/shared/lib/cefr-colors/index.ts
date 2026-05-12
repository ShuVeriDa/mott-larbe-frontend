import type { CefrLevel } from "@/shared/types";

export const CEFR_LEVEL_BADGE_CLASS: Record<CefrLevel, string> = {
	A1: "bg-grn-bg text-grn-t",
	A2: "bg-grn-bg text-grn-t",
	B1: "bg-acc-bg text-acc-t",
	B2: "bg-pur-bg text-pur-t",
	C1: "bg-amb-bg text-amb-t",
	C2: "bg-red-bg text-red-t",
};
