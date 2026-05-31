import { AdminStatsBar } from "@/shared/ui/admin-stats-bar";
import type { TextSubmissionStats } from "@/features/text-submission";

interface AdminTextSubmissionsStatsProps {
	stats: TextSubmissionStats | undefined;
	t: (key: string) => string;
}

export const AdminTextSubmissionsStats = ({ stats, t }: AdminTextSubmissionsStatsProps) => (
	<AdminStatsBar stats={stats} i18nPrefix="adminTextSubmissions" t={t} />
);
