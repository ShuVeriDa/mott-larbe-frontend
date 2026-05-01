import type { LearningLevel } from "@/shared/types";

export const tokenStatusClass = (
	status: LearningLevel | null | undefined,
): string => {
	switch (status) {
		case "KNOWN":
			return "underline decoration-grn decoration-[1.5px] underline-offset-2";
		case "LEARNING":
			return "underline decoration-amb decoration-[1.5px] underline-offset-2";
		case "NEW":
			return "underline decoration-t-4 decoration-1 underline-offset-2";
		default:
			return "";
	}
};
