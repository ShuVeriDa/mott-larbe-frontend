"use client";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { MessageSquareMoreIcon } from "lucide-react";
import { useRef, type MouseEvent } from "react";

interface NoteGroupIconProps {
	group: { noteIds: string[]; x: number; y: number };
	onNoteGroupClick: (noteIds: string[], x: number, y: number) => void;
}

export const NoteGroupIcon = ({ group, onNoteGroupClick }: NoteGroupIconProps) => {
	const iconRef = useRef<HTMLButtonElement>(null);

	const handleMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
	};

	const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		const rect = e.currentTarget.getBoundingClientRect();
		onNoteGroupClick(group.noteIds, rect.left + rect.width / 2, rect.bottom);
	};

	return (
		<Button
			ref={iconRef}
			data-note-icon="true"
			title={`${group.noteIds.length > 1 ? `${group.noteIds.length} заметки` : "Заметка"}`}
			onMouseDown={handleMouseDown}
			onClick={handleClick}
			style={{
				position: "fixed",
				left: group.x,
				top: group.y,
				zIndex: 50,
			}}
			className={cn(
				"flex items-center gap-0.5 rounded p-0.5",
				"text-amber-400 transition-colors hover:bg-amber-50 hover:text-amber-600",
			)}
		>
			<MessageSquareMoreIcon size={14} strokeWidth={1.8} />
			{group.noteIds.length > 1 && (
				<Typography tag="span" className="text-[10px] font-semibold leading-none">
					{group.noteIds.length}
				</Typography>
			)}
		</Button>
	);
};
