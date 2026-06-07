"use client";

import { Typography } from "@/shared/ui/typography";

import type { FeedbackType } from "@/entities/feedback";
import { useSubmitFeedback } from "@/features/submit-feedback";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { ComponentProps, ElementType, useState } from "react";
import { AlertTriangle, Bug, HelpCircle, Lightbulb } from "lucide-react";

type Translator = (key: string) => string;

interface FeedbackNewThreadModalProps {
	isOpen: boolean;
	t: Translator;
	onClose: () => void;
	onSuccess: (threadId: string) => void;
}

interface TypeOption {
	value: FeedbackType;
	icon: ElementType;
	bgClass: string;
	iconClass: string;
}

const TYPE_OPTIONS: TypeOption[] = [
	{ value: "QUESTION", icon: HelpCircle, bgClass: "bg-acc-bg", iconClass: "text-acc" },
	{ value: "BUG", icon: Bug, bgClass: "bg-ros-bg", iconClass: "text-ros-t" },
	{ value: "IDEA", icon: Lightbulb, bgClass: "bg-pur-bg", iconClass: "text-pur-t" },
	{ value: "COMPLAINT", icon: AlertTriangle, bgClass: "bg-amb-bg", iconClass: "text-amb-t" },
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
			{
				type,
				body: trimmedBody,
				...(trimmedTitle ? { title: trimmedTitle } : {}),
			},
			{
				onSuccess: thread => {
					onSuccess(thread.id);
					setBody("");
					setTitle("");
					setType("QUESTION");
				},
			},
		);
	};

	const handleTitleChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setTitle(e.currentTarget.value);
	const handleBodyChange: NonNullable<
		ComponentProps<"textarea">["onChange"]
	> = e => setBody(e.currentTarget.value);

	return (
		<Modal
			open={isOpen}
			onClose={onClose}
			title={t("feedback.modal.title")}
			className="max-w-[420px]"
		>
			{/* Type selector */}
			<div className="mb-3.5">
				<Typography
					tag="label"
					className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2"
				>
					{t("feedback.modal.typeLabel")}
				</Typography>
				<div className="grid grid-cols-2 gap-[7px]">
					{TYPE_OPTIONS.map(opt => {
						const handleClick: NonNullable<
							ComponentProps<"button">["onClick"]
						> = () => setType(opt.value);
						return (
							<Button
								key={opt.value}
								onClick={handleClick}
								title={t(`feedback.threadTypes.${opt.value}`)}
								className={cn(
									"flex cursor-pointer min-h-10 justify-start truncate items-center gap-[9px] rounded-[9px] border px-2.5 py-[9px] text-left transition-all",
									type === opt.value
										? "border-acc bg-acc-bg"
										: "border-bd-2 bg-surf-2 hover:border-acc hover:bg-acc-bg",
								)}
							>
								<div
									className={cn(
										"flex size-7 shrink-0 items-center justify-center rounded-base",
										opt.bgClass,
									)}
								>
									<opt.icon className={cn("size-[15px]", opt.iconClass)} strokeWidth={1.75} />
								</div>
								<div>
									<div className="text-[12px] font-medium text-t-1">
										{t(`feedback.threadTypes.${opt.value}`)}
									</div>
									<div className="text-[10px] text-t-3 ">
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
				<Typography
					tag="label"
					className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2"
				>
					{t("feedback.modal.titleLabel")}
				</Typography>
				<Input
					type="text"
					value={title}
					onChange={handleTitleChange}
					placeholder={t("feedback.modal.titlePlaceholder")}
					maxLength={200}
					aria-label={t("feedback.modal.titleLabel")}
					className="rounded-[9px] border-bd-2 bg-surf-2 px-3 py-2.5 h-auto"
				/>
			</div>

			{/* Message */}
			<div className="mb-2">
				<Typography
					tag="label"
					className="mb-[7px] block text-[11px] font-semibold uppercase tracking-[0.5px] text-t-2"
				>
					{t("feedback.modal.messageLabel")}
				</Typography>
				<textarea
					value={body}
					onChange={handleBodyChange}
					placeholder={t("feedback.modal.messagePlaceholder")}
					aria-label={t("feedback.modal.messageLabel")}
					aria-required="true"
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
