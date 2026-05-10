"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import type { MorphRule } from "@/entities/morph-rule";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { ArrowRight, Pencil, Trash2 } from "lucide-react";

interface Props {
	items: MorphRule[];
	isLoading?: boolean;
	onEdit: (rule: MorphRule) => void;
	onToggleActive: (rule: MorphRule) => void;
	onDelete: (id: string) => void;
}

export const MorphologyMobileList = ({
	items,
	isLoading,
	onEdit,
	onToggleActive,
	onDelete,
}: Props) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="flex flex-col gap-2 sm:hidden">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className="rounded-[12px] border border-bd-1 bg-surf p-3.5"
					>
						<div className="mb-3 flex items-start gap-2.5">
							<div className="flex-1">
								<div className="mb-1.5 h-4 w-32 animate-pulse rounded bg-surf-3" />
								<div className="h-3 w-20 animate-pulse rounded bg-surf-3" />
							</div>
							<div className="h-5 w-14 animate-pulse rounded bg-surf-3" />
						</div>
						<div className="h-8 animate-pulse rounded-lg bg-surf-3" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 sm:hidden">
			{items.map(rule => {
			  const handleToggleActiveClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onToggleActive(rule);
			  const handleEditClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onEdit(rule);
			  const handleDeleteClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onDelete(rule.id);
			  return (
				<div
					key={rule.id}
					className={cn(
						"rounded-[12px] border border-bd-1 bg-surf p-3.5 transition-colors",
						!rule.isActive && "opacity-60",
					)}
				>
					{/* Header */}
					<div className="mb-2.5 flex items-start gap-2.5">
						<div className="flex-1">
							<div className="font-mono text-[15px] font-bold text-t-1 leading-tight">
								{rule.isRegex ? (
									rule.suffix
								) : (
									<>
										<Typography tag="span" className="text-t-3">.*</Typography>
										<Typography tag="span" className="rounded bg-acc-bg px-[3px] font-bold text-acc-t">
											{rule.suffix}
										</Typography>
									</>
								)}
							</div>
							<div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-t-3">
								{rule.description}
								{rule.isRegex && (
									<Typography tag="span" className="rounded bg-pur-bg px-1 py-px text-[9.5px] font-bold uppercase tracking-[0.3px] text-pur-t">
										Regex
									</Typography>
								)}
							</div>
						</div>
						{rule.isActive ? (
							<Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] bg-grn-bg px-1.5 py-0.5 text-[10.5px] font-semibold text-grn-t">
								<Typography tag="span" className="size-1.5 rounded-full bg-current opacity-70" />
								{t("admin.morphology.status.active")}
							</Typography>
						) : (
							<Typography tag="span" className="inline-flex items-center gap-1 rounded-[5px] bg-surf-3 px-1.5 py-0.5 text-[10.5px] font-semibold text-t-2">
								<Typography tag="span" className="size-1.5 rounded-full bg-current opacity-70" />
								{t("admin.morphology.status.inactive")}
							</Typography>
						)}
					</div>

					{/* Replace row */}
					<div className="mb-2.5 flex flex-wrap items-center gap-1.5 rounded-lg border border-bd-1 bg-surf-2 px-2.5 py-1.5">
						<Typography tag="span" className="text-[10.5px] font-medium text-t-3">
							{t("admin.morphology.table.replace")}:
						</Typography>
						<Typography tag="span" className="rounded bg-red-bg px-1.5 py-px font-mono text-[12px] font-semibold text-red-t">
							{rule.suffix}
						</Typography>
						<ArrowRight className="size-3 text-t-3" />
						<Typography tag="span" className="rounded bg-grn-bg px-1.5 py-px font-mono text-[12px] font-semibold text-grn-t">
							{rule.add || "∅"}
						</Typography>
					</div>

					{/* Meta row */}
					<div className="mb-2.5 flex flex-wrap items-center gap-2">
						{rule.pos && (
							<Typography tag="span"
								className={cn(
									"inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold italic",
									rule.pos.toLowerCase() === "noun"
										? "bg-acc-bg text-acc-t"
										: rule.pos.toLowerCase() === "verb"
											? "bg-grn-bg text-grn-t"
											: rule.pos.toLowerCase() === "adj"
												? "bg-pur-bg text-pur-t"
												: "bg-surf-3 text-t-2",
								)}
							>
								{rule.pos.toLowerCase()}
							</Typography>
						)}
						<Typography tag="span" className="text-[11.5px] text-t-3">
							{rule.type.toLowerCase()}
						</Typography>
						<Typography tag="span"
							className={cn(
								"inline-flex size-5 items-center justify-center rounded-[5px] text-[11px] font-bold",
								rule.priority <= 1
									? "bg-red-bg text-red-t"
									: rule.priority === 2
										? "bg-amb-bg text-amb-t"
										: "bg-grn-bg text-grn-t",
							)}
						>
							{rule.priority}
						</Typography>
					</div>

					{/* Footer */}
					<div className="flex items-center gap-2.5">
						<div className="flex flex-1 items-center gap-1.5">
							<div className="h-1 flex-1 overflow-hidden rounded-full bg-surf-3">
								<div
									className="h-full rounded-full bg-pur"
									style={{ width: "40%" }}
								/>
							</div>
							<Typography tag="span" className="font-[tabular-nums] text-[11px] text-t-3">
								{rule.matchCount.toLocaleString()}
							</Typography>
						</div>
						<div className="flex shrink-0 gap-1.5">
							{!rule.isActive && (
								<Button
									onClick={handleToggleActiveClick}
									className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-surf-2 px-2.5 text-[11.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
								>
									{t("admin.morphology.row.activate")}
								</Button>
							)}
							<Button
								onClick={handleEditClick}
								className="flex size-[30px] items-center justify-center rounded-base border border-bd-2 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
							>
								<Pencil className="size-[13px]" />
							</Button>
							<Button
								onClick={handleDeleteClick}
								className="flex size-[30px] items-center justify-center rounded-base border border-red/20 bg-surf-2 text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
							>
								<Trash2 className="size-[13px]" />
							</Button>
						</div>
					</div>
				</div>
			);
			})}
		</div>
	);
};
