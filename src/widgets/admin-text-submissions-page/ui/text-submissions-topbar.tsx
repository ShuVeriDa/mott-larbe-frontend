import { AdminTopbar } from "@/shared/ui/admin-topbar";

interface TextSubmissionsTopbarProps {
	total: number;
	isLoading: boolean;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const TextSubmissionsTopbar = ({ total, isLoading, t }: TextSubmissionsTopbarProps) => (
	<AdminTopbar
		title={t("adminTextSubmissions.title")}
		subtitle={t("adminTextSubmissions.subtitle", { total })}
		isLoading={isLoading}
	/>
);
