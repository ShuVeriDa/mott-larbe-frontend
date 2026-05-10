"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { User, RotateCcw, Check, ArrowRight, Trash2 } from "lucide-react";

import { ComponentProps, ReactNode } from 'react';
import { cn } from "@/shared/lib/cn";
import type { AdminFeedbackThread, FeedbackStatus, FeedbackPriority } from "@/entities/feedback";
import { Select } from "@/shared/ui/select";

type Translator = (key: string) => string;

const STATUSES: FeedbackStatus[] = ["NEW", "IN_PROGRESS", "ANSWERED", "RESOLVED"];
const PRIORITIES: FeedbackPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });

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
}

const InfoSection = ({ title, children }: { title: string; children: ReactNode }) => (
	<div className="border-b border-bd-1 px-4 py-3.5">
		<Typography tag="p" className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">{title}</Typography>
		{children}
	</div>
);

const InfoRow = ({ label, children }: { label: string; children: ReactNode }) => (
	<div className="mb-2.5 flex flex-col gap-[3px] last:mb-0">
		<Typography tag="span" className="text-[10.5px] text-t-3">{label}</Typography>
		<div className="text-[12px] font-medium text-t-1">{children}</div>
	</div>
);


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
}: FeedbackInfoPanelProps & { className?: string }) => {
	const isResolved = thread.status === "RESOLVED";

		const handleStatusChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onStatusChange(e.currentTarget.value as FeedbackStatus);
	const handlePriorityChange: NonNullable<ComponentProps<"select">["onChange"]> = (e) => onPriorityChange(e.currentTarget.value as FeedbackPriority);
return (
		<div className={cn("flex w-[220px] shrink-0 flex-col overflow-y-auto border-l border-bd-1 bg-surf [&::-webkit-scrollbar]:w-0", className)}>
			{/* User */}
			<InfoSection title={t("admin.feedback.user.title")}>
				<div className="mb-2.5 flex items-center gap-2">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surf-3 text-[11px] font-bold text-t-2">
						{(thread.user.name?.[0] ?? "U").toUpperCase()}
					</div>
					<div>
						<Typography tag="p" className="text-[12.5px] font-semibold text-t-1">
							{thread.user.name} {thread.user.surname}
						</Typography>
						<Typography tag="p" className="text-[11px] text-t-3">{thread.user.email}</Typography>
					</div>
				</div>
				<InfoRow label={t("admin.feedback.user.plan")}>
					{thread.user.plan ?? "—"}
				</InfoRow>
				<InfoRow label={t("admin.feedback.user.registeredAt")}>
					{thread.user.signupAt ? formatDate(thread.user.signupAt) : "—"}
				</InfoRow>
			</InfoSection>

			{/* Ticket */}
			<InfoSection title={t("admin.feedback.ticket.title")}>
				<InfoRow label={t("admin.feedback.ticket.status")}>
					<Select
						value={thread.status}
						onChange={handleStatusChange}
						className="h-7 text-[11.5px] rounded-[6px]"
					>
						{STATUSES.map((s) => (
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
						className="h-7 text-[11.5px] rounded-[6px]"
					>
						{PRIORITIES.map((p) => (
							<option key={p} value={p}>
								{t(`admin.feedback.priority.${p}`)}
							</option>
						))}
					</Select>
				</InfoRow>
				<InfoRow label={t("admin.feedback.ticket.assignee")}>
					<Button
						onClick={onAssignOpen}
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
				<Typography tag="p" className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
					{t("admin.feedback.actions.title")}
				</Typography>
				<div className="flex flex-col gap-1.5">
					{isResolved ? (
						<ActionBtn
							onClick={onReopen}
							className="border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1"
							icon={<RotateCcw className="size-3" />}
						>
							{t("admin.feedback.actions.reopen")}
						</ActionBtn>
					) : (
						<ActionBtn
							onClick={onClose}
							className="border-[rgba(26,158,82,0.25)] bg-grn-bg text-grn-t hover:opacity-80"
							icon={<Check className="size-3" />}
						>
							{t("admin.feedback.actions.close")}
						</ActionBtn>
					)}
					<ActionBtn
						onClick={onTransferOpen}
						className="border-bd-2 bg-surf-2 text-t-2 hover:bg-surf-3 hover:text-t-1"
						icon={<ArrowRight className="size-3" />}
					>
						{t("admin.feedback.actions.transfer")}
					</ActionBtn>
					<ActionBtn
						onClick={onDelete}
						className="border-[rgba(220,38,38,0.2)] bg-red-bg text-red-t hover:opacity-80"
						icon={<Trash2 className="size-3" />}
					>
						{t("admin.feedback.actions.delete")}
					</ActionBtn>
				</div>
			</div>
		</div>
	);
};

const ActionBtn = ({
	children,
	icon,
	onClick,
	className,
}: {
	children: ReactNode;
	icon: ReactNode;
	onClick: () => void;
	className: string;
}) => (
	<Button
		onClick={onClick}
		className={cn("flex h-[30px] w-full items-center justify-center gap-1.5 rounded-base border text-[12px] font-semibold transition-opacity", className)}
	>
		{icon}
		{children}
	</Button>
);
