import { AdminStatsBar } from "@/shared/ui/admin-stats-bar";
import type { SuggestionStats } from "@/features/suggestions";

interface AdminSuggestionsStatsProps {
	stats: SuggestionStats | undefined;
	t: (key: string) => string;
}

export const AdminSuggestionsStats = ({ stats, t }: AdminSuggestionsStatsProps) => (
	<AdminStatsBar stats={stats} i18nPrefix="adminSuggestions" t={t} />
);
