"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, Check, X } from "lucide-react";
import Link from "next/link";
import type { TextSubmission } from "@/features/text-submission";

interface SubmissionPreviewTopbarProps {
	lang: string;
	submission: TextSubmission;
	isReviewing: boolean;
	onApprove: () => void;
	onReject: () => void;
	t: (key: string) => string;
}

export const SubmissionPreviewTopbar = ({
	lang,
	submission,
	isReviewing,
	onApprove,
	onReject,
	t,
}: SubmissionPreviewTopbarProps) => {
	const isPending = submission.status === "PENDING";

	return (
		<header className="sticky top-0 z-40 flex h-[46px] shrink-0 items-center gap-3 border-b border-bd-1 bg-surf px-4">
			<Link
				href={`/${lang}/admin/text-submissions`}
				className="inline-flex shrink-0 items-center gap-1.5 rounded-base px-2 py-1 text-[12.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<ChevronLeft className="size-3.5" strokeWidth={1.6} />
				<span className="max-md:hidden">{t("adminTextSubmissions.back")}</span>
			</Link>

			<span aria-hidden="true" className="h-4 w-px shrink-0 bg-bd-2" />

			<div className="min-w-0 flex-1">
				<Typography tag="p" className="truncate text-[13px] font-semibold text-t-1">
					{submission.title}
				</Typography>
				<Typography tag="p" className="truncate text-[11px] text-t-3 max-md:hidden">
					{[
						submission.language.toUpperCase(),
						submission.author,
						submission.user?.username ?? submission.user?.name,
					].filter(Boolean).join(" · ")}
				</Typography>
			</div>

			{isPending && (
				<div className="flex shrink-0 items-center gap-2">
					<Button
						variant="danger"
						onClick={onReject}
						disabled={isReviewing}
						className="gap-1.5"
					>
						<X className="size-3.5" />
						<span className="max-sm:hidden">{t("adminTextSubmissions.reject")}</span>
					</Button>
					<Button
						variant="save"
						onClick={onApprove}
						disabled={isReviewing}
						className="gap-1.5"
					>
						<Check className="size-3.5" />
						<span className="max-sm:hidden">{t("adminTextSubmissions.approve")}</span>
					</Button>
				</div>
			)}
		</header>
	);
};
