"use client";

import { ChangeEvent, ReactNode } from "react";
import { ArrowLeft, CheckCircle, Inbox, XCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { InputLabel } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Typography } from "@/shared/ui/typography";
import { StatusBadge, statusDotClass } from "@/shared/ui/status-badge";
import type { ReviewStatus } from "@/shared/ui/status-badge";

// ─── InfoCard ────────────────────────────────────────────────────────────────
// A single labeled content card (БЫЛО / СТАЛО / КОММЕНТАРИЙ / etc.)

interface InfoCardProps {
	label: string;
	children: ReactNode;
	className?: string;
}

export const InfoCard = ({ label, children, className }: InfoCardProps) => (
	<div className={cn("rounded-card border border-bd-1 bg-surf px-4 py-3", className)}>
		<Typography tag="p" className="mb-1 text-[11px] font-medium uppercase tracking-wide text-t-3">
			{label}
		</Typography>
		{children}
	</div>
);

// ─── ReviewPanelEmpty ─────────────────────────────────────────────────────────

interface ReviewPanelEmptyProps {
	text: string;
	/** Hide on mobile (admin layout), show everywhere (user layout) */
	hiddenOnMobile?: boolean;
}

export const ReviewPanelEmpty = ({ text, hiddenOnMobile = true }: ReviewPanelEmptyProps) => (
	<div className={cn(
		"h-full flex-col items-center justify-center gap-3 px-8 text-center",
		hiddenOnMobile ? "hidden sm:flex" : "flex",
	)}>
		<Inbox className="size-10 text-t-4" />
		<Typography tag="p" className="text-[13px] text-t-3">{text}</Typography>
	</div>
);

// ─── ReviewPanelHeader ────────────────────────────────────────────────────────

interface ReviewPanelHeaderProps {
	title: string;
	subtitle: string;
	status: ReviewStatus;
	statusLabel: string;
	titleClassName?: string;
}

export const ReviewPanelHeader = ({
	title, subtitle, status, statusLabel, titleClassName,
}: ReviewPanelHeaderProps) => (
	<div className="mb-5 flex items-stretch gap-3">
		<div className={cn("w-1 shrink-0 rounded-full", statusDotClass[status])} />
		<div className="min-w-0 flex-1">
			<div className="flex items-start justify-between gap-3">
				<Typography tag="p" className={cn("text-[18px] font-semibold text-t-1 leading-snug", titleClassName)}>
					{title}
				</Typography>
				<StatusBadge status={status} label={statusLabel} />
			</div>
			<Typography tag="p" className="mt-1 text-[12px] text-t-3">
				{subtitle}
			</Typography>
		</div>
	</div>
);

// ─── ReviewForm ───────────────────────────────────────────────────────────────
// Approve / Reject form — only rendered for PENDING items in admin panels

interface ReviewFormProps {
	comment: string;
	isPending: boolean;
	commentLabel: string;
	approveLabel: string;
	rejectLabel: string;
	onCommentChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
	onApprove: () => void;
	onReject: () => void;
	inputId?: string;
}

export const ReviewForm = ({
	comment, isPending,
	commentLabel, approveLabel, rejectLabel,
	onCommentChange, onApprove, onReject,
	inputId = "review-comment",
}: ReviewFormProps) => (
	<div className="mt-auto pt-2">
		<div className="mb-3">
			<InputLabel htmlFor={inputId}>{commentLabel}</InputLabel>
			<Textarea id={inputId} value={comment} onChange={onCommentChange} rows={2} disabled={isPending} />
		</div>
		<div className="flex gap-2">
			<Button
				type="button"
				onClick={onReject}
				disabled={isPending}
				className="flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-lg border-[0.5px] border-bd-1 bg-surf-2 text-[13px] font-medium text-t-2 transition-colors hover:bg-red-bg hover:text-red-t hover:border-red/30 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<XCircle className="size-3.5" />
				{rejectLabel}
			</Button>
			<Button
				type="button"
				onClick={onApprove}
				disabled={isPending}
				className="flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
			>
				<CheckCircle className="size-3.5" />
				{approveLabel}
			</Button>
		</div>
	</div>
);

// ─── ReviewPanelShell ─────────────────────────────────────────────────────────
// Container that handles mobile overlay behaviour

interface ReviewPanelShellProps {
	children: ReactNode;
	/** When true: renders as absolute overlay on mobile */
	mobileOverlay?: boolean;
	showDetail?: boolean;
	onBack?: () => void;
	backLabel?: string;
}

export const ReviewPanelShell = ({
	children, mobileOverlay = false, showDetail, onBack, backLabel = "Назад",
}: ReviewPanelShellProps) => {
	if (mobileOverlay) {
		return (
			<div className={cn(
				"flex h-full flex-col overflow-y-auto p-5 max-sm:p-4",
				"max-sm:absolute max-sm:inset-0 max-sm:z-10 max-sm:bg-surf",
				showDetail ? "max-sm:flex" : "max-sm:hidden",
				"sm:flex",
			)}>
				{onBack && (
					<button
						type="button"
						onClick={onBack}
						className="mb-4 flex items-center gap-1.5 text-[13px] text-t-3 hover:text-t-1 transition-colors sm:hidden"
					>
						<ArrowLeft className="size-4" />
						{backLabel}
					</button>
				)}
				{children}
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col overflow-y-auto p-5 max-sm:p-4">
			{children}
		</div>
	);
};
