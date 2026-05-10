"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";

import { ComponentProps } from 'react';
import { cn } from "@/shared/lib/cn";
import type { AdminFeedbackAssignee, AdminFeedbackThread } from "@/entities/feedback";

type Translator = (key: string) => string;

interface FeedbackAssignModalProps {
	isOpen: boolean;
	assignees: AdminFeedbackAssignee[];
	currentThread: AdminFeedbackThread | null;
	isLoading: boolean;
	t: Translator;
	onAssign: (adminId: string | null) => void;
	onClose: () => void;
}

const AV_COLORS = [
	"bg-acc-bg text-acc-t",
	"bg-grn-bg text-grn-t",
	"bg-pur-bg text-pur-t",
	"bg-amb-bg text-amb-t",
	"bg-surf-3 text-t-2",
];
const getAvColor = (id: string) => AV_COLORS[id.charCodeAt(0) % AV_COLORS.length];

export const FeedbackAssignModal = ({
	isOpen,
	assignees,
	currentThread,
	isLoading,
	t,
	onAssign,
	onClose,
}: FeedbackAssignModalProps) => {
	if (!isOpen) return null;

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => /* intentional: backdrop-only click */ e.target === e.currentTarget && onClose();
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => onAssign(null);
return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-5"
			onClick={handleClick}
		>
			<div className="w-full max-w-[380px] animate-[fadeUp_0.18s_ease] rounded-2xl border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_20px_60px_rgba(0,0,0,0.15)]">
				{/* Header */}
				<div className="mb-3.5 flex items-center justify-between">
					<Typography tag="p" className="text-[14px] font-semibold text-t-1">
						{t("admin.feedback.assign.title")}
					</Typography>
					<Button
						onClick={onClose}
						className="flex size-[26px] items-center justify-center rounded-md border border-bd-1 bg-surf-2 text-t-2 hover:text-t-1"
					>
						<X className="size-3" />
					</Button>
				</div>

				{/* Unassign */}
				{currentThread?.assignee && (
					<Button
						onClick={handleClick2}
						className="mb-1.5 flex w-full items-center gap-2.5 rounded-lg border border-bd-2 bg-surf-2 px-3 py-2 text-left text-[12.5px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<X className="size-4 shrink-0 text-t-3" />
						{t("admin.feedback.assign.unassign")}
					</Button>
				)}

				{/* Assignees list */}
				{isLoading ? (
					<div className="space-y-1.5">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-2.5 rounded-lg border border-bd-2 bg-surf-2 px-3 py-2">
								<div className="size-[26px] animate-pulse rounded-full bg-surf-3" />
								<div className="h-3 flex-1 animate-pulse rounded bg-surf-3" />
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col gap-1.5">
						{assignees.map((a) => {
						  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onAssign(a.id);
						  return (
							<Button
								key={a.id}
								onClick={handleClick}
								className={cn(
									"flex items-center gap-2.5 rounded-lg border border-bd-2 bg-surf-2 px-3 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-3",
									currentThread?.assigneeAdminId === a.id && "border-acc bg-acc-bg",
								)}
							>
								<div
									className={cn(
										"flex size-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
										getAvColor(a.id),
									)}
								>
									{a.name?.[0]?.toUpperCase() ?? "A"}
								</div>
								{a.name} {a.surname}
							</Button>
						);
						})}
					</div>
				)}
			</div>
		</div>
	);
};
