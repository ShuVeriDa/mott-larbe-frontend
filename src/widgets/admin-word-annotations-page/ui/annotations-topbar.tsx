import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { RefreshCw } from "lucide-react";

interface AnnotationsTopbarProps {
	total: number;
	isLoading: boolean;
	isSyncing: boolean;
	onSync: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const AnnotationsTopbar = ({ total, isLoading, isSyncing, onSync, t }: AnnotationsTopbarProps) => (
	<header className="flex items-center justify-between gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3">
		<div>
			<Typography tag="h1" className="font-display text-[16px] font-medium text-t-1">
				{t("admin.wordAnnotations.title")}
			</Typography>
			<Typography tag="p" className="mt-px text-[12px] text-t-3">
				{isLoading ? "…" : t("admin.wordAnnotations.subtitle", { total })}
			</Typography>
		</div>
		<Button
			size="bare"
			onClick={onSync}
			disabled={isSyncing}
			className="flex h-[30px] items-center gap-1.5 rounded-[6px] border border-bd-2 px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1 disabled:opacity-50"
		>
			<RefreshCw className={`size-3 ${isSyncing ? "animate-spin" : ""}`} />
			{isSyncing ? t("admin.wordAnnotations.syncing") : t("admin.wordAnnotations.sync")}
		</Button>
	</header>
);
