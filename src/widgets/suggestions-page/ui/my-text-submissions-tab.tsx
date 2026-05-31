"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useMyTextSubmissions } from "@/features/text-submission";
import { Typography } from "@/shared/ui/typography";
import { MyTextSubmissionCard } from "./my-text-submission-card";

export const MyTextSubmissionsTab = () => {
	const { t } = useI18n();
	const { data, isLoading, isError } = useMyTextSubmissions({ limit: 50 });
	const submissions = data?.data ?? [];

	if (isLoading) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 2 }).map((_, i) => (
					<div
						key={i}
						className="h-[96px] animate-pulse rounded-base border border-bd-2 bg-surf-2"
					/>
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<Typography tag="p" className="text-red text-[13px]">
				{t("vocabulary.wordDetail.states.error")}
			</Typography>
		);
	}

	if (submissions.length === 0) {
		return (
			<Typography tag="p" className="py-12 text-center text-[13px] text-t-3">
				{t("myTextSubmissions.empty")}
			</Typography>
		);
	}

	return (
		<ul className="flex flex-col gap-3">
			{submissions.map((submission) => (
				<li key={submission.id}>
					<MyTextSubmissionCard submission={submission} />
				</li>
			))}
		</ul>
	);
};
