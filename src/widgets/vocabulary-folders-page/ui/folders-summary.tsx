"use client";

import { CheckCircle2, Clock, FolderOpen, ListOrdered } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useFoldersSummary } from "@/entities/folder";

interface SummaryItemProps {
	tone: "acc" | "neutral" | "grn" | "amb";
	icon: ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number }>;
	value: number;
	label: string;
}

const TONE_CLASSES = {
	acc: "bg-acc-bg text-acc",
	neutral: "bg-surf-2 text-t-2",
	grn: "bg-grn-bg text-grn",
	amb: "bg-amb-bg text-amb",
} as const;

const SummaryItem = ({ tone, icon: Icon, value, label }: SummaryItemProps) => (
	<div className="rounded-card border-hairline border-bd-1 bg-surf px-[15px] py-[13px] transition-[border-color,box-shadow] hover:border-bd-2 hover:shadow-sm">
		<div
			className={cn(
				"mb-[9px] flex size-7 items-center justify-center rounded-[7px]",
				TONE_CLASSES[tone],
			)}
		>
			<Icon className="size-[13px]" strokeWidth={1.8} />
		</div>
		<div className="font-display text-[24px] leading-none text-t-1">
			{value}
		</div>
		<div className="mt-[3px] text-[11px] text-t-3">{label}</div>
	</div>
);

const SkeletonItem = () => (
	<div className="rounded-card border-hairline border-bd-1 bg-surf px-[15px] py-[13px]">
		<div className="mb-[9px] size-7 animate-pulse rounded-[7px] bg-surf-2" />
		<div className="h-6 w-12 animate-pulse rounded bg-surf-2" />
		<div className="mt-[5px] h-3 w-20 animate-pulse rounded bg-surf-2" />
	</div>
);

export const FoldersSummary = () => {
	const { t } = useI18n();
	const { data, isLoading } = useFoldersSummary();

	if (isLoading || !data) {
		return (
			<div className="grid grid-cols-2 gap-[9px] lg:grid-cols-4">
				<SkeletonItem />
				<SkeletonItem />
				<SkeletonItem />
				<SkeletonItem />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-[9px] lg:grid-cols-4">
			<SummaryItem
				tone="acc"
				icon={FolderOpen}
				value={data.foldersCount}
				label={t("vocabulary.foldersPage.summary.foldersCount")}
			/>
			<SummaryItem
				tone="neutral"
				icon={ListOrdered}
				value={data.wordsInFolders}
				label={t("vocabulary.foldersPage.summary.wordsInFolders")}
			/>
			<SummaryItem
				tone="grn"
				icon={CheckCircle2}
				value={data.knownWords}
				label={t("vocabulary.foldersPage.summary.knownWords")}
			/>
			<SummaryItem
				tone="amb"
				icon={Clock}
				value={data.wordsWithoutFolder}
				label={t("vocabulary.foldersPage.summary.wordsWithoutFolder")}
			/>
		</div>
	);
};
