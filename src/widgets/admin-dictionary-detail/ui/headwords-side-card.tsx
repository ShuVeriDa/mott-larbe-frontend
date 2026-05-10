"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminDictHeadword } from "@/entities/dictionary";
import type { DictModal } from "../model/use-admin-dictionary-detail-page";
import { Plus, Trash2 } from "lucide-react";


interface HeadwordsSideCardProps {
	headwords: AdminDictHeadword[] | undefined;
	isLoading: boolean;
	onOpenModal: (m: DictModal) => void;
	onDeleteHeadword: (hwId: string) => void;
}

export const HeadwordsSideCard = ({
	headwords = [],
	isLoading,
	onOpenModal,
	onDeleteHeadword,
}: HeadwordsSideCardProps) => {
	const { t } = useI18n();

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onOpenModal({ type: "addHeadword" });
return (
		<div className="overflow-hidden rounded-xl border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
				<Typography tag="span" className="text-[11.5px] font-semibold uppercase tracking-[0.5px] text-t-2">
					{t("admin.dictionaryDetail.headwords")}
				</Typography>
				<Button
					className="flex h-[26px] items-center gap-1.5 rounded-md border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1"
					onClick={handleClick}
				>
					<Plus className="size-[11px]" />
					{t("admin.dictionaryDetail.add")}
				</Button>
			</div>

			{isLoading ? (
				<div className="px-4 py-3">
					<div className="h-4 w-24 animate-pulse rounded bg-surf-3" />
				</div>
			) : headwords.length === 0 ? (
				<div className="px-4 py-4 text-center text-[12.5px] text-t-3">
					{t("admin.dictionaryDetail.noHeadwords")}
				</div>
			) : (
				<div>
					{headwords.map((hw) => {
					  const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onDeleteHeadword(hw.id);
					  return (
						<div
							key={hw.id}
							className="group flex items-center gap-2.5 border-b border-bd-1 px-4 py-2.5 transition-colors hover:bg-surf-2 last:border-b-0"
						>
							<Typography tag="span" className="flex-1 font-display text-[15px] font-medium text-t-1">
								{hw.text}
							</Typography>
							{hw.isPrimary && (
								<Typography tag="span" className="rounded bg-acc-bg px-[7px] py-0.5 text-[10.5px] font-semibold text-acc-t">
									{t("admin.dictionaryDetail.primary")}
								</Typography>
							)}
							<div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 max-sm:opacity-100">
								<Button
									className="flex size-[26px] items-center justify-center rounded-md bg-transparent text-t-3 transition-colors hover:bg-red-bg hover:text-red-t"
									onClick={handleClick}
								>
									<Trash2 className="size-[13px]" />
								</Button>
							</div>
						</div>
					);
					})}
				</div>
			)}
		</div>
	);
};
