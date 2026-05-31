import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import type { TextSubmission, TextSubmissionStatus } from "@/features/text-submission";

const statusBar: Record<TextSubmissionStatus, string> = {
	PENDING: "bg-yellow-400",
	APPROVED: "bg-green-500",
	REJECTED: "bg-red-400",
};

const statusLabel: Record<TextSubmissionStatus, string> = {
	PENDING: "text-yellow-700 dark:text-yellow-400",
	APPROVED: "text-green-700 dark:text-green-400",
	REJECTED: "text-red-600 dark:text-red-400",
};

interface MyTextSubmissionCardProps {
	submission: TextSubmission;
}

export const MyTextSubmissionCard = ({ submission }: MyTextSubmissionCardProps) => {
	const { t } = useI18n();

	return (
		<article className="flex overflow-hidden rounded-xl border border-bd-1 bg-surf">
			{/* Status bar */}
			<div className={cn("w-1 shrink-0", statusBar[submission.status])} />

			<div className="flex min-w-0 flex-1 flex-col gap-2.5 px-4 py-3.5">
				{/* Top row */}
				<div className="flex items-start justify-between gap-3">
					<div className="min-w-0">
						<Typography
							tag="p"
							className="truncate text-[13.5px] font-semibold text-t-1"
						>
							{submission.title}
						</Typography>
						<Typography tag="p" className="mt-0.5 text-[11.5px] text-t-3">
							{submission.language.toUpperCase()}
							{submission.author && ` · ${submission.author}`}
							{" · "}
							{new Date(submission.createdAt).toLocaleDateString()}
						</Typography>
					</div>
					<Typography
						tag="span"
						className={cn(
							"shrink-0 text-[11px] font-medium",
							statusLabel[submission.status],
						)}
					>
						{t(`myTextSubmissions.status.${submission.status}`)}
					</Typography>
				</div>

				{/* Source URL */}
				{submission.sourceUrl && (
					<a
						href={submission.sourceUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="truncate text-[12px] text-acc hover:underline"
					>
						{submission.sourceUrl}
					</a>
				)}

				{/* Editor's note */}
				{submission.reviewComment && submission.status !== "PENDING" && (
					<div className="border-t border-bd-1 pt-2.5">
						<Typography tag="p" className="text-[11.5px] text-t-3">
							{t("myTextSubmissions.reviewComment")}
						</Typography>
						<Typography tag="p" className="mt-0.5 text-[12px] text-t-2">
							{submission.reviewComment}
						</Typography>
					</div>
				)}
			</div>
		</article>
	);
};
