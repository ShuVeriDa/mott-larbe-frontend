"use client";

import { Typography } from "@/shared/ui/typography";

import { ComponentProps } from 'react';
import type { AdminLogItem } from "@/entities/admin-log";
import { LevelBadge } from "./level-badge";
import { DurationBadge } from "./duration-badge";

const formatTime = (iso: string) => {
	const d = new Date(iso);
	return d.toLocaleTimeString("ru-RU", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
};

const shortTrace = (id: string) =>
	id.length > 8 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;

interface LogsMobileListProps {
	items: AdminLogItem[];
	isLoading: boolean;
	onItemClick: (id: string) => void;
}

export const LogsMobileList = ({
	items,
	isLoading,
	onItemClick,
}: LogsMobileListProps) => {
	if (isLoading) {
		return (
			<div className="md:hidden">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="border-b border-bd-1 px-4 py-3 last:border-b-0">
						<div className="mb-2 flex items-center gap-2">
							<div className="h-5 w-12 animate-pulse rounded bg-surf-3" />
							<div className="h-5 w-20 animate-pulse rounded bg-surf-3" />
						</div>
						<div className="mb-1.5 h-4 animate-pulse rounded bg-surf-3" />
						<div className="h-3.5 w-2/3 animate-pulse rounded bg-surf-3" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="md:hidden">
			{items.map((item) => {
			  const handleClick: NonNullable<ComponentProps<"div">["onClick"]> = () => onItemClick(item.id);
			  return (
				<div
					key={item.id}
					onClick={handleClick}
					className="cursor-pointer border-b border-bd-1 px-4 py-3 transition-colors last:border-b-0 active:bg-surf-2"
				>
					<div className="mb-1.5 flex items-center gap-1.5">
						<LevelBadge level={item.level} />
						<Typography tag="span" className="rounded border border-bd-2 bg-surf-2 px-1.5 py-px text-[10.5px] font-medium text-t-2">
							{item.service}
						</Typography>
						<Typography tag="span" className="ml-auto tabular-nums text-[11px] text-t-3 whitespace-nowrap">
							{formatTime(item.timestamp)}
						</Typography>
					</div>
					<div className="mb-1.5 line-clamp-2 font-mono text-[13px] leading-[1.45] text-t-1">
						{item.message}
					</div>
					<div className="flex items-center gap-2">
						<DurationBadge durationMs={item.durationMs} />
						<Typography tag="span" className="ml-auto font-mono text-[11px] text-t-4">
							{shortTrace(item.traceId)}
						</Typography>
					</div>
				</div>
			);
			})}
		</div>
	);
};
