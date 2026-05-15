import { Typography } from "@/shared/ui/typography";
import type { ReactNode } from "react";

interface PhrasesTopbarProps {
	total: number;
	isLoading: boolean;
	actions: ReactNode;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhrasesTopbar = ({
	total,
	isLoading,
	actions,
	t,
}: PhrasesTopbarProps) => (
	<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3">
		<div>
			<Typography
				tag="h1"
				className="font-display text-[16px] font-medium text-t-1"
			>
				{t("admin.textPhrases.title")}
			</Typography>
			<Typography tag="p" className="mt-px text-[12px] text-t-3">
				{isLoading ? "…" : t("admin.textPhrases.subtitle", { total })}
			</Typography>
		</div>
		<div className="ml-auto flex items-center gap-2">{actions}</div>
	</header>
);
