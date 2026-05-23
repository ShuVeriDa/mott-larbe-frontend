import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { SuggestionStatusBadge } from "@/widgets/suggestions-page/ui/suggestion-status-badge";
import type { Suggestion } from "@/features/suggestions";

interface AdminSuggestionCardProps {
	suggestion: Suggestion;
	onReview: (suggestion: Suggestion) => void;
}

const displayValue = (raw: string | null) => {
	if (!raw) return "—";
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
	} catch {
		return raw;
	}
};

export const AdminSuggestionCard = ({ suggestion, onReview }: AdminSuggestionCardProps) => {
	const { t } = useI18n();

	const handleReview = () => onReview(suggestion);

	return (
		<article className="rounded-base border border-bd-2 bg-surf-2 p-4 flex flex-col gap-2.5">
			<div className="flex items-start justify-between gap-3">
				<div className="flex flex-col gap-0.5 min-w-0">
					<Typography tag="span" className="font-display text-[14px] font-semibold text-t-1 italic truncate">
						{suggestion.entry?.rawWord ?? "—"}
					</Typography>
					<Typography tag="span" className="text-[11px] text-t-3">
						{suggestion.user?.username ?? suggestion.user?.name ?? "—"}
						{" · "}
						{new Date(suggestion.createdAt).toLocaleDateString()}
					</Typography>
				</div>
				<SuggestionStatusBadge
					status={suggestion.status}
					label={t(`adminSuggestions.status.${suggestion.status}`)}
				/>
			</div>

			<div className="grid grid-cols-2 gap-3 text-[12px]">
				<div>
					<Typography tag="p" className="text-t-3 mb-0.5">{t("adminSuggestions.field")}</Typography>
					<Typography tag="p" className="text-t-1">
						{t(`suggest.fields.${suggestion.field}`) ?? suggestion.field}
					</Typography>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 text-[12px]">
				{suggestion.oldValue !== null && (
					<div>
						<Typography tag="p" className="text-t-3 mb-0.5">{t("adminSuggestions.oldValue")}</Typography>
						<Typography tag="p" className="text-red/80 line-through">
							{displayValue(suggestion.oldValue)}
						</Typography>
					</div>
				)}
				<div>
					<Typography tag="p" className="text-t-3 mb-0.5">{t("adminSuggestions.newValue")}</Typography>
					<Typography tag="p" className="text-green-600 dark:text-green-400">
						{displayValue(suggestion.newValue)}
					</Typography>
				</div>
			</div>

			{suggestion.comment && (
				<div className="text-[12px]">
					<Typography tag="p" className="text-t-3 mb-0.5">{t("adminSuggestions.comment")}</Typography>
					<Typography tag="p" className="text-t-2 italic">{suggestion.comment}</Typography>
				</div>
			)}

			{suggestion.reviewComment && (
				<div className="text-[12px] border-t border-bd-1 pt-2">
					<Typography tag="p" className="text-t-3 mb-0.5">{t("adminSuggestions.reviewComment")}</Typography>
					<Typography tag="p" className="text-t-2">{suggestion.reviewComment}</Typography>
				</div>
			)}

			{suggestion.status === "PENDING" && (
				<div className="pt-1">
					<Button
						onClick={handleReview}
						variant="action"
						className="w-full"
					>
						{t("adminSuggestions.approve")} / {t("adminSuggestions.reject")}
					</Button>
				</div>
			)}
		</article>
	);
};
