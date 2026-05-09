"use client";
import { useEffect } from 'react';
import type { AdminFeedbackThread, FeedbackStatus, FeedbackPriority } from "@/entities/feedback";
import { FeedbackInfoPanel } from "./feedback-info-panel";

type Translator = (key: string) => string;

interface FeedbackInfoDrawerProps {
	isOpen: boolean;
	thread: AdminFeedbackThread | null;
	t: Translator;
	onClose: () => void;
	onStatusChange: (s: FeedbackStatus) => void;
	onPriorityChange: (p: FeedbackPriority) => void;
	onAssignOpen: () => void;
	onTransferOpen: () => void;
	onClose2: () => void;
	onReopen: () => void;
	onDelete: () => void;
}

export const FeedbackInfoDrawer = ({
	isOpen,
	thread,
	t,
	onClose,
	onStatusChange,
	onPriorityChange,
	onAssignOpen,
	onTransferOpen,
	onClose2,
	onReopen,
	onDelete,
}: FeedbackInfoDrawerProps) => {
	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) onClose();
		};
		document.addEventListener("keydown", handleKey);
		return () => document.removeEventListener("keydown", handleKey);
	}, [isOpen, onClose]);

	if (!thread) return null;

	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					className="fixed inset-0 z-[49] bg-black/40 hidden max-[960px]:block"
					onClick={onClose}
				/>
			)}

			{/* Drawer */}
			<div
				className={`fixed bottom-0 left-1/2 z-[60] hidden w-full max-w-[1120px] -translate-x-1/2 rounded-t-2xl border-t border-bd-2 bg-surf shadow-[0_-4px_24px_rgba(0,0,0,0.15)] transition-transform duration-[280ms] ease-[cubic-bezier(.32,.72,0,1)] max-[960px]:block ${isOpen ? "translate-y-0" : "translate-y-full"}`}
				style={{ maxHeight: "80vh", overflowY: "auto" }}
			>
				{/* Handle */}
				<div className="mx-auto mb-2 mt-3 h-1 w-9 rounded-full bg-surf-4" />
				{/* Close btn */}
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-3 flex size-7 items-center justify-center rounded-md border border-bd-1 bg-surf-2 text-t-2"
				>
					<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-3">
						<path d="M2 2l8 8M10 2l-8 8" />
					</svg>
				</button>

				<FeedbackInfoPanel
					thread={thread}
					t={t}
					onStatusChange={onStatusChange}
					onPriorityChange={onPriorityChange}
					onAssignOpen={onAssignOpen}
					onTransferOpen={onTransferOpen}
					onClose={onClose2}
					onReopen={onReopen}
					onDelete={onDelete}
					className="w-full border-none"
				/>
			</div>
		</>
	);
};
