"use client";

import { cn } from "@/shared/lib/cn";
import { useRef, useState } from "react";

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

	const autoResize = () => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
	};

	const handleSend = () => {
		const trimmed = value.trim();
		if (!trimmed || isPending) return;
		onSend(trimmed, inputMode === "note");
		setValue("");
		if (textareaRef.current) textareaRef.current.style.height = "auto";
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	if (isClosed) {
		return (
			<div className="shrink-0 border-t border-bd-1 bg-surf px-5 py-3 text-center text-[12px] text-t-3">
				{t("admin.feedback.closed")}
				{" · "}
				<button
					type="button"
					onClick={onReopen}
					className="font-medium text-acc-t hover:underline"
				>
					{t("admin.feedback.reopen")}
				</button>
			</div>
		);
	}

	const isNote = inputMode === "note";

	return (
		<div className="shrink-0 border-t border-bd-1 bg-surf px-5 pb-[14px] pt-2.5">
			{/* Mode toggle */}
			<div className="mb-2 flex gap-0.5">
				<button
					type="button"
					onClick={() => onModeChange("reply")}
					className={cn(
						"flex h-6 items-center gap-1 rounded-[5px] border px-2.5 text-[11px] font-medium transition-all",
						!isNote
							? "border-bd-2 bg-surf-2 font-semibold text-t-1"
							: "border-transparent text-t-3 hover:text-t-1",
					)}
				>
					<svg viewBox="0 0 16 16" fill="none" className="size-[11px]">
						<path
							d="M13 10.5H9l-3 2.5V10.5H3a1 1 0 01-1-1V3a1 1 0 011-1h10a1 1 0 011 1v6.5a1 1 0 01-1 1z"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinejoin="round"
						/>
					</svg>
					{t("admin.feedback.input.replyMode")}
				</button>
				<button
					type="button"
					onClick={() => onModeChange("note")}
					className={cn(
						"flex h-6 items-center gap-1 rounded-[5px] border px-2.5 text-[11px] font-medium transition-all",
						isNote
							? "border-[rgba(217,119,6,0.25)] bg-amb-bg font-semibold text-amb-t"
							: "border-transparent text-t-3 hover:text-t-1",
					)}
				>
					<svg viewBox="0 0 16 16" fill="none" className="size-[11px]">
						<path
							d="M2 5h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5zm4-3h4"
							stroke="currentColor"
							strokeWidth="1.3"
							strokeLinecap="round"
						/>
					</svg>
					{t("admin.feedback.input.noteMode")}
				</button>
			</div>

			{/* Input box */}
			<div
				className={cn(
					"flex items-end gap-2 rounded-[10px] border px-2.5 py-2 transition-colors focus-within:border-acc",
					isNote
						? "border-[rgba(217,119,6,0.35)] bg-amb-bg focus-within:border-amb"
						: "border-bd-2 bg-surf-2",
				)}
			>
				<textarea
					ref={textareaRef}
					value={value}
					onChange={e => {
						setValue(e.target.value);
						autoResize();
					}}
					onKeyDown={handleKeyDown}
					placeholder={
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
				<button
					type="button"
					disabled={!value.trim() || isPending}
					onClick={handleSend}
					className={cn(
						"flex size-7 shrink-0 items-center justify-center rounded-base text-white transition-opacity hover:opacity-[0.88] disabled:opacity-40",
						isNote
							? "bg-amb shadow-[0_1px_4px_rgba(217,119,6,0.3)]"
							: "bg-acc shadow-[0_1px_4px_rgba(34,84,211,0.3)]",
					)}
				>
					<svg
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="size-[13px]"
					>
						<path d="M13.5 2.5L2.5 7l5 1.5M13.5 2.5L9 13.5l-1.5-5" />
					</svg>
				</button>
			</div>

			<p className="mt-1.5 text-center text-[10px] text-t-3">
				{t("admin.feedback.input.hint")}
			</p>
		</div>
	);
};
