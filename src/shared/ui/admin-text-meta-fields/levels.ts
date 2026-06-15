import { CEFR_LEVELS, type CefrLevel as TextLevel } from "@/shared/types";

export const LEVELS: TextLevel[] = CEFR_LEVELS as TextLevel[];

export const levelColorMap: Record<TextLevel, string> = {
	// A: "bg-grn-bg border-grn/25 text-grn-t",
	A: "bg-[#d1fae5] border-[rgba(6,95,70,0.25)] text-grn-t dark:bg-[rgba(6,95,70,0.12)] dark:text-[#6ee7b7]",
	// B: "bg-acc-bg border-acc/25 text-acc-t",
	B: "bg-pur-bg border-pur/20 text-pur-t",
	// C: "bg-amb-bg border-amb/20 text-amb-t",
	C: "bg-red-bg border-red/20 text-red-t",
};
