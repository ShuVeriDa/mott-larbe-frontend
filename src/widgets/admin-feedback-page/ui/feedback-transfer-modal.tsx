"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { AdminFeedbackAssignee } from "@/entities/feedback";

type Translator = (key: string) => string;

const AV_COLORS = [
	"bg-acc-bg text-acc-t",
	"bg-grn-bg text-grn-t",
	"bg-pur-bg text-pur-t",
	"bg-amb-bg text-amb-t",
	"bg-surf-3 text-t-2",
];
const getAvColor = (id: string) => AV_COLORS[id.charCodeAt(0) % AV_COLORS.length];

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

	if (!isOpen) return null;

	const candidates = assignees.filter((a) => a.id !== currentAssigneeId);

	const handleSubmit = () => {
		if (!selectedId) return;
		onTransfer(selectedId, note.trim() || undefined);
		setSelectedId(null);
		setNote("");
	};

	const handleBackdrop = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) onClose();
	};

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-5"
			onClick={handleBackdrop}
		>
			<div className="w-full max-w-[400px] animate-[fadeUp_0.18s_ease] rounded-2xl border border-bd-2 bg-surf p-5 shadow-[0_4px_12px_rgba(0,0,0,0.08),0_20px_60px_rgba(0,0,0,0.15)]">
				{/* Header */}
				<div className="mb-3.5 flex items-center justify-between">
					<p className="text-[14px] font-semibold text-t-1">
						{t("admin.feedback.transfer.title")}
					</p>
					<button
						type="button"
						onClick={onClose}
						className="flex size-[26px] items-center justify-center rounded-md border border-bd-1 bg-surf-2 text-t-2 hover:text-t-1"
					>
						<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-3">
							<path d="M2 2l8 8M10 2l-8 8" />
						</svg>
					</button>
				</div>

				{/* Assignee list */}
				{isLoading ? (
					<div className="space-y-1.5">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-2.5 rounded-lg border border-bd-2 bg-surf-2 px-3 py-2">
								<div className="size-[26px] animate-pulse rounded-full bg-surf-3" />
								<div className="h-3 flex-1 animate-pulse rounded bg-surf-3" />
							</div>
						))}
					</div>
				) : candidates.length === 0 ? (
					<p className="py-3 text-center text-[12px] text-t-3">
						{t("admin.feedback.transfer.noAssignees")}
					</p>
				) : (
					<div className="mb-3 flex flex-col gap-1.5">
						{candidates.map((a) => (
							<button
								key={a.id}
								type="button"
								onClick={() => setSelectedId(a.id)}
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
							</button>
						))}
					</div>
				)}

				{/* Optional note */}
				<textarea
					value={note}
					onChange={(e) => setNote(e.target.value)}
					placeholder={t("admin.feedback.transfer.notePlaceholder")}
					rows={2}
					className="mb-3 w-full resize-none rounded-base border border-bd-2 bg-surf-2 px-3 py-2 text-[12px] text-t-1 outline-none placeholder:text-t-3 focus:border-acc"
				/>

				<button
					type="button"
					disabled={!selectedId || isLoading}
					onClick={handleSubmit}
					className="h-[34px] w-full rounded-base bg-acc text-[12.5px] font-semibold text-white transition-opacity disabled:opacity-40 hover:opacity-90"
				>
					{t("admin.feedback.transfer.confirm")}
				</button>
			</div>
		</div>
	);
};
