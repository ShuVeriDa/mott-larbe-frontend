"use client";
import { ComponentProps, type MouseEvent as ReactMouseEvent, useEffect, useRef } from "react";
import { ArrowRight, PaintBucket, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface FolderCardActionsProps {
	open: boolean;
	onClose: () => void;
	onRename: () => void;
	onRecolor: () => void;
	onOpen: () => void;
	onDelete: () => void;
	labels: {
		rename: string;
		recolor: string;
		open: string;
		delete: string;
	};
}

export const FolderCardActions = ({
	open,
	onClose,
	onRename,
	onRecolor,
	onOpen,
	onDelete,
	labels,
}: FolderCardActionsProps) => {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!open) return;
		const onDocClick = (e: globalThis.MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node /* intentional: outside-click target */)) onClose();
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("mousedown", onDocClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("mousedown", onDocClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [open, onClose]);

	if (!open) return null;

	const item = cn(
		"flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-t-2",
		"transition-colors hover:bg-surf-2 hover:text-t-1",
	);
	const danger = cn(
		"flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-t-2",
		"transition-colors hover:bg-red-bg hover:text-red-t",
	);

	const handle = (cb: () => void) => (e: ReactMouseEvent) => {
		e.stopPropagation();
		cb();
		onClose();
	};

		const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = (e) => e.stopPropagation();
return (
		<div
			ref={ref}
			role="menu"
			onClick={handleClick}
			className={cn(
				"absolute right-2.5 top-9 z-30 min-w-[170px] overflow-hidden rounded-card",
				"border-hairline border-bd-2 bg-surf shadow-md",
				"animate-[fadeUp_0.14s_ease]",
			)}
		>
			<button type="button" className={item} onClick={handle(onRename)}>
				<Pencil className="size-[13px]" strokeWidth={1.6} />
				{labels.rename}
			</button>
			<button type="button" className={item} onClick={handle(onRecolor)}>
				<PaintBucket className="size-[13px]" strokeWidth={1.6} />
				{labels.recolor}
			</button>
			<div className="h-px bg-bd-1" />
			<button type="button" className={item} onClick={handle(onOpen)}>
				<ArrowRight className="size-[13px]" strokeWidth={1.6} />
				{labels.open}
			</button>
			<div className="h-px bg-bd-1" />
			<button type="button" className={danger} onClick={handle(onDelete)}>
				<Trash2 className="size-[13px]" strokeWidth={1.6} />
				{labels.delete}
			</button>
		</div>
	);
};
