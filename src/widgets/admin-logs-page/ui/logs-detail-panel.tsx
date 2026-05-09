"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import type { AdminLogDetail } from "@/entities/admin-log";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { ReactNode, useEffect } from 'react';
import { LevelBadge } from "./level-badge";

interface LogsDetailPanelProps {
	open: boolean;
	detail?: AdminLogDetail;
	isLoading?: boolean;
	onClose: () => void;
}

export const LogsDetailPanel = ({
	open,
	detail,
	isLoading,
	onClose,
}: LogsDetailPanelProps) => {
	const { t } = useI18n();

	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<>
			{/* Overlay */}
			<div
				onClick={onClose}
				className={cn(
					"fixed inset-0 z-[199] bg-black/20 transition-opacity dark:bg-black/45",
					open ? "block" : "hidden",
				)}
			/>

			{/* Panel */}
			<div
				className={cn(
					"fixed bottom-0 right-0 top-0 z-[200] flex w-[440px] flex-col border-l border-bd-2 bg-surf shadow-[-8px_0_32px_rgba(0,0,0,0.1)] transition-transform duration-[220ms] ease-[ease]",
					"max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:h-[88dvh] max-sm:w-full max-sm:rounded-t-2xl max-sm:border-l-0 max-sm:border-t max-sm:shadow-[0_-4px_32px_rgba(0,0,0,0.12)]",
					open
						? "translate-x-0 max-sm:translate-y-0"
						: "translate-x-full max-sm:translate-x-0 max-sm:translate-y-full",
				)}
			>
				{/* Handle (mobile) */}
				<div className="relative hidden items-center justify-center py-2.5 max-sm:flex">
					<div className="h-1 w-9 rounded-full bg-bd-3" />
				</div>

				{/* Header */}
				<div className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 px-4 py-3.5">
					<Button
						onClick={onClose}
						className="flex size-7 items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<svg width="13" height="13" viewBox="0 0 16 16" fill="none">
							<path
								d="M12 4L4 12M4 4l8 8"
								stroke="currentColor"
								strokeWidth="1.4"
								strokeLinecap="round"
							/>
						</svg>
					</Button>
					<Typography tag="span" className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-semibold text-t-1">
						{detail
							? `${detail.service}: ${detail.levelLabel}`
							: t("admin.logs.detail.title")}
					</Typography>
					{detail && (
						<div className="shrink-0">
							<LevelBadge level={detail.level} label={detail.levelLabel} />
						</div>
					)}
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:w-0">
					{isLoading && (
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<div key={i} className="h-5 animate-pulse rounded bg-surf-3" />
							))}
						</div>
					)}

					{!isLoading && detail && (
						<>
							<Section label={t("admin.logs.detail.main")}>
								<Row label={t("admin.logs.detail.time")}>
									<Typography tag="span" className="font-mono text-[11.5px]">
										{new Date(detail.timestamp).toLocaleString("ru-RU")}
									</Typography>
								</Row>
								<Row label={t("admin.logs.detail.service")}>
									<Typography tag="span" className="rounded border border-bd-2 bg-surf-2 px-1.5 py-px font-mono text-[11.5px] text-t-1">
										{detail.service}
									</Typography>
								</Row>
								<Row label={t("admin.logs.detail.user")}>
									<Typography tag="span" className="font-mono text-[11.5px]">
										{detail.user?.id ?? t("admin.logs.detail.anonymous")}
									</Typography>
								</Row>
								<Row label={t("admin.logs.detail.host")}>
									<Typography tag="span" className="font-mono text-[11.5px]">
										{detail.host ?? t("admin.logs.detail.noHost")}
									</Typography>
								</Row>
								<Row label={t("admin.logs.detail.duration")}>
									<Typography tag="span" className="font-mono text-[11.5px]">
										{detail.durationMs != null
											? `${detail.durationMs} ms`
											: t("admin.logs.detail.noDuration")}
									</Typography>
								</Row>
							</Section>

							<Divider />

							<Section label={t("admin.logs.detail.message")}>
								<CodeBlock>{detail.message}</CodeBlock>
							</Section>

							{detail.stack && (
								<>
									<Divider />
									<Section label={t("admin.logs.detail.stackTrace")}>
										<CodeBlock className="text-red-t">{detail.stack}</CodeBlock>
									</Section>
								</>
							)}

							{Object.keys(detail.context).length > 0 && (
								<>
									<Divider />
									<Section label={t("admin.logs.detail.context")}>
										{Object.entries(detail.context).map(([k, v]) => (
											<Row key={k} label={k}>
												<Typography tag="span" className="break-all font-mono text-[11.5px]">
													{typeof v === "object"
														? JSON.stringify(v)
														: String(v ?? "—")}
												</Typography>
											</Row>
										))}
									</Section>
								</>
							)}

							<Divider />

							<Section label={t("admin.logs.detail.traceId")}>
								<CodeBlock>{detail.traceId}</CodeBlock>
							</Section>
						</>
					)}
				</div>
			</div>
		</>
	);
};

const Section = ({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) => (
	<div className="mb-[18px]">
		<div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
			{label}
		</div>
		{children}
	</div>
);

const Row = ({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) => (
	<div className="mb-2 flex items-start gap-2.5">
		<Typography tag="span" className="w-[110px] shrink-0 pt-px text-[12px] text-t-3">
			{label}
		</Typography>
		<Typography tag="span" className="flex-1 text-[12.5px] text-t-1">{children}</Typography>
	</div>
);

const Divider = () => <div className="my-3.5 h-px bg-bd-1" />;

const CodeBlock = ({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) => (
	<pre
		className={cn(
			"overflow-x-auto whitespace-pre rounded-lg border border-bd-2 bg-surf-2 px-3 py-2.5 font-mono text-[11.5px] leading-[1.6] text-t-1",
			className,
		)}
	>
		{children}
	</pre>
);
