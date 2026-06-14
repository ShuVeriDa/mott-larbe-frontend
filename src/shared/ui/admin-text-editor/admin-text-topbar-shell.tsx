"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { AlignLeft, Check, ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

interface AdminTextTopbarShellProps {
	breadcrumbTitle: string;
	backAriaLabel: string;
	settingsAriaLabel: string;
	settingsLabel: string;
	saveDraftAriaLabel: string;
	saveDraftLabel: string;
	primaryActionAriaLabel: string;
	primaryActionLabel: string;
	primaryActionIcon: ReactNode;
	isSaving: boolean;
	isBackgroundRunning?: boolean;
	backgroundTooltip?: string;
	isMetaPanelVisible: boolean;
	statusLabel?: string | null;
	showUnsavedPulse?: boolean;
	showSavedCheck?: boolean;
	leftAfterBreadcrumb?: ReactNode;
	rightBeforeStatus?: ReactNode;
	/** Override the back/breadcrumb href. Defaults to /{lang}/admin/texts */
	backHref?: string;
	/** Override the breadcrumb section label. Defaults to admin.texts.title */
	backLabel?: string;
	onSaveDraft: () => void;
	onPrimaryAction: () => void;
	onToggleMetaPanel: () => void;
}

export const AdminTextTopbarShell = ({
	breadcrumbTitle,
	backAriaLabel,
	settingsAriaLabel,
	settingsLabel,
	saveDraftAriaLabel,
	saveDraftLabel,
	primaryActionAriaLabel,
	primaryActionLabel,
	primaryActionIcon,
	isSaving,
	isBackgroundRunning = false,
	backgroundTooltip,
	isMetaPanelVisible,
	statusLabel,
	showUnsavedPulse = false,
	showSavedCheck = false,
	leftAfterBreadcrumb,
	rightBeforeStatus,
	backHref,
	backLabel,
	onSaveDraft,
	onPrimaryAction,
	onToggleMetaPanel,
}: AdminTextTopbarShellProps) => {
	const { t, lang } = useI18n();
	const resolvedBackHref = backHref ?? `/${lang}/admin/texts`;
	const resolvedBackLabel = backLabel ?? t("admin.texts.title");
	const handleToggleMetaPanel: NonNullable<
		ComponentProps<"button">["onClick"]
	> = () => onToggleMetaPanel();

	return (
		<header className="flex min-h-[52px] items-center gap-2 border-b border-bd-1 bg-surf px-5 transition-colors max-sm:gap-1.5 max-sm:px-3.5">
			<div className="flex min-w-0 flex-1 items-center gap-2">
				<Link
					href={resolvedBackHref}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-base border border-bd-2 bg-surf text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					aria-label={backAriaLabel}
				>
					<ChevronLeft className="size-[13px]" />
				</Link>

				<nav
					className="flex items-center gap-1.5 overflow-hidden text-xs text-t-3"
					aria-label="breadcrumb"
				>
					<Link
						href={resolvedBackHref}
						className="shrink-0 transition-colors hover:text-t-2 max-[600px]:hidden"
					>
						{resolvedBackLabel}
					</Link>
					<Typography
						tag="span"
						className="shrink-0 text-t-4 max-[600px]:hidden"
					>
						/
					</Typography>
					<Typography tag="span" className="truncate font-medium text-t-2">
						{breadcrumbTitle}
					</Typography>
				</nav>

				{leftAfterBreadcrumb}
			</div>

			<div className="flex shrink-0 items-center gap-1.5">
				{rightBeforeStatus}

				{statusLabel && (
					<div className="flex items-center gap-1.5 max-[767px]:hidden">
						{showUnsavedPulse && (
							<Typography
								tag="span"
								className="h-[7px] w-[7px] shrink-0 animate-pulse rounded-full bg-amb"
							/>
						)}
						{showSavedCheck && <Check className="size-[11px] shrink-0 text-grn" />}
						<Typography tag="span" className="text-[11px] text-t-3">
							{statusLabel}
						</Typography>
					</div>
				)}

				<Button
					onClick={handleToggleMetaPanel}
					className="hidden h-[30px] items-center gap-1 rounded-base border border-bd-2 bg-transparent px-2.5 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 min-[768px]:flex"
					aria-label={settingsAriaLabel}
					title={settingsAriaLabel}
				>
					<AlignLeft className="size-3.5" />
					<Typography tag="span" className="max-[960px]:hidden">
						{settingsLabel}
					</Typography>
					{isMetaPanelVisible ? (
						<ChevronRight className="size-3.5 text-t-4" />
					) : (
						<ChevronLeft className="size-3.5 text-t-4" />
					)}
				</Button>

				<TooltipProvider>
					<Tooltip open={isBackgroundRunning && !!backgroundTooltip ? undefined : false}>
						<TooltipTrigger asChild>
							<Button
								onClick={onSaveDraft}
								disabled={isSaving}
								aria-label={saveDraftAriaLabel}
								title={saveDraftAriaLabel}
								className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50 max-[767px]:h-8 max-[767px]:w-8 max-[767px]:justify-center max-[767px]:gap-0 max-[767px]:px-0"
							>
								{isBackgroundRunning ? (
									<Loader2 className="size-3 animate-spin shrink-0" />
								) : (
									<Save className="size-3" />
								)}
								<Typography tag="span" className="max-[767px]:hidden">
									{saveDraftLabel}
								</Typography>
							</Button>
						</TooltipTrigger>
						{backgroundTooltip && (
							<TooltipContent side="bottom">{backgroundTooltip}</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip open={isBackgroundRunning && !!backgroundTooltip ? undefined : false}>
						<TooltipTrigger asChild>
							<Button
								onClick={onPrimaryAction}
								disabled={isSaving}
								aria-label={primaryActionAriaLabel}
								title={primaryActionAriaLabel}
								className="flex h-[30px] items-center gap-1.5 rounded-base bg-acc px-3 text-xs font-semibold text-white transition-opacity hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50 max-[767px]:h-8 max-[767px]:w-8 max-[767px]:justify-center max-[767px]:gap-0 max-[767px]:px-0"
							>
								{isBackgroundRunning ? (
									<Loader2 className="size-3 animate-spin shrink-0" />
								) : (
									primaryActionIcon
								)}
								<Typography tag="span" className="max-[767px]:hidden">
									{primaryActionLabel}
								</Typography>
							</Button>
						</TooltipTrigger>
						{backgroundTooltip && (
							<TooltipContent side="bottom">{backgroundTooltip}</TooltipContent>
						)}
					</Tooltip>
				</TooltipProvider>
			</div>
		</header>
	);
};
