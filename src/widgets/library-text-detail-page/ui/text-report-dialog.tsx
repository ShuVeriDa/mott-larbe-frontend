"use client";

import { Typography } from "@/shared/ui/typography";
import { ComponentProps, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/shared/ui/dialog";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import { libraryTextApi } from "@/entities/library-text";
import type { TextReportReason } from "@/entities/library-text";

type Translator = (key: string, vars?: Record<string, string | number>) => string;

const REPORT_REASONS: TextReportReason[] = [
	"SPAM",
	"INAPPROPRIATE",
	"COPYRIGHT",
	"INCORRECT_CONTENT",
	"BROKEN",
	"OTHER",
];

interface TextReportDialogProps {
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	t: Translator;
}

export const TextReportDialog = ({ id, open, onOpenChange, t }: TextReportDialogProps) => {
	const [reason, setReason] = useState<TextReportReason>("SPAM");
	const [comment, setComment] = useState("");
	const [submitted, setSubmitted] = useState<"success" | "duplicate" | null>(null);

	const mutation = useMutation({
		mutationFn: () =>
			libraryTextApi.reportText(id, {
				reason,
				comment: comment.trim() || undefined,
			}),
		onSuccess: () => setSubmitted("success"),
		onError: (err: unknown) => {
			const status =
				err &&
				typeof err === "object" &&
				"response" in err &&
				(err as { response?: { status?: number } }).response?.status;
			setSubmitted(status === 409 ? "duplicate" : null);
		},
	});

	const handleOpenChange = (next: boolean) => {
		if (!next) {
			setSubmitted(null);
			setComment("");
			setReason("SPAM");
			mutation.reset();
		}
		onOpenChange(next);
	};

	const handleSubmit = () => {
		mutation.mutate();
	};

		const handleChange: NonNullable<ComponentProps<typeof Select>["onChange"]> = (e) => setReason(e.currentTarget.value as TextReportReason);
	const handleChange2: NonNullable<ComponentProps<typeof Textarea>["onChange"]> = (e) => setComment(e.currentTarget.value);
return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-sm font-medium text-t-1">
						{t("library.textDetail.reportDialog.title")}
					</DialogTitle>
				</DialogHeader>

				{submitted === "success" ? (
					<Typography tag="p" className="text-sm text-t-2">
						{t("library.textDetail.reportDialog.success")}
					</Typography>
				) : submitted === "duplicate" ? (
					<Typography tag="p" className="text-sm text-t-2">
						{t("library.textDetail.reportDialog.alreadyReported")}
					</Typography>
				) : (
					<form action={handleSubmit} className="flex flex-col gap-4">
						<div className="flex flex-col gap-1.5">
							<Typography tag="span" className="text-xs text-t-3">
								{t("library.textDetail.reportDialog.reason")}
							</Typography>
							<Select
								value={reason}
								onChange={handleChange}
							>
								{REPORT_REASONS.map((r) => (
									<option key={r} value={r}>
										{t(`library.textDetail.reportDialog.reasons.${r}`)}
									</option>
								))}
							</Select>
						</div>

						<div className="flex flex-col gap-1.5">
							<Typography tag="span" className="text-xs text-t-3">
								{t("library.textDetail.reportDialog.comment")}
							</Typography>
							<Textarea
								value={comment}
								onChange={handleChange2}
								placeholder={t("library.textDetail.reportDialog.commentPlaceholder")}
								rows={3}
								className="resize-none text-sm"
							/>
						</div>

						<div className="flex justify-end">
							<Button
								type="submit"
								disabled={mutation.isPending}
								size="default"
								variant="action"
							>
								{t("library.textDetail.reportDialog.submit")}
							</Button>
						</div>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
};
