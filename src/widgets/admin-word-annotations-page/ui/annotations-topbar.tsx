import { Typography } from "@/shared/ui/typography";

interface AnnotationsTopbarProps {
	total: number;
	isLoading: boolean;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const AnnotationsTopbar = ({ total, isLoading, t }: AnnotationsTopbarProps) => (
	<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3">
		<div>
			<Typography tag="h1" className="font-display text-[16px] font-medium text-t-1">
				{t("admin.wordAnnotations.title")}
			</Typography>
			<Typography tag="p" className="mt-px text-[12px] text-t-3">
				{isLoading ? "…" : t("admin.wordAnnotations.subtitle", { total })}
			</Typography>
		</div>
	</header>
);
