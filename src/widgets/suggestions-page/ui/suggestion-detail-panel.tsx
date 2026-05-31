"use client";

import { Typography } from "@/shared/ui/typography";
import { displayValue } from "@/shared/lib/display-value";
import {
	InfoCard,
	ReviewPanelEmpty,
	ReviewPanelHeader,
	ReviewPanelShell,
} from "@/shared/ui/review-panel";
import { useI18n } from "@/shared/lib/i18n";
import type { Suggestion } from "@/features/suggestions";

interface SuggestionDetailPanelProps {
	suggestion: Suggestion | null;
	showDetail: boolean;
	onBack: () => void;
}

export const SuggestionDetailPanel = ({ suggestion, showDetail, onBack }: SuggestionDetailPanelProps) => {
	const { t } = useI18n();

	if (!suggestion) {
		return <ReviewPanelEmpty text={t("suggestions.selectToView")} hiddenOnMobile />;
	}

	const target = suggestion.text?.title ?? suggestion.entry?.rawWord ?? "—";
	const subtitle = [
		t(`suggest.fields.${suggestion.field}`),
		new Date(suggestion.createdAt).toLocaleDateString(),
	].join(" · ");

	return (
		<ReviewPanelShell
			mobileOverlay
			showDetail={showDetail}
			onBack={onBack}
			backLabel={t("adminTextSubmissions.back")}
		>
			<ReviewPanelHeader
				title={target}
				subtitle={subtitle}
				status={suggestion.status}
				statusLabel={t(`suggestions.status.${suggestion.status}`)}
				titleClassName="font-display italic"
			/>

			{/* Diff — same as admin panel: white bg, red old, green new */}
			<div className="mb-5 overflow-hidden rounded-card border border-bd-1 bg-surf">
				{suggestion.oldValue !== null && (
					<div className="border-b border-bd-1 px-4 py-3">
						<Typography tag="p" className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3">
							{t("suggestions.oldValue")}
						</Typography>
						<Typography tag="p" className="text-[13px] text-red/80 line-through">
							{displayValue(suggestion.oldValue)}
						</Typography>
					</div>
				)}
				<div className="px-4 py-3">
					<Typography tag="p" className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3">
						{t("suggestions.newValue")}
					</Typography>
					<Typography tag="p" className="text-[13px] text-green-600 dark:text-green-400">
						{displayValue(suggestion.newValue)}
					</Typography>
				</div>
			</div>

			{suggestion.comment && (
				<InfoCard label={t("suggestions.comment")} className="mb-5">
					<Typography tag="p" className="text-[13px] italic text-t-2">{suggestion.comment}</Typography>
				</InfoCard>
			)}

			{suggestion.reviewComment && suggestion.status !== "PENDING" && (
				<InfoCard label={t("suggestions.reviewComment")} className="mb-5">
					<Typography tag="p" className="text-[13px] text-t-2">{suggestion.reviewComment}</Typography>
				</InfoCard>
			)}
		</ReviewPanelShell>
	);
};
