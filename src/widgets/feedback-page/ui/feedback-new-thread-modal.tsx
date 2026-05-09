"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import type { FeedbackType } from "@/entities/feedback";
import { useSubmitFeedback } from "@/features/submit-feedback";

type Translator = (key: string) => string;

interface FeedbackNewThreadModalProps {
	isOpen: boolean;
	t: Translator;
	onClose: () => void;
	onSuccess: (threadId: string) => void;
}

interface TypeOption {
	value: FeedbackType;
	emoji: string;
	bgClass: string;
}

const TYPE_OPTIONS: TypeOption[] = [
	{ value: "QUESTION", emoji: "❓", bgClass: "bg-acc-bg" },
	{ value: "BUG", emoji: "🐛", bgClass: "bg-ros-bg" },
	{ value: "IDEA", emoji: "💡", bgClass: "bg-pur-bg" },
	{ value: "COMPLAINT", emoji: "⚠️", bgClass: "bg-amb-bg" },
];

export const FeedbackNewThreadModal = ({
	isOpen,
	t,
	onClose,
	onSuccess,
}: FeedbackNewThreadModalProps) => {
	const [type, setType] = useState<FeedbackType>("QUESTION");
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const submitFeedback = useSubmitFeedback();

	const handleSubmit = () => {
		const trimmedBody = body.trim();
		if (!trimmedBody) return;

		const trimmedTitle = title.trim();
		submitFeedback.mutate(
			{ type, body: trimmedBody, ...(trimmedTitle ? { title: trimmedTitle } : {}) },
			{
				onSuccess: (thread) => {
					onSuccess(thread.id);
					setBody("");
					setTitle("");
					setType("QUESTION");
				},
			},
		);
	};

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

		const handleChange: NonNullable<React.ComponentProps<"input">["onChange"]> = (e) => setTitle(e.target.value);
	const handleChange2: NonNullable<React.ComponentProps<"textarea">["onChange"]> = (e) => setBody(e.target.value);
return (
		<div
			onClick={handleOverlayClick}
			className={cn(
				"fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200",
				"max-sm:items-end",
				isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
			)}
		>
			<div
				className={cn(
					"w-[420px] rounded-[14px] border border-bd-2 bg-surf p-5 shadow-lg transition-[transform,opacity] duration-200",
					"max-sm:w-full max-sm:max-h-[92dvh] max-sm:overflow-y-auto max-sm:rounded-t-hero max-sm:rounded-b-none max-sm:pb-[calc(20px+env(safe-area-inset-bottom,0))]",
					isOpen
						? "translate-y-0 scale-100 opacity-100"
						: "translate-y-2.5 scale-[0.97] opacity-0 max-sm:translate-y-full",
				)}
			>
				{/* Header */}
				<div className="mb-[18px] flex items-center justify-between">
					<p className="text-sm font-semibold text-t-1">
						{t("feedback.modal.title")}
					</p>
					<button
						type="button"
						onClick={onClose}
						className="flex size-7 items-center justify-center rounded-base border border-bd-1 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
					>
						<svg
							viewBox="0 0 12 12"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							className="size-3"
						>
							<path d="M2 2l8 8M10 2l-8 8" />
						</svg>
					</button>
				</div>

				{/* Type selector */}
				<div className="mb-3.5">
					<label className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2">
						{t("feedback.modal.typeLabel")}
					</label>
					<div className="grid grid-cols-2 gap-[7px]">
						{TYPE_OPTIONS.map((opt) => {
						  const handleClick: NonNullable<React.ComponentProps<"button">["onClick"]> = () => setType(opt.value);
						  return (
							<button
								key={opt.value}
								type="button"
								onClick={handleClick}
								className={cn(
									"flex cursor-pointer items-center gap-[9px] rounded-[9px] border px-2.5 py-[9px] text-left transition-all",
									type === opt.value
										? "border-acc bg-acc-bg"
										: "border-bd-2 bg-surf-2 hover:border-acc hover:bg-acc-bg",
								)}
							>
								<div
									className={cn(
										"flex size-7 shrink-0 items-center justify-center rounded-base text-sm",
										opt.bgClass,
									)}
								>
									{opt.emoji}
								</div>
								<div>
									<div className="text-[12px] font-medium text-t-1">
										{t(`feedback.threadTypes.${opt.value}`)}
									</div>
									<div className="text-[10px] text-t-3">
										{t(`feedback.threadTypeDesc.${opt.value}`)}
									</div>
								</div>
							</button>
						);
						})}
					</div>
				</div>

				{/* Title */}
				<div className="mb-3">
					<label className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2">
						{t("feedback.modal.titleLabel")}
					</label>
					<input
						type="text"
						value={title}
						onChange={handleChange}
						placeholder={t("feedback.modal.titlePlaceholder")}
						maxLength={200}
						className="w-full rounded-[9px] border border-bd-2 bg-surf-2 px-3 py-2.5 font-[inherit] text-[13px] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
					/>
				</div>

				{/* Message */}
				<div className="mb-0">
					<label className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2">
						{t("feedback.modal.messageLabel")}
					</label>
					<textarea
						value={body}
						onChange={handleChange2}
						placeholder={t("feedback.modal.messagePlaceholder")}
						className="min-h-[86px] w-full resize-none rounded-[9px] border border-bd-2 bg-surf-2 px-3 py-2.5 font-[inherit] text-[13px] leading-[1.55] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
					/>
				</div>

				{/* Actions */}
				<div className="mt-4 flex gap-2">
					<button
						type="button"
						onClick={onClose}
						className="h-9 flex-1 rounded-[9px] border border-bd-2 bg-surf-2 font-[inherit] text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("feedback.modal.cancel")}
					</button>
					<button
						type="button"
						disabled={!body.trim() || submitFeedback.isPending}
						onClick={handleSubmit}
						className="h-9 flex-2 rounded-[9px] bg-acc font-[inherit] text-[13px] font-semibold text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)] transition-opacity hover:opacity-[0.88] disabled:opacity-50"
					>
						{t("feedback.modal.submit")}
					</button>
				</div>
			</div>
		</div>
	);
};
