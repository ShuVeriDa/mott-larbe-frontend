"use client";

import { ComponentProps, ReactNode } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { TextVersionListItem } from "@/entities/admin-text";

const formatDuration = (ms: number | null): string => {
	if (ms === null) return "—";
	if (ms < 1000) return `${ms}ms`;
	return `${(ms / 1000).toFixed(1)}s`;
};

interface DotProps {
	status: TextVersionListItem["status"];
	isCurrent: boolean;
}

const Dot = ({ status, isCurrent }: DotProps) => {
	if (isCurrent && status === "COMPLETED") {
		return (
			<div className="relative z-10 shrink-0">
				<div className="size-2.5 rounded-full bg-grn shadow-[0_0_0_3px_var(--color-grn-bg)]" />
			</div>
		);
	}
	if (status === "RUNNING") {
		return (
			<div className="relative z-10 shrink-0">
				<div className="size-2 animate-pulse rounded-full bg-amb shadow-[0_0_0_3px_var(--color-amb-bg)]" />
			</div>
		);
	}
	if (status === "ERROR") {
		return (
			<div className="relative z-10 shrink-0">
				<div className="size-2 rounded-full bg-red shadow-[0_0_0_3px_var(--color-red-bg)]" />
			</div>
		);
	}
	return <div className="relative z-10 size-2 shrink-0 rounded-full bg-surf-4" />;
};

interface TagProps {
	children: ReactNode;
	variant: "green" | "amber" | "red" | "blue" | "neutral";
}

const Tag = ({ children, variant }: TagProps) => {
	const cls = {
		green: "bg-grn-bg text-grn-t",
		amber: "bg-amb-bg text-amb-t",
		red: "bg-red-bg text-red-t",
		blue: "bg-acc-bg text-acc-t",
		neutral: "bg-surf-3 text-t-2",
	}[variant];
	return (
		<span className={cn("rounded px-1.5 py-px text-[10px] font-semibold tracking-[0.2px]", cls)}>
			{children}
		</span>
	);
};

interface VersionItemProps {
	item: TextVersionListItem;
	isFirst: boolean;
	isLast: boolean;
	isActive: boolean;
	onClick: () => void;
	onRestore: () => void;
	onRetry: () => void;
	onDownload: (versionNumber: number) => void;
}

