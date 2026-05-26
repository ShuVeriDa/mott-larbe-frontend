"use client";

import { useState, type ComponentProps } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Theme, type EmojiClickData } from "emoji-picker-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/shared/ui/popover";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface EmojiPickerInputProps {
	value: string;
	onChange: (emoji: string) => void;
	placeholder?: string;
	hasError?: boolean;
	searchPlaceholder?: string;
}

export const EmojiPickerInput = ({
	value,
	onChange,
	placeholder = "👋",
	hasError,
	searchPlaceholder = "Search...",
}: EmojiPickerInputProps) => {
	const [open, setOpen] = useState(false);
	const { resolvedTheme } = useTheme();

	const handleEmojiClick = (data: EmojiClickData) => {
		onChange(data.emoji);
		setOpen(false);
	};

	const handleOpenChange: NonNullable<ComponentProps<typeof Popover>["onOpenChange"]> = (v) =>
		setOpen(v);

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					className={cn(
						"flex h-9 w-full items-center justify-center rounded-base border bg-bg text-[22px] leading-none transition-colors",
						hasError
							? "border-red-400"
							: open
								? "border-bd-3"
								: "border-bd-2 hover:border-bd-3",
					)}
				>
					{value || <span className="text-t-4 text-[18px]">{placeholder}</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className="z-300 w-auto p-0 border-bd-1 bg-surf shadow-lg"
				align="start"
				sideOffset={6}
			>
				<EmojiPicker
					onEmojiClick={handleEmojiClick}
					theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
					lazyLoadEmojis
					skinTonesDisabled
					searchPlaceholder={searchPlaceholder}
					width={300}
					height={380}
					emojiSize={22}
				/>
			</PopoverContent>
		</Popover>
	);
};
