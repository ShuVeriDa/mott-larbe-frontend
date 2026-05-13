import { Badge } from "@/shared/ui/badge";
import type { CefrLevel } from "@/shared/types";

const VARIANT: Record<CefrLevel, "acc" | "grn" | "amb"> = {
	A: "grn",
	B: "acc",
	C: "amb",
};

export interface CefrBadgeProps {
	level: CefrLevel;
}

export const CefrBadge = ({ level }: CefrBadgeProps) => (
	<Badge variant={VARIANT[level]}>{level}</Badge>
);
