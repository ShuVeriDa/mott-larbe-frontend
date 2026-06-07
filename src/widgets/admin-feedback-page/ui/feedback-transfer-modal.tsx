"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { getAvColor } from "@/shared/lib/avatar-colors";
import type { AdminFeedbackAssignee } from "@/entities/feedback";
import { Modal, ModalActions } from "@/shared/ui/modal";

type Translator = (key: string) => string;

interface FeedbackTransferModalProps {
	isOpen: boolean;
	assignees: AdminFeedbackAssignee[];
	currentAssigneeId: string | null;
	isLoading: boolean;
	t: Translator;
	onTransfer: (targetAdminId: string, note?: string) => void;
	onClose: () => void;
}

export const FeedbackTransferModal = ({
	isOpen,
	assignees,
	currentAssigneeId,
	isLoading,
	t,
	onTransfer,
	onClose,
}: FeedbackTransferModalProps) => {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [note, setNote] = useState("");

	const candidates = assignees.filter((a) => a.id !== currentAssigneeId);

	const handleSubmit = () => {
		if (!selectedId) return;
		onTransfer(selectedId, note.trim() || undefined);
		setSelectedId(null);
		setNote("");
	};

	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = (e) => setNote(e.currentTarget.value);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={t("admin.feedback.transfer.title")}
			className="max-w-[400px]"
		>
			{/* Assignee list */}
			{isLoading ? (
				<div className="mb-3 space-y-1.5">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex items-center gap-2.5 rounded-lg border border-bd-2 bg-surf-2 px-3 py-2">
							<div className="size-[26px] animate-pulse rounded-full bg-surf-3" />
							<div className="h-3 flex-1 animate-pulse rounded bg-surf-3" />
						</div>
					))}
				</div>
			) : candidates.length === 0 ? (
				<Typography tag="p" className="mb-3 py-3 text-center text-[12px] text-t-3">
					{t("admin.feedback.transfer.noAssignees")}
				</Typography>
			) : (
				<div className="mb-3 flex flex-col gap-1.5">
					{candidates.map((a) => {
						const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setSelectedId(a.id);
						return (
							<Button
								key={a.id}
								onClick={handleClick}
								title={`${a.name} ${a.surname}`}
								className={cn(
									"flex items-center gap-2.5 rounded-lg border border-bd-2 bg-surf-2 px-3 py-2 text-left text-[12.5px] text-t-1 transition-colors hover:bg-surf-3",
									selectedId === a.id && "border-acc bg-acc-bg",
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

			{/* Optional note */}
			<textarea
				value={note}
				onChange={handleChange}
				placeholder={t("admin.feedback.transfer.notePlaceholder")}
				aria-label={t("admin.feedback.transfer.notePlaceholder")}
				rows={2}
				className="mb-3 w-full resize-none rounded-base border border-bd-2 bg-surf-2 px-3 py-2 text-[12px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc"
			/>

			<ModalActions>
				<Button
					disabled={!selectedId || isLoading}
					onClick={handleSubmit}
					title={t("admin.feedback.transfer.confirm")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px] w-full"
				>
					{t("admin.feedback.transfer.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
