"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminLogItem } from "@/entities/admin-log";
import { LevelBadge } from "./level-badge";
import { DurationBadge } from "./duration-badge";

const formatTime = (iso: string) => {
	const d = new Date(iso);
	return {
		time: d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
		ms: `.${String(d.getMilliseconds()).padStart(3, "0")}`,
	};
};

const shortTrace = (id: string) =>
	id.length > 8 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id;

interface LogsTableProps {
	items: AdminLogItem[];
	isLoading: boolean;
	onRowClick: (id: string) => void;
}

export const LogsTable = ({ items, isLoading, onRowClick }: LogsTableProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="hidden overflow-x-auto [&::-webkit-scrollbar]:h-0 md:block">
				<table className="w-full border-collapse text-[12.5px]">
					<thead>
						<TableHead t={t} />
					</thead>
					<tbody>
						{Array.from({ length: 10 }).map((_, i) => (
							<tr key={i} className="border-b border-bd-1 last:border-b-0">
								{Array.from({ length: 7 }).map((__, j) => (
									<td key={j} className="px-3 py-2">
										<div className="h-3.5 animate-pulse rounded bg-surf-3" />
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	return (
		<div className="hidden overflow-x-auto [&::-webkit-scrollbar]:h-0 md:block">
			<table className="w-full border-collapse text-[12.5px]">
				<thead>
					<TableHead t={t} />
				</thead>
				<tbody>
					{items.map((item) => {
						const { time, ms } = formatTime(item.timestamp);
												const handleClick: NonNullable<React.ComponentProps<"tr">["onClick"]> = () => onRowClick(item.id);
						const handleClick2: NonNullable<React.ComponentProps<"button">["onClick"]> = (e) => {
												e.stopPropagation();
												onRowClick(item.id);
											};
return (
							<tr
								key={item.id}
								onClick={handleClick}
								className="cursor-pointer border-b border-bd-1 transition-colors last:border-b-0 hover:bg-surf-2"
							>
								<td className="px-3 py-2">
									<span className="tabular-nums text-[11.5px] text-t-3 whitespace-nowrap">
										{time}
										<span className="text-t-4">{ms}</span>
									</span>
								</td>
								<td className="px-3 py-2">
									<LevelBadge level={item.level} />
								</td>
								<td className="px-3 py-2">
									<span className="rounded border border-bd-2 bg-surf-2 px-1.5 py-px text-[10.5px] font-medium text-t-2 whitespace-nowrap">
										{item.service}
									</span>
								</td>
								<td className="px-3 py-2">
									<div className="max-w-[340px] overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[12.5px] text-t-1 tracking-[-0.01em] max-lg:max-w-[200px]">
										{item.message}
									</div>
									{item.tracePreview && (
										<div className="mt-0.5 font-mono text-[11px] text-t-3">
											{item.tracePreview}
										</div>
									)}
								</td>
								<td className="px-3 py-2 max-[760px]:hidden">
									<DurationBadge durationMs={item.durationMs} />
								</td>
								<td className="px-3 py-2 max-[900px]:hidden">
									<span className="tabular-nums text-[11.5px] text-t-3">
										{shortTrace(item.traceId)}
									</span>
								</td>
								<td className="px-3 py-2">
									<div className="flex items-center justify-end">
										<button
											type="button"
											onClick={handleClick2}
											className="flex size-[26px] items-center justify-center rounded-[6px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
										>
											<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
												<circle cx="8" cy="4" r="1" fill="currentColor" />
												<circle cx="8" cy="8" r="1" fill="currentColor" />
												<circle cx="8" cy="12" r="1" fill="currentColor" />
											</svg>
										</button>
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

const TableHead = ({ t }: { t: (key: string) => string }) => (
	<tr className="border-b border-bd-1">
		{[
			{ key: "time", style: "w-[148px]" },
			{ key: "level", style: "w-[76px]" },
			{ key: "service", style: "w-[110px]" },
			{ key: "message", style: "" },
			{ key: "duration", style: "w-20 max-[760px]:hidden" },
			{ key: "traceId", style: "w-[110px] max-[900px]:hidden" },
			{ key: "", style: "w-9" },
		].map(({ key, style }) => (
			<th
				key={key}
				className={`bg-surf-2 px-3 py-[9px] text-left text-[10.5px] font-semibold uppercase tracking-[0.4px] text-t-3 whitespace-nowrap ${style}`}
			>
				{key ? t(`admin.logs.table.${key}`) : ""}
			</th>
		))}
	</tr>
);
