"use client";

import { Typography } from "@/shared/ui/typography";

import type { RunScope, TokenizationStats } from "@/entities/token";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Play } from "lucide-react";
import { ComponentProps, useState } from "react";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface TokenizationRunModalProps {
	open: boolean;
	isLoading: boolean;
	stats: TokenizationStats | undefined;
	onClose: () => void;
	onRun: (scope: RunScope) => void;
}

export const TokenizationRunModal = ({
	open,
	isLoading,
	stats,
	onClose,
	onRun,
}: TokenizationRunModalProps) => {
	const { t } = useI18n();
	const [scope, setScope] = useState<RunScope>("pending");

	const options: {
		value: RunScope;
		labelKey: string;
		subKey: string;
		count: number | undefined;
	}[] = [
		{
			value: "pending",
			labelKey: "admin.tokenization.runModal.pending",
			subKey: "admin.tokenization.runModal.pendingSub",
			count: stats?.tabs.pending,
		},
		{
			value: "errors",
			labelKey: "admin.tokenization.runModal.errors",
			subKey: "admin.tokenization.runModal.errorsSub",
			count: stats?.tabs.issues,
		},
		{
			value: "all",
			labelKey: "admin.tokenization.runModal.all",
			subKey: "admin.tokenization.runModal.allSub",
			count: stats?.tabs.all,
		},
	];

	const handleRun: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		onRun(scope);

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("admin.tokenization.runModal.title")}
			className="max-w-[400px]"
		>
			<Typography tag="p" className="mb-3.5 text-[12px] text-t-3">
				{t("admin.tokenization.runModal.subtitle")}
			</Typography>
			<div className="flex flex-col gap-2 mb-2">
				{options.map(opt => {
					const handleChange: NonNullable<
						ComponentProps<"input">["onChange"]
					> = () => setScope(opt.value);
					return (
						<Typography
							tag="label"
							key={opt.value}
							className={cn(
								"flex cursor-pointer items-start gap-2.5 rounded-[9px] border p-3 transition-colors",
								scope === opt.value
									? "border-acc bg-acc-bg"
									: "border-bd-2 hover:border-bd-3 hover:bg-surf-2",
							)}
						>
							<input
								type="radio"
								name="scope"
								value={opt.value}
								checked={scope === opt.value}
								onChange={handleChange}
								className="mt-0.5 size-[15px] shrink-0 accent-acc"
							/>
							<div className="min-w-0 flex-1">
								<div className="flex items-center justify-between gap-2">
									<Typography
										tag="span"
										className="text-[12.5px] font-medium text-t-1"
									>
										{t(opt.labelKey)}
									</Typography>
									{opt.count !== undefined && (
										<Typography
											tag="span"
											className="shrink-0 rounded-full bg-surf-3 px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums text-t-2"
										>
											{opt.count}
										</Typography>
									)}
								</div>
								<div className="mt-0.5 text-[11px] text-t-3">
									{t(opt.subKey)}
								</div>
							</div>
						</Typography>
					);
				})}
			</div>

			<ModalActions>
				<Button
					onClick={onClose}
					title={t("admin.tokenization.runModal.cancelBtn")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.tokenization.runModal.cancelBtn")}
				</Button>
				<Button
					onClick={handleRun}
					disabled={isLoading}
					title={t("admin.tokenization.runModal.runBtn")}
					variant="action"
					className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
				>
					{isLoading ? (
						<Typography
							tag="span"
							className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
						/>
					) : (
						<Play className="size-3" />
					)}
					{t("admin.tokenization.runModal.runBtn")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