export const VersionItem = ({ item, isFirst, isLast, isActive, onClick, onRestore, onRetry, onDownload }: VersionItemProps) => {
	const { t } = useI18n();

	const statusVariant: Record<TextVersionListItem["status"], "green" | "amber" | "red" | "neutral"> = {
		COMPLETED: "green",
		RUNNING: "amber",
		ERROR: "red",
		IDLE: "neutral",
	};

	const triggerVariant: Record<TextVersionListItem["trigger"], "blue" | "neutral"> = {
		MANUAL: "blue",
		AUTO_ON_SAVE: "neutral",
		AUTO_ON_CREATE: "neutral",
	};

	const btnClass = "flex size-6 cursor-pointer items-center justify-center rounded-[5px] border-none bg-surf-3 text-t-2 transition-colors hover:bg-surf-4 hover:text-t-1 [&_svg]:size-3";

		const handleKeyDown: NonNullable<ComponentProps<"div">["onKeyDown"]> = (e) => e.key === "Enter" && onClick();
	const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = (e) => { e.stopPropagation(); onRestore(); };
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = (e) => { e.stopPropagation(); onRetry(); };
	const handleClick3: NonNullable<ComponentProps<"button">["onClick"]> = (e) => { e.stopPropagation(); onDownload(item.version); };
return (
		<div
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"group relative flex cursor-pointer gap-0 px-4 transition-colors max-sm:px-3",
				isActive ? "bg-acc-bg" : "hover:bg-surf-2",
				isActive && "before:absolute before:bottom-2 before:left-0 before:top-2 before:w-0.5 before:rounded-r-sm before:bg-acc",
			)}
		>
			{/* Timeline spine */}
			<div className="relative flex w-7 shrink-0 flex-col items-center py-3 max-sm:w-5.5">
				<div className={cn("w-px flex-1 bg-bd-2", isFirst && "bg-transparent")} />
				<Dot status={item.status} isCurrent={item.isCurrent} />
				<div className={cn("w-px flex-1 bg-bd-2", isLast && "bg-transparent")} />
			</div>

			{/* Content */}
			<div className={cn("flex flex-1 min-w-0 gap-2 border-b border-bd-1 py-2.5 pl-2 max-sm:pl-1.5", isLast && "border-none")}>
				<div className="flex flex-1 min-w-0 flex-col gap-1">
					{/* Top row: version + time */}
					<div className="flex items-start justify-between gap-2">
						<span className={cn(
							"text-[12.5px] font-medium leading-tight",
							item.status === "RUNNING" || item.status === "IDLE" ? "text-t-2 font-normal" : "text-t-1",
						)}>
							v{item.version}
							{item.label && <span className="ml-1.5 text-t-3">— {item.label}</span>}
						</span>
						<span className="shrink-0 mt-px text-[10.5px] text-t-3">
							{new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
						</span>
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-1">
						{item.isCurrent && (
							<Tag variant="green">{t("admin.texts.versions.item.currentBadge")}</Tag>
						)}
						<Tag variant={statusVariant[item.status]}>
							{t(`admin.texts.versions.status.${item.status}`)}
						</Tag>
						<Tag variant={triggerVariant[item.trigger]}>
							{t(`admin.texts.versions.trigger.${item.trigger}`)}
						</Tag>
						{item.initiator && (
							<span className="text-[10.5px] text-t-3">
								{t("admin.texts.versions.item.by")} {item.initiator.name}
							</span>
						)}
					</div>

					{/* Stats */}
					{item.status === "COMPLETED" && (
						<div className="flex flex-wrap items-center gap-3">
							<span className="flex items-center gap-1 text-[11px] text-t-3">
								<svg width="10" height="10" viewBox="0 0 16 16" fill="none">
									<path d="M3 4h10M3 7h10M3 10h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
								</svg>
								<strong className="text-t-2">{item.tokenCount.toLocaleString()}</strong>
								{" "}{t("admin.texts.versions.item.tokens")}
							</span>
							{item.unknownCount > 0 && (
								<span className="flex items-center gap-1 text-[11px] text-t-3">
									<svg width="10" height="10" viewBox="0 0 16 16" fill="none">
										<circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
										<path d="M8 9V8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
										<circle cx="8" cy="11" r=".75" fill="currentColor" />
									</svg>
									<strong className="text-red-t">{item.unknownCount}</strong>
									{" "}{t("admin.texts.versions.item.unknown")}
								</span>
							)}
							<span className="flex items-center gap-1 text-[11px] text-t-3">
								<svg width="10" height="10" viewBox="0 0 16 16" fill="none">
									<rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
									<path d="M5 8h6M5 5h6M5 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
								</svg>
								<strong className="text-t-2">{item.pageCount}</strong>
								{" "}{t("admin.texts.versions.item.pages")}
							</span>
							{item.durationMs !== null && (
								<span className="text-[11px] text-t-3">
									{formatDuration(item.durationMs)}
								</span>
							)}
						</div>
					)}

					{/* Progress bar for running */}
					{item.status === "RUNNING" && (
						<div className="flex items-center gap-1.5 mt-1">
							<div className="h-1 flex-1 overflow-hidden rounded-full bg-surf-3">
								<div
									className="h-full rounded-full bg-amb transition-all duration-500"
									style={{ width: `${item.progress}%` }}
								/>
							</div>
							<span className="min-w-[30px] text-right text-[10.5px] tabular-nums text-t-3">
								{item.progress}%
							</span>
						</div>
					)}

					{/* Error message */}
					{item.status === "ERROR" && item.errorMessage && (
						<div className="mt-1 rounded-[5px] bg-red-bg px-2 py-1.5 font-mono text-[11px] leading-relaxed text-red-t">
							{item.errorMessage}
						</div>
					)}
				</div>

				{/* Hover actions */}
				<div className="flex shrink-0 flex-col justify-start gap-1 pt-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
					{item.status === "COMPLETED" && !item.isCurrent && (
						<button
							type="button"
							onClick={handleClick}
							className={btnClass}
							title={t("admin.texts.versions.actions.restore")}
						>
							<svg viewBox="0 0 16 16" fill="none">
								<path d="M13 8A5 5 0 013.5 11M3 8a5 5 0 019.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
								<path d="M3 5v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					)}
					{item.status === "ERROR" && (
						<button
							type="button"
							onClick={handleClick2}
							className={btnClass}
							title={t("admin.texts.versions.actions.retry")}
						>
							<svg viewBox="0 0 16 16" fill="none">
								<path d="M13 8A5 5 0 013.5 11M3 8a5 5 0 019.5-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
								<path d="M13 5v3h-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					)}
					{item.status === "COMPLETED" && (
						<button
							type="button"
							onClick={handleClick3}
							className={btnClass}
							title={t("admin.texts.versions.actions.download")}
						>
							<svg viewBox="0 0 16 16" fill="none">
								<path d="M8 3v7M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M3 13h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
							</svg>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
