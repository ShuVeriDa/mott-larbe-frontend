import type { CefrLevel } from "@/shared/types";

export type LibraryPreviewLevelStyle = {
	badge: string;
	cov: string;
	stripe: string;
};

export const LIBRARY_PREVIEW_LEVEL_CLASSES: Record<
	CefrLevel,
	LibraryPreviewLevelStyle
> = {
	A1: { badge: "bg-amb-bg text-amb-t", cov: "bg-amb-bg", stripe: "var(--amb)" },
	A2: { badge: "bg-grn-bg text-grn-t", cov: "bg-grn-bg", stripe: "var(--grn)" },
	B1: { badge: "bg-acc-bg text-acc-t", cov: "bg-acc-bg", stripe: "var(--acc)" },
	B2: { badge: "bg-pur-bg text-pur-t", cov: "bg-pur-bg", stripe: "var(--pur)" },
	C1: {
		badge: "bg-ros-bg text-ros-t",
		cov: "bg-ros-bg",
		stripe: "var(--ros-t)",
	},
	C2: {
		badge: "bg-ros-bg text-ros-t",
		cov: "bg-ros-bg",
		stripe: "var(--ros-t)",
	},
};

const DEFAULT_LEVEL_COLORS = LIBRARY_PREVIEW_LEVEL_CLASSES.B1;

export const getLibraryPreviewLevelColors = (
	level: string | null,
): LibraryPreviewLevelStyle =>
	LIBRARY_PREVIEW_LEVEL_CLASSES[(level as CefrLevel) ?? ""] ??
	DEFAULT_LEVEL_COLORS;

export const getLibraryPreviewProgressBarColor = (pct: number): string => {
	if (pct >= 80) return "var(--grn)";
	if (pct > 0) return "var(--acc)";
	return "transparent";
};
