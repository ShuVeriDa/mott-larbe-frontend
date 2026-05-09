"use client";

import { cn } from "@/shared/lib/cn";
import { type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import type { Folder } from "../../api/types";
import { DEFAULT_FOLDER_COLOR } from "../../lib/folder-presets";
import { FolderIcon } from "../folder-icon";

export interface FolderCardLabels {
	new: string;
	learning: string;
	known: string;
	progress: string;
	open: string;
	noWords: string;
	updated: (date: string | null) => string;
}

export interface FolderCardProps {
	folder: Folder;
	labels: FolderCardLabels;
	onOpen: () => void;
	onMenu?: (anchor: HTMLElement) => void;
	menuLabel?: string;
	menuSlot?: ReactNode;
}

const Counts = ({
	folder,
	labels,
}: {
	folder: Folder;
	labels: FolderCardLabels;
}) => (
	<div className="mb-3 flex gap-1.5">
		<CountChip
			value={folder.wordCounts.NEW}
			label={labels.new}
			tone="neutral"
		/>
		<CountChip
			value={folder.wordCounts.LEARNING}
			label={labels.learning}
			tone="amber"
		/>
		<CountChip
			value={folder.wordCounts.KNOWN}
			label={labels.known}
			tone="green"
		/>
	</div>
);

const CountChip = ({
	value,
	label,
	tone,
}: {
	value: number;
	label: string;
	tone: "neutral" | "amber" | "green";
}) => (
	<div className="flex flex-1 flex-col items-center gap-0.5 rounded-base bg-surf-2 px-1 py-[5px]">
		<span
			className={cn("font-display text-[16px] leading-none", {
				"text-t-3": tone === "neutral",
				"text-amb": tone === "amber",
				"text-grn": tone === "green",
			})}
		>
			{value}
		</span>
		<span className="text-[9.5px] font-medium uppercase tracking-[0.3px] text-t-3">
			{label}
		</span>
	</div>
);

export const FolderCard = ({
	folder,
	labels,
	onOpen,
	onMenu,
	menuLabel,
	menuSlot,
}: FolderCardProps) => {
	const stripColor = folder.color ?? DEFAULT_FOLDER_COLOR;
	const handleMenuClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (onMenu) onMenu(e.currentTarget);
	};
	const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onOpen();
		}
	};

	return (
		<div
			role="button"
			tabIndex={0}
			onClick={onOpen}
			onKeyDown={handleKey}
			className={cn(
				"group relative cursor-pointer overflow-hidden rounded-card",
				"border-hairline border-bd-1 bg-surf",
				"transition-[border-color,box-shadow] duration-150",
				"hover:border-bd-2 hover:shadow-sm",
				"focus-visible:border-acc focus-visible:outline-none",
				"focus-visible:ring-2 focus-visible:ring-acc/30",
			)}
		>
			<div className="h-1 w-full" style={{ background: stripColor }} />

			<div className="px-4 pt-3.5 pb-3">
				<div className="mb-2.5 flex items-start justify-between gap-2">
					<div
						className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px]"
						style={{ background: `${stripColor}1F`, color: stripColor }}
					>
						<FolderIcon icon={folder.icon} className="size-4" />
					</div>

					<div className="min-w-0 flex-1">
						<h3 className="text-[14px] font-semibold leading-[1.3] text-t-1">
							{folder.name}
						</h3>
					</div>

					{onMenu ? (
						<button
							type="button"
							aria-label={menuLabel}
							onClick={handleMenuClick}
							className={cn(
								"flex size-6 shrink-0 items-center justify-center rounded-[5px]",
								"text-t-4 opacity-0 transition-[background-color,color,opacity]",
								"group-hover:opacity-100 hover:bg-surf-2 hover:text-t-2",
								"focus-visible:opacity-100",
							)}
						>
							<svg viewBox="0 0 14 14" className="size-[13px]" aria-hidden>
								<circle cx="7" cy="3" r="1" fill="currentColor" />
								<circle cx="7" cy="7" r="1" fill="currentColor" />
								<circle cx="7" cy="11" r="1" fill="currentColor" />
							</svg>
						</button>
					) : null}
				</div>

				<p className="mb-3 min-h-[18px] text-[12px] leading-[1.5] text-t-3 line-clamp-2">
					{folder.description ?? ""}
				</p>

				<Counts folder={folder} labels={labels} />

				<div className="mb-2.5">
					<div className="mb-1 flex items-center justify-between">
						<span className="text-[11px] text-t-3">{labels.progress}</span>
						<span className="text-[11px] font-semibold text-t-1">
							{folder.progress}%
						</span>
					</div>
					<div className="h-1 overflow-hidden rounded-full bg-surf-3">
						<div
							className="h-full rounded-full transition-[width] duration-300"
							style={{
								width: `${Math.min(100, Math.max(0, folder.progress))}%`,
								background: stripColor,
							}}
						/>
					</div>
				</div>

				<div className="flex items-center justify-between border-t border-hairline border-bd-1 pt-2.5">
					<span className="text-[11px] text-t-3">
						{folder.total === 0
							? labels.noWords
							: labels.updated(folder.lastModified)}
					</span>
					<span className="text-[11.5px] font-medium text-acc">
						{labels.open}
					</span>
				</div>
			</div>

			{menuSlot}
		</div>
	);
};
