"use client";

import { useEffect, useRef } from "react";
import type { FeedbackMessage } from "@/entities/feedback";
import { FeedbackMessageBubble } from "./feedback-message-bubble";

type Translator = (key: string) => string;

interface FeedbackMessagesProps {
	messages: FeedbackMessage[];
	userInitials: string;
	t: Translator;
}

const formatDateLabel = (iso: string): string => {
	const d = new Date(iso);
	return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
};

const groupByDate = (messages: FeedbackMessage[]) => {
	const groups: { date: string; messages: FeedbackMessage[] }[] = [];
	let currentDate = "";

	for (const msg of messages) {
		const date = msg.createdAt.slice(0, 10);
		if (date !== currentDate) {
			currentDate = date;
			groups.push({ date: msg.createdAt, messages: [] });
		}
		groups[groups.length - 1].messages.push(msg);
	}
	return groups;
};

export const FeedbackMessages = ({
	messages,
	userInitials,
	t,
}: FeedbackMessagesProps) => {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "instant" });
	}, [messages.length]);

	const groups = groupByDate(messages);

	return (
		<div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-[18px] [&::-webkit-scrollbar-thumb]:rounded-sm [&::-webkit-scrollbar-thumb]:bg-bd-2 [&::-webkit-scrollbar]:w-1 max-sm:px-4">
			{groups.map((group) => (
				<div key={group.date} className="flex flex-col gap-3.5">
					<div className="relative py-1 text-center text-[10.5px] font-medium text-t-3 before:absolute before:right-[calc(50%+40px)] before:top-1/2 before:h-px before:w-[70px] before:bg-bd-2 after:absolute after:left-[calc(50%+40px)] after:top-1/2 after:h-px after:w-[70px] after:bg-bd-2">
						{formatDateLabel(group.date)}
					</div>
					{group.messages.map((msg) => (
						<FeedbackMessageBubble
							key={msg.id}
							message={msg}
							userInitials={userInitials}
							t={t}
						/>
					))}
				</div>
			))}
			<div ref={bottomRef} />
		</div>
	);
};
