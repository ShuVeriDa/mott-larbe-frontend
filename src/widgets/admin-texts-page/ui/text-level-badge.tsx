import type { TextLevel } from "@/entities/admin-text";
import { CefrBadge } from "@/shared/ui/cefr-badge";

export const TextLevelBadge = ({ level }: { level: TextLevel | null }) => (
	<CefrBadge level={level} />
);
