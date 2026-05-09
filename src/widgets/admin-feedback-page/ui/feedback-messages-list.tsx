"use client";

import { Typography } from "@/shared/ui/typography";

import type { AdminFeedbackMessage } from "@/entities/feedback";
import { useEffect, useRef } from 'react';
import { FeedbackMessageBubble } from "./feedback-message-bubble";

const formatDateDivider = (iso: string): string =>
	new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

const isSameDay = (a: string, b: string) => {
	const da = new Date(a);
	const db = new Date(b);
	return (
		da.getFullYear() === db.getFullYear() &&
		da.getMonth() === db.getMonth() &&
		da.getDate() === db.getDate()
	);
};

interface FeedbackMessagesListProps {
	messages: AdminFeedbackMessage[];
	noteLabel: string;
}

export const FeedbackMessagesList = ({
	messages,
	noteLabel,
}: FeedbackMessagesListProps) => {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messages.length]);

	return (
		<div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-[18px] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-bd-2">
			{messages.map((msg, i) => {
				const showDivider =
					i === 0 || !isSameDay(messages[i - 1].createdAt, msg.createdAt);
				return (
					<>
						{showDivider && (
							<div
								key={`divider-${msg.id}`}
								className="relative my-1 text-center text-[10.5px] text-t-3"
							>
								<Typography tag="span" className="relative z-10 bg-bg px-2">
									{formatDateDivider(msg.createdAt)}
								</Typography>
								<Typography tag="span" className="absolute inset-x-0 top-1/2 -z-0 h-px bg-bd-2" />
							</div>
						)}
						<FeedbackMessageBubble
							key={msg.id}
							message={msg}
							noteLabel={noteLabel}
						/>
					</>
				);
			})}
			<div ref={bottomRef} />
		</div>
	);
};
