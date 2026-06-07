"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { MessageSquare, Send, StickyNote } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { useAutoResize } from "@/shared/lib/use-auto-resize";
import { ComponentProps, KeyboardEvent, useRef, useState } from "react";

type Translator = (key: string) => string;

interface FeedbackAdminInputProps {
	isClosed: boolean;
	isPending: boolean;
	inputMode: "reply" | "note";
	t: Translator;
	onModeChange: (mode: "reply" | "note") => void;
	onSend: (body: string, isInternal: boolean) => void;
	onReopen: () => void;
}

export const FeedbackAdminInput = ({
	isClosed,
	isPending,
	inputMode,
	t,
	onModeChange,
	onSend,
	onReopen,
}: FeedbackAdminInputProps) => {
	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { autoResize, resetHeight } = useAutoResize(textareaRef, 100);

	const handleSend = () => {
		const trimmed = value.trim();
		if (!trimmed || isPending) return;
		onSend(trimmed, inputMode === "note");
		setValue("");
		resetHeight();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleReplyMode: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onModeChange("reply");
	const handleNoteMode: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onModeChange("note");
	const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = e => {
		setValue(e.currentTarget.value);
		autoResize();
	};

	if (isClosed) {
		return (
			<div className="shrink-0 border-t border-bd-1 bg-surf px-5 py-3 text-center text-[12px] text-t-3">
				{t("admin.feedback.closed")}
				{" · "}
				<Button
					onClick={onReopen}
					title={t("admin.feedback.reopen")}
					className="font-medium text-acc-t hover:underline"
				>
					{t("admin.feedback.reopen")}
				</Button>
			</div>
		);
	}

	const isNote = inputMode === "note";

	return (
		<div className="shrink-0 border-t border-bd-1 bg-surf px-5 pb-[14px] pt-2.5">
			<div className="mb-2 flex gap-0.5">
				<Button
					size={"bare"}
					onClick={handleReplyMode}
					title={t("admin.feedback.input.replyMode")}
					className={cn(
						"flex h-6 items-center gap-1 rounded-[5px] border px-2.5 text-[11px] font-medium transition-all",
						!isNote
							? "border-bd-2 bg-surf-2 font-semibold text-t-1"
							: "border-transparent text-t-3 hover:text-t-1",
					)}
				>
					<MessageSquare className="size-[11px]" />
					{t("admin.feedback.input.replyMode")}
				</Button>
				<Button
					size={"bare"}
					onClick={handleNoteMode}
					title={t("admin.feedback.input.noteMode")}
					className={cn(
						"flex h-6 items-center gap-1 rounded-[5px] border px-2.5 text-[11px] font-medium transition-all",
						isNote
							? "border-[rgba(217,119,6,0.25)] bg-amb-bg font-semibold text-amb-t"
							: "border-transparent text-t-3 hover:text-t-1",
					)}
				>
					<StickyNote className="size-[11px]" />
					{t("admin.feedback.input.noteMode")}
				</Button>
			</div>

			<div
				className={cn(
					"flex items-center gap-2 rounded-[10px] border px-2.5 py-2 transition-colors focus-within:border-acc",
					isNote
						? "border-[rgba(217,119,6,0.35)] bg-amb-bg focus-within:border-amb"
						: "border-bd-2 bg-panel",
				)}
			>
				<textarea
					ref={textareaRef}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={
						isNote
							? t("admin.feedback.input.notePlaceholder")
							: t("admin.feedback.input.replyPlaceholder")
					}
					aria-label={
						isNote
							? t("admin.feedback.input.notePlaceholder")
							: t("admin.feedback.input.replyPlaceholder")
					}
					rows={1}
					className={cn(
						"min-h-[20px] flex-1 resize-none bg-transparent font-[inherit] text-[12.5px] outline-none placeholder:text-t-3",
						isNote ? "text-amb-t" : "text-t-1",
					)}
					style={{ maxHeight: 100 }}
				/>
				<Button
					size={"bare"}
					disabled={!value.trim() || isPending}
					onClick={handleSend}
					title={
						isNote
							? t("admin.feedback.input.noteMode")
							: t("admin.feedback.input.replyMode")
					}
					aria-label={
						isNote
							? t("admin.feedback.input.noteMode")
							: t("admin.feedback.input.replyMode")
					}
					className={cn(
						"flex size-7 shrink-0 items-center justify-center rounded-base text-white transition-opacity hover:opacity-[0.88] disabled:opacity-40",
						isNote
							? "bg-amb shadow-[0_1px_4px_rgba(217,119,6,0.3)]"
							: "bg-acc shadow-[0_1px_4px_rgba(34,84,211,0.3)]",
					)}
				>
					<Send className="size-[13px]" />
				</Button>
			</div>

			<Typography tag="p" className="mt-1.5 text-center text-[10px] text-t-3">
				{t("admin.feedback.input.hint")}
			</Typography>
		</div>
	);
};
