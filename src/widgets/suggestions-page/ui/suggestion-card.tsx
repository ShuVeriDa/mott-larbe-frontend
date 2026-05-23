import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import type { Suggestion } from "@/features/suggestions";
import { SuggestionStatusBadge } from "./suggestion-status-badge";

interface SuggestionCardProps {
	suggestion: Suggestion;
}

export const SuggestionCard = ({ suggestion }: SuggestionCardProps) => {
	const { t } = useI18n();

	const displayValue = (raw: string | null) => {
		if (!raw) return "—";
		try {
			const parsed = JSON.parse(raw);
			return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
		} catch {
			return raw;
		}
	};

	return (
		<article className="rounded-base border border-bd-2 bg-surf-2 p-4 flex flex-col gap-2">
			<div className="flex items-start justify-between gap-2">
				<Typography tag="span" className="font-display text-[14px] font-semibold text-t-1 italic">
					{suggestion.entry?.rawWord ?? "—"}
				</Typography>
				<SuggestionStatusBadge
					status={suggestion.status}
					label={t(`suggestions.status.${suggestion.status}`)}
				/>
			</div>

			<div className="grid grid-cols-2 gap-2 text-[12px]">
				<div>
					<Typography tag="p" className="text-t-3 mb-0.5">{t("suggestions.field")}</Typography>
					<Typography tag="p" className="text-t-1">{t(`suggest.fields.${suggestion.field}`)}</Typography>
				</div>
				<div>
					<Typography tag="p" className="text-t-3 mb-0.5">{t("suggestions.submittedAt")}</Typography>
					<Typography tag="p" className="text-t-1">
						{new Date(suggestion.createdAt).toLocaleDateString()}
					</Typography>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-2 text-[12px]">
				{suggestion.oldValue !== null && (
					<div>
						<Typography tag="p" className="text-t-3 mb-0.5">{t("suggestions.oldValue")}</Typography>
						<Typography tag="p" className="text-t-1 line-through opacity-60">
							{displayValue(suggestion.oldValue)}
						</Typography>
					</div>
				)}
				<div>
					<Typography tag="p" className="text-t-3 mb-0.5">{t("suggestions.newValue")}</Typography>
					<Typography tag="p" className="text-t-1">{displayValue(suggestion.newValue)}</Typography>
				</div>
			</div>

			{suggestion.comment && (
				<div className="text-[12px]">
					<Typography tag="p" className="text-t-3 mb-0.5">{t("suggestions.comment")}</Typography>
					<Typography tag="p" className="text-t-2 italic">{suggestion.comment}</Typography>
				</div>
			)}

			{suggestion.reviewComment && (
				<div className="text-[12px] border-t border-bd-1 pt-2 mt-1">
					<Typography tag="p" className="text-t-3 mb-0.5">{t("suggestions.reviewComment")}</Typography>
					<Typography tag="p" className="text-t-2">{suggestion.reviewComment}</Typography>
				</div>
			)}
		</article>
	);
};
