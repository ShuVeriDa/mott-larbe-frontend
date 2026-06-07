"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";

import { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import { getAvColor } from "@/shared/lib/avatar-colors";
import type { AdminFeedbackAssignee, AdminFeedbackThread } from "@/entities/feedback";
import { Modal } from "@/shared/ui/modal";

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

export const FeedbackAssignModal = ({
	isOpen,
	assignees,
	currentThread,
	isLoading,
	t,
	onAssign,
	onClose,
}: FeedbackAssignModalProps) => {
	const handleUnassign: NonNullable<ComponentProps<"button">["onClick"]> = () => onAssign(null);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={t("admin.feedback.assign.title")}
			className="max-w-[380px]"
		>
			{/* Unassign */}
			{currentThread?.assignee && (
				<Button
					onClick={handleUnassign}
					title={t("admin.feedback.assign.unassign")}
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
								title={`${a.name} ${a.surname}`}
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
		</Modal>
	);
};
