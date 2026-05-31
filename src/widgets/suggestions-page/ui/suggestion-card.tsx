import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import type { Suggestion } from "@/features/suggestions";

interface SuggestionCardProps {
	suggestion: Suggestion;
}

const statusBar: Record<string, string> = {
	PENDING: "bg-yellow-400",
	APPROVED: "bg-green-500",
	REJECTED: "bg-red-400",
};

const statusLabel: Record<string, string> = {
	PENDING: "text-yellow-700 dark:text-yellow-400",
	APPROVED: "text-green-700 dark:text-green-400",
	REJECTED: "text-red-600 dark:text-red-400",
};

const displayValue = (raw: string | null) => {
	if (!raw) return "—";
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
	} catch {
		return raw;
	}
};

export const SuggestionCard = ({ suggestion }: SuggestionCardProps) => {
	const { t } = useI18n();

	const target = suggestion.text
		? suggestion.text.title
		: (suggestion.entry?.rawWord ?? "—");

	return (
		<article className="flex overflow-hidden rounded-xl border border-bd-1 bg-surf">
			{/* Status bar */}
			<div className={cn("w-1 shrink-0", statusBar[suggestion.status])} />

			<div className="flex min-w-0 flex-1 flex-col gap-3 px-4 py-3.5">
				{/* Top row */}
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<Typography
							tag="p"
							className="truncate font-display text-[13.5px] font-semibold italic text-t-1"
						>
							{target}
						</Typography>
						<Typography tag="p" className="mt-0.5 text-[11.5px] text-t-3">
							{t(`suggest.fields.${suggestion.field}`)}
							{" · "}
							{new Date(suggestion.createdAt).toLocaleDateString()}
						</Typography>
					</div>
					<Typography
						tag="span"
						className={cn(
							"shrink-0 text-[11px] font-medium",
							statusLabel[suggestion.status],
						)}
					>
						{t(`suggestions.status.${suggestion.status}`)}
					</Typography>
				</div>

				{/* Diff */}
				<div className="flex items-baseline gap-2 text-[12.5px]">
					{suggestion.oldValue !== null && (
						<>
							<Typography tag="span" className="line-through text-t-3 max-w-[40%] truncate">
								{displayValue(suggestion.oldValue)}
							</Typography>
							<Typography tag="span" className="text-t-4 shrink-0">→</Typography>
						</>
					)}
					<Typography tag="span" className="text-t-1 font-medium truncate">
						{displayValue(suggestion.newValue)}
					</Typography>
				</div>

				{/* Comment / review comment */}
				{suggestion.comment && (
					<Typography tag="p" className="text-[12px] text-t-3 italic">
						"{suggestion.comment}"
					</Typography>
				)}

				{suggestion.reviewComment && suggestion.status !== "PENDING" && (
					<div className="border-t border-bd-1 pt-2.5">
						<Typography tag="p" className="text-[11.5px] text-t-3">
							{t("suggestions.reviewComment")}
						</Typography>
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-2">
							{suggestion.reviewComment}
						</Typography>
					</div>
				)}
			</div>
		</article>
	);
};
