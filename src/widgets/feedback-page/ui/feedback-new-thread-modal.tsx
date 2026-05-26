"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ComponentProps, useState } from 'react';
import { cn } from "@/shared/lib/cn";
import type { FeedbackType } from "@/entities/feedback";
import { useSubmitFeedback } from "@/features/submit-feedback";
import { Modal, ModalActions } from "@/shared/ui/modal";

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

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (e) => setTitle(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"textarea">["onChange"]> = (e) => setBody(e.currentTarget.value);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={t("feedback.modal.title")}
			className="max-w-[420px]"
		>
			{/* Type selector */}
			<div className="mb-3.5">
				<Typography tag="label" className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("feedback.modal.typeLabel")}
				</Typography>
				<div className="grid grid-cols-2 gap-[7px]">
					{TYPE_OPTIONS.map((opt) => {
						const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setType(opt.value);
						return (
							<Button
								key={opt.value}
								onClick={handleClick}
								title={t(`feedback.threadTypes.${opt.value}`)}
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
							</Button>
						);
					})}
				</div>
			</div>

			{/* Title */}
			<div className="mb-3">
				<Typography tag="label" className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("feedback.modal.titleLabel")}
				</Typography>
				<Input
					type="text"
					value={title}
					onChange={handleChange}
					placeholder={t("feedback.modal.titlePlaceholder")}
					maxLength={200}
					aria-label={t("feedback.modal.titleLabel")}
					className="rounded-[9px] border-bd-2 bg-surf-2 px-3 py-2.5 h-auto"
				/>
			</div>

			{/* Message */}
			<div className="mb-2">
				<Typography tag="label" className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("feedback.modal.messageLabel")}
				</Typography>
				<textarea
					value={body}
					onChange={handleChange2}
					placeholder={t("feedback.modal.messagePlaceholder")}
					className="min-h-[86px] w-full resize-none rounded-[9px] border border-bd-2 bg-surf-2 px-3 py-2.5 font-[inherit] text-[13px] leading-[1.55] text-t-1 outline-none transition-colors placeholder:text-t-3 focus:border-acc"
				/>
			</div>

			<ModalActions>
				<Button
					onClick={onClose}
					title={t("feedback.modal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("feedback.modal.cancel")}
				</Button>
				<Button
					disabled={!body.trim() || submitFeedback.isPending}
					onClick={handleSubmit}
					title={t("feedback.modal.submit")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
				>
					{t("feedback.modal.submit")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
