"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { ComponentProps, KeyboardEvent, useRef, useState } from 'react';
type Translator = (key: string) => string;

interface FeedbackChatInputProps {
	isClosed: boolean;
	isPending: boolean;
	t: Translator;
	onSend: (text: string) => void;
}

export const FeedbackChatInput = ({
	isClosed,
	isPending,
	t,
	onSend,
}: FeedbackChatInputProps) => {
	const [value, setValue] = useState("");
	const [isReopening, setIsReopening] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const autoResize = () => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
	};

	const handleSend = () => {
		const trimmed = value.trim();
		if (!trimmed || isPending) return;
		onSend(trimmed);
		setValue("");
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	if (isClosed && !isReopening) {
				const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => setIsReopening(true);
return (
			<div className="flex flex-col items-center gap-2 border-t border-bd-1 px-4 pb-3.5 pt-3">
				<Typography tag="p" className="text-[12px] text-t-3">{t("feedback.chat.closed")}</Typography>
				<Button
					onClick={handleClick}
					className="flex h-[28px] items-center rounded-[8px] border border-acc px-3 text-[12px] font-medium text-acc transition-colors hover:bg-acc-bg"
				>
					{t("feedback.chat.reopen")}
				</Button>
			</div>
		);
	}

		const handleChange: NonNullable<ComponentProps<"textarea">["onChange"]> = (e) => {
						setValue(e.currentTarget.value);
						autoResize();
					};
return (
		<div className="shrink-0 border-t border-bd-1 bg-surf px-4 pb-[13px] pt-2.5 transition-colors max-sm:pb-[calc(12px+env(safe-area-inset-bottom,0))]">
			<div className="flex items-end gap-2 rounded-xl border border-bd-2 bg-surf-2 px-2.5 py-2 focus-within:border-acc">
				<textarea
					ref={textareaRef}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={t("feedback.chat.placeholder")}
					rows={1}
					className="min-h-[22px] flex-1 resize-none bg-transparent font-[inherit] text-[13px] text-t-1 outline-none placeholder:text-t-3"
					style={{ maxHeight: 120 }}
				/>
				<Button
					disabled={!value.trim() || isPending}
					onClick={handleSend}
					className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-acc text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)] transition-opacity hover:opacity-[0.88] active:opacity-70 disabled:opacity-40"
				>
					<svg
						viewBox="0 0 14 14"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.7"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="size-3.5"
					>
						<path d="M12 7L2 2l2 5-2 5z" />
					</svg>
				</Button>
			</div>
			<Typography tag="p" className="mt-[5px] text-center text-[10.5px] text-t-3 max-sm:hidden">
				{t("feedback.chat.hint")}
			</Typography>
		</div>
	);
};
