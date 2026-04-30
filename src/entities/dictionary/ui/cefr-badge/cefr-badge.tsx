import { Badge } from "@/shared/ui/badge";
import type { CefrLevel } from "@/shared/types";

const VARIANT: Record<CefrLevel, "acc" | "grn" | "amb" | "pur"> = {
	A1: "acc",
	A2: "grn",
	B1: "amb",
	B2: "pur",
};

export interface CefrBadgeProps {
	level: CefrLevel;
}

export const CefrBadge = ({ level }: CefrBadgeProps) => (
	<Badge variant={VARIANT[level]}>{level}</Badge>
);
