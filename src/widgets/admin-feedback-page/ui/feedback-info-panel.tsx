"use client";

import { Button } from "@/shared/ui/button";
import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
import { ArrowRight, Check, RotateCcw, Trash2, User } from "lucide-react";

import type {
	AdminFeedbackThread,
	FeedbackPriority,
	FeedbackStatus,
} from "@/entities/feedback";
import { cn } from "@/shared/lib/cn";
import { formatDate } from "@/shared/lib/format-date";
import { Select } from "@/shared/ui/select";
import { ComponentProps } from "react";
import { ActionBtn } from "./action-btn";
import { InfoRow } from "./info-row";
import { InfoSection } from "./info-section";

type Translator = (key: string) => string;

const STATUSES: FeedbackStatus[] = [
	"NEW",
	"IN_PROGRESS",
	"ANSWERED",
	"RESOLVED",
];
const PRIORITIES: FeedbackPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

interface FeedbackInfoPanelProps {
	thread: AdminFeedbackThread;
	t: Translator;
	onStatusChange: (status: FeedbackStatus) => void;
	onPriorityChange: (priority: FeedbackPriority) => void;
	onAssignOpen: () => void;
	onTransferOpen: () => void;
	onClose: () => void;
	onReopen: () => void;
	onDelete: () => void;
	className?: string;
}

export const FeedbackInfoPanel = ({
	thread,
	t,
	onStatusChange,
	onPriorityChange,
	onAssignOpen,
	onTransferOpen,
	onClose,
	onReopen,
	onDelete,
	className,
}: FeedbackInfoPanelProps) => {
	const isResolved = thread.status === "RESOLVED";

	const handleStatusChange: NonNullable<
		ComponentProps<"select">["onChange"]
	> = e => onStatusChange(e.currentTarget.value as FeedbackStatus);
	const handlePriorityChange: NonNullable<
		ComponentProps<"select">["onChange"]
	> = e => onPriorityChange(e.currentTarget.value as FeedbackPriority);

	return (
		<div
			className={cn(
				"flex w-[220px] shrink-0 flex-col overflow-y-auto border-l border-bd-1 bg-surf [&::-webkit-scrollbar]:w-0",
				className,
			)}
		>
			{/* User */}
			<InfoSection title={t("admin.feedback.user.title")}>
				<div className="mb-2.5 flex items-center gap-2">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surf-3 text-[11px] font-bold text-t-2">
						{(thread.user.name?.[0] ?? "U").toUpperCase()}
					</div>
					<div>
						<Typography
							tag="p"
							className="text-[12.5px] font-semibold text-t-1"
						>
							{thread.user.name} {thread.user.surname}
						</Typography>
						<Typography tag="p" className="text-[11px] text-t-3">
							{thread.user.email}
						</Typography>
					</div>
				</div>
				<InfoRow label={t("admin.feedback.user.plan")}>
					{thread.user.plan ?? "—"}
				</InfoRow>
				<InfoRow label={t("admin.feedback.user.registeredAt")}>
					{formatDate(thread.user.signupAt)}
				</InfoRow>
			</InfoSection>

			{/* Ticket */}
			<InfoSection title={t("admin.feedback.ticket.title")}>
				<InfoRow label={t("admin.feedback.ticket.status")}>
					<Select
						value={thread.status}
						onChange={handleStatusChange}
						className="h-7 rounded-[6px] text-[11.5px]"
					>
						{STATUSES.map(s => (
							<option key={s} value={s}>
								{t(`admin.feedback.status.${s}`)}
							</option>
						))}
					</Select>
				</InfoRow>
				<InfoRow label={t("admin.feedback.ticket.priority")}>
					<Select
						value={thread.priority}
						onChange={handlePriorityChange}
						className="h-7 rounded-[6px] text-[11.5px]"
					>
						{PRIORITIES.map(p => (
							<option key={p} value={p}>
								{t(`admin.feedback.priority.${p}`)}
							</option>
						))}
					</Select>
				</InfoRow>
				<InfoRow label={t("admin.feedback.ticket.assignee")}>
					<Button
						onClick={onAssignOpen}
						title={t("admin.feedback.ticket.assign")}
						className="flex h-7 w-full items-center gap-1.5 rounded-[6px] border border-bd-2 bg-surf-2 px-2 text-[11.5px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						{thread.assignee ? (
							<>
								<div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-acc-bg text-[8px] font-bold text-acc-t">
									{thread.assignee.name?.[0]?.toUpperCase() ?? "A"}
								</div>
								<Typography tag="span" className="truncate text-t-1">
									{thread.assignee.name} {thread.assignee.surname?.[0]}.
								</Typography>
							</>
						) : (
							<>
								<User className="size-3 text-t-3" />
								{t("admin.feedback.ticket.assign")}
							</>
						)}
					</Button>
				</InfoRow>
				<InfoRow label={t("admin.feedback.ticket.createdAt")}>
					{formatDate(thread.createdAt)}
				</InfoRow>
			</InfoSection>

			{/* Actions */}
			<div className="px-4 py-3.5">
				<SectionLabel className="mb-2.5">
					{t("admin.feedback.actions.title")}
				</SectionLabel>
				<div className="flex flex-col gap-1.5">
					{isResolved ? (
						<ActionBtn
							onClick={onReopen}
							className="border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1"
							icon={<RotateCcw className="size-3" />}
							title={t("admin.feedback.actions.reopen")}
						>
							{t("admin.feedback.actions.reopen")}
						</ActionBtn>
					) : (
						<ActionBtn
							onClick={onClose}
							className="border-[rgba(26,158,82,0.25)] bg-grn-bg text-grn-t hover:opacity-80"
							icon={<Check className="size-3" />}
							title={t("admin.feedback.actions.close")}
						>
							{t("admin.feedback.actions.close")}
						</ActionBtn>
					)}
					<ActionBtn
						onClick={onTransferOpen}
						className="border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1"
						icon={<ArrowRight className="size-3" />}
						title={t("admin.feedback.actions.transfer")}
					>
						{t("admin.feedback.actions.transfer")}
					</ActionBtn>
					<ActionBtn
						onClick={onDelete}
						className="border-[rgba(220,38,38,0.2)] bg-red-bg text-red-t hover:opacity-80"
						icon={<Trash2 className="size-3" />}
						title={t("admin.feedback.actions.delete")}
					>
						{t("admin.feedback.actions.delete")}
					</ActionBtn>
				</div>
			</div>
		</div>
	);
};
