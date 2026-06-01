import type { CefrLevel } from "@/shared/types";

export type LibraryPreviewLevelStyle = {
	badge: string;
	cov: string;
	stripe: string;
	/** AA-safe text color for the progress percentage (darker than stripe) */
	stripeText: string;
	glow: string;
};

export const LIBRARY_PREVIEW_LEVEL_CLASSES: Record<
	CefrLevel,
	LibraryPreviewLevelStyle
> = {
	A: { badge: "bg-grn-bg text-grn-t", cov: "bg-grn-bg", stripe: "var(--grn)", stripeText: "var(--grn-t)", glow: "#22c55e" },
	B: { badge: "bg-acc-bg text-acc-t", cov: "bg-acc-bg", stripe: "var(--acc)", stripeText: "var(--acc-t)", glow: "#2563eb" },
	C: { badge: "bg-amb-bg text-amb-t", cov: "bg-amb-bg", stripe: "var(--amb)", stripeText: "var(--amb-t)", glow: "#f59e0b" },
};

const DEFAULT_LEVEL_COLORS = LIBRARY_PREVIEW_LEVEL_CLASSES.B;

export const getLibraryPreviewLevelColors = (
	level: string | null,
): LibraryPreviewLevelStyle =>
	LIBRARY_PREVIEW_LEVEL_CLASSES[(level as CefrLevel) ?? ""] ??
	DEFAULT_LEVEL_COLORS;

export const getLibraryPreviewProgressBarColor = (
	pct: number,
	stripe: string,
): string => {
	if (pct > 0) return stripe;
	return "transparent";
};
