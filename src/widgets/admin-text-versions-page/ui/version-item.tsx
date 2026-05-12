"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type { TextVersionListItem } from "@/entities/admin-text";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import {
	AlignLeft,
	Download,
	FileText,
	HelpCircle,
	RefreshCw,
	RotateCcw,
} from "lucide-react";
import { ComponentProps, ReactNode } from "react";

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
	return (
		<div className="relative z-10 size-2 shrink-0 rounded-full bg-surf-4" />
	);
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
		<Typography
			tag="span"
			className={cn(
				"rounded px-1.5 py-px text-[10px] font-semibold tracking-[0.2px]",
				cls,
			)}
		>
			{children}
		</Typography>
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

export const VersionItem = ({
	item,
	isFirst,
	isLast,
	isActive,
	onClick,
	onRestore,
	onRetry,
	onDownload,
}: VersionItemProps) => {
	const { t } = useI18n();

	const statusVariant: Record<
		TextVersionListItem["status"],
		"green" | "amber" | "red" | "neutral"
	> = {
		COMPLETED: "green",
		RUNNING: "amber",
		ERROR: "red",
		IDLE: "neutral",
	};

	const triggerVariant: Record<
		TextVersionListItem["trigger"],
		"blue" | "neutral"
	> = {
		MANUAL: "blue",
		AUTO_ON_SAVE: "neutral",
		AUTO_ON_CREATE: "neutral",
	};

	const btnClass =
		"flex size-6 cursor-pointer items-center justify-center rounded-[5px] border-none bg-surf-3 text-t-2 transition-colors hover:bg-surf-4 hover:text-t-1 [&_svg]:size-3";

	const handleKeyDown: NonNullable<ComponentProps<"div">["onKeyDown"]> = e =>
		e.key === "Enter" && onClick();
	const handleRestoreClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = e => {
		e.stopPropagation();
		onRestore();
	};
	const handleRetryClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = e => {
		e.stopPropagation();
		onRetry();
	};
	const handleDownloadClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = e => {
		e.stopPropagation();
		onDownload(item.version);
	};
	return (
		<div
			role="button"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"group relative flex cursor-pointer gap-0 px-4 transition-colors max-sm:px-3",
				isActive ? "bg-acc-bg" : "hover:bg-surf-2",
				isActive &&
					"before:absolute before:bottom-2 before:left-0 before:top-2 before:w-0.5 before:rounded-r-sm before:bg-acc",
			)}
		>
			{/* Timeline spine */}
			<div className="relative flex w-7 shrink-0 flex-col items-center py-3 max-sm:w-5.5">
				<div
					className={cn("w-px flex-1 bg-bd-2", isFirst && "bg-transparent")}
				/>
				<Dot status={item.status} isCurrent={item.isCurrent} />
				<div
					className={cn("w-px flex-1 bg-bd-2", isLast && "bg-transparent")}
				/>
			</div>

			{/* Content */}
			<div
				className={cn(
					"flex flex-1 min-w-0 gap-2 border-b border-bd-1 py-2.5 pl-2 max-sm:pl-1.5",
					isLast && "border-none",
				)}
			>
				<div className="flex flex-1 min-w-0 flex-col gap-1">
					{/* Top row: version + time */}
					<div className="flex items-start justify-between gap-2">
						<Typography
							tag="span"
							className={cn(
								"text-[12.5px] font-medium leading-tight",
								item.status === "RUNNING" || item.status === "IDLE"
									? "text-t-2 font-normal"
									: "text-t-1",
							)}
						>
							v{item.version}
							{item.label && (
								<Typography tag="span" className="ml-1.5 text-t-3">
									— {item.label}
								</Typography>
							)}
						</Typography>
						<Typography
							tag="span"
							className="shrink-0 mt-px text-[10.5px] text-t-3"
						>
							{new Date(item.createdAt).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Typography>
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-1">
						{item.isCurrent && (
							<Tag variant="green">
								{t("admin.texts.versions.item.currentBadge")}
							</Tag>
						)}
						<Tag variant={statusVariant[item.status]}>
							{t(`admin.texts.versions.status.${item.status}`)}
						</Tag>
						<Tag variant={triggerVariant[item.trigger]}>
							{t(`admin.texts.versions.trigger.${item.trigger}`)}
						</Tag>
						{item.initiator && (
							<Typography tag="span" className="text-[10.5px] text-t-3">
								{t("admin.texts.versions.item.by")} {item.initiator.name}
							</Typography>
						)}
					</div>

					{/* Stats */}
					{item.status === "COMPLETED" && (
						<div className="flex flex-wrap items-center gap-3">
							<Typography
								tag="span"
								className="flex items-center gap-1 text-[11px] text-t-3"
							>
								<AlignLeft className="size-2.5" />
								<Typography tag="strong" className="text-t-2">
									{item.tokenCount.toLocaleString()}
								</Typography>{" "}
								{t("admin.texts.versions.item.tokens")}
							</Typography>
							{item.unknownCount > 0 && (
								<Typography
									tag="span"
									className="flex items-center gap-1 text-[11px] text-t-3"
								>
									<HelpCircle className="size-2.5" />
									<Typography tag="strong" className="text-red-t">
										{item.unknownCount}
									</Typography>{" "}
									{t("admin.texts.versions.item.unknown")}
								</Typography>
							)}
							<Typography
								tag="span"
								className="flex items-center gap-1 text-[11px] text-t-3"
							>
								<FileText className="size-2.5" />
								<Typography tag="strong" className="text-t-2">
									{item.pageCount}
								</Typography>{" "}
								{t("admin.texts.versions.item.pages")}
							</Typography>
							{item.durationMs !== null && (
								<Typography tag="span" className="text-[11px] text-t-3">
									{formatDuration(item.durationMs)}
								</Typography>
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
							<Typography
								tag="span"
								className="min-w-[30px] text-right text-[10.5px] tabular-nums text-t-3"
							>
								{item.progress}%
							</Typography>
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
						<Button
							onClick={handleRestoreClick}
							className={btnClass}
							title={t("admin.texts.versions.actions.restore")}
						>
							<RotateCcw className="size-3" />
						</Button>
					)}
					{item.status === "ERROR" && (
						<Button
							onClick={handleRetryClick}
							className={btnClass}
							title={t("admin.texts.versions.actions.retry")}
						>
							<RefreshCw className="size-3" />
						</Button>
					)}
					{item.status === "COMPLETED" && (
						<Button
							onClick={handleDownloadClick}
							className={btnClass}
							title={t("admin.texts.versions.actions.download")}
						>
							<Download className="size-3" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};
