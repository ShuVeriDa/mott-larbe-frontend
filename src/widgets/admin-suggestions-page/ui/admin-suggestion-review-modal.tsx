"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Textarea } from "@/shared/ui/textarea";
import { Typography } from "@/shared/ui/typography";
import type { Suggestion } from "@/features/suggestions";

interface AdminSuggestionReviewModalProps {
	suggestion: Suggestion | null;
	comment: string;
	isPending: boolean;
	onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	onApprove: () => void;
	onReject: () => void;
	onClose: () => void;
}

export const AdminSuggestionReviewModal = ({
	suggestion,
	comment,
	isPending,
	onCommentChange,
	onApprove,
	onReject,
	onClose,
}: AdminSuggestionReviewModalProps) => {
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
		<Modal
			open={!!suggestion}
			onClose={onClose}
			title={t("adminSuggestions.title")}
		>
			{suggestion && (
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-1 text-[12px]">
						<Typography tag="p" className="text-t-3">
							<strong className="text-t-1 font-display italic">{suggestion.entry?.rawWord}</strong>
							{" · "}
							{t(`suggest.fields.${suggestion.field}`) ?? suggestion.field}
						</Typography>

						<div className="grid grid-cols-2 gap-2 mt-1">
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
							<div className="mt-1">
								<Typography tag="p" className="text-t-3 mb-0.5">{t("adminSuggestions.comment")}</Typography>
								<Typography tag="p" className="text-t-2 italic">{suggestion.comment}</Typography>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-1">
						<Typography tag="label" htmlFor="review-comment" className="text-[12px] text-t-2 font-medium">
							{t("adminSuggestions.reviewComment")}
						</Typography>
						<Textarea
							id="review-comment"
							value={comment}
							onChange={onCommentChange}
							rows={2}
							disabled={isPending}
						/>
					</div>

					<ModalActions>
						<Button
							type="button"
							onClick={onReject}
							disabled={isPending}
							variant="ghost"
							className="h-[34px] px-4 rounded-lg text-[13px]"
						>
							{t("adminSuggestions.reject")}
						</Button>
						<Button
							type="button"
							onClick={onApprove}
							disabled={isPending}
							variant="action"
							className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
						>
							{t("adminSuggestions.approve")}
						</Button>
					</ModalActions>
				</div>
			)}
		</Modal>
	);
};
